import {
  getAllProducts,
  getProductById,
} from '../services/productService.js'

export function listProducts(_request, response) {
  response.status(200).json(getAllProducts())
}

export function showProduct(request, response, next) {
  const product = getProductById(request.params.id)

  if (!product) {
    const error = new Error('Ürün bulunamadı')
    error.statusCode = 404
    return next(error)
  }

  return response.status(200).json(product)
}

