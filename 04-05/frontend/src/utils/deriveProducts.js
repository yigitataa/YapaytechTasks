export const ALL_CATEGORIES = 'all'

export const SORT_OPTIONS = {
  DEFAULT: 'default',
  PRICE_ASCENDING: 'price-ascending',
  PRICE_DESCENDING: 'price-descending',
}

function parsePriceBoundary(value) {
  if (value === '' || value === null || value === undefined) {
    return null
  }

  const parsedValue = Number(value)

  return Number.isFinite(parsedValue) && parsedValue >= 0
    ? parsedValue
    : Number.NaN
}

export function getPriceRangeError(minPrice = '', maxPrice = '') {
  const minimum = parsePriceBoundary(minPrice)
  const maximum = parsePriceBoundary(maxPrice)

  if (Number.isNaN(minimum) || Number.isNaN(maximum)) {
    return 'Fiyat sınırları sıfır veya daha büyük bir sayı olmalıdır.'
  }

  if (minimum !== null && maximum !== null && minimum > maximum) {
    return 'Minimum fiyat, maksimum fiyattan büyük olamaz.'
  }

  return ''
}

function normalizeText(value) {
  return value
    .trim()
    .toLocaleLowerCase('tr-TR')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replaceAll('ı', 'i')
}

export function getProductCategories(products) {
  return [...new Set(products.map((product) => product.category).filter(Boolean))].sort(
    (firstCategory, secondCategory) =>
      firstCategory.localeCompare(secondCategory, 'tr-TR'),
  )
}

export function deriveProducts(
  products,
  {
    searchTerm = '',
    selectedCategory = ALL_CATEGORIES,
    sortBy = SORT_OPTIONS.DEFAULT,
    minPrice = '',
    maxPrice = '',
  },
) {
  const normalizedSearch = normalizeText(searchTerm)
  const priceRangeError = getPriceRangeError(minPrice, maxPrice)
  const minimum = parsePriceBoundary(minPrice)
  const maximum = parsePriceBoundary(maxPrice)

  const matchingProducts = products
    .filter((product) =>
      normalizedSearch ? normalizeText(product.name).includes(normalizedSearch) : true,
    )
    .filter((product) =>
      selectedCategory === ALL_CATEGORIES
        ? true
        : product.category === selectedCategory,
    )
    .filter((product) =>
      priceRangeError || minimum === null ? true : product.price >= minimum,
    )
    .filter((product) =>
      priceRangeError || maximum === null ? true : product.price <= maximum,
    )

  const sortedProducts = [...matchingProducts]

  if (sortBy === SORT_OPTIONS.PRICE_ASCENDING) {
    sortedProducts.sort((firstProduct, secondProduct) => firstProduct.price - secondProduct.price)
  }

  if (sortBy === SORT_OPTIONS.PRICE_DESCENDING) {
    sortedProducts.sort((firstProduct, secondProduct) => secondProduct.price - firstProduct.price)
  }

  return sortedProducts
}
