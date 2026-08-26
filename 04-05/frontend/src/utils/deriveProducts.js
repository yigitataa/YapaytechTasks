export const ALL_CATEGORIES = 'all'

export const SORT_OPTIONS = {
  DEFAULT: 'default',
  PRICE_ASCENDING: 'price-ascending',
  PRICE_DESCENDING: 'price-descending',
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
  { searchTerm = '', selectedCategory = ALL_CATEGORIES, sortBy = SORT_OPTIONS.DEFAULT },
) {
  const normalizedSearch = normalizeText(searchTerm)

  const matchingProducts = products
    .filter((product) =>
      normalizedSearch ? normalizeText(product.name).includes(normalizedSearch) : true,
    )
    .filter((product) =>
      selectedCategory === ALL_CATEGORIES
        ? true
        : product.category === selectedCategory,
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
