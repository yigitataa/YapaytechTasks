import { AppError } from '../errors/AppError.js'
import {
  createProduct as createProductRecord,
  deleteProductById,
  getAllProducts,
  getPaginatedProducts,
  getProductById,
  updateProductById,
} from '../services/productService.js'
import {
  validateProductForCreate,
  validateProductForUpdate,
} from '../validators/productValidator.js'
import { validatePaginationQuery } from '../validators/paginationValidator.js'

function getValidatedValue(
  validationResult,
  message = 'Geçersiz ürün verisi',
) {
  if (Object.keys(validationResult.errors).length > 0) {
    throw new AppError(message, 400, validationResult.errors)
  }

  return validationResult.value
}

export function listProducts(request, response) {
  if (Object.keys(request.query).length === 0) {
    return response.status(200).json(getAllProducts())
  }

  const pagination = getValidatedValue(
    validatePaginationQuery(request.query),
    'Geçersiz sayfalama parametreleri',
  )

  return response.status(200).json(getPaginatedProducts(pagination))
}

export function showProduct(request, response) {
  const product = getProductById(request.params.id)

  if (!product) {
    throw new AppError('Ürün bulunamadı', 404)
  }

  return response.status(200).json(product)
}

export function createProduct(request, response) {
  const productData = getValidatedValue(
    validateProductForCreate(request.body),
  )
  const product = createProductRecord(productData)

  return response.status(201).json(product)
}

export function updateProduct(request, response) {
  if (!getProductById(request.params.id)) {
    throw new AppError('Ürün bulunamadı', 404)
  }

  const changes = getValidatedValue(validateProductForUpdate(request.body))
  const product = updateProductById(request.params.id, changes)

  return response.status(200).json(product)
}

export function deleteProduct(request, response) {
  const product = deleteProductById(request.params.id)

  if (!product) {
    throw new AppError('Ürün bulunamadı', 404)
  }

  return response.status(204).send()
}
