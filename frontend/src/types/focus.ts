export type FocusPhase = 'focus' | 'break';

export interface FocusSettings {
  focusMinutes: number;
  breakMinutes: number;
  /** Target jumlah sesi fokus */
  sessions: number;
}

/** Jenis dialog "Waktu Habis!" yang perlu ditampilkan saat hitung mundur selesai. */
export type FocusFinish = 'focus-end' | 'break-end' | 'all-done';
