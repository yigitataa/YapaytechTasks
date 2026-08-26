import { AppError } from '../errors/AppError.js'

export function notFoundHandler(_request, _response, next) {
  next(new AppError('Endpoint bulunamadı', 404))
}
