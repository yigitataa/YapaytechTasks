import type { ApiErrorResponse } from '@vehicle-cost/contracts';
import type { ErrorRequestHandler, RequestHandler } from 'express';
import { AppError } from '../errors/app-error.js';

export const notFoundHandler: RequestHandler = (request, _response, next) => {
  next(new AppError(404, 'NOT_FOUND', `${request.method} ${request.path} bulunamadı.`));
};

export const errorHandler: ErrorRequestHandler = (error: unknown, _request, response, _next) => {
  void _next;

  if (error instanceof AppError) {
    const payload: ApiErrorResponse = {
      error: {
        code: error.code,
        message: error.message,
        retryable: error.retryable,
      },
    };

    response.status(error.statusCode).json(payload);
    return;
  }

  if (error instanceof SyntaxError && 'body' in error) {
    const payload: ApiErrorResponse = {
      error: {
        code: 'INVALID_JSON',
        message: 'İstek gövdesi geçerli JSON olmalıdır.',
        retryable: false,
      },
    };

    response.status(400).json(payload);
    return;
  }

  const payload: ApiErrorResponse = {
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Beklenmeyen bir sunucu hatası oluştu.',
      retryable: false,
    },
  };

  response.status(500).json(payload);
};
