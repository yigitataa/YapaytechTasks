function getLogLevel(statusCode) {
  if (statusCode >= 500) {
    return 'error'
  }

  if (statusCode >= 400) {
    return 'warn'
  }

  return 'info'
}

export function createRequestLogger({
  enabled = true,
  logger = console,
  now = Date.now,
} = {}) {
  return function requestLogger(request, response, next) {
    if (!enabled) {
      next()
      return
    }

    const startedAt = now()

    response.on('finish', () => {
      const duration = Math.max(0, now() - startedAt)
      const level = getLogLevel(response.statusCode)
      const writeLog = logger[level] ?? logger.log
      const path = request.path || '/'

      writeLog.call(
        logger,
        `[${level.toUpperCase()}] ${request.method} ${path} ${response.statusCode} ${duration}ms`,
      )
    })

    next()
  }
}
