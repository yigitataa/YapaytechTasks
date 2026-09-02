import type { Brand } from '@vehicle-cost/contracts';
import { describe, expect, it, vi } from 'vitest';
import { FailoverBrandSource } from '../src/services/brand-catalog/failover-source.js';
import type { BrandSource } from '../src/services/brand-catalog/live-source.js';

function source(result: Brand[] | Error): BrandSource {
  return {
    fetchBrands: vi.fn(async () => {
      if (result instanceof Error) {
        throw result;
      }
      return result;
    }),
  };
}

describe('FailoverBrandSource', () => {
  it('Puppeteer benzeri ilk kaynak başarısızsa sonraki canlı kaynağı kullanır', async () => {
    const first = source(new Error('HTTP 403'));
    const second = source([{ name: 'Audi', slug: 'audi' }]);

    await expect(new FailoverBrandSource([first, second]).fetchBrands()).resolves.toEqual([
      { name: 'Audi', slug: 'audi' },
    ]);
    expect(first.fetchBrands).toHaveBeenCalledOnce();
    expect(second.fetchBrands).toHaveBeenCalledOnce();
  });

  it('tüm canlı kaynaklar başarısızsa hatayı katalog katmanına iletir', async () => {
    const liveSource = new FailoverBrandSource([
      source(new Error('browser failed')),
      source(new Error('http failed')),
    ]);

    await expect(liveSource.fetchBrands()).rejects.toThrow('hiçbiri kullanılamadı');
  });
});
