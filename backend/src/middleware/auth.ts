import { RequestHandler } from 'express';
import { verifyAccessToken } from '../utils/security';
import { AppError } from '../utils/errors';

declare global {
  namespace Express {
    interface Request {
      user?: { id: string };
    }
  }
}

/** Lindungi route: wajib header `Authorization: Bearer <accessToken>`. */
export const requireAuth: RequestHandler = (req, _res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    throw new AppError(401, 'UNAUTHORIZED', 'Token akses tidak ditemukan');
  }
  try {
    const payload = verifyAccessToken(header.slice(7));
    req.user = { id: payload.sub as string };
    next();
  } catch {
    throw new AppError(401, 'TOKEN_INVALID', 'Token tidak valid atau sudah kedaluwarsa');
  }
};
