import { BRAND_SOURCE_URL } from '@vehicle-cost/contracts';
import { describe, expect, it, vi } from 'vitest';
import { HttpBrandSource } from '../src/services/brand-catalog/http-source.js';

const html = `
  <a href="/ikinci-el/otomobil/audi">Audi 5.004</a>
  <a href="/ikinci-el/otomobil/renault">Renault 27.253</a>
`;

describe('HttpBrandSource', () => {
  it('yalnız sabit Arabam URL’sinden HTML alıp markaları çıkarır', async () => {
    const fetcher = vi.fn<typeof fetch>(async () =>
      Promise.resolve(
        new Response(html, {
          status: 200,
          headers: { 'Content-Type': 'text/html; charset=utf-8' },
        }),
      ),
    );
    const source = new HttpBrandSource({ fetcher, timeoutMs: 2_000 });

    await expect(source.fetchBrands()).resolves.toEqual([
      { name: 'Audi', slug: 'audi' },
      { name: 'Renault', slug: 'renault' },
    ]);
    expect(fetcher).toHaveBeenCalledWith(
      BRAND_SOURCE_URL,
      expect.objectContaining({
        method: 'GET',
        redirect: 'error',
        headers: {
          Accept: 'text/html,application/xhtml+xml',
          'User-Agent': 'YataOil/0.1 (brand-catalog)',
        },
      }),
    );
  });

  it('başarısız HTTP yanıtını reddeder', async () => {
    const fetcher = vi.fn<typeof fetch>(async () =>
      Promise.resolve(new Response('Forbidden', { status: 403 })),
    );

    await expect(new HttpBrandSource({ fetcher }).fetchBrands()).rejects.toThrow('403');
  });

  it('HTML olmayan yanıtı reddeder', async () => {
    const fetcher = vi.fn<typeof fetch>(async () =>
      Promise.resolve(
        new Response('{}', {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      ),
    );

    await expect(new HttpBrandSource({ fetcher }).fetchBrands()).rejects.toThrow(
      'beklenmeyen içerik türü',
    );
  });
});
