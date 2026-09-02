import { z } from 'zod';

const isoDateTimeSchema = z.string().datetime({ offset: true });

export const BRAND_SOURCE_URL = 'https://www.arabam.com/ikinci-el/otomobil' as const;

export const apiErrorCodeSchema = z.enum([
  'VALIDATION_ERROR',
  'INVALID_BRAND_SLUG',
  'INVALID_JSON',
  'NOT_FOUND',
  'NOT_IMPLEMENTED',
  'INTERNAL_SERVER_ERROR',
  'LISTING_NOT_FOUND',
  'INVALID_DETAIL_HREF',
  'CALCULATION_INPUT_INVALID',
  'FUEL_PRICE_UNAVAILABLE',
  'FUEL_TYPE_UNSUPPORTED',
  'RATE_LIMITED',
  'UPSTREAM_ERROR',
]);

export const apiErrorResponseSchema = z.object({
  error: z.object({
    code: apiErrorCodeSchema,
    message: z.string().min(1),
    retryable: z.boolean(),
  }),
});

export const healthResponseSchema = z.object({
  status: z.literal('ok'),
  timestamp: isoDateTimeSchema,
});

export const brandSchema = z
  .object({
    name: z.string().trim().min(1),
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  })
  .strict();

export const brandListSchema = z
  .array(brandSchema)
  .min(1)
  .superRefine((brands, context) => {
    const seenSlugs = new Set<string>();

    brands.forEach((brand, index) => {
      if (seenSlugs.has(brand.slug)) {
        context.addIssue({
          code: 'custom',
          message: 'Marka slug değerleri yinelenemez.',
          path: [index, 'slug'],
        });
      }

      seenSlugs.add(brand.slug);
    });
  });

export const brandCatalogSnapshotSchema = z
  .object({
    items: brandListSchema,
    updatedAt: isoDateTimeSchema,
    sourceUrl: z.literal(BRAND_SOURCE_URL),
  })
  .strict();

export const brandsResponseSchema = brandCatalogSnapshotSchema.extend({
  source: z.enum(['live', 'cache', 'fallback']),
});

export const rawSearchCellSchema = z
  .object({
    label: z.string(),
    value: z.string(),
  })
  .strict();

export const searchListingSchema = z
  .object({
    cells: z.array(rawSearchCellSchema),
    imageSrc: z.string().nullable(),
    detailHref: z.string().nullable(),
    rawText: z.string(),
  })
  .strict();

export const rawSearchPageSchema = z
  .object({
    headers: z.array(z.string()),
    items: z.array(searchListingSchema),
  })
  .strict();

export const searchResponseSchema = rawSearchPageSchema.extend({
  brand: brandSchema,
  sourceUrl: z
    .string()
    .regex(/^https:\/\/www\.arabam\.com\/ikinci-el\/otomobil\/[a-z0-9]+(?:-[a-z0-9]+)*$/),
  items: z.array(searchListingSchema),
  fetchedAt: isoDateTimeSchema,
});

export const detailHrefSchema = z.string().superRefine((value, context) => {
  const unsafePathPattern = /(?:\/\/|\.\.|%2e|%2f|%5c|\\|https?:|javascript:|data:|\s)/i;
  const pathSuffix = value.slice('/ilan/'.length);
  const hasControlCharacter = [...value].some((character) => {
    const codePoint = character.codePointAt(0) ?? 0;
    return codePoint < 32 || codePoint === 127;
  });

  if (
    !value.startsWith('/ilan/') ||
    !pathSuffix ||
    pathSuffix.startsWith('?') ||
    pathSuffix.startsWith('#') ||
    hasControlCharacter ||
    unsafePathPattern.test(value)
  ) {
    context.addIssue({
      code: 'custom',
      message: 'Detay bağlantısı güvenli bir /ilan/ relative yolu olmalıdır.',
    });
  }
});

const rawLocationValueSchema = z.string().max(200).nullable().optional();

