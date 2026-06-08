export class AppError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
  }
}

export function badRequest(message, code = 'BAD_REQUEST') {
  return new AppError(message, 400, code);
}

export function unauthorized(message = 'Authentication required') {
  return new AppError(message, 401, 'UNAUTHORIZED');
}

export function forbidden(message = 'Forbidden') {
  return new AppError(message, 403, 'FORBIDDEN');
}

export function notFound(message = 'Resource not found') {
  return new AppError(message, 404, 'NOT_FOUND');
}
