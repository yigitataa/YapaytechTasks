import { apiErrorResponseSchema, detailsResponseSchema } from '@vehicle-cost/contracts';
import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createApp } from '../src/app.js';
import {
  CollectApiConfigurationError,
  type FuelPriceSource,
} from '../src/services/fuel-price/index.js';
import type { VehicleDetailsSource } from '../src/services/vehicle-details/index.js';

const fetchDetails = vi.fn(async () => ({
  sourceUrl: 'https://www.arabam.com/ilan/ham-audi/123',
  sections: [
    {
      title: 'Teknik Özellikler',
      fields: [
        { label: 'Ortalama Yakıt Tüketimi', value: '6,4 lt/100 km' },
        { label: 'Yakıt Deposu', value: '50 lt' },
      ],
      rawText: 'Teknik Özellikler 6,4 lt/100 km 50 lt',
    },
  ],
  images: ['//cdn.example.com/raw-car.jpg?quality=original'],
  rawText: 'Ham araç detay metni',
}));
const fetchFuelPrices = vi.fn(async () => ({
  success: true,
  result: [{ marka: 'Ham Marka', benzin: '45,90 TL' }],
}));
const vehicleDetailsSource: VehicleDetailsSource = { fetchDetails };
const fuelPriceSource: FuelPriceSource = { fetchFuelPrices };

beforeEach(() => {
  fetchDetails.mockClear();
  fetchFuelPrices.mockClear();
});

function expectApiError(body: unknown, code: string) {
  const parsed = apiErrorResponseSchema.parse(body);
  expect(parsed.error.code).toBe(code);
}

describe('POST /api/details', () => {
  it('ham detay ve CollectAPI yanıtını değiştirmeden birleştirir', async () => {
    const app = createApp({ vehicleDetailsSource, fuelPriceSource });
    const response = await request(app)
      .post('/api/details')
      .send({ detailHref: '/ilan/ham-audi/123', city: 'İstanbul', district: 'Şişli / Merkez' })
      .expect(200);
    const result = detailsResponseSchema.parse(response.body);

    expect(fetchDetails).toHaveBeenCalledWith('/ilan/ham-audi/123');
    expect(fetchFuelPrices).toHaveBeenCalledWith('İstanbul', 'Şişli / Merkez');
    expect(result.sections[0]?.fields[0]?.value).toBe('6,4 lt/100 km');
    expect(result.images).toEqual(['//cdn.example.com/raw-car.jpg?quality=original']);
    expect(result.fuelLocation).toEqual({ city: 'İstanbul', district: 'Şişli / Merkez' });
    expect(result.fuelPriceResponse).toEqual({
      success: true,
      result: [{ marka: 'Ham Marka', benzin: '45,90 TL' }],
    });
  });

  it.each([
    'https://evil.example/ilan/1',
    '//evil.example/ilan/1',
    'javascript:alert(1)',
    'data:text/html,boom',
    '/ilan/../hesabim',
    '/ilan/%2e%2e/hesabim',
    '/ilan//evil',
  ])('güvensiz detailHref değerini INVALID_DETAIL_HREF ile reddeder: %s', async (detailHref) => {
    const app = createApp({ vehicleDetailsSource, fuelPriceSource });
    const response = await request(app)
      .post('/api/details')
      .send({ detailHref, city: 'Ankara', district: 'Çankaya' })
      .expect(400);

    expectApiError(response.body, 'INVALID_DETAIL_HREF');
    expect(fetchDetails).not.toHaveBeenCalled();
    expect(fetchFuelPrices).not.toHaveBeenCalled();
  });

  it('CollectAPI hatasında araç detayını HTTP 200 ile döndürmeye devam eder', async () => {
    const app = createApp({
      vehicleDetailsSource,
      fuelPriceSource: {
        fetchFuelPrices: async () => {
          throw new Error('collect unavailable');
        },
      },
    });
    const response = await request(app)
      .post('/api/details')
      .send({ detailHref: '/ilan/ham-audi/123', city: 'Ankara', district: 'Çankaya' })
      .expect(200);

    expect(response.body.rawText).toBe('Ham araç detay metni');
    expectApiError(response.body.fuelPriceResponse, 'FUEL_PRICE_UNAVAILABLE');
  });

  it('CollectAPI anahtarı yoksa güvenli ve uygulanabilir yapılandırma mesajı döndürür', async () => {
    const app = createApp({
      vehicleDetailsSource,
      fuelPriceSource: {
        fetchFuelPrices: async () => {
          throw new CollectApiConfigurationError();
        },
      },
    });
    const response = await request(app)
      .post('/api/details')
      .send({ detailHref: '/ilan/ham-audi/123', city: 'Ankara', district: 'Keçiören' })
      .expect(200);

    expect(response.body.rawText).toBe('Ham araç detay metni');
    expectApiError(response.body.fuelPriceResponse, 'FUEL_PRICE_UNAVAILABLE');
    expect(response.body.fuelPriceResponse.error.message).toContain('apps/backend/.env');
    expect(response.body.fuelPriceResponse.error.message).toContain('COLLECTAPI_API_KEY');
  });

  it('il veya ilçe eksikse CollectAPI çağrısını atlar ve durumu yanıtta açıklar', async () => {
    const app = createApp({ vehicleDetailsSource, fuelPriceSource });
    const response = await request(app)
      .post('/api/details')
      .send({ detailHref: '/ilan/ham-audi/123', city: 'İzmir' })
      .expect(200);

    expect(fetchFuelPrices).not.toHaveBeenCalled();
    expect(response.body.fuelLocation).toEqual({ city: 'İzmir', district: null });
    expectApiError(response.body.fuelPriceResponse, 'FUEL_PRICE_UNAVAILABLE');
    expect(response.body.fuelPriceResponse.error.message).toContain('çağrısı yapılmadı');
  });

  it('detay kaynağı 403/timeout benzeri hata verirse ortak 502 döndürür', async () => {
    const app = createApp({
      vehicleDetailsSource: {
        fetchDetails: async () => {
          throw new Error('HTTP 403');
        },
      },
      fuelPriceSource,
    });
    const response = await request(app)
      .post('/api/details')
      .send({ detailHref: '/ilan/ham-audi/123', city: 'Ankara', district: 'Çankaya' })
      .expect(502);

    expectApiError(response.body, 'UPSTREAM_ERROR');
    expect(fetchFuelPrices).not.toHaveBeenCalled();
  });
});
