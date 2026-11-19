/**
 * Validasi masukan form menggunakan Regular Expression (RegExp).
 *
 * Sintaks: /pola/flags
 *  ^ $       awal / akhir string (seluruh teks harus cocok)
 *  [a-z]     kelas karakter;  \d = digit;  \s = spasi;  \p{L} = huruf Unicode (flag u)
 *  + * ? {n,m}  quantifier (jumlah pengulangan)
 *  (?=...)   lookahead: "harus ada ...", tanpa memakan karakter
 *  RegExp.test(str) -> true / false
 */

// Email: local-part @ domain . TLD (min. 2 huruf). Contoh: student@university.ac.id
export const EMAIL_REGEX =
  /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;

// Nama: diawali huruf, boleh huruf (termasuk aksara Unicode), spasi, ' . -, panjang 2-100.
export const NAME_REGEX = /^\p{L}[\p{L}\s'.-]{1,99}$/u;

// Password: 8-72 karakter, tanpa spasi, memuat huruf kecil, huruf besar, dan angka.
// Setiap (?=...) adalah satu syarat yang harus terpenuhi.
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)\S{8,72}$/;

export const isValidEmail = (v: string) => EMAIL_REGEX.test(v.trim());
export const isValidName = (v: string) => NAME_REGEX.test(v.trim());
export const isValidPassword = (v: string) => PASSWORD_REGEX.test(v);

/** Pesan error spesifik untuk password (mengembalikan undefined jika valid). */
export const passwordError = (v: string): string | undefined => {
  if (!v) return 'Kata sandi wajib diisi.';
  if (/\s/.test(v)) return 'Kata sandi tidak boleh mengandung spasi.';
  if (v.length < 8) return 'Gunakan minimal 8 karakter.';
  if (v.length > 72) return 'Maksimal 72 karakter.';
  if (!/[a-z]/.test(v)) return 'Tambahkan minimal satu huruf kecil.';
  if (!/[A-Z]/.test(v)) return 'Tambahkan minimal satu huruf besar.';
  if (!/\d/.test(v)) return 'Tambahkan minimal satu angka.';
  return undefined;
};
