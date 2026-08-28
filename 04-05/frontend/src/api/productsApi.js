const DEFAULT_API_BASE_URL = 'http://localhost:3000'

const apiBaseUrl = (
  import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL
).replace(/\/$/, '')

export class ApiError extends Error {
  constructor(message, status = 0, details = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.details = details
  }
}

async function requestJson(path, { signal, method = 'GET', body } = {}) {
  let response
  const headers = { Accept: 'application/json' }

  if (body !== undefined) {
    headers['Content-Type'] = 'application/json'
  }

  try {
    response = await fetch(`${apiBaseUrl}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal,
    })
  } catch (error) {
    if (error.name === 'AbortError') {
      throw error
    }

    throw new ApiError(
      'Sunucuya ulaşılamadı. Backend uygulamasının çalıştığını kontrol edin.',
    )
  }

  if (response.status === 204) {
    return null
  }

  let data

  try {
    data = await response.json()
  } catch {
    throw new ApiError('Sunucudan beklenmeyen bir cevap alındı.', response.status)
  }

  if (!response.ok) {
    throw new ApiError(
      data?.message || 'İstek tamamlanamadı.',
      response.status,
      data?.details,
    )
  }

  return data
}

export async function getProducts(options = {}) {
  const products = await requestJson('/api/products', options)

  if (!Array.isArray(products)) {
    throw new ApiError('Ürün listesi beklenen biçimde değil.')
  }

  return products
}

export async function getProductsPage(page, limit, options = {}) {
  const result = await requestJson(
    `/api/products?page=${encodeURIComponent(page)}&limit=${encodeURIComponent(limit)}`,
    options,
  )

  if (
    !result ||
    !Array.isArray(result.items) ||
    !Number.isInteger(result.page) ||
    !Number.isInteger(result.limit) ||
    !Number.isInteger(result.totalItems) ||
    !Number.isInteger(result.totalPages)
  ) {
    throw new ApiError('Sayfalı ürün listesi beklenen biçimde değil.')
  }

  return result
}

export async function getProductById(productId, options = {}) {
  return requestJson(`/api/products/${encodeURIComponent(productId)}`, options)
}

export async function createProduct(productData, options = {}) {
  return requestJson('/api/products', {
    ...options,
    method: 'POST',
    body: productData,
  })
}

export async function updateProduct(productId, changes, options = {}) {
  return requestJson(`/api/products/${encodeURIComponent(productId)}`, {
    ...options,
    method: 'PATCH',
    body: changes,
  })
}

export async function deleteProduct(productId, options = {}) {
  return requestJson(`/api/products/${encodeURIComponent(productId)}`, {
    ...options,
    method: 'DELETE',
  })
}
