/** Data ujian / agenda yang ditampilkan di halaman Hitung Mundur */
export interface Exam {
  id: string;
  /** Nama mata pelajaran */
  subject: string;
  /** Tanggal & waktu ujian (ISO string) */
  date: string;
  /** Jam mulai, e.g. "10.00" */
  time: string;
  /** Ruangan ujian */
  room?: string;
  /** Catatan tambahan */
  notes?: string;
}

