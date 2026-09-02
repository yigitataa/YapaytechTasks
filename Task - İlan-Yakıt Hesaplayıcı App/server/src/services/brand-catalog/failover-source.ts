import type { Brand } from '@vehicle-cost/contracts';
import type { BrandSource } from './live-source.js';

export class FailoverBrandSource implements BrandSource {
  constructor(readonly sources: readonly BrandSource[]) {
    if (sources.length === 0) {
      throw new Error('En az bir canlı marka kaynağı gereklidir.');
    }
  }

  async fetchBrands(): Promise<Brand[]> {
    const failures: unknown[] = [];

    for (const source of this.sources) {
      try {
        return await source.fetchBrands();
      } catch (error) {
        failures.push(error);
      }
    }

    throw new AggregateError(failures, 'Canlı marka kaynaklarının hiçbiri kullanılamadı.');
  }
}
