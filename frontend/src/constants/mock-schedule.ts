import { Course, Material } from '@/types/schedule';

// TODO: ganti dengan data dari backend (modul materials) saat API tersedia
const m = (id: string, title: string, completedAt?: string, extra: Partial<Material> = {}): Material => ({
  id,
  title,
  estimateMinutes: 45,
  level: 'Menengah',
  done: !!completedAt,
  completedAt,
  note: '',
  attachments: [],
  ...extra,
});

export const MOCK_COURSES: Course[] = [
  {
    id: 'matdis',
    name: 'Matematika Diskrit',
    examDate: '2026-12-10',
    hoursPerDay: 2,
    materials: [
      m('m1', 'Logika Proposisi & Predikat', '2026-10-03'),
      m('m2', 'Himpunan & Operasi', '2026-10-08'),
      m('m3', 'Kombinatorika Dasar', '2026-10-11'),
      m('m4', 'Prinsip Inklusi–Eksklusi', '2026-10-16'),
      m('m5', 'Induksi Matematika', '2026-10-21'),
      m('m6', 'Teori Bilangan Dasar', '2026-10-26'),
      m('m7', 'Relasi, Fungsi, dan Relasi Rekurens', undefined, {
        summary: {
          points: [
            { lead: 'Relasi', text: 'adalah hubungan antara anggota dua himpunan yang dinyatakan sebagai pasangan berurutan.' },
            { lead: 'Fungsi', text: 'merupakan relasi khusus yang memasangkan setiap anggota domain dengan tepat satu anggota kodomain.' },
            { text: 'Sifat relasi meliputi refleksif, simetris, antisimetris, dan transitif.' },
          ],
          example: {
            label: 'CONTOH RELASI REKURENS',
            formula: 'aₙ = aₙ₋₁ + 2, a₁ = 1',
            caption: 'Menghasilkan barisan: 1, 3, 5, 7, ...',
          },
        },
        note: 'Relasi rekurens dapat digunakan untuk mendefinisikan barisan berdasarkan nilai sebelumnya.',
        attachments: [{ id: 'a1', name: 'Modul Relasi dan Fungsi.pdf', description: 'Dokumen materi' }],
      }),
      m('m8', 'Teori Graf Dasar'),
      m('m9', 'Pohon & Aplikasinya'),
      m('m10', 'Aljabar Boolean'),
    ],
  },
];
