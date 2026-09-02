export const COLLECTAPI_GASOLINE_URL =
  'https://api.collectapi.com/gasPrice/turkeyGasoline' as const;
export const DEFAULT_COLLECTAPI_TIMEOUT_MS = 10_000;

interface FetchResponse {
  ok: boolean;
  status: number;
  json(): Promise<unknown>;
}

export type FetchAdapter = (
  input: string | URL,
  init?: { method?: 'GET'; headers?: Record<string, string>; signal?: AbortSignal },
) => Promise<FetchResponse>;

export interface FuelPriceSource {
  fetchFuelPrices(city: string, district: string): Promise<unknown>;
}

export interface CollectApiFuelPriceSourceOptions {
  apiKey?: string;
  fetcher?: FetchAdapter;
  timeoutMs?: number;
}

export class CollectApiConfigurationError extends Error {
  constructor() {
    super('CollectAPI anahtarı sunucuda yapılandırılmamış.');
    this.name = 'CollectApiConfigurationError';
  }
}

const TURKISH_ASCII_CHARACTERS: Readonly<Record<string, string>> = {
  ç: 'c',
  ğ: 'g',
  ı: 'i',
  ö: 'o',
  ş: 's',
  ü: 'u',
};

export function toCollectApiLocationParam(value: string): string {
  return value
    .trim()
    .toLocaleLowerCase('tr-TR')
    .replace(/[çğıöşü]/gu, (character) => TURKISH_ASCII_CHARACTERS[character] ?? character);
}

function collectApiAuthorization(apiKey: string | undefined): string {
  const value = apiKey?.trim() ?? '';

  if (!value) {
    throw new CollectApiConfigurationError();
  }

  return /^apikey\s+/iu.test(value) ? value : `apikey ${value}`;
}

export class CollectApiFuelPriceSource implements FuelPriceSource {
  readonly #apiKey: string | undefined;
  readonly #fetcher: FetchAdapter;
  readonly #timeoutMs: number;

  constructor(options: CollectApiFuelPriceSourceOptions = {}) {
    this.#apiKey = options.apiKey ?? process.env.COLLECTAPI_API_KEY;
    this.#fetcher = options.fetcher ?? (fetch as FetchAdapter);
    this.#timeoutMs = options.timeoutMs ?? DEFAULT_COLLECTAPI_TIMEOUT_MS;
  }

  async fetchFuelPrices(city: string, district: string): Promise<unknown> {
    const authorization = collectApiAuthorization(this.#apiKey);
    const cityParam = toCollectApiLocationParam(city);
    const districtParam = toCollectApiLocationParam(district);

    if (!cityParam || !districtParam) {
      throw new Error('CollectAPI için il ve ilçe boş olamaz.');
    }

    const url = new URL(COLLECTAPI_GASOLINE_URL);
    url.searchParams.set('district', districtParam);
    url.searchParams.set('city', cityParam);

    const response = await this.#fetcher(url, {
      method: 'GET',
      headers: {
        Authorization: authorization,
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(this.#timeoutMs),
    });

    if (!response.ok) {
      throw new Error(`CollectAPI HTTP ${response.status} döndürdü.`);
    }

    return response.json();
  }
}
