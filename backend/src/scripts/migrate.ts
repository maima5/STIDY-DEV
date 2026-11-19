// Jalankan file SQL di folder /migrations secara berurutan (berdasarkan nama file).
// File yang sudah dijalankan dicatat di tabel schema_migrations sehingga tidak diulang.
// Pemakaian: npm run migrate
import fs from 'fs';
import path from 'path';
import { pool } from '../db';

const DIR = path.resolve(__dirname, '../../migrations');

async function main() {
  await pool.query(`create table if not exists schema_migrations (
    name       text primary key,
    applied_at timestamptz not null default now()
  )`);
  await pool.query('alter table schema_migrations enable row level security');

  const done = new Set((await pool.query<{ name: string }>('select name from schema_migrations')).rows.map((r) => r.name));
  const files = fs.readdirSync(DIR).filter((f) => f.endsWith('.sql')).sort();

  for (const file of files) {
    if (done.has(file)) {
      console.log(`- ${file} (sudah dijalankan)`);
      continue;
    }
    const sql = fs.readFileSync(path.join(DIR, file), 'utf8');
    const c = await pool.connect();
    try {
      await c.query('BEGIN');
      await c.query(sql);
      await c.query('insert into schema_migrations (name) values ($1)', [file]);
      await c.query('COMMIT');
      console.log(`✓ ${file}`);
    } catch (err) {
      await c.query('ROLLBACK');
      throw new Error(`Migrasi ${file} gagal: ${(err as Error).message}`);
    } finally {
      c.release();
    }
  }
  console.log('Migrasi selesai.');
}

main()
  .catch((err) => { console.error(err.message ?? err); process.exitCode = 1; })
  .finally(() => pool.end());
