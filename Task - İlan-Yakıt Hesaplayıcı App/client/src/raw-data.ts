import type { ApiErrorResponse, DetailsResponse, SearchListing } from '@vehicle-cost/contracts';

export interface RawLocation {
  city?: string;
  district?: string;
}

export interface FuelOption {
  name: string;
  price: string | number;
}

function comparableLabel(value: string): string {
  return value.trim().toLocaleLowerCase('tr-TR');
}

const LISTING_CONTROL_TEXT_PATTERN =
  /Karşılaştırmadan Çıkar|Karşılaştır|Favorilerimde|Favoriye Ekle|Gizle|Göster/giu;

export function cleanListingDisplayText(value: string): string {
  return value.replace(LISTING_CONTROL_TEXT_PATTERN, ' ').replace(/\s+/g, ' ').trim();
}

export function extractRawLocation(listing: SearchListing): RawLocation {
  const separateCity = listing.cells.find((cell) =>
    ['il', 'şehir'].includes(comparableLabel(cell.label)),
  )?.value;
  const separateDistrict = listing.cells.find(
    (cell) => comparableLabel(cell.label) === 'ilçe',
  )?.value;

  if (separateCity && separateDistrict) {
    return {
      city: cleanListingDisplayText(separateCity),
      district: cleanListingDisplayText(separateDistrict),
    };
  }

  const combinedLocation = listing.cells.find((cell) =>
    /^il\s*\/\s*ilçe$/iu.test(comparableLabel(cell.label)),
  )?.value;
  const cleanCombinedLocation = combinedLocation ? cleanListingDisplayText(combinedLocation) : '';
  const separatorIndex = cleanCombinedLocation.indexOf(' ');

  return {
    city: separatorIndex > 0 ? cleanCombinedLocation.slice(0, separatorIndex).trim() : undefined,
    district:
      separatorIndex > 0 ? cleanCombinedLocation.slice(separatorIndex + 1).trim() : undefined,
  };
}

export function findRawDetailValue(
  details: DetailsResponse,
  acceptedLabels: readonly string[],
): string | undefined {
  const labels = acceptedLabels.map(comparableLabel);

  for (const section of details.sections) {
    const match = section.fields.find((field) => labels.includes(comparableLabel(field.label)));
    if (match) {
      return match.value;
    }
  }

  return undefined;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function getNestedApiError(value: unknown): ApiErrorResponse['error'] | undefined {
  if (!isRecord(value) || !isRecord(value.error)) {
    return undefined;
  }

  const { code, message, retryable } = value.error;
  if (typeof code === 'string' && typeof message === 'string' && typeof retryable === 'boolean') {
    return { code: code as ApiErrorResponse['error']['code'], message, retryable };
  }

  return undefined;
}

export function extractFuelOptions(value: unknown): FuelOption[] {
  if (!isRecord(value) || !Array.isArray(value.result)) {
    return [];
  }

  return value.result.flatMap((item) => {
    if (!isRecord(item)) {
      return [];
    }

    const name = item.marka ?? item.brand ?? item.name;
    const price = item.benzin ?? item.gasoline ?? item.price ?? item.priceTryPerLiter;

    if (typeof name !== 'string' || (typeof price !== 'string' && typeof price !== 'number')) {
      return [];
    }

    return [{ name, price }];
  });
}
