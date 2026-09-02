import { BRAND_SOURCE_URL, type Brand } from '@vehicle-cost/contracts';
import puppeteer from 'puppeteer';
import { extractBrandsFromHtml } from './parser.js';

export const DEFAULT_BRAND_SOURCE_TIMEOUT_MS = 15_000;

export interface BrandSource {
  fetchBrands(): Promise<Brand[]>;
}

export interface BrowserPageAdapter {
  setDefaultNavigationTimeout(timeoutMs: number): void;
  setDefaultTimeout(timeoutMs: number): void;
  goto(
    url: string,
    options: { waitUntil: 'domcontentloaded'; timeout: number },
  ): Promise<{ status(): number } | null>;
  waitForSelector(selector: string, options: { timeout: number }): Promise<unknown>;
  content(): Promise<string>;
}

export interface BrowserAdapter {
  newPage(): Promise<BrowserPageAdapter>;
  close(): Promise<void>;
}

export type BrowserLauncher = (timeoutMs: number) => Promise<BrowserAdapter>;

export async function launchPuppeteerBrowser(timeoutMs: number): Promise<BrowserAdapter> {
  const browser = await puppeteer.launch({
    headless: true,
    timeout: timeoutMs,
  });

  return {
    async newPage() {
      const page = await browser.newPage();

      return {
        setDefaultNavigationTimeout: (value) => page.setDefaultNavigationTimeout(value),
        setDefaultTimeout: (value) => page.setDefaultTimeout(value),
        goto: (url, options) => page.goto(url, options),
        waitForSelector: (selector, options) => page.waitForSelector(selector, options),
        content: () => page.content(),
      };
    },
    close: () => browser.close(),
  };
}

export interface PuppeteerBrandSourceOptions {
  timeoutMs?: number;
  launchBrowser?: BrowserLauncher;
}

export class PuppeteerBrandSource implements BrandSource {
  readonly #timeoutMs: number;
  readonly #launchBrowser: BrowserLauncher;

  constructor(options: PuppeteerBrandSourceOptions = {}) {
    this.#timeoutMs = options.timeoutMs ?? DEFAULT_BRAND_SOURCE_TIMEOUT_MS;
    this.#launchBrowser = options.launchBrowser ?? launchPuppeteerBrowser;
  }

  async fetchBrands(): Promise<Brand[]> {
    let browser: BrowserAdapter | undefined;

    try {
      browser = await this.#launchBrowser(this.#timeoutMs);
      const page = await browser.newPage();
      page.setDefaultNavigationTimeout(this.#timeoutMs);
      page.setDefaultTimeout(this.#timeoutMs);
      const response = await page.goto(BRAND_SOURCE_URL, {
        waitUntil: 'domcontentloaded',
        timeout: this.#timeoutMs,
      });

      if (!response || response.status() >= 400) {
        throw new Error(`Marka kaynağı HTTP ${response?.status() ?? 'yanıtsız'} döndürdü.`);
      }

      await page.waitForSelector('a[href^="/ikinci-el/otomobil/"]', {
        timeout: this.#timeoutMs,
      });

      return extractBrandsFromHtml(await page.content());
    } finally {
      if (browser) {
        await browser.close().catch(() => undefined);
      }
    }
  }
}
