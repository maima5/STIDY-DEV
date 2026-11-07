// Contoh pola modul CRUD (pakai ini sebagai template untuk materials, summaries, focus).
// Aturan emas: SEMUA query harus difilter `user_id = req.user.id` supaya data antar user terisolasi.
import { Router } from 'express';
import { z } from 'zod';
import { query } from '../../db';
import { requireAuth } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import { AppError } from '../../utils/errors';
import { ok, created } from '../../utils/response';

const router = Router();
router.use(requireAuth);

const createSchema = z.object({
  subject_name: z.string().trim().min(1, 'Wajib diisi').max(100),
  exam_date: z.coerce.date(),
  notes: z.string().trim().max(500).optional(),
});
const updateSchema = createSchema.partial().refine((v) => Object.keys(v).length > 0, 'Minimal satu field');
const idParam = (v: unknown) => z.string().uuid('ID tidak valid').parse(v);

const SELECT = `id, subject_name, exam_date, notes, created_at,
  ceil(extract(epoch from (exam_date - now())) / 86400)::int as days_left`;

router.get('/', async (req, res) => {
  const r = await query(`select ${SELECT} from exams where user_id = $1 order by exam_date asc`, [req.user!.id]);
  ok(res, r.rows, undefined, { total: r.rowCount });
});

router.post('/', validate(createSchema), async (req, res) => {
  const { subject_name, exam_date, notes } = req.body;
  const r = await query(
    `insert into exams (user_id, subject_name, exam_date, notes) values ($1, $2, $3, $4) returning ${SELECT}`,
    [req.user!.id, subject_name, exam_date, notes ?? null]);
  created(res, r.rows[0], 'Ujian ditambahkan');
});

router.get('/:id', async (req, res) => {
  const r = await query(`select ${SELECT} from exams where id = $1 and user_id = $2`, [idParam(req.params.id), req.user!.id]);
  if (!r.rowCount) throw new AppError(404, 'EXAM_NOT_FOUND', 'Ujian tidak ditemukan');
  ok(res, r.rows[0]);
});

router.patch('/:id', validate(updateSchema), async (req, res) => {
  const { subject_name, exam_date, notes } = req.body;
  const r = await query(
    `update exams set subject_name = coalesce($3, subject_name), exam_date = coalesce($4, exam_date),
       notes = coalesce($5, notes) where id = $1 and user_id = $2 returning ${SELECT}`,
    [idParam(req.params.id), req.user!.id, subject_name ?? null, exam_date ?? null, notes ?? null]);
  if (!r.rowCount) throw new AppError(404, 'EXAM_NOT_FOUND', 'Ujian tidak ditemukan');
  ok(res, r.rows[0], 'Ujian diperbarui');
});

router.delete('/:id', async (req, res) => {
  const r = await query('delete from exams where id = $1 and user_id = $2', [idParam(req.params.id), req.user!.id]);
  if (!r.rowCount) throw new AppError(404, 'EXAM_NOT_FOUND', 'Ujian tidak ditemukan');
  ok(res, null, 'Ujian dihapus');
});

export default router;
