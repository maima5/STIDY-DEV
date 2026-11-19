// Jadwal Belajar: mata kuliah (courses) -> materi (course_materials) -> lampiran (material_attachments).
// Semua response memakai bentuk `Course` yang sama dengan frontend (camelCase, tanggal "YYYY-MM-DD"),
// dan setiap mutasi mengembalikan course lengkap terbaru supaya client cukup mengganti satu item.
import { Router } from 'express';
import { Pool, PoolClient } from 'pg';
import { z } from 'zod';
import { pool, query, withTx } from '../../db';
import { requireAuth } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import { AppError } from '../../utils/errors';
import { ok, created } from '../../utils/response';

const router = Router();
router.use(requireAuth);

// ---------- schemas ----------
const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal harus YYYY-MM-DD')
  .refine((v) => !Number.isNaN(Date.parse(v)), 'Tanggal tidak valid');
const title = z.string().trim().min(1, 'Wajib diisi').max(200);

const courseSchema = z.object({
  name: z.string().trim().min(1, 'Nama mata kuliah wajib diisi').max(100),
  examDate: isoDate,
  hoursPerDay: z.coerce.number().int().min(1).max(24),
  materials: z.array(z.object({ id: z.string().uuid().optional(), title })).min(1, 'Minimal satu materi').max(200),
});

const materialCreateSchema = z.object({ title });

const materialUpdateSchema = z.object({
  title: title.optional(),
  done: z.boolean().optional(),
  completedAt: isoDate.optional(),       // tanggal lokal client saat ditandai selesai
  note: z.string().max(20_000).optional(),
  estimateMinutes: z.coerce.number().int().min(1).max(1440).optional(),
  level: z.enum(['Dasar', 'Menengah', 'Lanjut']).optional(),
}).refine((v) => Object.keys(v).length > 0, 'Minimal satu field');

const attachmentSchema = z.object({
  name: z.string().trim().min(1, 'Wajib diisi').max(255),
  description: z.string().trim().max(255).default(''),
  url: z.string().url().optional(),
});

const uuid = (v: unknown) => z.string().uuid('ID tidak valid').parse(v);

// ---------- query helpers ----------
type Db = Pool | PoolClient;
const db: Db = pool;

// json_strip_nulls: field kosong (completedAt, summary, url) dihilangkan -> `undefined` di frontend
const COURSE_JSON = `
  json_strip_nulls(json_build_object(
    'id', c.id,
    'name', c.name,
    'examDate', to_char(c.exam_date, 'YYYY-MM-DD'),
    'hoursPerDay', c.hours_per_day,
    'materials', coalesce((
      select json_agg(json_build_object(
        'id', m.id,
        'title', m.title,
        'estimateMinutes', m.estimate_minutes,
        'level', m.level,
        'done', m.completed_on is not null,
        'completedAt', to_char(m.completed_on, 'YYYY-MM-DD'),
        'note', m.note,
        'summary', m.summary,
        'attachments', coalesce((
          select json_agg(json_build_object('id', a.id, 'name', a.name, 'description', a.description, 'url', a.url)
                          order by a.created_at)
          from material_attachments a where a.material_id = m.id
        ), '[]'::json)
      ) order by m.position, m.created_at)
      from course_materials m where m.course_id = c.id
    ), '[]'::json)
  )) as course`;

async function fetchCourse(c: Db, courseId: string, userId: string) {
  const r = await c.query(`select ${COURSE_JSON} from courses c where c.id = $1 and c.user_id = $2`, [courseId, userId]);
  if (!r.rowCount) throw new AppError(404, 'COURSE_NOT_FOUND', 'Mata kuliah tidak ditemukan');
  return r.rows[0].course;
}

/** Pastikan course milik user (dan materi milik course bila diberikan). */
async function assertOwned(c: Db, userId: string, courseId: string, materialId?: string) {
  const r = materialId
    ? await c.query(
        `select 1 from course_materials m join courses c on c.id = m.course_id
         where m.id = $1 and c.id = $2 and c.user_id = $3`, [materialId, courseId, userId])
    : await c.query('select 1 from courses where id = $1 and user_id = $2', [courseId, userId]);
  if (!r.rowCount) {
    throw materialId
      ? new AppError(404, 'MATERIAL_NOT_FOUND', 'Materi tidak ditemukan')
      : new AppError(404, 'COURSE_NOT_FOUND', 'Mata kuliah tidak ditemukan');
  }
}

// ---------- courses ----------
router.get('/', async (req, res) => {
  const r = await query(
    `select ${COURSE_JSON} from courses c where c.user_id = $1 order by c.exam_date asc, c.created_at asc`,
    [req.user!.id]);
  ok(res, r.rows.map((row) => row.course), undefined, { total: r.rowCount });
});

router.post('/', validate(courseSchema), async (req, res) => {
  const { name, examDate, hoursPerDay, materials } = req.body as z.infer<typeof courseSchema>;
  const userId = req.user!.id;
  const course = await withTx(async (c) => {
    const r = await c.query(
      'insert into courses (user_id, name, exam_date, hours_per_day) values ($1, $2, $3, $4) returning id',
      [userId, name, examDate, hoursPerDay]);
    const courseId = r.rows[0].id;
    await c.query(
      `insert into course_materials (course_id, title, position)
       select $1, t.title, t.pos - 1 from unnest($2::text[]) with ordinality as t(title, pos)`,
      [courseId, materials.map((m) => m.title)]);
    return fetchCourse(c, courseId, userId);
  });
  created(res, course, 'Jadwal belajar ditambahkan');
});

