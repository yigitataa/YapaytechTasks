import {
  rawSearchPageSchema,
  type RawSearchCell,
  type RawSearchPage,
  type SearchListing,
} from '@vehicle-cost/contracts';
import { load, type Cheerio, type CheerioAPI } from 'cheerio';
import type { AnyNode } from 'domhandler';

function visibleText(element: Cheerio<AnyNode>): string {
  const clone = element.clone();
  clone.find('script, style, [hidden], [aria-hidden="true"]').remove();
  return clone.text().trim();
}

function findRawAttribute(
  element: Cheerio<AnyNode>,
  selector: string,
  attribute: 'href' | 'src',
): string | null {
  return element.find(selector).first().attr(attribute) ?? null;
}

function extractTablePage($: CheerioAPI): RawSearchPage | undefined {
  const candidates: RawSearchPage[] = [];

  $('table').each((_tableIndex, tableElement) => {
    const table = $(tableElement);
    const headers = table
      .find('thead tr')
      .first()
      .children('th, td')
      .toArray()
      .map((header) => visibleText($(header)));
    const items: SearchListing[] = [];

    table.find('tbody tr').each((_rowIndex, rowElement) => {
      const row = $(rowElement);
      const detailHref = findRawAttribute(row, 'a[href*="/ilan/"]', 'href');
      const cellElements = row.children('td').toArray();

      if (!detailHref || cellElements.length === 0) {
        return;
      }

      const cells = cellElements.map<RawSearchCell>((cellElement, cellIndex) => {
        const cell = $(cellElement);

        return {
          label: headers[cellIndex] ?? cell.attr('data-label') ?? '',
          value: visibleText(cell),
        };
      });

      items.push({
        cells,
        imageSrc: findRawAttribute(row, 'img[src]', 'src'),
        detailHref,
        rawText: visibleText(row),
      });
    });

    if (items.length > 0) {
      candidates.push({ headers, items });
    }
  });

  return candidates.sort((left, right) => right.items.length - left.items.length)[0];
}

function extractCardPage($: CheerioAPI): RawSearchPage {
  const items: SearchListing[] = [];

  $('[data-listing-card], .listing-card, article').each((_cardIndex, cardElement) => {
    const card = $(cardElement);
    const detailHref = findRawAttribute(card, 'a[href*="/ilan/"]', 'href');

    if (!detailHref) {
      return;
    }

    const cells: RawSearchCell[] = card
      .find('[data-label]')
      .toArray()
      .map((fieldElement) => {
        const field = $(fieldElement);
        return {
          label: field.attr('data-label') ?? '',
          value: visibleText(field),
        };
      });
    const rawText = visibleText(card);

    items.push({
      cells: cells.length > 0 ? cells : [{ label: '', value: rawText }],
      imageSrc: findRawAttribute(card, 'img[src]', 'src'),
      detailHref,
      rawText,
    });
  });

  return {
    headers: items[0]?.cells.map((cell) => cell.label) ?? [],
    items,
  };
}

export function extractRawSearchPage(html: string): RawSearchPage {
  const $ = load(html);
  return rawSearchPageSchema.parse(extractTablePage($) ?? extractCardPage($));
}
