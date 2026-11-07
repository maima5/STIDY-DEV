import { RequestHandler } from 'express';
import { ZodType } from 'zod';

/** Validasi + bersihkan req.body. ZodError ditangkap errorHandler -> 422. */
export const validate =
  (schema: ZodType): RequestHandler =>
  (req, _res, next) => {
    req.body = schema.parse(req.body);
    next();
  };
