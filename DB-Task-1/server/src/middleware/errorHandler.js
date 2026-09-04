import { isMongoAvailabilityError } from '../db/mongodb.js';
import { AppError } from '../errors/AppError.js';

function errorHandler(error, request, response, next) {
  if (response.headersSent) {
    next(error);
    return;
  }

  if (error instanceof AppError) {
    response.status(error.status).json({
      error: {
        code: error.code,
        message: error.message,
      },
    });
    return;
  }

  if (error.type === 'entity.parse.failed') {
    response.status(400).json({
      error: {
        code: 'INVALID_JSON',
        message: 'Request body must contain valid JSON.',
      },
    });
    return;
  }

  if (isMongoAvailabilityError(error)) {
    response.status(503).json({
      error: {
        code: 'MONGODB_UNAVAILABLE',
        message: 'MongoDB is temporarily unavailable. Try again later.',
      },
    });
    return;
  }

  console.error('Unexpected request error:', error);
  response.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred.',
    },
  });
}

export { errorHandler };
