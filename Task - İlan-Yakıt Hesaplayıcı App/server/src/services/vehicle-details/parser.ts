import {
  rawDetailsPageSchema,
  type RawDetailField,
  type RawDetailSection,
  type RawDetailsPage,
} from '@vehicle-cost/contracts';
import { load, type Cheerio, type CheerioAPI } from 'cheerio';
import type { AnyNode } from 'domhandler';

const PRIVATE_SELECTORS = [
  '[href^="tel:"]',
  '[href^="mailto:"]',
  '[data-phone]',
  '[class*="phone"]',
  '[class*="seller"]',
  '[class*="dealer"]',
  '[class*="contact"]',
  '[class*="whatsapp"]',
  '[id*="phone"]',
  '[id*="seller"]',
  '[id*="contact"]',
  '.user-info',
  '.store-info',
].join(',');

const SECTION_SELECTORS = [
  '[data-vehicle-section]',
  '.vehicle-detail-section',
  '.detail-section',
  '.product-properties',
  '.property-list',
  '.specifications',
  '.equipment',
].join(',');

const DESCRIPTION_SELECTORS = [
  '.description',
  '[data-description]',
  '#head-tab-description',
  '#tab-description',
  '.tab-description',
].join(',');

const PRIVATE_TEXT_PATTERN =
  /(?:\+?90\s*)?\(?0?5\d{2}\)?(?:[\s.-]*\d){7}|[\w.+-]+@[\w.-]+\.[a-z]{2,}/iu;
const PRIVATE_LABEL_PATTERN = /telefon|iletişim|satıcı|galeri|mağaza|whatsapp|e-?posta/iu;

function visibleText(element: Cheerio<AnyNode>): string {
  const clone = element.clone();
  clone.find('script, style, noscript, template, [hidden], [aria-hidden="true"]').remove();
  return clone.text().trim();
}

function removePrivateContent($: CheerioAPI, root: Cheerio<AnyNode>): void {
  root.find(PRIVATE_SELECTORS).remove();
  root
    .find('*')
    .addBack()
    .contents()
    .each((_index, node) => {
      if (node.type === 'text' && PRIVATE_TEXT_PATTERN.test(node.data)) {
        $(node).remove();
      }
    });
}

function addField(fields: RawDetailField[], label: string, value: string): void {
  if (!label || !value || PRIVATE_LABEL_PATTERN.test(label)) {
    return;
  }

  if (!fields.some((field) => field.label === label && field.value === value)) {
    fields.push({ label, value });
  }
}

function extractFields($: CheerioAPI, section: Cheerio<AnyNode>): RawDetailField[] {
  const fields: RawDetailField[] = [];

  section.find('tr').each((_index, rowElement) => {
    const cells = $(rowElement).children('th, td').toArray();
    if (cells.length >= 2) {
      addField(fields, visibleText($(cells[0])), visibleText($(cells[1])));
    }
  });

  section.find('dt').each((_index, termElement) => {
    const term = $(termElement);
    const value = term.next('dd').first();
    addField(fields, visibleText(term), visibleText(value));
  });

  section.find('[data-label]').each((_index, fieldElement) => {
    const field = $(fieldElement);
    const label = field.attr('data-label') ?? '';
    const valueElement = field.find('[data-value], .value, dd').first();
    const value =
      field.attr('data-value') ?? visibleText(valueElement.length > 0 ? valueElement : field);
    addField(fields, label, value);
  });

  section.find('.property-item, .attribute-item, li').each((_index, fieldElement) => {
    const field = $(fieldElement);
    const children = field.children('span, strong, b, div').toArray();
    if (children.length >= 2) {
      addField(fields, visibleText($(children[0])), visibleText($(children[1])));
    }
  });

  return fields;
}

function sectionTitle(section: Cheerio<AnyNode>): string {
  return (
    section.attr('data-title') ??
    visibleText(section.children('h1, h2, h3, h4, .section-title, .title').first())
  );
}

function extractSections($: CheerioAPI, root: Cheerio<AnyNode>): RawDetailSection[] {
  const candidates = root.find(SECTION_SELECTORS).toArray();
  const sectionElements = candidates.length > 0 ? candidates : root.toArray();

  return sectionElements
    .map((element) => {
      const section = $(element);
      return {
        title: sectionTitle(section),
        fields: extractFields($, section),
        rawText: visibleText(section),
      };
    })
    .filter((section) => section.rawText || section.fields.length > 0)
    .filter(
      (section, index, allSections) =>
        allSections.findIndex(
          (candidate) => candidate.title === section.title && candidate.rawText === section.rawText,
        ) === index,
    );
}

const GALLERY_IMAGE_SELECTORS = [
  '.slider-container img[src]',
  '.gallery img[src]',
  '[data-gallery] img[src]',
  '.vehicle-gallery img[src]',
  '.product-gallery img[src]',
].join(',');

function imageIdentity(src: string): string {
  return src.replace(/_\d+x\d+(?=\.[a-z0-9]+(?:\?|$))/iu, '');
}

function imagePixelArea(src: string): number {
  const dimensions = src.match(/_(\d+)x(\d+)(?=\.[a-z0-9]+(?:\?|$))/iu);
  return dimensions ? Number(dimensions[1]) * Number(dimensions[2]) : 0;
}

function uniqueBestImageSources(sources: string[]): string[] {
  const selected = new Map<string, { src: string; area: number }>();

  for (const src of sources) {
    const identity = imageIdentity(src);
    const area = imagePixelArea(src);
    const current = selected.get(identity);

    if (!current || area > current.area) {
      selected.set(identity, { src, area });
    }
  }

  return [...selected.values()].map(({ src }) => src);
}

function extractVehicleImages($: CheerioAPI, root: Cheerio<AnyNode>): string[] {
  const gallerySources = root
    .find(GALLERY_IMAGE_SELECTORS)
    .toArray()
    .map((imageElement) => $(imageElement).attr('src') ?? '')
    .filter((src) => src.length > 0 && !/\/ilanfotograflari\/noimage\//iu.test(src));
  const arabamListingSources = gallerySources.filter((src) => /\/ilanfotograflari\//iu.test(src));
  const fallbackSources = root
    .find('img[src]')
    .toArray()
    .map((imageElement) => $(imageElement).attr('src') ?? '')
    .filter(
      (src) =>
        src.length > 0 &&
        !/\/assets(?:2)?\/|favicon|logo|banner|viewcounter|data:image|\/noimage\//iu.test(src),
    );

  return uniqueBestImageSources(
    arabamListingSources.length > 0
      ? arabamListingSources
      : gallerySources.length > 0
        ? gallerySources
        : fallbackSources,
  );
}

export function extractRawVehicleDetails(html: string): RawDetailsPage {
  const $ = load(html);
  const sourceRoot = $('main, .vehicle-detail, .product-detail, body').first();
  const root = sourceRoot.length > 0 ? sourceRoot.clone() : $('body').clone();

  root.find('script, style, noscript, template, nav, header, footer, form').remove();
  root.find(DESCRIPTION_SELECTORS).remove();
  removePrivateContent($, root);

  return rawDetailsPageSchema.parse({
    sections: extractSections($, root),
    images: extractVehicleImages($, root),
    rawText: visibleText(root),
  });
}
