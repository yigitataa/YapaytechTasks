import {
  BRAND_SOURCE_URL,
  apiErrorResponseSchema,
  brandsResponseSchema,
  searchResponseSchema,
  type BrandsResponse,
} from '@vehicle-cost/contracts';
import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createApp } from '../src/app.js';
import type { BrandCatalogReader } from '../src/services/brand-catalog/index.js';
import type { ListingSearchSource } from '../src/services/listing-search/index.js';

const liveResponse: BrandsResponse = {
  items: [{ name: 'Tesla', slug: 'tesla' }],
  source: 'live',
  updatedAt: '2026-09-01T00:00:00.000Z',
  sourceUrl: BRAND_SOURCE_URL,
};

const testCatalog: BrandCatalogReader = {
  getCatalog: async () => liveResponse,
  hasSlug: async (slug) => liveResponse.items.some((brand) => brand.slug === slug),
};
const search = vi.fn(async () => ({
  sourceUrl: `${BRAND_SOURCE_URL}/tesla`,
  headers: ['Model', 'Fiyat'],
  items: [
    {
      cells: [
        { label: 'Model', value: 'Tesla Model 3' },
        { label: 'Fiyat', value: '2.345.000 TL' },
      ],
      imageSrc: '//image.example/raw-tesla.jpg',
      detailHref: '/ilan/ham-tesla-ilani/123?ref=liste',
      rawText: 'Tesla Model 3\n2.345.000 TL',
    },
  ],
}));
const listingSearchSource: ListingSearchSource = { search };
const app = createApp({ brandCatalog: testCatalog, listingSearchSource });

beforeEach(() => {
  search.mockClear();
});

function expectApiError(body: unknown, code: string) {
  const result = apiErrorResponseSchema.safeParse(body);

  expect(result.success).toBe(true);
  if (result.success) {
    expect(result.data.error.code).toBe(code);
  }
}

describe('marka API route’ları', () => {
  it('GET /api/brands etkin katalog ve metadata döndürür', async () => {
    const response = await request(app).get('/api/brands').expect(200);
    const result = brandsResponseSchema.safeParse(response.body);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(liveResponse);
    }
  });

  it('canlı katalogdan gelen slug için ham ilan verisini HTTP 200 döndürür', async () => {
    const response = await request(app).get('/api/search?brandSlug=tesla').expect(200);
    const result = searchResponseSchema.parse(response.body);

    expect(result.brand).toEqual({ name: 'Tesla', slug: 'tesla' });
    expect(result.headers).toEqual(['Model', 'Fiyat']);
    expect(result.items[0]).toEqual({
      cells: [
        { label: 'Model', value: 'Tesla Model 3' },
        { label: 'Fiyat', value: '2.345.000 TL' },
      ],
      imageSrc: '//image.example/raw-tesla.jpg',
      detailHref: '/ilan/ham-tesla-ilani/123?ref=liste',
      rawText: 'Tesla Model 3\n2.345.000 TL',
    });
    expect(search).toHaveBeenCalledWith('tesla');
  });

  it('katalogda olmayan slug için INVALID_BRAND_SLUG döndürür', async () => {
    const response = await request(app).get('/api/search?brandSlug=mercedes').expect(400);
    expectApiError(response.body, 'INVALID_BRAND_SLUG');
    expect(search).not.toHaveBeenCalled();
  });

  it('biçimi geçersiz slug için INVALID_BRAND_SLUG döndürür', async () => {
    const response = await request(app).get('/api/search?brandSlug=Audi_').expect(400);
    expectApiError(response.body, 'INVALID_BRAND_SLUG');
    expect(search).not.toHaveBeenCalled();
  });

  it('canlı ilan kaynağı hatasını ortak 502 hatasına eşler', async () => {
    const failingApp = createApp({
      brandCatalog: testCatalog,
      listingSearchSource: {
        search: async () => {
          throw new Error('source unavailable');
        },
      },
    });
    const response = await request(failingApp).get('/api/search?brandSlug=tesla').expect(502);

    expectApiError(response.body, 'UPSTREAM_ERROR');
    expect(response.body.error.retryable).toBe(true);
  });
});
