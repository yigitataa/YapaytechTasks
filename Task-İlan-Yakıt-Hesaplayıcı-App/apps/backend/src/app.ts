import cors from 'cors';
import express from 'express';
import { isFixtureDataEnabled, serverConfig } from './config.js';
import {
  FixtureBrandCatalog,
  FixtureFuelPriceSource,
  FixtureListingSearchSource,
  FixtureVehicleDetailsSource,
} from './fixtures/index.js';
import { errorHandler, notFoundHandler } from './middleware/error-handler.js';
import { createApiRouter } from './routes/api.js';
import {
  brandCatalog as defaultBrandCatalog,
  type BrandCatalogReader,
} from './services/brand-catalog/index.js';
import {
  createDefaultListingSearchSource,
  type ListingSearchSource,
} from './services/listing-search/index.js';
import { CollectApiFuelPriceSource, type FuelPriceSource } from './services/fuel-price/index.js';
import {
  createDefaultVehicleDetailsSource,
  type VehicleDetailsSource,
} from './services/vehicle-details/index.js';

export interface AppOptions {
  brandCatalog?: BrandCatalogReader;
  listingSearchSource?: ListingSearchSource;
  vehicleDetailsSource?: VehicleDetailsSource;
  fuelPriceSource?: FuelPriceSource;
  fixtureMode?: boolean;
}

export function createApp(options: AppOptions = {}) {
  const app = express();
  const fixtureMode = options.fixtureMode ?? isFixtureDataEnabled();
  const brandCatalog =
    options.brandCatalog ?? (fixtureMode ? new FixtureBrandCatalog() : defaultBrandCatalog);
  const listingSearchSource =
    options.listingSearchSource ??
    (fixtureMode ? new FixtureListingSearchSource() : createDefaultListingSearchSource());
  const vehicleDetailsSource =
    options.vehicleDetailsSource ??
    (fixtureMode ? new FixtureVehicleDetailsSource() : createDefaultVehicleDetailsSource());
  const fuelPriceSource =
    options.fuelPriceSource ??
    (fixtureMode ? new FixtureFuelPriceSource() : new CollectApiFuelPriceSource());

  app.disable('x-powered-by');
  app.use(
    cors({
      origin: serverConfig.clientOrigin,
    }),
  );
  app.use(express.json({ limit: '100kb' }));
  app.get(['/', '/api'], (_request, response) => {
    response.status(200).json({
      name: 'YataOil API',
      status: 'ok',
      message: `API çalışıyor. Kullanıcı arayüzü ${serverConfig.clientOrigin} adresindedir.`,
      health: '/api/health',
      endpoints: {
        brands: 'GET /api/brands',
        search: 'GET /api/search?brandSlug=...',
        details: 'POST /api/details',
        costEstimate: 'POST /api/cost-estimate',
      },
    });
  });
  app.use(
    '/api',
    createApiRouter(brandCatalog, listingSearchSource, vehicleDetailsSource, fuelPriceSource),
  );
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

export const app = createApp();
