import {
  apiErrorResponseSchema,
  brandsResponseSchema,
  costEstimateResponseSchema,
  detailsResponseSchema,
  searchResponseSchema,
  type ApiErrorCode,
  type BrandsResponse,
  type CostEstimateRequest,
  type CostEstimateResponse,
  type DetailsRequest,
  type DetailsResponse,
  type SearchResponse,
} from '@vehicle-cost/contracts';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? (import.meta.env.DEV ? '/api' : 'http://localhost:3001/api');

export class ApiClientError extends Error {
  constructor(
    readonly status: number,
    readonly code: ApiErrorCode | 'UNKNOWN_ERROR',
    message: string,
    readonly retryable = false,
  ) {
    super(message);
    this.name = 'ApiClientError';
  }
}

async function requestJson(path: string, init?: RequestInit): Promise<unknown> {
  const response = await fetch(`${API_BASE_URL}${path}`, init);
  const body: unknown = await response.json().catch(() => undefined);

  if (!response.ok) {
    const parsedError = apiErrorResponseSchema.safeParse(body);
    if (parsedError.success) {
      throw new ApiClientError(
        response.status,
        parsedError.data.error.code,
        parsedError.data.error.message,
        parsedError.data.error.retryable,
      );
    }

    throw new ApiClientError(response.status, 'UNKNOWN_ERROR', 'API yanıtı okunamadı.');
  }

  return body;
}

export async function getBrands(): Promise<BrandsResponse> {
  return brandsResponseSchema.parse(await requestJson('/brands'));
}

export async function searchListings(brandSlug: string): Promise<SearchResponse> {
  return searchResponseSchema.parse(
    await requestJson(`/search?brandSlug=${encodeURIComponent(brandSlug)}`),
  );
}

export async function getVehicleDetails(input: DetailsRequest): Promise<DetailsResponse> {
  return detailsResponseSchema.parse(
    await requestJson('/details', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    }),
  );
}

export async function estimateCost(input: CostEstimateRequest): Promise<CostEstimateResponse> {
  return costEstimateResponseSchema.parse(
    await requestJson('/cost-estimate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    }),
  );
}
