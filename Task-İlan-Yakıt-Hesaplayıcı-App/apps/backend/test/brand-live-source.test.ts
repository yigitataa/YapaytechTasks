import { BRAND_SOURCE_URL } from '@vehicle-cost/contracts';
import { describe, expect, it, vi } from 'vitest';
import {
  PuppeteerBrandSource,
  type BrowserAdapter,
  type BrowserLauncher,
} from '../src/services/brand-catalog/live-source.js';

function createBrowser(html: string): {
  browser: BrowserAdapter;
  close: ReturnType<typeof vi.fn>;
  goto: ReturnType<typeof vi.fn>;
} {
  const close = vi.fn(async () => undefined);
  const goto = vi.fn(async () => ({ status: () => 200 }));

  return {
    close,
    goto,
    browser: {
      close,
      newPage: vi.fn(async () => ({
        setDefaultNavigationTimeout: vi.fn(),
        setDefaultTimeout: vi.fn(),
        goto,
        waitForSelector: vi.fn(async () => undefined),
        content: vi.fn(async () => html),
      })),
    },
  };
}

describe('PuppeteerBrandSource', () => {
  it('yalnız sabit kaynak URL’ye gider ve tarayıcıyı kapatır', async () => {
    const { browser, close, goto } = createBrowser(
      '<a href="/ikinci-el/otomobil/audi">Audi 4.943</a>',
    );
    const launchBrowser: BrowserLauncher = vi.fn(async () => browser);
    const source = new PuppeteerBrandSource({ timeoutMs: 2_000, launchBrowser });

    await expect(source.fetchBrands()).resolves.toEqual([{ name: 'Audi', slug: 'audi' }]);
    expect(goto).toHaveBeenCalledWith(BRAND_SOURCE_URL, {
      waitUntil: 'domcontentloaded',
      timeout: 2_000,
    });
    expect(close).toHaveBeenCalledOnce();
  });

  it('sayfa işlemi hata verdiğinde de tarayıcıyı kapatır', async () => {
    const { browser, close, goto } = createBrowser('');
    goto.mockRejectedValueOnce(new Error('navigation failed'));
    const launchBrowser: BrowserLauncher = vi.fn(async () => browser);
    const source = new PuppeteerBrandSource({ launchBrowser });

    await expect(source.fetchBrands()).rejects.toThrow('navigation failed');
    expect(close).toHaveBeenCalledOnce();
  });

  it('başarısız HTTP yanıtını reddeder ve tarayıcıyı kapatır', async () => {
    const { browser, close, goto } = createBrowser('');
    goto.mockResolvedValueOnce({ status: () => 403 });
    const launchBrowser: BrowserLauncher = vi.fn(async () => browser);
    const source = new PuppeteerBrandSource({ launchBrowser });

    await expect(source.fetchBrands()).rejects.toThrow('HTTP 403');
    expect(close).toHaveBeenCalledOnce();
  });
});
