// TODO: ganti dengan API backend (Supabase / REST)

export async function login(email: string, password: string) {
  await new Promise((r) => setTimeout(r, 800));
  return { ok: true };
}

export async function register(email: string, name: string, password: string) {
  await new Promise((r) => setTimeout(r, 800));
  return { ok: true };
}

export async function requestPasswordReset(email: string) {
  await new Promise((r) => setTimeout(r, 800));
  return { ok: true };
}

export async function logout() {
  // TODO: hapus token / signOut Supabase
  return { ok: true };
}