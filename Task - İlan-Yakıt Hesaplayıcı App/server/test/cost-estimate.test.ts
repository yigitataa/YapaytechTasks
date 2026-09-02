import { apiErrorResponseSchema, costEstimateResponseSchema } from '@vehicle-cost/contracts';
import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from '../src/app.js';
import { calculateCostEstimate } from '../src/services/cost-estimate/index.js';

describe('maliyet hesaplama', () => {
  it('ham Türkçe sayı metinlerini yalnız hesaplama anında yorumlar', () => {
    const result = calculateCostEstimate({
      monthlyKm: '1.200 km',
      averageConsumption: '6,4 lt/100 km',
      fuelTankLiters: '50 lt',
      pricePerLiter: '45,90 TL',
    });

    expect(result).toEqual({
      monthlyCostTry: 3525.12,
      tankCostTry: 2295,
      monthlyLiters: 76.8,
    });
  });

  it('ara işlem hassasiyetini ondalık aritmetik ile korur', () => {
    const result = calculateCostEstimate({
      monthlyKm: 333,
      averageConsumption: 7.1,
      fuelTankLiters: 47.5,
      pricePerLiter: 44.37,
    });

    expect(result.monthlyCostTry).toBe(1049.04);
    expect(result.tankCostTry).toBe(2107.58);
    expect(result.monthlyLiters).toBe(23.643);
  });

  it('Arabam kaynağındaki kısa tüketim birimini hesaplar', () => {
    const result = calculateCostEstimate({
      monthlyKm: '1000',
      averageConsumption: '4,6 lt',
      fuelTankLiters: '58 lt',
      pricePerLiter: '6,91',
    });

    expect(result).toEqual({
      monthlyCostTry: 317.86,
      tankCostTry: 400.78,
      monthlyLiters: 46,
    });
  });

  it('POST /api/cost-estimate başarılı hesabı ortak sözleşmede döndürür', async () => {
    const response = await request(createApp())
      .post('/api/cost-estimate')
      .send({
        monthlyKm: '1200',
        averageConsumption: '6,4 lt/100 km',
        fuelTankLiters: '50 lt',
        pricePerLiter: '45,90 TL',
      })
      .expect(200);

    expect(costEstimateResponseSchema.parse(response.body).monthlyCostTry).toBe(3525.12);
  });

  it.each([
    [{ monthlyKm: '', averageConsumption: '6,4', fuelTankLiters: '50', pricePerLiter: '45' }],
    [{ monthlyKm: '1000', averageConsumption: null, fuelTankLiters: '50', pricePerLiter: '45' }],
    [
      {
        monthlyKm: '1000',
        averageConsumption: 'bilinmiyor',
        fuelTankLiters: '50',
        pricePerLiter: '45',
      },
    ],
    [
      {
        monthlyKm: '1000',
        averageConsumption: '6,4',
        fuelTankLiters: undefined,
        pricePerLiter: '45',
      },
    ],
  ])('geçersiz veya eksik girdi için 422 CALCULATION_INPUT_INVALID döndürür', async (body) => {
    const response = await request(createApp()).post('/api/cost-estimate').send(body).expect(422);
    const parsed = apiErrorResponseSchema.parse(response.body);

    expect(parsed.error.code).toBe('CALCULATION_INPUT_INVALID');
  });
});
