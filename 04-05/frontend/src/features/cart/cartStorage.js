export const CART_STORAGE_KEY = 'yata-market-cart'

const emptyCartState = () => ({ items: [] })

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0
}

function isValidStoredItem(item) {
  if (!item || typeof item !== 'object' || Array.isArray(item)) {
    return false
  }

  const { product, quantity } = item

  return (
    product &&
    typeof product === 'object' &&
    !Array.isArray(product) &&
    isNonEmptyString(product.id) &&
    isNonEmptyString(product.name) &&
    typeof product.price === 'number' &&
    Number.isFinite(product.price) &&
    product.price > 0 &&
    isNonEmptyString(product.category) &&
    typeof product.imageUrl === 'string' &&
    Number.isInteger(quantity) &&
    quantity > 0
  )
}

function sanitizeStoredState(value) {
  if (!value || typeof value !== 'object' || !Array.isArray(value.items)) {
    return null
  }

  if (!value.items.every(isValidStoredItem)) {
    return null
  }

  const productIds = value.items.map((item) => item.product.id)

  if (new Set(productIds).size !== productIds.length) {
    return null
  }

  return {
    items: value.items.map(({ product, quantity }) => ({
      product: {
        id: product.id,
        name: product.name,
        price: product.price,
        category: product.category,
        imageUrl: product.imageUrl,
      },
      quantity,
    })),
  }
}

function getBrowserStorage() {
  try {
    return typeof window === 'undefined' ? null : window.localStorage
  } catch {
    return null
  }
}

export function loadCartState(storage = getBrowserStorage()) {
  if (!storage) {
    return emptyCartState()
  }

  try {
    const serializedState = storage.getItem(CART_STORAGE_KEY)

    if (serializedState === null) {
      return emptyCartState()
    }

    return sanitizeStoredState(JSON.parse(serializedState)) ?? emptyCartState()
  } catch {
    return emptyCartState()
  }
}

export function saveCartState(state, storage = getBrowserStorage()) {
  if (!storage) {
    return false
  }

  const safeState = sanitizeStoredState(state)

  if (!safeState) {
    return false
  }

  try {
    storage.setItem(CART_STORAGE_KEY, JSON.stringify(safeState))
    return true
  } catch {
    return false
  }
}
