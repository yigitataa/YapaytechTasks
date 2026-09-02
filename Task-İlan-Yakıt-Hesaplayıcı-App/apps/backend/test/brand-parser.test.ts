import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';
import { extractBrandsFromHtml } from '../src/services/brand-catalog/parser.js';

const fixtureUrl = new URL('./fixtures/brand-categories.html', import.meta.url);

describe('extractBrandsFromHtml', () => {
  it('fixture içindeki marka adlarını ve href slug değerlerini alfabetik çıkarır', async () => {
    const brands = extractBrandsFromHtml(await readFile(fixtureUrl, 'utf8'));

    expect(brands).toEqual([
      { name: 'Alfa Romeo', slug: 'alfa-romeo' },
      { name: 'Audi', slug: 'audi' },
      { name: 'BMW', slug: 'bmw' },
    ]);
  });

  it('ana kategori, ilan, model, footer ve kategori dışı bağlantıları filtreler', async () => {
    const brands = extractBrandsFromHtml(await readFile(fixtureUrl, 'utf8'));

    expect(brands.map((brand) => brand.slug)).not.toEqual(
      expect.arrayContaining(['otomobil', 'audi-a4', 'suv', 'listing-43243003']),
    );
    expect(brands).toHaveLength(3);
  });

  it('metnin sonundaki düz ve noktalı ilan adetlerini temizler', async () => {
    const brands = extractBrandsFromHtml(await readFile(fixtureUrl, 'utf8'));

    expect(brands.find((brand) => brand.slug === 'alfa-romeo')?.name).toBe('Alfa Romeo');
    expect(brands.find((brand) => brand.slug === 'audi')?.name).toBe('Audi');
  });

  it('yinelenen slug kayıtlarını reddeder', () => {
    expect(() =>
      extractBrandsFromHtml(`
        <a href="/ikinci-el/otomobil/audi">Audi 4.943</a>
        <a href="/ikinci-el/otomobil/audi">Başka Audi 2</a>
      `),
    ).toThrow();
  });

  it('geçersiz slug ve boş ad kayıtlarını kabul etmez', () => {
    expect(
      extractBrandsFromHtml(`
        <a href="/ikinci-el/otomobil/Audi_">Audi 4.943</a>
        <a href="/ikinci-el/otomobil/gecerli">123</a>
        <a href="/ikinci-el/otomobil/fiat">Fiat 12.300</a>
      `),
    ).toEqual([{ name: 'Fiat', slug: 'fiat' }]);
  });
});
