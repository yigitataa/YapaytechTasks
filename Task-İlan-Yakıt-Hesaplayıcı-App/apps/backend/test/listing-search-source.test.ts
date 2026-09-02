import { BRAND_SOURCE_URL } from '@vehicle-cost/contracts';
import { describe, expect, it, vi } from 'vitest';
import type { BrowserAdapter, BrowserLauncher } from '../src/services/brand-catalog/live-source.js';
import { PuppeteerListingSearchSource } from '../src/services/listing-search/index.js';

const listingHtml = `
  <table>
    <thead><tr><th>Model</th><th>Fiyat</th></tr></thead>
    <tbody>
      <tr>
        <td><a href="/ilan/raw-audi/1"><img src="/raw-audi.jpg"></a>Audi A3</td>
        <td>1.050.000 TL</td>
      </tr>
    </tbody>
  </table>
`;

function createBrowser(status = 200): {
  browser: BrowserAdapter;
  close: ReturnType<typeof vi.fn>;
  goto: ReturnType<typeof vi.fn>;
  waitForSelector: ReturnType<typeof vi.fn>;
} {
  const close = vi.fn(async () => undefined);
  const goto = vi.fn(async () => ({ status: () => status }));
  const waitForSelector = vi.fn(async () => undefined);

  return {
    close,
    goto,
    waitForSelector,
    browser: {
      close,
      newPage: vi.fn(async () => ({
        setDefaultNavigationTimeout: vi.fn(),
        setDefaultTimeout: vi.fn(),
        goto,
        waitForSelector,
        content: vi.fn(async () => listingHtml),
      })),
    },
  };
}

describe('PuppeteerListingSearchSource', () => {
  it('izinli slug için yalnız ilgili ham marka URL’sine gider', async () => {
    const { browser, close, goto, waitForSelector } = createBrowser();
    const launchBrowser: BrowserLauncher = vi.fn(async () => browser);
    const source = new PuppeteerListingSearchSource({ timeoutMs: 3_000, launchBrowser });

    const result = await source.search('audi');

    expect(goto).toHaveBeenCalledWith(`${BRAND_SOURCE_URL}/audi`, {
      waitUntil: 'domcontentloaded',
      timeout: 3_000,
    });
    expect(waitForSelector).toHaveBeenCalledOnce();
    expect(result.sourceUrl).toBe(`${BRAND_SOURCE_URL}/audi`);
    expect(result.items[0]?.cells[1]?.value).toBe('1.050.000 TL');
    expect(close).toHaveBeenCalledOnce();
  });

  it('biçimi geçersiz slug için tarayıcı başlatmaz', async () => {
    const launchBrowser: BrowserLauncher = vi.fn();
    const source = new PuppeteerListingSearchSource({ launchBrowser });

    await expect(source.search('../ilan')).rejects.toThrow();
    expect(launchBrowser).not.toHaveBeenCalled();
  });

  it('başarısız HTTP yanıtında tarayıcıyı kapatır', async () => {
    const { browser, close } = createBrowser(403);
    const launchBrowser: BrowserLauncher = vi.fn(async () => browser);
    const source = new PuppeteerListingSearchSource({ launchBrowser });

    await expect(source.search('audi')).rejects.toThrow('HTTP 403');
    expect(close).toHaveBeenCalledOnce();
  });
});
