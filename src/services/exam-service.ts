import { Exam } from '@/types/countdown';

/**
 * Data mock daftar ujian.
 * TODO: ganti dengan fetch ke backend.
 */
const MOCK_EXAMS: Exam[] = [
  {
    id: '1',
    subject: 'Bahasa Indonesia',
    date: '2026-11-28T10:00:00+07:00',
    time: '10.00',
    room: 'Ruang B-204',
    notes: 'Bawa kamus dan kartu ujian.',
  },
  {
    id: '2',
    subject: 'Matematika Diskrit',
    date: '2026-12-10T08:30:00+07:00',
    time: '08.30',
    room: 'Ruang A-101',
  },
  {
    id: '3',
    subject: 'Kimia Dasar',
    date: '2026-12-18T13:00:00+07:00',
    time: '13.00',
    room: 'Lab Kimia',
  },
  {
    id: '4',
    subject: 'Sistem Informasi',
    date: '2027-01-08T09:00:00+07:00',
    time: '09.00',
    room: 'Ruang C-302',
  },
];

/** Ambil semua ujian, diurutkan berdasarkan tanggal terdekat */
export async function getExams(): Promise<Exam[]> {
  // simulasi delay network
  return new Promise((resolve) =>
    setTimeout(() => resolve([...MOCK_EXAMS].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())), 300),
  );
}

/** Ambil ujian berdasarkan ID */
export async function getExamById(id: string): Promise<Exam | undefined> {
  return new Promise((resolve) =>
    setTimeout(() => resolve(MOCK_EXAMS.find((e) => e.id === id)), 200),
  );
}

/** Ambil ujian terdekat (deadline paling cepat setelah sekarang) */
export async function getNextExam(): Promise<Exam | undefined> {
  const now = Date.now();
  const upcoming = MOCK_EXAMS
    .filter((e) => new Date(e.date).getTime() > now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  return new Promise((resolve) => setTimeout(() => resolve(upcoming[0]), 200));
}

