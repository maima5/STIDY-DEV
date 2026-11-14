export const MONTHS_LONG = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];
export const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

const pad = (n: number) => String(n).padStart(2, '0');

/** Date -> "YYYY-MM-DD" (zona waktu lokal) */
export const toISODate = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

/** "YYYY-MM-DD" -> Date pada tengah malam lokal */
export function parseISODate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

/** "10 Desember 2026" */
export function formatDateLong(iso: string) {
  const d = parseISODate(iso);
  return `${d.getDate()} ${MONTHS_LONG[d.getMonth()]} ${d.getFullYear()}`;
}

/** "10 Des 2026" */
export function formatDateShort(iso: string) {
  const d = parseISODate(iso);
  return `${d.getDate()} ${MONTHS_SHORT[d.getMonth()]} ${d.getFullYear()}`;
}

/** "3 Okt" */
export function formatDayMonth(iso: string) {
  const d = parseISODate(iso);
  return `${d.getDate()} ${MONTHS_SHORT[d.getMonth()]}`;
}

/** Selisih hari dari hari ini ke tanggal tujuan (minimal 0). */
export function daysUntil(iso: string) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.max(0, Math.round((parseISODate(iso).getTime() - today.getTime()) / 86_400_000));
}
