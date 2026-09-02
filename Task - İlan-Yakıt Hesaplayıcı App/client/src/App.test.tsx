import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { App } from './App';

const timestamp = '2026-09-01T12:00:00.000Z';
const brandsPayload = {
  items: [{ name: 'Audi', slug: 'audi' }],
  source: 'fallback',
  updatedAt: timestamp,
  sourceUrl: 'https://www.arabam.com/ikinci-el/otomobil',
};
const listingPayload = {
  brand: { name: 'Audi', slug: 'audi' },
  sourceUrl: 'https://www.arabam.com/ikinci-el/otomobil/audi',
  headers: ['', 'Model', 'Fiyat', 'İl / İlçe'],
  items: [
    {
      cells: [
        { label: '', value: '' },
        { label: 'Model', value: 'Audi A3' },
        { label: 'Fiyat', value: '1.450.000 TL' },
        {
          label: 'İl / İlçe',
          value:
            'İstanbul Kadıköy Karşılaştır Karşılaştırmadan Çıkar Favorilerimde Favoriye Ekle Gizle Göster',
        },
      ],
      imageSrc: '//cdn.example.com/listing-audi-a3.jpg',
      detailHref: '/ilan/fixture-audi/1001',
      rawText: 'Audi A3 1.450.000 TL İstanbul Kadıköy',
    },
  ],
  fetchedAt: timestamp,
};
const detailsPayload = {
  sourceUrl: 'https://www.arabam.com/ilan/fixture-audi/1001',
  sections: [
    {
      title: 'Teknik Özellikler',
      fields: [
        { label: 'Yakıt Tipi', value: 'Benzin' },
        { label: 'Ort. Yakıt Tüketimi', value: '6,4 lt/100 km' },
        { label: 'Yakıt Deposu', value: '50 lt' },
      ],
      rawText: 'Teknik Özellikler Benzin 6,4 lt/100 km 50 lt',
    },
  ],
  images: ['/images/audi-a3-front.jpg', '/images/audi-a3-interior.jpg'],
  rawText: 'Ham araç detay metni',
  fuelLocation: { city: 'İstanbul', district: 'Kadıköy' },
  fuelPriceResponse: {
    success: true,
    result: [{ marka: 'Fixture Petrol', benzin: '45,90 TL' }],
  },
  fetchedAt: timestamp,
};

