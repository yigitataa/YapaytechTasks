export function errorHandler(error, _request, response, _next) {
  const statusCode = error.statusCode ?? 500
  const message = statusCode === 500 ? 'Sunucu hatası' : error.message

  response.status(statusCode).json({ message })
}

