import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';
import { extractRawVehicleDetails } from '../src/services/vehicle-details/parser.js';

const fixtureUrl = new URL('./fixtures/vehicle-details.html', import.meta.url);

describe('extractRawVehicleDetails', () => {
  it('ham alanları, bölüm metinlerini ve görsel src değerlerini değiştirmeden döndürür', async () => {
    const result = extractRawVehicleDetails(await readFile(fixtureUrl, 'utf8'));

    expect(result.sections[0]).toMatchObject({
      title: 'Teknik Özellikler',
      fields: expect.arrayContaining([
        { label: 'Yakıt Tipi', value: 'Benzin & LPG' },
        { label: 'Ortalama Yakıt Tüketimi', value: '6,4 lt/100 km' },
        { label: 'Yakıt Deposu', value: '50 lt' },
      ]),
    });
    expect(result.images).toEqual([
      '//cdn.example.com/ilanfotograflari/431/front_580x435.jpg',
      '//cdn.example.com/ilanfotograflari/431/rear_580x435.jpg',
    ]);
    expect(result.images.every((source) => source.includes('_580x435.'))).toBe(true);
    expect(result.images).not.toContain('/assets/favicon.png');
    expect(result.rawText).not.toContain('Bakımları zamanında yapılmıştır.');
  });

  it('ilan açıklamasını, satıcıyı ve telefon verisini ham çıktıdan çıkarır', async () => {
    const result = extractRawVehicleDetails(await readFile(fixtureUrl, 'utf8'));
    const serialized = JSON.stringify(result);

    expect(serialized).not.toContain('0555 111 22 33');
    expect(serialized).not.toContain('Satıcı Adı');
    expect(serialized).not.toContain('Boya bilgisi ilandaki gibidir.');
    expect(result.sections.map((section) => section.title)).not.toContain('Açıklama');
  });
});
