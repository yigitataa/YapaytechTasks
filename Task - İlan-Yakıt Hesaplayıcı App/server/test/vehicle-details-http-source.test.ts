import { describe, expect, it, vi } from 'vitest';
import {
  ARABAM_ORIGIN,
  FailoverVehicleDetailsSource,
  HttpVehicleDetailsSource,
  type VehicleDetailsSource,
} from '../src/services/vehicle-details/index.js';

const detailHtml = `
  <title>Galeriden Audi A6 Sedan | arabam.com</title>
  <main class="vehicle-detail">
    <section class="product-properties">
      <div class="property-item"><div>Yakıt Tipi</div><div>Dizel</div></div>
      <div class="property-item"><div>Motor Hacmi</div><div>1801 - 2000 cm3</div></div>
    </section>
    <div id="tab-description" class="tab-description">Satıcı ilan açıklaması</div>
    <img src="/raw-car.jpg">
  </main>
  <script src="https://static.cloudflareinsights.com/beacon.min.js"></script>
`;

describe('HttpVehicleDetailsSource', () => {
  it('güvenli relative ilan yolunu yalnız sabit Arabam origin’inden okur', async () => {
    const fetcher = vi.fn<typeof fetch>(async () =>
      Promise.resolve(
        new Response(detailHtml, {
          status: 200,
          headers: { 'Content-Type': 'text/html; charset=utf-8' },
        }),
      ),
    );
    const source = new HttpVehicleDetailsSource({ fetcher, timeoutMs: 2_000 });
    const result = await source.fetchDetails('/ilan/ham-ilan/123?ref=liste');

    expect(result.sourceUrl).toBe(`${ARABAM_ORIGIN}/ilan/ham-ilan/123?ref=liste`);
    expect(result.sections[0]?.fields).toContainEqual({ label: 'Yakıt Tipi', value: 'Dizel' });
    expect(result.images).toEqual(['/raw-car.jpg']);
    expect(fetcher).toHaveBeenCalledWith(
      `${ARABAM_ORIGIN}/ilan/ham-ilan/123?ref=liste`,
      expect.objectContaining({ method: 'GET', redirect: 'error' }),
    );
  });

  it('geçersiz detailHref için HTTP çağrısı yapmaz', async () => {
    const fetcher = vi.fn<typeof fetch>();

    await expect(
      new HttpVehicleDetailsSource({ fetcher }).fetchDetails('https://example.com/ilan/1'),
    ).rejects.toThrow();
    expect(fetcher).not.toHaveBeenCalled();
  });

  it('normal sayfadaki Cloudflare Insights betiğini erişim engeli saymaz', async () => {
    const source = new HttpVehicleDetailsSource({
      fetcher: vi.fn<typeof fetch>(async () =>
        Promise.resolve(
          new Response(detailHtml, {
            status: 200,
            headers: { 'Content-Type': 'text/html' },
          }),
        ),
      ),
    });

    await expect(source.fetchDetails('/ilan/ham-ilan/123')).resolves.toMatchObject({
      images: ['/raw-car.jpg'],
    });
  });

  it('gerçek challenge işaretlerini erişim engeli olarak reddeder', async () => {
    const source = new HttpVehicleDetailsSource({
      fetcher: vi.fn<typeof fetch>(async () =>
        Promise.resolve(
          new Response(
            '<html><title>Just a moment...</title><form id="challenge-form"></form></html>',
            { status: 200, headers: { 'Content-Type': 'text/html' } },
          ),
        ),
      ),
    });

    await expect(source.fetchDetails('/ilan/ham-ilan/123')).rejects.toThrow('erişim doğrulaması');
  });
});

describe('FailoverVehicleDetailsSource', () => {
  it('Puppeteer benzeri kaynak 403 verdiğinde HTTP detay sonucunu döndürür', async () => {
    const first: VehicleDetailsSource = {
      fetchDetails: vi.fn(async () => Promise.reject(new Error('HTTP 403'))),
    };
    const second = new HttpVehicleDetailsSource({
      fetcher: vi.fn<typeof fetch>(async () =>
        Promise.resolve(
          new Response(detailHtml, {
            status: 200,
            headers: { 'Content-Type': 'text/html' },
          }),
        ),
      ),
    });

    const result = await new FailoverVehicleDetailsSource([first, second]).fetchDetails(
      '/ilan/ham-ilan/123',
    );

    expect(result.sections[0]?.fields).toHaveLength(2);
    expect(first.fetchDetails).toHaveBeenCalledOnce();
  });
});