router.get('/:id', async (req, res) => {
  ok(res, await fetchCourse(db, uuid(req.params.id), req.user!.id));
});

/** Ganti detail course + sinkronkan daftar materi (urutan baru, materi yang hilang dihapus). */
router.put('/:id', validate(courseSchema), async (req, res) => {
  const courseId = uuid(req.params.id);
  const userId = req.user!.id;
  const { name, examDate, hoursPerDay, materials } = req.body as z.infer<typeof courseSchema>;

  const course = await withTx(async (c) => {
    const r = await c.query(
      'update courses set name = $3, exam_date = $4, hours_per_day = $5 where id = $1 and user_id = $2',
      [courseId, userId, name, examDate, hoursPerDay]);
    if (!r.rowCount) throw new AppError(404, 'COURSE_NOT_FOUND', 'Mata kuliah tidak ditemukan');

    const keepIds = materials.flatMap((m) => (m.id ? [m.id] : []));
    await c.query('delete from course_materials where course_id = $1 and not (id = any($2::uuid[]))', [courseId, keepIds]);

    for (const [position, m] of materials.entries()) {
      if (m.id) {
        const u = await c.query(
          'update course_materials set title = $3, position = $4 where id = $1 and course_id = $2',
          [m.id, courseId, m.title, position]);
        if (!u.rowCount) throw new AppError(404, 'MATERIAL_NOT_FOUND', 'Materi tidak ditemukan');
      } else {
        await c.query('insert into course_materials (course_id, title, position) values ($1, $2, $3)',
          [courseId, m.title, position]);
      }
    }
    return fetchCourse(c, courseId, userId);
  });
  ok(res, course, 'Jadwal belajar diperbarui');
});

router.delete('/:id', async (req, res) => {
  const r = await query('delete from courses where id = $1 and user_id = $2', [uuid(req.params.id), req.user!.id]);
  if (!r.rowCount) throw new AppError(404, 'COURSE_NOT_FOUND', 'Mata kuliah tidak ditemukan');
  ok(res, null, 'Jadwal belajar dihapus');
});

// ---------- materials ----------
router.post('/:id/materials', validate(materialCreateSchema), async (req, res) => {
  const courseId = uuid(req.params.id);
  const userId = req.user!.id;
  await assertOwned(db, userId, courseId);
  await query(
    `insert into course_materials (course_id, title, position)
     values ($1, $2, (select coalesce(max(position) + 1, 0) from course_materials where course_id = $1))`,
    [courseId, req.body.title]);
  created(res, await fetchCourse(db, courseId, userId), 'Materi ditambahkan');
});

router.patch('/:id/materials/:materialId', validate(materialUpdateSchema), async (req, res) => {
  const courseId = uuid(req.params.id);
  const materialId = uuid(req.params.materialId);
  const userId = req.user!.id;
  const b = req.body as z.infer<typeof materialUpdateSchema>;
  await assertOwned(db, userId, courseId, materialId);

  // done: true -> isi tanggal selesai (pakai tanggal lokal client bila dikirim); false -> kosongkan
  // (semua parameter selalu direferensikan + di-cast agar Postgres bisa menentukan tipenya)
  await query(
    `update course_materials set
       title = coalesce($2::varchar, title),
       note = coalesce($3::text, note),
       completed_on = case $7::boolean
         when true then coalesce($4::date, current_date)
         when false then null
         else completed_on end,
       estimate_minutes = coalesce($5::int, estimate_minutes),
       level = coalesce($6::varchar, level)
     where id = $1`,
    [materialId, b.title ?? null, b.note ?? null, b.completedAt ?? null, b.estimateMinutes ?? null, b.level ?? null,
      b.done ?? null]);
  ok(res, await fetchCourse(db, courseId, userId), 'Materi diperbarui');
});

router.delete('/:id/materials/:materialId', async (req, res) => {
  const courseId = uuid(req.params.id);
  const materialId = uuid(req.params.materialId);
  const userId = req.user!.id;
  await assertOwned(db, userId, courseId, materialId);
  await query('delete from course_materials where id = $1', [materialId]);
  ok(res, await fetchCourse(db, courseId, userId), 'Materi dihapus');
});

// ---------- attachments (metadata; unggah file belum tersedia) ----------
router.post('/:id/materials/:materialId/attachments', validate(attachmentSchema), async (req, res) => {
  const courseId = uuid(req.params.id);
  const materialId = uuid(req.params.materialId);
  const userId = req.user!.id;
  const { name, description, url } = req.body as z.infer<typeof attachmentSchema>;
  await assertOwned(db, userId, courseId, materialId);
  await query('insert into material_attachments (material_id, name, description, url) values ($1, $2, $3, $4)',
    [materialId, name, description, url ?? null]);
  created(res, await fetchCourse(db, courseId, userId), 'Lampiran ditambahkan');
});

router.delete('/:id/materials/:materialId/attachments/:attachmentId', async (req, res) => {
  const courseId = uuid(req.params.id);
  const materialId = uuid(req.params.materialId);
  const userId = req.user!.id;
  await assertOwned(db, userId, courseId, materialId);
  const r = await query('delete from material_attachments where id = $1 and material_id = $2',
    [uuid(req.params.attachmentId), materialId]);
  if (!r.rowCount) throw new AppError(404, 'ATTACHMENT_NOT_FOUND', 'Lampiran tidak ditemukan');
  ok(res, await fetchCourse(db, courseId, userId), 'Lampiran dihapus');
});

export default router;
