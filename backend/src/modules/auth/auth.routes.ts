import { Request, Response, Router } from 'express';
import { z } from 'zod';
import { query } from '../../db';
import { env, isProd } from '../../config/env';
import { validate } from '../../middleware/validate';
import { requireAuth } from '../../middleware/auth';
import { AppError } from '../../utils/errors';
import { ok, created } from '../../utils/response';
import {
  DUMMY_HASH, hashPassword, randomToken, sha256, signAccessToken, verifyPassword,
} from '../../utils/security';

const router = Router();

const COOKIE = 'refresh_token';
const cookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: (isProd ? 'none' : 'lax') as 'none' | 'lax',
  path: '/api/auth',
};

// ---------- schemas ----------
const registerSchema = z.object({
  email: z.string().trim().toLowerCase().email('Email tidak valid'),
  name: z.string().trim().min(1, 'Nama wajib diisi').max(100),
  password: z.string().min(8, 'Minimal 8 karakter').max(72, 'Maksimal 72 karakter'),
});
const loginSchema = z.object({
  identifier: z.string().trim().min(1, 'Wajib diisi'), // email
  password: z.string().min(1, 'Wajib diisi'),
});

// ---------- helper: buat session + set cookie refresh token ----------
async function issueSession(req: Request, res: Response, userId: string) {
  const refresh = randomToken();
  await query(
    `insert into auth_sessions (user_id, token_hash, user_agent, ip_address, expires_at)
     values ($1, $2, $3, $4::inet, now() + ($5 || ' days')::interval)`,
    [userId, sha256(refresh), req.headers['user-agent'] ?? null, req.ip ?? null, env.REFRESH_TOKEN_DAYS],
  );
  res.cookie(COOKIE, refresh, { ...cookieOptions, maxAge: env.REFRESH_TOKEN_DAYS * 86_400_000 });
  return signAccessToken(userId);
}

// ---------- POST /register ----------
router.post('/register', validate(registerSchema), async (req, res) => {
  const { email, name, password } = req.body;

  const dup = await query(
    'select email from users where lower(email) = $1', [email]);
  if (dup.rowCount) {
    throw new AppError(409, 'EMAIL_TAKEN', 'Email sudah terdaftar');
  }

  const passwordHash = await hashPassword(password);
  const u = await query(
    'insert into users (email, name, password_hash) values ($1, $2, $3) returning id, email, name, created_at',
    [email, name, passwordHash]);

  created(res, { user: u.rows[0] }, 'Registrasi berhasil.');
});

// ---------- POST /login ----------
router.post('/login', validate(loginSchema), async (req, res) => {
  const identifier = req.body.identifier.toLowerCase();
  const r = await query(
    `select id, email, name, password_hash, status from users
     where lower(email) = $1 limit 1`, [identifier]);
  const user = r.rows[0];

  const valid = await verifyPassword(req.body.password, user ? user.password_hash : DUMMY_HASH);
  if (!user || !valid) throw new AppError(401, 'INVALID_CREDENTIALS', 'Email atau password salah');
  if (user.status !== 'active') {
    throw new AppError(403, 'ACCOUNT_INACTIVE', 'Akun tidak aktif, hubungi admin');
  }

  // Update last_login_at
  await query('update users set last_login_at = now() where id = $1', [user.id]);

  const accessToken = await issueSession(req, res, user.id);
  ok(res, { accessToken, user: { id: user.id, email: user.email, name: user.name } }, 'Login berhasil');
});

// ---------- POST /refresh (rotasi refresh token) ----------
router.post('/refresh', async (req, res) => {
  const token = req.cookies?.[COOKIE];
  if (!token) throw new AppError(401, 'NO_REFRESH_TOKEN', 'Sesi tidak ditemukan, silakan login ulang');

  const r = await query(
    `update auth_sessions set revoked_at = now()
     where token_hash = $1 and revoked_at is null and expires_at > now() returning user_id`,
    [sha256(token)]);
  if (!r.rowCount) {
    res.clearCookie(COOKIE, cookieOptions);
    throw new AppError(401, 'SESSION_EXPIRED', 'Sesi berakhir, silakan login ulang');
  }

  const accessToken = await issueSession(req, res, r.rows[0].user_id);
  ok(res, { accessToken });
});

// ---------- POST /logout ----------
router.post('/logout', async (req, res) => {
  const token = req.cookies?.[COOKIE];
  if (token) await query('update auth_sessions set revoked_at = now() where token_hash = $1 and revoked_at is null', [sha256(token)]);
  res.clearCookie(COOKIE, cookieOptions);
  ok(res, null, 'Logout berhasil');
});

// ---------- GET /me ----------
router.get('/me', requireAuth, async (req, res) => {
  const r = await query(
    'select id, email, name, role, status, created_at from users where id = $1', [req.user!.id]);
  if (!r.rowCount) throw new AppError(404, 'USER_NOT_FOUND', 'User tidak ditemukan');
  ok(res, r.rows[0]);
});

export default router;
