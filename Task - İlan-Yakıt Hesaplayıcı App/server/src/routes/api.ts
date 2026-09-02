import {
  apiContracts,
  type BrandsResponse,
  type CostEstimateRequest,
  type DetailsRequest,
  type DetailsResponse,
  type HealthResponse,
  type SearchQuery,
  type SearchResponse,
} from '@vehicle-cost/contracts';
import { Router } from 'express';
import { AppError } from '../errors/app-error.js';
import { validateRequest } from '../middleware/validate-request.js';
import type { BrandCatalogReader } from '../services/brand-catalog/index.js';
import { calculateCostEstimate, CalculationInputError } from '../services/cost-estimate/index.js';
import {
  CollectApiConfigurationError,
  type FuelPriceSource,
} from '../services/fuel-price/index.js';
import type { ListingSearchSource } from '../services/listing-search/index.js';
import type { VehicleDetailsSource } from '../services/vehicle-details/index.js';

function fuelPriceError(message: string, retryable: boolean) {
  return {
    error: {
      code: 'FUEL_PRICE_UNAVAILABLE' as const,
      message,
      retryable,
    },
  };
}

export function createApiRouter(
  brandCatalog: BrandCatalogReader,
  listingSearchSource: ListingSearchSource,
  vehicleDetailsSource: VehicleDetailsSource,
  fuelPriceSource: FuelPriceSource,
): Router {
  const apiRouter = Router();

  apiRouter.get(
    '/health',
    validateRequest(apiContracts.health.request, 'query'),
    (_request, response) => {
      const payload: HealthResponse = {
        status: 'ok',
        timestamp: new Date().toISOString(),
      };

      response.status(200).json(apiContracts.health.response.parse(payload));
    },
  );

  apiRouter.get(
    '/brands',
    validateRequest(apiContracts.brands.request, 'query'),
    async (_request, response) => {
      const payload: BrandsResponse = await brandCatalog.getCatalog();
      response.status(200).json(apiContracts.brands.response.parse(payload));
    },
  );
  apiRouter.get(
    '/search',
    validateRequest(apiContracts.search.request, 'query', {
      code: 'INVALID_BRAND_SLUG',
      message: 'Marka slug değeri geçersiz.',
    }),
    async (_request, response, next) => {
      const query = response.locals.validated.query as SearchQuery;
      const catalog = await brandCatalog.getCatalog();
      const brand = catalog.items.find((item) => item.slug === query.brandSlug);

      if (!brand) {
        next(new AppError(400, 'INVALID_BRAND_SLUG', 'Marka slug değeri katalogda bulunamadı.'));
        return;
      }

      try {
        const searchResult = await listingSearchSource.search(brand.slug);
        const payload: SearchResponse = {
          brand,
          ...searchResult,
          fetchedAt: new Date().toISOString(),
        };

        response.status(200).json(apiContracts.search.response.parse(payload));
      } catch {
        next(
          new AppError(502, 'UPSTREAM_ERROR', 'İlan arama kaynağına şu anda ulaşılamıyor.', true),
        );
      }
    },
  );
  apiRouter.post(
    '/details',
    validateRequest(apiContracts.details.request, 'body', {
      code: 'INVALID_DETAIL_HREF',
      message: 'Detay bağlantısı geçersiz.',
    }),
    async (_request, response, next) => {
      const body = response.locals.validated.body as DetailsRequest;

      try {
        const detailResult = await vehicleDetailsSource.fetchDetails(body.detailHref);
        let fuelPriceResponse: unknown;

        if (!body.city || !body.district) {
          fuelPriceResponse = fuelPriceError(
            'Yakıt fiyatı için il ve ilçe birlikte gereklidir; CollectAPI çağrısı yapılmadı.',
            false,
          );
        } else {
          try {
            fuelPriceResponse = await fuelPriceSource.fetchFuelPrices(body.city, body.district);
          } catch (error) {
            fuelPriceResponse = fuelPriceError(
              error instanceof CollectApiConfigurationError
                ? 'CollectAPI anahtarı eksik. server/.env dosyasındaki COLLECTAPI_API_KEY değerini yapılandırın ve sunucuyu yeniden başlatın.'
                : 'Yakıt fiyatı servisine şu anda ulaşılamıyor.',
              !(error instanceof CollectApiConfigurationError),
            );
          }
        }

        const payload: DetailsResponse = {
          ...detailResult,
          fuelLocation: {
            city: body.city ?? null,
            district: body.district ?? null,
          },
          fuelPriceResponse,
          fetchedAt: new Date().toISOString(),
        };

        response.status(200).json(apiContracts.details.response.parse(payload));
      } catch {
        next(
          new AppError(
            502,
            'UPSTREAM_ERROR',
            'Araç detay kaynağına erişilemiyor veya erişim doğrulaması gerekiyor.',
            true,
          ),
        );
      }
    },
  );
  apiRouter.post(
    '/cost-estimate',
    validateRequest(apiContracts.costEstimate.request, 'body'),
    (_request, response, next) => {
      try {
        const input = response.locals.validated.body as CostEstimateRequest;
        response
          .status(200)
          .json(apiContracts.costEstimate.response.parse(calculateCostEstimate(input)));
      } catch (error) {
        if (error instanceof CalculationInputError) {
          next(
            new AppError(
              422,
              'CALCULATION_INPUT_INVALID',
              'Maliyet hesabı için aylık km, tüketim, depo ve litre fiyatı geçerli olmalıdır.',
            ),
          );
          return;
        }

        next(error);
      }
    },
  );

  return apiRouter;
}
