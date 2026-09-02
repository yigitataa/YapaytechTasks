import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from '../src/app.js';
import { isFixtureDataEnabled } from '../src/config.js';

describe('fixture modu', () => {
  it('yalnız açık geliştirme/test ayarında etkinleşir', () => {
    expect(isFixtureDataEnabled({ NODE_ENV: 'development', DATA_SOURCE_MODE: 'fixture' })).toBe(
      true,
    );
    expect(isFixtureDataEnabled({ NODE_ENV: 'test', DATA_SOURCE_MODE: 'fixture' })).toBe(true);
    expect(isFixtureDataEnabled({ NODE_ENV: 'production', DATA_SOURCE_MODE: 'fixture' })).toBe(
      false,
    );
    expect(isFixtureDataEnabled({ NODE_ENV: 'development' })).toBe(false);
  });

  it('marka → ilan → detay → yakıt → maliyet akışını dış ağ olmadan tamamlar', async () => {
    const app = createApp({ fixtureMode: true });
    const brands = await request(app).get('/api/brands').expect(200);
    const audi = brands.body.items.find((brand: { slug: string }) => brand.slug === 'audi');
    expect(audi.name).toBe('Audi');

    const search = await request(app).get('/api/search?brandSlug=audi').expect(200);
    const listing = search.body.items[0];
    const city = listing.cells.find((cell: { label: string }) => cell.label === 'İl').value;
    const district = listing.cells.find((cell: { label: string }) => cell.label === 'İlçe').value;

    const details = await request(app)
      .post('/api/details')
      .send({ detailHref: listing.detailHref, city, district })
      .expect(200);
    expect(details.body.fuelPriceResponse.result[0].marka).toBe('Fixture Petrol');

    const cost = await request(app)
      .post('/api/cost-estimate')
      .send({
        monthlyKm: '1000 km',
        averageConsumption: '6,4 lt/100 km',
        fuelTankLiters: '50 lt',
        pricePerLiter: details.body.fuelPriceResponse.result[0].benzin,
      })
      .expect(200);

    expect(cost.body).toEqual({
      monthlyCostTry: 2937.6,
      tankCostTry: 2295,
      monthlyLiters: 64,
    });
  });
});
