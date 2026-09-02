import { BRAND_SOURCE_URL } from '@vehicle-cost/contracts';
import { describe, expect, it, vi } from 'vitest';
import {
  FailoverListingSearchSource,
  HttpListingSearchSource,
  type ListingSearchSource,
} from '../src/services/listing-search/index.js';

const listingHtml = `
  <table>
    <thead><tr><th>Model</th><th>Fiyat</th></tr></thead>
    <tbody>
      <tr>
        <td><a href="/ilan/raw-audi/1"><img src="/raw-audi.jpg"></a>Audi A3</td>
        <td>1.050.000 TL</td>
      </tr>
    </tbody>
  </table>
`;

describe('HttpListingSearchSource', () => {
  it('doğrulanmış slug için yalnız ilgili Arabam URL’sinden ham ilanları alır', async () => {
    const fetcher = vi.fn<typeof fetch>(async () =>
      Promise.resolve(
        new Response(listingHtml, {
          status: 200,
          headers: { 'Content-Type': 'text/html; charset=utf-8' },
        }),
      ),
    );
    const result = await new HttpListingSearchSource({ fetcher, timeoutMs: 2_000 }).search('audi');

    expect(result.sourceUrl).toBe(`${BRAND_SOURCE_URL}/audi`);
    expect(result.items[0]?.cells[1]?.value).toBe('1.050.000 TL');
    expect(fetcher).toHaveBeenCalledWith(
      `${BRAND_SOURCE_URL}/audi`,
      expect.objectContaining({
        method: 'GET',
        redirect: 'error',
      }),
    );
  });

  it('geçersiz slug için HTTP çağrısı yapmaz', async () => {
    const fetcher = vi.fn<typeof fetch>();

    await expect(new HttpListingSearchSource({ fetcher }).search('../ilan')).rejects.toThrow();
    expect(fetcher).not.toHaveBeenCalled();
  });
});

describe('FailoverListingSearchSource', () => {
  it('Puppeteer benzeri kaynak 403 verdiğinde HTTP sonucunu döndürür', async () => {
    const first: ListingSearchSource = {
      search: vi.fn(async () => Promise.reject(new Error('HTTP 403'))),
    };
    const second: ListingSearchSource = {
      search: vi.fn(async () => ({
        sourceUrl: `${BRAND_SOURCE_URL}/audi`,
        headers: ['Model'],
        items: [
          {
            cells: [{ label: 'Model', value: 'Audi A3' }],
            imageSrc: null,
            detailHref: '/ilan/raw-audi/1',
            rawText: 'Audi A3',
          },
        ],
      })),
    };

    const result = await new FailoverListingSearchSource([first, second]).search('audi');

    expect(result.items).toHaveLength(1);
    expect(first.search).toHaveBeenCalledOnce();
    expect(second.search).toHaveBeenCalledOnce();
  });
});
