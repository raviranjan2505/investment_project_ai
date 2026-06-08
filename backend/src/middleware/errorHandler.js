import { AppError } from '../utils/errors.js';
import env from '../config/env.js';

export default function errorHandler(error, _req, res, _next) {
  const isAppError = error instanceof AppError;
  const statusCode = isAppError ? error.statusCode : 500;

  if (!isAppError) {
    console.error(error);
  }

  res.status(statusCode).json({
    error: {
      code: isAppError ? error.code : 'INTERNAL_ERROR',
      message: isAppError || !env.isProduction ? error.message : 'Internal server error'
    }
  });
}
