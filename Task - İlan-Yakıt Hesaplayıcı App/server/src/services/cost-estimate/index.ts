import type { CostEstimateRequest, CostEstimateResponse } from '@vehicle-cost/contracts';
import { Decimal } from 'decimal.js';

type InputKind = 'monthlyKm' | 'averageConsumption' | 'fuelTankLiters' | 'pricePerLiter';

const inputPatterns: Record<InputKind, RegExp> = {
  monthlyKm: /^\s*([0-9][0-9.,]*)\s*(?:km)?\s*$/iu,
  averageConsumption: /^\s*([0-9][0-9.,]*)\s*(?:(?:l|lt|litre)(?:\s*\/\s*100\s*km)?)?\s*$/iu,
  fuelTankLiters: /^\s*([0-9][0-9.,]*)\s*(?:l|lt|litre)?\s*$/iu,
  pricePerLiter: /^\s*([0-9][0-9.,]*)\s*(?:₺|tl)?\s*$/iu,
};

export class CalculationInputError extends Error {
  constructor(readonly field: InputKind) {
    super(`${field} değeri hesaplama için geçerli bir pozitif sayı olmalıdır.`);
    this.name = 'CalculationInputError';
  }
}

function normalizeNumericToken(token: string, kind: InputKind): string | undefined {
  const commaCount = (token.match(/,/g) ?? []).length;
  const dotCount = (token.match(/\./g) ?? []).length;

  if (commaCount > 1) {
    return undefined;
  }

  if (commaCount === 1) {
    return token.replaceAll('.', '').replace(',', '.');
  }

  if (dotCount > 1) {
    const groups = token.split('.');
    if (groups.slice(1).every((group) => group.length === 3)) {
      return groups.join('');
    }
    return undefined;
  }

  if (dotCount === 1 && kind === 'monthlyKm' && token.split('.')[1]?.length === 3) {
    return token.replace('.', '');
  }

  return token;
}

function parseInput(value: CostEstimateRequest[InputKind], kind: InputKind): Decimal {
  const text = typeof value === 'number' ? String(value) : value;
  const match = typeof text === 'string' ? inputPatterns[kind].exec(text) : null;
  const normalized = match?.[1] ? normalizeNumericToken(match[1], kind) : undefined;

  if (!normalized) {
    throw new CalculationInputError(kind);
  }

  try {
    const decimal = new Decimal(normalized);
    if (!decimal.isFinite() || !decimal.isPositive()) {
      throw new CalculationInputError(kind);
    }
    return decimal;
  } catch (error) {
    if (error instanceof CalculationInputError) {
      throw error;
    }
    throw new CalculationInputError(kind);
  }
}

export function calculateCostEstimate(input: CostEstimateRequest): CostEstimateResponse {
  const monthlyKm = parseInput(input.monthlyKm, 'monthlyKm');
  const averageConsumption = parseInput(input.averageConsumption, 'averageConsumption');
  const fuelTankLiters = parseInput(input.fuelTankLiters, 'fuelTankLiters');
  const pricePerLiter = parseInput(input.pricePerLiter, 'pricePerLiter');
  const monthlyLiters = monthlyKm.dividedBy(100).times(averageConsumption);

  return {
    monthlyCostTry: monthlyLiters
      .times(pricePerLiter)
      .toDecimalPlaces(2, Decimal.ROUND_HALF_UP)
      .toNumber(),
    tankCostTry: fuelTankLiters
      .times(pricePerLiter)
      .toDecimalPlaces(2, Decimal.ROUND_HALF_UP)
      .toNumber(),
    monthlyLiters: monthlyLiters.toDecimalPlaces(3, Decimal.ROUND_HALF_UP).toNumber(),
  };
}
