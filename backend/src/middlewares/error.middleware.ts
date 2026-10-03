import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/apiError';
import config from '../config';

export const notFoundHandler = (req: Request, res: Response, next: NextFunction): void => {
  const error = new ApiError(404, `Route ${req.method} ${req.originalUrl} not found`);
  next(error);
};

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  const response: Record<string, any> = {
    success: false,
    message,
    timestamp: new Date().toISOString(),
  };

  if (err.errors && Array.isArray(err.errors) && err.errors.length > 0) {
    response.errors = err.errors;
  }

  // Include stack trace only in development
  if (config.isDevelopment && err.stack) {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};
