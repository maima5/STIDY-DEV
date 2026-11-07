import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes';
import { requireAuth } from '../middleware/auth';
import { AppError } from '../utils/errors';
import { ok } from '../utils/response';
import { query } from '../db';

const api = Router();

api.get('/health', async (_req, res) => {
  await query('select 1');
  ok(res, { status: 'up' });
});

api.use('/auth', authRoutes);

// Placeholder: kerjakan di task berikutnya
const notImplemented = Router().use(requireAuth, () => {
  throw new AppError(501, 'NOT_IMPLEMENTED', 'Endpoint belum diimplementasi');
});
api.use('/schedules', notImplemented);   // CRUD jadwal belajar
api.use('/sessions', notImplemented);    // Study sessions
api.use('/summaries', notImplemented);   // POST ringkasan AI (Gemini), GET riwayat

export default api;
