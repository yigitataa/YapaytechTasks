function isInvalidJsonError(error) {
  return error.status === 400 && error.type === 'entity.parse.failed'
}

function getSafeStatusCode(error) {
  return Number.isInteger(error.statusCode) &&
    error.statusCode >= 400 &&
    error.statusCode <= 599
    ? error.statusCode
    : 500
}

export function errorHandler(error, _request, response, next) {
  if (response.headersSent) {
    return next(error)
  }

  if (isInvalidJsonError(error)) {
    return response.status(400).json({ message: 'Geçersiz JSON gövdesi' })
  }

  const statusCode = getSafeStatusCode(error)
  const payload = {
    message: statusCode === 500 ? 'Sunucu hatası' : error.message,
  }

  if (statusCode < 500 && error.details) {
    payload.details = error.details
  }

  return response.status(statusCode).json(payload)
}
