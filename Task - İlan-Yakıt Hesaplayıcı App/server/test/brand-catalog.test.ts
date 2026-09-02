import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { BRAND_SOURCE_URL, brandCatalogSnapshotSchema, type Brand } from '@vehicle-cost/contracts';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { BrandCatalog } from '../src/services/brand-catalog/index.js';
import type { BrandSource } from '../src/services/brand-catalog/live-source.js';

const temporaryDirectories: string[] = [];
const now = new Date('2026-09-01T00:00:00.000Z');

async function createDataFile(contents?: string): Promise<string> {
  const directory = await mkdtemp(join(tmpdir(), 'brand-catalog-'));
  temporaryDirectories.push(directory);
  const dataFilePath = join(directory, 'brands.json');

  if (contents !== undefined) {
    await writeFile(dataFilePath, contents, 'utf8');
  }

  return dataFilePath;
}

function createSource(
  result: Brand[] | Error,
): BrandSource & { fetchBrands: ReturnType<typeof vi.fn> } {
  return {
    fetchBrands: vi.fn(async () => {
      if (result instanceof Error) {
        throw result;
      }

      return result;
    }),
  };
}

function createCatalog(source: BrandSource, dataFilePath: string) {
  return new BrandCatalog({
    source,
    dataFilePath,
    cacheTtlMs: 60_000,
    now: () => now,
  });
}

afterEach(async () => {
  await Promise.all(
    temporaryDirectories.splice(0).map((directory) => rm(directory, { recursive: true })),
  );
});

describe('BrandCatalog', () => {
  it('başarılı canlı sonucu sıralayıp atomik JSON cache dosyasına yazar', async () => {
    const dataFilePath = await createDataFile(
      JSON.stringify({
        items: [{ name: 'Eski Marka', slug: 'eski-marka' }],
        updatedAt: '2026-08-01T00:00:00.000Z',
        sourceUrl: BRAND_SOURCE_URL,
      }),
    );
    const source = createSource([
      { name: 'Renault', slug: 'renault' },
      { name: 'Audi', slug: 'audi' },
    ]);

    const result = await createCatalog(source, dataFilePath).getCatalog();
    const saved = brandCatalogSnapshotSchema.parse(
      JSON.parse(await readFile(dataFilePath, 'utf8')),
    );

    expect(result.source).toBe('live');
    expect(result.items.map((brand) => brand.slug)).toEqual(['audi', 'renault']);
    expect(saved).toEqual({
      items: result.items,
      updatedAt: now.toISOString(),
      sourceUrl: BRAND_SOURCE_URL,
    });
  });

  it('canlı kaynak hatasında son geçerli JSON cache dosyasını kullanır', async () => {
    const snapshot = {
      items: [{ name: 'Tesla', slug: 'tesla' }],
      updatedAt: '2026-08-31T12:00:00.000Z',
      sourceUrl: BRAND_SOURCE_URL,
    };
    const dataFilePath = await createDataFile(JSON.stringify(snapshot));
    const result = await createCatalog(
      createSource(new Error('source unavailable')),
      dataFilePath,
    ).getCatalog();

    expect(result).toEqual({ ...snapshot, source: 'cache' });
  });

  it('canlı kaynak ve cache kullanılamıyorsa sabit fallback kataloğunu kullanır', async () => {
    const missingFilePath = await createDataFile();
    const result = await createCatalog(
      createSource(new Error('source unavailable')),
      missingFilePath,
    ).getCatalog();

    expect(result.source).toBe('fallback');
    expect(result.items).toHaveLength(5);
    expect(result.updatedAt).toBe(now.toISOString());
    expect(result.sourceUrl).toBe(BRAND_SOURCE_URL);
  });

  it('bozuk cache dosyasını reddedip fallback kullanır', async () => {
    const dataFilePath = await createDataFile('{ geçersiz json');
    const result = await createCatalog(
      createSource(new Error('source unavailable')),
      dataFilePath,
    ).getCatalog();

    expect(result.source).toBe('fallback');
  });

  it('geçerli bellek cache varken yeniden canlı kaynak çağırmaz', async () => {
    const dataFilePath = await createDataFile();
    const source = createSource([{ name: 'Audi', slug: 'audi' }]);
    const catalog = createCatalog(source, dataFilePath);

    expect((await catalog.getCatalog()).source).toBe('live');
    expect((await catalog.getCatalog()).source).toBe('cache');
    expect(source.fetchBrands).toHaveBeenCalledTimes(1);
  });

  it('eşzamanlı istekler için yalnız bir canlı kazıma başlatır', async () => {
    const dataFilePath = await createDataFile();
    let resolveSource: ((brands: Brand[]) => void) | undefined;
    const source: BrandSource & { fetchBrands: ReturnType<typeof vi.fn> } = {
      fetchBrands: vi.fn(
        () =>
          new Promise<Brand[]>((resolve) => {
            resolveSource = resolve;
          }),
      ),
    };
    const catalog = createCatalog(source, dataFilePath);
    const firstRequest = catalog.getCatalog();
    const secondRequest = catalog.getCatalog();

    resolveSource?.([{ name: 'Audi', slug: 'audi' }]);
    const [firstResult, secondResult] = await Promise.all([firstRequest, secondRequest]);

    expect(firstResult.source).toBe('live');
    expect(secondResult.source).toBe('live');
    expect(source.fetchBrands).toHaveBeenCalledTimes(1);
  });
});
