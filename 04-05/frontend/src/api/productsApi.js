const DEFAULT_API_BASE_URL = 'http://localhost:3000'

const apiBaseUrl = (
  import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL
).replace(/\/$/, '')

export class ApiError extends Error {
  constructor(message, status = 0) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

async function requestJson(path, { signal } = {}) {
  let response

  try {
    response = await fetch(`${apiBaseUrl}${path}`, {
      headers: { Accept: 'application/json' },
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

  let data

  try {
    data = await response.json()
  } catch {
    throw new ApiError('Sunucudan beklenmeyen bir cevap alındı.', response.status)
  }

  if (!response.ok) {
    throw new ApiError(data?.message || 'İstek tamamlanamadı.', response.status)
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

export async function getProductById(productId, options = {}) {
  return requestJson(`/api/products/${encodeURIComponent(productId)}`, options)
}
