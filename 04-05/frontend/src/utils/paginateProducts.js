export const CATALOG_PAGE_SIZE = 6

export function paginateProducts(products, requestedPage, pageSize = CATALOG_PAGE_SIZE) {
  const validPageSize = Number.isInteger(pageSize) && pageSize > 0 ? pageSize : CATALOG_PAGE_SIZE
  const totalItems = products.length
  const totalPages = Math.max(1, Math.ceil(totalItems / validPageSize))
  const validRequestedPage = Number.isInteger(requestedPage) && requestedPage > 0
    ? requestedPage
    : 1
  const page = Math.min(validRequestedPage, totalPages)
  const offset = (page - 1) * validPageSize

  return {
    items: products.slice(offset, offset + validPageSize),
    page,
    pageSize: validPageSize,
    totalItems,
    totalPages,
  }
}
