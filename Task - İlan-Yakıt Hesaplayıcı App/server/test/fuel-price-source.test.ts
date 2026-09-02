import { describe, expect, it, vi } from 'vitest';
import {
  COLLECTAPI_GASOLINE_URL,
  CollectApiFuelPriceSource,
  type FetchAdapter,
} from '../src/services/fuel-price/index.js';

describe('CollectApiFuelPriceSource', () => {
  it('yalnız turkeyGasoline endpointine dokümandaki parametre ve yetkilendirmeyle gider', async () => {
    const rawResponse = { success: true, result: [{ marka: 'Ham Petrol', benzin: '45,90' }] };
    const fetcher: FetchAdapter = vi.fn(async () => ({
      ok: true,
      status: 200,
      json: async () => rawResponse,
    }));
    const source = new CollectApiFuelPriceSource({
      apiKey: 'server-only-secret',
      fetcher,
      timeoutMs: 1_000,
    });

    const result = await source.fetchFuelPrices('İstanbul', 'Şişli / Merkez');
    const [url, options] = vi.mocked(fetcher).mock.calls[0] ?? [];
    const parsedUrl = new URL(String(url));

    expect(`${parsedUrl.origin}${parsedUrl.pathname}`).toBe(COLLECTAPI_GASOLINE_URL);
    expect(parsedUrl.searchParams.get('city')).toBe('istanbul');
    expect(parsedUrl.searchParams.get('district')).toBe('sisli / merkez');
    expect(options?.method).toBe('GET');
    expect(options?.headers).toEqual({
      Authorization: 'apikey server-only-secret',
      'Content-Type': 'application/json',
    });
    expect(JSON.stringify(result)).not.toContain('server-only-secret');
    expect(result).toBe(rawResponse);
  });

  it('sunucu anahtarı yoksa ağ isteği yapmaz', async () => {
    const fetcher: FetchAdapter = vi.fn();
    const source = new CollectApiFuelPriceSource({ apiKey: '', fetcher });

    await expect(source.fetchFuelPrices('Ankara', 'Çankaya')).rejects.toThrow(
      'sunucuda yapılandırılmamış',
    );
    expect(fetcher).not.toHaveBeenCalled();
  });

  it('apikey öneki env değerinde zaten varsa ikinci kez eklemez', async () => {
    const fetcher: FetchAdapter = vi.fn(async () => ({
      ok: true,
      status: 200,
      json: async () => ({ success: true, result: [] }),
    }));
    const source = new CollectApiFuelPriceSource({
      apiKey: 'apikey server-only-secret',
      fetcher,
    });

    await source.fetchFuelPrices('Ankara', 'Çankaya');

    expect(vi.mocked(fetcher).mock.calls[0]?.[1]?.headers?.Authorization).toBe(
      'apikey server-only-secret',
    );
  });
});