export const detailsRequestSchema = z
  .object({
    detailHref: detailHrefSchema,
    city: rawLocationValueSchema,
    district: rawLocationValueSchema,
  })
  .strict();

export const rawDetailFieldSchema = z
  .object({
    label: z.string(),
    value: z.string(),
  })
  .strict();

export const rawDetailSectionSchema = z
  .object({
    title: z.string(),
    fields: z.array(rawDetailFieldSchema),
    rawText: z.string(),
  })
  .strict();

export const rawDetailsPageSchema = z
  .object({
    sections: z.array(rawDetailSectionSchema),
    images: z.array(z.string()),
    rawText: z.string(),
  })
  .strict();

export const detailsResponseSchema = rawDetailsPageSchema.extend({
  sourceUrl: z.string().url().startsWith('https://www.arabam.com/ilan/'),
  fuelLocation: z
    .object({
      city: z.string().nullable(),
      district: z.string().nullable(),
    })
    .strict(),
  fuelPriceResponse: z.unknown(),
  fetchedAt: isoDateTimeSchema,
});

const calculationScalarSchema = z.union([z.string(), z.number()]).nullable().optional();

export const costEstimateRequestSchema = z
  .object({
    monthlyKm: calculationScalarSchema,
    averageConsumption: calculationScalarSchema,
    fuelTankLiters: calculationScalarSchema,
    pricePerLiter: calculationScalarSchema,
  })
  .strict();

export const costEstimateResponseSchema = z.object({
  monthlyCostTry: z.number().nonnegative(),
  tankCostTry: z.number().nonnegative(),
  monthlyLiters: z.number().nonnegative(),
});

const emptyQuerySchema = z.object({}).strict();
const searchQuerySchema = z
  .object({
    brandSlug: z
      .string()
      .trim()
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  })
  .strict();
export const apiContracts = {
  health: {
    method: 'GET',
    path: '/api/health',
    request: emptyQuerySchema,
    response: healthResponseSchema,
  },
  brands: {
    method: 'GET',
    path: '/api/brands',
    request: emptyQuerySchema,
    response: brandsResponseSchema,
  },
  search: {
    method: 'GET',
    path: '/api/search',
    request: searchQuerySchema,
    response: searchResponseSchema,
  },
  details: {
    method: 'POST',
    path: '/api/details',
    request: detailsRequestSchema,
    response: detailsResponseSchema,
  },
  costEstimate: {
    method: 'POST',
    path: '/api/cost-estimate',
    request: costEstimateRequestSchema,
    response: costEstimateResponseSchema,
  },
} as const;

export type ApiErrorCode = z.infer<typeof apiErrorCodeSchema>;
export type ApiErrorResponse = z.infer<typeof apiErrorResponseSchema>;
export type HealthResponse = z.infer<typeof healthResponseSchema>;
export type Brand = z.infer<typeof brandSchema>;
export type BrandCatalogSnapshot = z.infer<typeof brandCatalogSnapshotSchema>;
export type BrandsResponse = z.infer<typeof brandsResponseSchema>;
export type SearchQuery = z.infer<typeof searchQuerySchema>;
export type RawSearchCell = z.infer<typeof rawSearchCellSchema>;
export type SearchListing = z.infer<typeof searchListingSchema>;
export type RawSearchPage = z.infer<typeof rawSearchPageSchema>;
export type SearchResponse = z.infer<typeof searchResponseSchema>;
export type DetailHref = z.infer<typeof detailHrefSchema>;
export type DetailsRequest = z.infer<typeof detailsRequestSchema>;
export type RawDetailField = z.infer<typeof rawDetailFieldSchema>;
export type RawDetailSection = z.infer<typeof rawDetailSectionSchema>;
export type RawDetailsPage = z.infer<typeof rawDetailsPageSchema>;
export type DetailsResponse = z.infer<typeof detailsResponseSchema>;
export type CostEstimateRequest = z.infer<typeof costEstimateRequestSchema>;
export type CostEstimateResponse = z.infer<typeof costEstimateResponseSchema>;
