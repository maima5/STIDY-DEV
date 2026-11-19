// Isi contoh data Jadwal Belajar (Matematika Diskrit) untuk satu akun yang sudah terdaftar.
// Pemakaian: npm run seed -- <email>
// Aman dijalankan berulang: dilewati bila akun tsb sudah punya mata kuliah dengan nama yang sama.
import { pool, withTx } from '../db';

type SeedMaterial = {
  title: string;
  completedOn?: string;
  note?: string;
  summary?: unknown;
  attachments?: { name: string; description: string }[];
};

const COURSE = {
  name: 'Matematika Diskrit',
  examDate: '2026-12-10',
  hoursPerDay: 2,
  materials: [
    { title: 'Logika Proposisi & Predikat', completedOn: '2026-10-03' },
    { title: 'Himpunan & Operasi', completedOn: '2026-10-08' },
    { title: 'Kombinatorika Dasar', completedOn: '2026-10-11' },
    { title: 'Prinsip Inklusi–Eksklusi', completedOn: '2026-10-16' },
    { title: 'Induksi Matematika', completedOn: '2026-10-21' },
    { title: 'Teori Bilangan Dasar', completedOn: '2026-10-26' },
    {
      title: 'Relasi, Fungsi, dan Relasi Rekurens',
      note: 'Relasi rekurens dapat digunakan untuk mendefinisikan barisan berdasarkan nilai sebelumnya.',
      summary: {
        points: [
          { lead: 'Relasi', text: 'adalah hubungan antara anggota dua himpunan yang dinyatakan sebagai pasangan berurutan.' },
          { lead: 'Fungsi', text: 'merupakan relasi khusus yang memasangkan setiap anggota domain dengan tepat satu anggota kodomain.' },
          { text: 'Sifat relasi meliputi refleksif, simetris, antisimetris, dan transitif.' },
        ],
        example: {
          label: 'CONTOH RELASI REKURENS',
          formula: 'aₙ = aₙ₋₁ + 2, a₁ = 1',
          caption: 'Menghasilkan barisan: 1, 3, 5, 7, ...',
        },
      },
      attachments: [{ name: 'Modul Relasi dan Fungsi.pdf', description: 'Dokumen materi' }],
    },
    { title: 'Teori Graf Dasar' },
    { title: 'Pohon & Aplikasinya' },
    { title: 'Aljabar Boolean' },
  ] as SeedMaterial[],
};

async function main() {
  const email = process.argv[2]?.trim().toLowerCase();
  if (!email) throw new Error('Pemakaian: npm run seed -- <email akun>');

  const user = await pool.query<{ id: string }>('select id from users where lower(email) = $1', [email]);
  if (!user.rowCount) throw new Error(`Akun ${email} tidak ditemukan. Daftar dulu lewat aplikasi.`);
  const userId = user.rows[0].id;

  const exists = await pool.query('select 1 from courses where user_id = $1 and name = $2', [userId, COURSE.name]);
  if (exists.rowCount) {
    console.log(`"${COURSE.name}" sudah ada untuk ${email}, dilewati.`);
    return;
  }

  await withTx(async (c) => {
    const course = await c.query<{ id: string }>(
      'insert into courses (user_id, name, exam_date, hours_per_day) values ($1, $2, $3, $4) returning id',
      [userId, COURSE.name, COURSE.examDate, COURSE.hoursPerDay]);
    const courseId = course.rows[0].id;

    for (const [position, m] of COURSE.materials.entries()) {
      const mat = await c.query<{ id: string }>(
        `insert into course_materials (course_id, position, title, completed_on, note, summary)
         values ($1, $2, $3, $4, $5, $6) returning id`,
        [courseId, position, m.title, m.completedOn ?? null, m.note ?? '', m.summary ? JSON.stringify(m.summary) : null]);
      for (const a of m.attachments ?? []) {
        await c.query('insert into material_attachments (material_id, name, description) values ($1, $2, $3)',
          [mat.rows[0].id, a.name, a.description]);
      }
    }
  });
  console.log(`✓ "${COURSE.name}" (${COURSE.materials.length} materi) ditambahkan untuk ${email}`);
}

main()
  .catch((err) => { console.error(err.message ?? err); process.exitCode = 1; })
  .finally(() => pool.end());
