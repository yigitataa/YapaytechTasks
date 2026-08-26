import { AppError } from '../errors/AppError.js'
import {
  createProduct as createProductRecord,
  deleteProductById,
  getAllProducts,
  getProductById,
  updateProductById,
} from '../services/productService.js'
import {
  validateProductForCreate,
  validateProductForUpdate,
} from '../validators/productValidator.js'

function getValidatedValue(validationResult) {
  if (Object.keys(validationResult.errors).length > 0) {
    throw new AppError(
      'Geçersiz ürün verisi',
      400,
      validationResult.errors,
    )
  }

  return validationResult.value
}

export function listProducts(_request, response) {
  response.status(200).json(getAllProducts())
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
