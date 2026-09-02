import { BRAND_SOURCE_URL, type Brand } from '@vehicle-cost/contracts';
import { fetchHtml, type HtmlFetcher } from '../http/fetch-html.js';
import { extractBrandsFromHtml } from './parser.js';
import type { BrandSource } from './live-source.js';

export const DEFAULT_BRAND_HTTP_TIMEOUT_MS = 15_000;

export type BrandHttpFetcher = HtmlFetcher;

export interface HttpBrandSourceOptions {
  timeoutMs?: number;
  fetcher?: BrandHttpFetcher;
}

export class HttpBrandSource implements BrandSource {
  readonly #timeoutMs: number;
  readonly #fetcher: BrandHttpFetcher;

  constructor(options: HttpBrandSourceOptions = {}) {
    this.#timeoutMs = options.timeoutMs ?? DEFAULT_BRAND_HTTP_TIMEOUT_MS;
    this.#fetcher = options.fetcher ?? fetch;
  }

  async fetchBrands(): Promise<Brand[]> {
    const html = await fetchHtml(BRAND_SOURCE_URL, {
      fetcher: this.#fetcher,
      sourceName: 'Marka HTTP kaynağı',
      timeoutMs: this.#timeoutMs,
      userAgent: 'YataOil/0.1 (brand-catalog)',
    });

    return extractBrandsFromHtml(html);
  }
}
