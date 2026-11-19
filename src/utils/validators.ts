export const isValidEmail = (v: string) => /^\S+@\S+\.\S+$/.test(v.trim());
export const isValidPassword = (v: string) => v.length >= 8;

/**
 * Validates full name input.
 * Returns error string if invalid, or null if valid.
 */
export function validateFullName(name: string): string | null {
  if (!name || name.trim().length === 0) {
    return 'Full Name tidak boleh kosong.';
  }
  if (name.trim().length < 2) {
    return 'Nama minimal 2 karakter.';
  }
  return null;
}

/**
 * Validates email input.
 */
export function validateEmail(email: string): string | null {
  if (!email || email.trim().length === 0) {
    return 'Alamat email tidak boleh kosong.';
  }
  if (!isValidEmail(email)) {
    return 'Format alamat email tidak valid.';
  }
  return null;
}

/**
 * Validates new password.
 * Returns exact error message from design: "Kata sandi baru harus terdiri dari minimal 8 karakter."
 */
export function validateNewPassword(password: string): string | null {
  if (!password || password.length === 0) {
    return 'Kata sandi baru harus terdiri dari minimal 8 karakter.';
  }
  if (password.length < 8) {
    return 'Kata sandi baru harus terdiri dari minimal 8 karakter.';
  }
  return null;
}

/**
 * Validates confirmation password against new password.
 */
export function validateConfirmPassword(
  newPassword: string,
  confirmPassword: string
): string | null {
  if (!confirmPassword || confirmPassword.length === 0) {
    return 'Konfirmasi kata sandi tidak boleh kosong.';
  }
  if (newPassword !== confirmPassword) {
    return 'Konfirmasi kata sandi tidak cocok dengan kata sandi baru.';
  }
  return null;
}

/**
 * Validates current password input.
 */
export function validateCurrentPassword(currentPassword: string): string | null {
  if (!currentPassword || currentPassword.length === 0) {
    return 'Kata sandi saat ini harus diisi.';
  }
  return null;
}