function jsonResponse(body: unknown, status = 200): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  } as Response;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('React kullanıcı akışı', () => {
  it('marka → ilan → detay → yakıt seçimi → aylık km → maliyet akışını tamamlar', async () => {
    const fetchMock = vi.fn<typeof fetch>(async (input) => {
      const url = String(input);
      if (url.endsWith('/brands')) return jsonResponse(brandsPayload);
      if (url.includes('/search?brandSlug=audi')) return jsonResponse(listingPayload);
      if (url.endsWith('/details')) return jsonResponse(detailsPayload);
      if (url.endsWith('/cost-estimate')) {
        return jsonResponse({ monthlyCostTry: 3525.12, tankCostTry: 2295, monthlyLiters: 76.8 });
      }
      return jsonResponse({}, 404);
    });
    vi.stubGlobal('fetch', fetchMock);
    const user = userEvent.setup();

    render(<App />);
    expect(screen.getByText('Markalar yükleniyor…')).toBeInTheDocument();

    await user.click(await screen.findByRole('button', { name: 'Audi ilanlarını gör' }));
    expect(
      screen.queryByRole('heading', { name: 'Popüler araç markaları' }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Audi ilanları' })).toBeInTheDocument();
    expect((await screen.findAllByText('1.450.000 TL')).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('img', { name: 'Audi A3 ilan görseli' }).length).toBeGreaterThan(0);
    expect(screen.queryByText(/Karşılaştırmadan Çıkar/)).not.toBeInTheDocument();
    await user.click(screen.getAllByRole('button', { name: 'İlanı incele' })[0]!);

    expect(screen.queryByRole('heading', { name: 'Audi ilanları' })).not.toBeInTheDocument();
    expect(await screen.findByRole('heading', { name: 'Teknik Özellikler' })).toBeInTheDocument();
    expect(screen.queryByText('Ham araç detay metni')).not.toBeInTheDocument();
    expect(
      screen.queryByText('Teknik Özellikler Benzin 6,4 lt/100 km 50 lt'),
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Araç fotoğrafı 1 büyüt' }));
    expect(screen.getByRole('dialog', { name: 'Araç fotoğraf galerisi' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Büyük araç görseli 1' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Sonraki fotoğraf' }));
    expect(screen.getByRole('img', { name: 'Büyük araç görseli 2' })).toBeInTheDocument();
    await user.keyboard('{ArrowLeft}');
    expect(screen.getByRole('img', { name: 'Büyük araç görseli 1' })).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(
      screen.queryByRole('dialog', { name: 'Araç fotoğraf galerisi' }),
    ).not.toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText('Yakıt istasyonu / marka'), '0');
    await user.type(screen.getByLabelText('Aylık kilometre'), '1200');
    await user.click(screen.getByRole('button', { name: 'Maliyeti hesapla' }));

    expect(await screen.findByText('3.525,12 TL')).toBeInTheDocument();
    expect(screen.getByText('2.295 TL')).toBeInTheDocument();

    const detailCall = fetchMock.mock.calls.find(([input]) => String(input).endsWith('/details'));
    expect(JSON.parse(String(detailCall?.[1]?.body))).toEqual({
      detailHref: '/ilan/fixture-audi/1001',
      city: 'İstanbul',
      district: 'Kadıköy',
    });
    const costCall = fetchMock.mock.calls.find(([input]) =>
      String(input).endsWith('/cost-estimate'),
    );
    expect(JSON.parse(String(costCall?.[1]?.body))).toEqual({
      monthlyKm: '1200',
      averageConsumption: '6,4 lt/100 km',
      fuelTankLiters: '50 lt',
      pricePerLiter: '45,90 TL',
    });
  });

  it('yüklenme ve boş sonuç durumlarını ayrı gösterir', async () => {
    const fetchMock = vi.fn<typeof fetch>(async (input) => {
      const url = String(input);
      if (url.endsWith('/brands')) return jsonResponse(brandsPayload);
      return jsonResponse({ ...listingPayload, items: [] });
    });
    vi.stubGlobal('fetch', fetchMock);
    const user = userEvent.setup();

    render(<App />);
    expect(screen.getByText('Markalar yükleniyor…')).toBeInTheDocument();
    await user.click(await screen.findByRole('button', { name: 'Audi ilanlarını gör' }));
    expect(
      await screen.findByText('Bu marka için ilk sayfada görünür ilan bulunamadı.'),
    ).toBeInTheDocument();
  });

  it('Arabam 502/403 erişim durumunu anlaşılır biçimde gösterir', async () => {
    const fetchMock = vi.fn<typeof fetch>(async (input) => {
      const url = String(input);
      if (url.endsWith('/brands')) return jsonResponse(brandsPayload);
      return jsonResponse(
        {
          error: {
            code: 'UPSTREAM_ERROR',
            message: 'İlan arama kaynağına şu anda ulaşılamıyor.',
            retryable: true,
          },
        },
        502,
      );
    });
    vi.stubGlobal('fetch', fetchMock);
    const user = userEvent.setup();

    render(<App />);
    await user.click(await screen.findByRole('button', { name: 'Audi ilanlarını gör' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Cloudflare/403 erişim kontrolü');
  });

  it('CollectAPI hatasını ve eksik kaynak tüketim/depo bilgisini ayrı gösterir', async () => {
    const detailWithoutCalculationFields = {
      ...detailsPayload,
      sections: [
        {
          title: 'Teknik Özellikler',
          fields: [{ label: 'Yakıt Tipi', value: 'Benzin' }],
          rawText: 'Yakıt Tipi Benzin',
        },
      ],
      fuelPriceResponse: {
        error: {
          code: 'FUEL_PRICE_UNAVAILABLE',
          message: 'Yakıt fiyatı servisine şu anda ulaşılamıyor.',
          retryable: true,
        },
      },
    };
    const fetchMock = vi.fn<typeof fetch>(async (input) => {
      const url = String(input);
      if (url.endsWith('/brands')) return jsonResponse(brandsPayload);
      if (url.includes('/search')) return jsonResponse(listingPayload);
      return jsonResponse(detailWithoutCalculationFields);
    });
    vi.stubGlobal('fetch', fetchMock);
    const user = userEvent.setup();

    render(<App />);
    await user.click(await screen.findByRole('button', { name: 'Audi ilanlarını gör' }));
    await user.click((await screen.findAllByRole('button', { name: 'İlanı incele' }))[0]!);

    expect(
      await screen.findByText('Yakıt fiyatı servisine şu anda ulaşılamıyor.'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Kaynakta tüketim veya depo bilgisi yok; tahmin üretilmeyecek.'),
    ).toBeInTheDocument();
    expect(screen.getAllByText('Kaynakta yok')).toHaveLength(2);
  });

  it('geçersiz aylık km için API çağrısı yapmadan form hatası gösterir', async () => {
    const fetchMock = vi.fn<typeof fetch>(async (input) => {
      const url = String(input);
      if (url.endsWith('/brands')) return jsonResponse(brandsPayload);
      if (url.includes('/search')) return jsonResponse(listingPayload);
      return jsonResponse(detailsPayload);
    });
    vi.stubGlobal('fetch', fetchMock);
    const user = userEvent.setup();

    render(<App />);
    await user.click(await screen.findByRole('button', { name: 'Audi ilanlarını gör' }));
    await user.click((await screen.findAllByRole('button', { name: 'İlanı incele' }))[0]!);
    await screen.findByRole('heading', { name: 'Teknik Özellikler' });
    await user.selectOptions(screen.getByLabelText('Yakıt istasyonu / marka'), '0');
    await user.click(screen.getByRole('button', { name: 'Maliyeti hesapla' }));

    expect(screen.getByRole('alert')).toHaveTextContent('Aylık kilometre sıfırdan büyük');
    expect(fetchMock.mock.calls.some(([input]) => String(input).endsWith('/cost-estimate'))).toBe(
      false,
    );
  });

  it('ilk marka isteği beklerken yüklenme durumunu korur', async () => {
    const fetchMock = vi.fn<typeof fetch>(() => new Promise(() => undefined));
    vi.stubGlobal('fetch', fetchMock);

    render(<App />);
    expect(screen.getByText('Markalar yükleniyor…')).toBeInTheDocument();
    await waitFor(() => expect(fetchMock).toHaveBeenCalledOnce());
  });

  it('sonuç ve detay ekranlarından önceki ekrana döner', async () => {
    const fetchMock = vi.fn<typeof fetch>(async (input) => {
      const url = String(input);
      if (url.endsWith('/brands')) return jsonResponse(brandsPayload);
      if (url.includes('/search')) return jsonResponse(listingPayload);
      return jsonResponse(detailsPayload);
    });
    vi.stubGlobal('fetch', fetchMock);
    const user = userEvent.setup();

    render(<App />);
    await user.click(await screen.findByRole('button', { name: 'Audi ilanlarını gör' }));
    await user.click((await screen.findAllByRole('button', { name: 'İlanı incele' }))[0]!);
    await screen.findByRole('heading', { name: 'Teknik Özellikler' });

    await user.click(screen.getByRole('button', { name: /İlan sonuçlarına dön/ }));
    expect(screen.getByRole('heading', { name: 'Audi ilanları' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Yakıt maliyeti' })).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Marka değiştir/ }));
    expect(screen.getByRole('heading', { name: 'Popüler araç markaları' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Audi ilanları' })).not.toBeInTheDocument();
  });

  it('API bağlantı hatasını açıklayıp marka isteğini yeniden dener', async () => {
    let requestCount = 0;
    const fetchMock = vi.fn<typeof fetch>(async () => {
      requestCount += 1;
      if (requestCount === 1) {
        throw new TypeError('fetch failed');
      }
      return jsonResponse(brandsPayload);
    });
    vi.stubGlobal('fetch', fetchMock);
    const user = userEvent.setup();

    render(<App />);
    expect(await screen.findByRole('alert')).toHaveTextContent('API sunucusuna ulaşılamıyor');
    expect(screen.getByRole('alert')).toHaveTextContent('npm run dev');

    await user.click(screen.getByRole('button', { name: 'Yeniden dene' }));
    expect(await screen.findByRole('button', { name: 'Audi ilanlarını gör' })).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
