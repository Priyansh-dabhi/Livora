import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { ApiError } from '../utils/apiError';

export const validate = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const errorMessages = (result.error as any).errors.map((err: any) => `${err.path.join('.')}: ${err.message}`);
    next(new ApiError(400, 'Validation failed', errorMessages));
    return;
  }
  req.body = result.data; // Use sanitized data
  next();
};
