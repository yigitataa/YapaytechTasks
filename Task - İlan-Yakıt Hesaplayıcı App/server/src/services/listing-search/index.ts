import {
  BRAND_SOURCE_URL,
  apiContracts,
  rawSearchPageSchema,
  type RawSearchPage,
} from '@vehicle-cost/contracts';
import {
  launchPuppeteerBrowser,
  type BrowserAdapter,
  type BrowserLauncher,
} from '../brand-catalog/live-source.js';
import { fetchHtml, type HtmlFetcher } from '../http/fetch-html.js';
import { extractRawSearchPage } from './parser.js';

export const DEFAULT_LISTING_SEARCH_TIMEOUT_MS = 20_000;

export interface ListingSearchResult extends RawSearchPage {
  sourceUrl: string;
}

export interface ListingSearchSource {
  search(brandSlug: string): Promise<ListingSearchResult>;
}

export interface PuppeteerListingSearchSourceOptions {
  timeoutMs?: number;
  launchBrowser?: BrowserLauncher;
}

export interface HttpListingSearchSourceOptions {
  timeoutMs?: number;
  fetcher?: HtmlFetcher;
}

function buildBrandSearchUrl(brandSlug: string): string {
  const query = apiContracts.search.request.parse({ brandSlug });
  return `${BRAND_SOURCE_URL}/${query.brandSlug}`;
}

export class PuppeteerListingSearchSource implements ListingSearchSource {
  readonly #timeoutMs: number;
  readonly #launchBrowser: BrowserLauncher;

  constructor(options: PuppeteerListingSearchSourceOptions = {}) {
    this.#timeoutMs = options.timeoutMs ?? DEFAULT_LISTING_SEARCH_TIMEOUT_MS;
    this.#launchBrowser = options.launchBrowser ?? launchPuppeteerBrowser;
  }

  async search(brandSlug: string): Promise<ListingSearchResult> {
    const sourceUrl = buildBrandSearchUrl(brandSlug);
    let browser: BrowserAdapter | undefined;

    try {
      browser = await this.#launchBrowser(this.#timeoutMs);
      const page = await browser.newPage();
      page.setDefaultNavigationTimeout(this.#timeoutMs);
      page.setDefaultTimeout(this.#timeoutMs);
      const response = await page.goto(sourceUrl, {
        waitUntil: 'domcontentloaded',
        timeout: this.#timeoutMs,
      });

      if (!response || response.status() >= 400) {
        throw new Error(`İlan arama kaynağı HTTP ${response?.status() ?? 'yanıtsız'} döndürdü.`);
      }

      await page.waitForSelector(
        'table tbody tr, [data-listing-card], .listing-card, article a[href*="/ilan/"]',
        { timeout: this.#timeoutMs },
      );

      return {
        ...rawSearchPageSchema.parse(extractRawSearchPage(await page.content())),
        sourceUrl,
      };
    } finally {
      if (browser) {
        await browser.close().catch(() => undefined);
      }
    }
  }
}

export class HttpListingSearchSource implements ListingSearchSource {
  readonly #timeoutMs: number;
  readonly #fetcher: HtmlFetcher;

  constructor(options: HttpListingSearchSourceOptions = {}) {
    this.#timeoutMs = options.timeoutMs ?? DEFAULT_LISTING_SEARCH_TIMEOUT_MS;
    this.#fetcher = options.fetcher ?? fetch;
  }

  async search(brandSlug: string): Promise<ListingSearchResult> {
    const sourceUrl = buildBrandSearchUrl(brandSlug);
    const html = await fetchHtml(sourceUrl, {
      fetcher: this.#fetcher,
      sourceName: 'İlan arama HTTP kaynağı',
      timeoutMs: this.#timeoutMs,
      userAgent: 'YataOil/0.1 (listing-search)',
    });

    return {
      ...rawSearchPageSchema.parse(extractRawSearchPage(html)),
      sourceUrl,
    };
  }
}

export class FailoverListingSearchSource implements ListingSearchSource {
  constructor(readonly sources: readonly ListingSearchSource[]) {
    if (sources.length === 0) {
      throw new Error('En az bir canlı ilan arama kaynağı gereklidir.');
    }
  }

  async search(brandSlug: string): Promise<ListingSearchResult> {
    const failures: unknown[] = [];

    for (const source of this.sources) {
      try {
        return await source.search(brandSlug);
      } catch (error) {
        failures.push(error);
      }
    }

    throw new AggregateError(failures, 'Canlı ilan arama kaynaklarının hiçbiri kullanılamadı.');
  }
}

export function createDefaultListingSearchSource(): ListingSearchSource {
  return new FailoverListingSearchSource([
    new PuppeteerListingSearchSource(),
    new HttpListingSearchSource(),
  ]);
}
