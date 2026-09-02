import { describe, expect, it } from 'vitest';
import { cleanListingDisplayText, extractRawLocation } from './raw-data';

describe('ilan listeleme sunumu', () => {
  it('konuma karışan karşılaştırma, favori ve görünürlük kontrollerini göstermez', () => {
    const rawValue = `
      İstanbul Eyüpsultan
      Karşılaştır
      Karşılaştırmadan Çıkar
      Favorilerimde
      Favoriye Ekle
      Gizle Göster Göster
    `;

    expect(cleanListingDisplayText(rawValue)).toBe('İstanbul Eyüpsultan');
  });

  it('CollectAPI konumuna arayüz kontrol metinlerini taşımaz', () => {
    const location = extractRawLocation({
      cells: [
        { label: 'İl', value: 'İstanbul Karşılaştır Favoriye Ekle' },
        { label: 'İlçe', value: 'Eyüpsultan Gizle Göster' },
      ],
      imageSrc: null,
      detailHref: '/ilan/ornek/1',
      rawText: '',
    });

    expect(location).toEqual({ city: 'İstanbul', district: 'Eyüpsultan' });
  });

  it('canlı tablodaki birleşik İl / İlçe hücresini CollectAPI isteği için ayırır', () => {
    const location = extractRawLocation({
      cells: [
        {
          label: 'İl / İlçe',
          value:
            'İstanbul Küçükçekmece Karşılaştır Karşılaştırmadan Çıkar Favorilerimde Favoriye Ekle Gizle Göster',
        },
      ],
      imageSrc: null,
      detailHref: '/ilan/ornek/1',
      rawText: '',
    });

    expect(location).toEqual({ city: 'İstanbul', district: 'Küçükçekmece' });
  });
});
