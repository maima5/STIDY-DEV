import { Pool, PoolClient, QueryResultRow } from 'pg';
import { env } from './config/env';

export const pool = new Pool({
  connectionString: env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // Supabase pooler memakai SSL
  max: 10,
});

export const query = <T extends QueryResultRow = any>(text: string, params?: unknown[]) =>
  pool.query<T>(text, params);

export async function withTx<T>(fn: (c: PoolClient) => Promise<T>): Promise<T> {
  const c = await pool.connect();
  try {
    await c.query('BEGIN');
    const result = await fn(c);
    await c.query('COMMIT');
    return result;
  } catch (err) {
    await c.query('ROLLBACK');
    throw err;
  } finally {
    c.release();
  }
}
