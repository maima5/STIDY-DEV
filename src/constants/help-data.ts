import { FaqItem, SupportInfo } from '@/types/help';

export const INITIAL_FAQS: FaqItem[] = [
  {
    id: 'faq_01',
    number: '01',
    question: 'Bagaimana cara mengatur jadwal belajar?',
    answer:
      'Buka menu Jadwal dari navigasi utama, pilih tanggal yang diinginkan, lalu tekan tombol tambah untuk membuat sesi belajar baru.',
  },
  {
    id: 'faq_02',
    number: '02',
    question: 'Mengapa notifikasi pengingat tidak muncul?',
    answer:
      'Pastikan notifikasi S-Tidy sudah aktif di Pengaturan Akun dan izin notifikasi pada perangkatmu tidak dinonaktifkan.',
  },
  {
    id: 'faq_03',
    number: '03',
    question: 'Bagaimana cara menyinkronkan data akun?',
    answer:
      'Masuk menggunakan akun yang sama di perangkat lain. Progres dan jadwal belajarmu akan disinkronkan secara otomatis.',
  },
];

export const SUPPORT_INFO: SupportInfo = {
  email: 'support@stidy.id',
  hours: 'Senin–Jumat, 08.00–17.00 WIB',
  responseEstimate: 'Tim kami biasanya merespons dalam 1×24 jam.',
};

