import { Platform } from 'react-native';

// Only import SecureStore on native — it doesn't work on web
const SecureStore =
  Platform.OS !== 'web'
    ? require('expo-secure-store')
    : null;

// Android emulator uses 10.0.2.2 to reach the host machine's localhost.
// iOS simulator and web can use localhost directly.
const BASE_URL =
  Platform.OS === 'android'
    ? 'http://10.0.2.2:4000/api'
    : 'http://localhost:4000/api';

const TOKEN_KEY = 'access_token';

// ── token helpers (SecureStore on native, localStorage on web) ───

export async function getToken(): Promise<string | null> {
  try {
    if (Platform.OS === 'web') {
      return localStorage.getItem(TOKEN_KEY);
    }
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch {
    return null;
  }
}

export async function setToken(token: string): Promise<void> {
  if (Platform.OS === 'web') {
    localStorage.setItem(TOKEN_KEY, token);
    return;
  }
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function removeToken(): Promise<void> {
  if (Platform.OS === 'web') {
    localStorage.removeItem(TOKEN_KEY);
    return;
  }
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}

// ── generic API response shape (matches backend utils/response.ts) ──

export interface ApiOk<T = unknown> {
  success: true;
  message?: string;
  data: T;
}

export interface ApiErr {
  success: false;
  error: { code: string; message: string };
}

export type ApiResponse<T = unknown> = ApiOk<T> | ApiErr;

// ── custom error class for API failures ──────────────────────────

export class ApiError extends Error {
  code: string;
  status: number;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

// ── core fetch wrapper ───────────────────────────────────────────

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  /** If true, skip attaching the Authorization header */
  noAuth?: boolean;
}

/**
 * Wrapper around `fetch` that:
 * 1. Prepends BASE_URL to the path
 * 2. Sets JSON Content-Type
 * 3. Attaches the stored access token (unless `noAuth` is set)
 * 4. Parses the JSON response
 * 5. On 401, attempts a single token refresh then retries the request
 * 6. Throws `ApiError` for non-success responses
 */
export async function api<T = unknown>(
  path: string,
  { body, noAuth, ...init }: RequestOptions = {},
): Promise<ApiOk<T>> {
  const doFetch = async (retry: boolean): Promise<ApiOk<T>> => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(init.headers as Record<string, string>),
    };

    if (!noAuth) {
      const token = await getToken();
      if (token) headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${BASE_URL}${path}`, {
      ...init,
      headers,
      body: body != null ? JSON.stringify(body) : undefined,
    });

    const json: ApiResponse<T> = await res.json();

    if (!json.success) {
      // If we get 401 and haven't retried yet, try refreshing the token
      if (res.status === 401 && !retry && !noAuth) {
        const refreshed = await tryRefresh();
        if (refreshed) return doFetch(true);
      }
      throw new ApiError(res.status, json.error.code, json.error.message);
    }

    return json;
  };

  return doFetch(false);
}

// ── silent token refresh ─────────────────────────────────────────

let refreshPromise: Promise<boolean> | null = null;

async function tryRefresh(): Promise<boolean> {
  // Deduplicate concurrent refresh attempts
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      const res = await fetch(`${BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // sends the refresh_token cookie
      });

      const json: ApiResponse<{ accessToken: string }> = await res.json();
      if (json.success) {
        await setToken(json.data.accessToken);
        return true;
      }
      // Refresh failed → clear stale token
      await removeToken();
      return false;
    } catch {
      await removeToken();
      return false;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}
