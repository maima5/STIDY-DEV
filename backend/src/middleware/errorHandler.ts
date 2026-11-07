import { ErrorRequestHandler, RequestHandler, Response } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../utils/errors';

export const notFound: RequestHandler = (req, _res, next) =>
  next(new AppError(404, 'NOT_FOUND', `Route ${req.method} ${req.originalUrl} tidak ditemukan`));

const fail = (res: Response, status: number, code: string, message: string, details?: unknown) =>
  res.status(status).json({ success: false, error: { code, message, details } });

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ZodError) {
    return fail(res, 422, 'VALIDATION_ERROR', 'Data yang dikirim tidak valid',
      err.issues.map((i) => ({ field: i.path.join('.'), message: i.message })));
  }
  if (err instanceof AppError) return fail(res, err.status, err.code, err.message, err.details);
  if (err?.type === 'entity.parse.failed') return fail(res, 400, 'INVALID_JSON', 'Body bukan JSON yang valid');
  if (err?.code === '23505') return fail(res, 409, 'CONFLICT', 'Data sudah ada');                  // pg unique violation
  if (err?.code === '22P02') return fail(res, 400, 'BAD_REQUEST', 'Format parameter tidak valid'); // pg invalid uuid

  console.error(err);
  return fail(res, 500, 'INTERNAL_ERROR', 'Terjadi kesalahan pada server');
};
