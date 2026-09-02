import {
  BRAND_SOURCE_URL,
  brandsResponseSchema,
  type BrandsResponse,
  type RawDetailsPage,
} from '@vehicle-cost/contracts';
import type { BrandCatalogReader } from '../services/brand-catalog/index.js';
import type { FuelPriceSource } from '../services/fuel-price/index.js';
import type { ListingSearchResult, ListingSearchSource } from '../services/listing-search/index.js';
import {
  buildVehicleDetailUrl,
  type VehicleDetailsResult,
  type VehicleDetailsSource,
} from '../services/vehicle-details/index.js';

const fixtureCatalog: BrandsResponse = brandsResponseSchema.parse({
  items: [
    { name: 'Alfa Romeo', slug: 'alfa-romeo' },
    { name: 'Audi', slug: 'audi' },
    { name: 'BMW', slug: 'bmw' },
    { name: 'Fiat', slug: 'fiat' },
    { name: 'Renault', slug: 'renault' },
  ],
  source: 'fallback',
  updatedAt: '2026-09-01T00:00:00.000Z',
  sourceUrl: BRAND_SOURCE_URL,
});

const fixtureDetailHref = '/ilan/fixture-audi-a3/1001';

const fixtureDetails: RawDetailsPage = {
  sections: [
    {
      title: 'Teknik Özellikler',
      fields: [
        { label: 'Yakıt Tipi', value: 'Benzin' },
        { label: 'Ortalama Yakıt Tüketimi', value: '6,4 lt/100 km' },
        { label: 'Yakıt Deposu', value: '50 lt' },
        { label: 'Motor Gücü', value: '150 HP' },
        { label: 'Şanzıman', value: 'Otomatik' },
      ],
      rawText:
        'Teknik Özellikler Yakıt Tipi Benzin Ortalama Yakıt Tüketimi 6,4 lt/100 km Yakıt Deposu 50 lt Motor Gücü 150 HP Şanzıman Otomatik',
    },
    {
      title: 'Donanım',
      fields: [{ label: 'Donanım', value: 'Hız sabitleyici, geri görüş kamerası' }],
      rawText: 'Donanım Hız sabitleyici, geri görüş kamerası',
    },
  ],
  images: ['/fixture/audi-a3-front.jpg', '/fixture/audi-a3-interior.jpg'],
  rawText: 'Audi A3 Fixture İlanı Teknik Özellikler Benzin 6,4 lt/100 km 50 lt',
};

export class FixtureBrandCatalog implements BrandCatalogReader {
  async getCatalog(): Promise<BrandsResponse> {
    return fixtureCatalog;
  }

  async hasSlug(slug: string): Promise<boolean> {
    return fixtureCatalog.items.some((brand) => brand.slug === slug);
  }
}

export class FixtureListingSearchSource implements ListingSearchSource {
  async search(brandSlug: string): Promise<ListingSearchResult> {
    return {
      sourceUrl: `${BRAND_SOURCE_URL}/${brandSlug}`,
      headers: ['Model', 'İlan Başlığı', 'Yıl', 'Kilometre', 'Fiyat', 'İl', 'İlçe'],
      items:
        brandSlug === 'audi'
          ? [
              {
                cells: [
                  { label: 'Model', value: 'Audi A3' },
                  { label: 'İlan Başlığı', value: 'Fixture Audi A3 İlanı' },
                  { label: 'Yıl', value: '2021' },
                  { label: 'Kilometre', value: '42.500 km' },
                  { label: 'Fiyat', value: '1.450.000 TL' },
                  { label: 'İl', value: 'İstanbul' },
                  { label: 'İlçe', value: 'Kadıköy' },
                ],
                imageSrc: '/fixture/audi-a3-list.jpg',
                detailHref: fixtureDetailHref,
                rawText:
                  'Audi A3 Fixture Audi A3 İlanı 2021 42.500 km 1.450.000 TL İstanbul Kadıköy',
              },
            ]
          : [],
    };
  }
}

export class FixtureVehicleDetailsSource implements VehicleDetailsSource {
  async fetchDetails(detailHref: string): Promise<VehicleDetailsResult> {
    if (detailHref !== fixtureDetailHref) {
      throw new Error('Fixture detay ilanı bulunamadı.');
    }

    return {
      ...fixtureDetails,
      sourceUrl: buildVehicleDetailUrl(detailHref),
    };
  }
}

export class FixtureFuelPriceSource implements FuelPriceSource {
  async fetchFuelPrices(city: string, district: string): Promise<unknown> {
    return {
      success: true,
      result: [
        { marka: 'Fixture Petrol', benzin: '45,90 TL', city, district },
        { marka: 'Örnek Akaryakıt', benzin: '46,25 TL', city, district },
      ],
    };
  }
}
