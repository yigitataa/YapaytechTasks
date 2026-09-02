import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';
import { extractRawSearchPage } from '../src/services/listing-search/parser.js';

const tableFixtureUrl = new URL('./fixtures/listing-search-table.html', import.meta.url);

describe('extractRawSearchPage', () => {
  it('tablo başlıklarını ve kolon sırasını olduğu gibi korur', async () => {
    const result = extractRawSearchPage(await readFile(tableFixtureUrl, 'utf8'));

    expect(result.headers).toEqual([
      '',
      'Model',
      'İlan Başlığı',
      'Yıl',
      'Kilometre',
      'Renk',
      'Fiyat',
      'Tarih',
      'İl / İlçe',
    ]);
    expect(result.items).toHaveLength(1);
    expect(result.items[0]?.cells.map((cell) => cell.label)).toEqual(result.headers);
  });

  it('fiyat, kilometre, tarih ve konum metinlerini dönüştürmeden döndürür', async () => {
    const [listing] = extractRawSearchPage(await readFile(tableFixtureUrl, 'utf8')).items;
    const values = listing?.cells.map((cell) => cell.value);

    expect(values).toContain('201.000');
    expect(values).toContain('1.050.000 TL');
    expect(values).toContain('01 Eylül 2026');
    expect(values).toContain('İstanbul Tuzla');
  });

  it('görsel src ve ilan href değerlerini ham biçimde korur', async () => {
    const [listing] = extractRawSearchPage(await readFile(tableFixtureUrl, 'utf8')).items;

    expect(listing?.imageSrc).toBe('//cdn.example.com/raw/audi-a3.jpg?size=small');
    expect(listing?.detailHref).toBe('/ilan/galeriden-satilik-audi-a3/ham-ilan/43243003?ref=liste');
    expect(listing?.rawText).toContain('AUDİ A3 1.6 TDİ SPORT LİNE');
  });

  it('ilan olmayan tablo satırlarını filtreler', async () => {
    const result = extractRawSearchPage(await readFile(tableFixtureUrl, 'utf8'));

    expect(result.items).toHaveLength(1);
    expect(result.items[0]?.rawText).not.toContain('Reklam satırı');
  });

  it('kart görünümündeki etiketli alanları kaynak sırasıyla çıkarır', () => {
    const result = extractRawSearchPage(`
      <article data-listing-card>
        <a href="/ilan/ham-kart/88"><img src="/images/raw-card.jpg"></a>
        <div data-label="Model">Audi A4 Sedan 2.0 TDI</div>
        <div data-label="Fiyat">1.550.000 TL</div>
        <div data-label="İl / İlçe">Gaziantep Şehitkamil</div>
      </article>
    `);

    expect(result.headers).toEqual(['Model', 'Fiyat', 'İl / İlçe']);
    expect(result.items[0]).toEqual({
      cells: [
        { label: 'Model', value: 'Audi A4 Sedan 2.0 TDI' },
        { label: 'Fiyat', value: '1.550.000 TL' },
        { label: 'İl / İlçe', value: 'Gaziantep Şehitkamil' },
      ],
      imageSrc: '/images/raw-card.jpg',
      detailHref: '/ilan/ham-kart/88',
      rawText: expect.stringContaining('Audi A4 Sedan 2.0 TDI'),
    });
  });
});
