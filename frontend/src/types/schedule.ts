export type MaterialLevel = 'Dasar' | 'Menengah' | 'Lanjut';

export interface Attachment {
  id: string;
  name: string;
  description: string;
}

export interface MaterialSummary {
  /** Paragraf ringkasan; `lead` ditampilkan tebal di awal kalimat. */
  points: { lead?: string; text: string }[];
  example?: { label: string; formula: string; caption?: string };
}

export interface Material {
  id: string;
  title: string;
  estimateMinutes: number;
  level: MaterialLevel;
  done: boolean;
  /** Tanggal selesai, format YYYY-MM-DD */
  completedAt?: string;
  summary?: MaterialSummary;
  note: string;
  attachments: Attachment[];
}

export interface Course {
  id: string;
  name: string;
  /** Tanggal ujian, format YYYY-MM-DD */
  examDate: string;
  hoursPerDay: number;
  materials: Material[];
}

/** Payload form tambah/edit mata kuliah. Materi tanpa `id` dianggap materi baru. */
export interface CourseInput {
  name: string;
  examDate: string;
  hoursPerDay: number;
  materials: { id?: string; title: string }[];
}

export type MaterialFilter = 'all' | 'done' | 'todo';
