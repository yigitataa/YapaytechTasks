import type { ApiErrorCode } from '@vehicle-cost/contracts';
import type { RequestHandler } from 'express';
import type { ZodType } from 'zod';
import { AppError } from '../errors/app-error.js';

type RequestTarget = 'body' | 'query';

interface ValidationErrorOptions {
  code?: ApiErrorCode;
  message?: string;
}

export function validateRequest(
  schema: ZodType,
  target: RequestTarget,
  errorOptions: ValidationErrorOptions = {},
): RequestHandler {
  return (request, response, next) => {
    const result = schema.safeParse(request[target]);

    if (!result.success) {
      next(
        new AppError(
          400,
          errorOptions.code ?? 'VALIDATION_ERROR',
          errorOptions.message ?? 'İstek parametreleri geçersiz.',
        ),
      );
      return;
    }

    response.locals.validated = {
      ...(response.locals.validated as Record<string, unknown> | undefined),
      [target]: result.data,
    };
    next();
  };
}
