import { brandListSchema, type Brand } from '@vehicle-cost/contracts';
import { load } from 'cheerio';

const brandHrefPattern = /^\/ikinci-el\/otomobil\/([a-z0-9]+(?:-[a-z0-9]+)*)$/;
const listingCountPattern = /\s+\d{1,3}(?:\.\d{3})*$/;

function cleanBrandName(visibleText: string): string | undefined {
  const normalizedText = visibleText.replace(/\s+/g, ' ').trim();

  if (!listingCountPattern.test(normalizedText)) {
    return undefined;
  }

  const name = normalizedText.replace(listingCountPattern, '').trim();
  return name || undefined;
}

export function extractBrandsFromHtml(html: string): Brand[] {
  const $ = load(html);
  const brands: Brand[] = [];

  $('a[href]').each((_index, element) => {
    const href = $(element).attr('href');
    const match = href?.match(brandHrefPattern);
    const slug = match?.[1];
    const name = cleanBrandName($(element).text());

    if (slug && name) {
      brands.push({ name, slug });
    }
  });

  brands.sort((left, right) => left.name.localeCompare(right.name, 'tr', { sensitivity: 'base' }));

  return brandListSchema.parse(brands);
}
