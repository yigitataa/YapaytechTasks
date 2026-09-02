import type { Brand } from '@vehicle-cost/contracts';

export const fallbackBrands = [
  { name: 'Alfa Romeo', slug: 'alfa-romeo' },
  { name: 'Audi', slug: 'audi' },
  { name: 'BMW', slug: 'bmw' },
  { name: 'Fiat', slug: 'fiat' },
  { name: 'Renault', slug: 'renault' },
] as const satisfies readonly Brand[];
