/** Bagian-bagian sisa waktu untuk countdown */
export interface TimeParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  /** Total detik tersisa (berguna untuk progress ring) */
  totalSeconds: number;
}

/**
 * Hitung selisih antara `deadline` dan sekarang.
 * Semua field menjadi 0 jika deadline sudah lewat.
 */
export function getTimeParts(deadline: Date): TimeParts {
  const now = new Date();
  let diff = Math.max(0, deadline.getTime() - now.getTime());

  const totalSeconds = Math.floor(diff / 1000);

  const days = Math.floor(diff / (24 * 60 * 60 * 1000));
  diff -= days * 24 * 60 * 60 * 1000;

  const hours = Math.floor(diff / (60 * 60 * 1000));
  diff -= hours * 60 * 60 * 1000;

  const minutes = Math.floor(diff / (60 * 1000));
  diff -= minutes * 60 * 1000;

  const seconds = Math.floor(diff / 1000);

  return { days, hours, minutes, seconds, totalSeconds };
}

/** Pad angka jadi 2 digit, e.g. 5 → "05" */
export function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

/**
 * Format sisa waktu menjadi teks badge yang friendly:
 * - >= 1 hari  → "15 hari lagi"
 * - >= 1 jam   → "3 jam lagi"
 * - >= 1 menit → "45 menit lagi"
 * - > 0 detik  → "30 detik lagi"
 * - sudah lewat → "Sudah lewat"
 */
export function formatTimeLeft(dateStr: string): string {
  const deadline = new Date(dateStr);
  if (isNaN(deadline.getTime())) return 'Tanggal belum diatur';

  const diff = deadline.getTime() - Date.now();
  if (diff <= 0) return 'Sudah lewat';

  const days = Math.ceil(diff / (24 * 60 * 60 * 1000));
  if (days >= 1) return `${days} hari lagi`;

  const hours = Math.floor(diff / (60 * 60 * 1000));
  if (hours >= 1) return `${hours} jam lagi`;

  const minutes = Math.floor(diff / (60 * 1000));
  if (minutes >= 1) return `${minutes} menit lagi`;

  const seconds = Math.floor(diff / 1000);
  return `${seconds} detik lagi`;
}
