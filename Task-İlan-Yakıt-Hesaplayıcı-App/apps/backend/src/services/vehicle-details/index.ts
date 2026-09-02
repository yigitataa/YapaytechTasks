import {
  detailHrefSchema,
  rawDetailsPageSchema,
  type RawDetailsPage,
} from '@vehicle-cost/contracts';
import {
  launchPuppeteerBrowser,
  type BrowserAdapter,
  type BrowserLauncher,
} from '../brand-catalog/live-source.js';
import { fetchHtml, type HtmlFetcher } from '../http/fetch-html.js';
import { extractRawVehicleDetails } from './parser.js';

export const ARABAM_ORIGIN = 'https://www.arabam.com' as const;
export const DEFAULT_VEHICLE_DETAILS_TIMEOUT_MS = 20_000;

export interface VehicleDetailsResult extends RawDetailsPage {
  sourceUrl: string;
}

export interface VehicleDetailsSource {
  fetchDetails(detailHref: string): Promise<VehicleDetailsResult>;
}

export interface PuppeteerVehicleDetailsSourceOptions {
  timeoutMs?: number;
  launchBrowser?: BrowserLauncher;
}

export interface HttpVehicleDetailsSourceOptions {
  timeoutMs?: number;
  fetcher?: HtmlFetcher;
}

export function buildVehicleDetailUrl(detailHref: string): string {
  return `${ARABAM_ORIGIN}${detailHrefSchema.parse(detailHref)}`;
}

function isAccessChallenge(html: string): boolean {
  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/iu)?.[1] ?? '';

  return (
    /just a moment|attention required|access denied|erişim engellendi/iu.test(title) ||
    /cf-chl-|\/cdn-cgi\/challenge-platform\/|id=["']challenge-form["']|class=["'][^"']*cf-turnstile/iu.test(
      html,
    )
  );
}

export class PuppeteerVehicleDetailsSource implements VehicleDetailsSource {
  readonly #timeoutMs: number;
  readonly #launchBrowser: BrowserLauncher;

  constructor(options: PuppeteerVehicleDetailsSourceOptions = {}) {
    this.#timeoutMs = options.timeoutMs ?? DEFAULT_VEHICLE_DETAILS_TIMEOUT_MS;
    this.#launchBrowser = options.launchBrowser ?? launchPuppeteerBrowser;
  }

  async fetchDetails(detailHref: string): Promise<VehicleDetailsResult> {
    const sourceUrl = buildVehicleDetailUrl(detailHref);
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
        throw new Error(`Araç detay kaynağı HTTP ${response?.status() ?? 'yanıtsız'} döndürdü.`);
      }

      await page.waitForSelector('main, .vehicle-detail, .product-detail', {
        timeout: this.#timeoutMs,
      });
      const html = await page.content();

      if (isAccessChallenge(html)) {
        throw new Error('Araç detay kaynağı erişim doğrulaması döndürdü.');
      }

      return {
        ...rawDetailsPageSchema.parse(extractRawVehicleDetails(html)),
        sourceUrl,
      };
    } finally {
      if (browser) {
        await browser.close().catch(() => undefined);
      }
    }
  }
}

export class HttpVehicleDetailsSource implements VehicleDetailsSource {
  readonly #timeoutMs: number;
  readonly #fetcher: HtmlFetcher;

  constructor(options: HttpVehicleDetailsSourceOptions = {}) {
    this.#timeoutMs = options.timeoutMs ?? DEFAULT_VEHICLE_DETAILS_TIMEOUT_MS;
    this.#fetcher = options.fetcher ?? fetch;
  }

  async fetchDetails(detailHref: string): Promise<VehicleDetailsResult> {
    const sourceUrl = buildVehicleDetailUrl(detailHref);
    const html = await fetchHtml(sourceUrl, {
      fetcher: this.#fetcher,
      sourceName: 'Araç detay HTTP kaynağı',
      timeoutMs: this.#timeoutMs,
      userAgent: 'YataOil/0.1 (vehicle-details)',
    });

    if (isAccessChallenge(html)) {
      throw new Error('Araç detay HTTP kaynağı erişim doğrulaması döndürdü.');
    }

    return {
      ...rawDetailsPageSchema.parse(extractRawVehicleDetails(html)),
      sourceUrl,
    };
  }
}

export class FailoverVehicleDetailsSource implements VehicleDetailsSource {
  constructor(readonly sources: readonly VehicleDetailsSource[]) {
    if (sources.length === 0) {
      throw new Error('En az bir canlı araç detay kaynağı gereklidir.');
    }
  }

  async fetchDetails(detailHref: string): Promise<VehicleDetailsResult> {
    const failures: unknown[] = [];

    for (const source of this.sources) {
      try {
        return await source.fetchDetails(detailHref);
      } catch (error) {
        failures.push(error);
      }
    }

    throw new AggregateError(failures, 'Canlı araç detay kaynaklarının hiçbiri kullanılamadı.');
  }
}

export function createDefaultVehicleDetailsSource(): VehicleDetailsSource {
  return new FailoverVehicleDetailsSource([
    new PuppeteerVehicleDetailsSource(),
    new HttpVehicleDetailsSource(),
  ]);
}
