import { fileURLToPath } from 'node:url';
import {
  BRAND_SOURCE_URL,
  brandCatalogSnapshotSchema,
  brandListSchema,
  brandsResponseSchema,
  type Brand,
  type BrandCatalogSnapshot,
  type BrandsResponse,
} from '@vehicle-cost/contracts';
import { BrandCatalogCacheFile } from './cache-file.js';
import { FailoverBrandSource } from './failover-source.js';
import { fallbackBrands } from './fallback-brands.js';
import { HttpBrandSource } from './http-source.js';
import { PuppeteerBrandSource, type BrandSource } from './live-source.js';

const defaultDataFilePath = fileURLToPath(new URL('../../../data/brands.json', import.meta.url));
export const DEFAULT_BRAND_CACHE_TTL_MS = 6 * 60 * 60 * 1000;

type CachedSource = 'cache' | 'fallback';

interface MemoryCatalog {
  snapshot: BrandCatalogSnapshot;
  source: CachedSource;
  cachedAt: number;
}

export interface BrandCatalogReader {
  getCatalog(): Promise<BrandsResponse>;
  hasSlug(slug: string): Promise<boolean>;
}

export interface BrandCatalogOptions {
  source?: BrandSource;
  dataFilePath?: string;
  cacheTtlMs?: number;
  now?: () => Date;
}

function sortBrands(brands: Brand[]): Brand[] {
  return [...brands].sort((left, right) =>
    left.name.localeCompare(right.name, 'tr', { sensitivity: 'base' }),
  );
}

export class BrandCatalog implements BrandCatalogReader {
  readonly #source: BrandSource;
  readonly #cacheFile: BrandCatalogCacheFile;
  readonly #cacheTtlMs: number;
  readonly #now: () => Date;
  #memory?: MemoryCatalog;
  #refreshPromise?: Promise<BrandsResponse>;

  constructor(options: BrandCatalogOptions = {}) {
    this.#source =
      options.source ??
      new FailoverBrandSource([new PuppeteerBrandSource(), new HttpBrandSource()]);
    this.#cacheFile = new BrandCatalogCacheFile(options.dataFilePath ?? defaultDataFilePath);
    this.#cacheTtlMs = options.cacheTtlMs ?? DEFAULT_BRAND_CACHE_TTL_MS;
    this.#now = options.now ?? (() => new Date());
  }

  getCatalog(): Promise<BrandsResponse> {
    const now = this.#now().getTime();

    if (this.#memory && now - this.#memory.cachedAt < this.#cacheTtlMs) {
      return Promise.resolve(this.#toResponse(this.#memory.snapshot, this.#memory.source));
    }

    this.#refreshPromise ??= this.#refreshCatalog().finally(() => {
      this.#refreshPromise = undefined;
    });

    return this.#refreshPromise;
  }

  async hasSlug(slug: string): Promise<boolean> {
    const catalog = await this.getCatalog();
    return catalog.items.some((brand) => brand.slug === slug);
  }

  async #refreshCatalog(): Promise<BrandsResponse> {
    const refreshedAt = this.#now();

    try {
      const items = sortBrands(brandListSchema.parse(await this.#source.fetchBrands()));
      const snapshot = brandCatalogSnapshotSchema.parse({
        items,
        updatedAt: refreshedAt.toISOString(),
        sourceUrl: BRAND_SOURCE_URL,
      });

      await this.#cacheFile.write(snapshot);
      this.#remember(snapshot, 'cache', refreshedAt.getTime());
      return this.#toResponse(snapshot, 'live');
    } catch {
      return this.#loadSavedOrFallback(refreshedAt);
    }
  }

  async #loadSavedOrFallback(refreshedAt: Date): Promise<BrandsResponse> {
    try {
      const snapshot = await this.#cacheFile.read();
      this.#remember(snapshot, 'cache', refreshedAt.getTime());
      return this.#toResponse(snapshot, 'cache');
    } catch {
      const snapshot = brandCatalogSnapshotSchema.parse({
        items: fallbackBrands.map((brand) => ({ ...brand })),
        updatedAt: refreshedAt.toISOString(),
        sourceUrl: BRAND_SOURCE_URL,
      });

      this.#remember(snapshot, 'fallback', refreshedAt.getTime());
      return this.#toResponse(snapshot, 'fallback');
    }
  }

  #remember(snapshot: BrandCatalogSnapshot, source: CachedSource, cachedAt: number): void {
    this.#memory = { snapshot, source, cachedAt };
  }

  #toResponse(snapshot: BrandCatalogSnapshot, source: BrandsResponse['source']): BrandsResponse {
    return brandsResponseSchema.parse({ ...snapshot, source });
  }
}

export const brandCatalog = new BrandCatalog();

export { FailoverBrandSource } from './failover-source.js';
export { HttpBrandSource } from './http-source.js';
export { PuppeteerBrandSource } from './live-source.js';
