import { api, setToken, removeToken, ApiError } from './api';

// ── Types (match backend response shapes) ──────────────────────

interface AuthUser {
  id: string;
  email: string;
  name: string;
}

interface LoginData {
  accessToken: string;
  user: AuthUser;
}

interface RegisterData {
  user: AuthUser;
}

// ── POST /api/auth/login ────────────────────────────────────────

export async function login(email: string, password: string) {
  // Backend expects `identifier` (email or username) — see auth.routes.ts
  const res = await api<LoginData>('/auth/login', {
    method: 'POST',
    body: { identifier: email, password },
    noAuth: true,
  });

  // Persist the access token for future authenticated requests
  await setToken(res.data.accessToken);

  return { ok: true, user: res.data.user, message: res.message };
}

// ── POST /api/auth/register ─────────────────────────────────────

export async function register(email: string, name: string, password: string) {
  const res = await api<RegisterData>('/auth/register', {
    method: 'POST',
    body: { email, name, password },
    noAuth: true,
  });

  return { ok: true, user: res.data.user, message: res.message };
}

// ── POST /api/auth/logout ───────────────────────────────────────

export async function logout() {
  try {
    await api('/auth/logout', { method: 'POST' });
  } catch {
    // Even if the server call fails, clear local state
  }
  await removeToken();
  return { ok: true };
}

// ── Password reset (placeholder — backend endpoint not yet built) ──

export async function requestPasswordReset(_email: string) {
  // TODO: backend belum punya endpoint POST /api/auth/forgot-password
  // Untuk sementara, tampilkan pesan sukses agar alur UI tetap berjalan
  await new Promise((r) => setTimeout(r, 500));
  return { ok: true };
}

// Re-export ApiError so screens can catch and inspect it
export { ApiError };