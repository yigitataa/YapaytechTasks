import { randomUUID } from 'node:crypto'
import products from '../data/products.js'

export function getAllProducts() {
  return products
}

export function getProductById(id) {
  return products.find((product) => product.id === id)
}

export function createProduct(productData) {
  const product = {
    id: randomUUID(),
    ...productData,
  }

  products.push(product)
  return product
}

export function updateProductById(id, changes) {
  const productIndex = products.findIndex((product) => product.id === id)

  if (productIndex === -1) {
    return undefined
  }

  products[productIndex] = {
    ...products[productIndex],
    ...changes,
  }

  return products[productIndex]
}

export function deleteProductById(id) {
  const productIndex = products.findIndex((product) => product.id === id)

  if (productIndex === -1) {
    return undefined
  }

  const [deletedProduct] = products.splice(productIndex, 1)
  return deletedProduct
}
