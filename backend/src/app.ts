import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { env } from './config/env';
import api from './routes';
import { AppError } from './utils/errors';
import { errorHandler, notFound } from './middleware/errorHandler';

const app = express();

app.set('trust proxy', 1); // di belakang proxy hosting (Railway/Render/Vercel) agar req.ip benar
app.use(helmet());
app.use(cors({
  origin: env.NODE_ENV === 'development'
    ? (origin, cb) => cb(null, true)   // dev: izinkan semua origin (localhost:8081, 3000, dll)
    : env.CLIENT_URL,                   // prod: hanya CLIENT_URL
  credentials: true,
}));
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

// batasi percobaan brute-force pada endpoint auth
app.use('/api/auth', rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 50,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, _res, next) => next(new AppError(429, 'TOO_MANY_REQUESTS', 'Terlalu banyak percobaan, coba lagi nanti')),
}));

app.use('/api', api);
app.use(notFound);
app.use(errorHandler);

export default app;
