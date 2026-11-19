import { Alert, Platform } from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Exam } from '@/types/countdown';
import { formatTimeLeft } from '@/utils/time';

/**
 * Generate HTML tabel jadwal ujian untuk dicetak jadi PDF.
 */
function buildHtml(exams: Exam[]): string {
  const rows = exams
    .map((e, i) => {
      const deadline = new Date(e.date);
      const isValid = !isNaN(deadline.getTime());
      const dateStr = isValid
        ? deadline.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
        : '-';
      const sisaWaktu = formatTimeLeft(e.date);

      return `
        <tr>
          <td style="text-align:center">${i + 1}</td>
          <td>${e.subject}</td>
          <td>${dateStr}</td>
          <td>${e.time || '-'}</td>
          <td>${e.room || '-'}</td>
          <td>${sisaWaktu}</td>
          <td>${e.notes || '-'}</td>
        </tr>`;
    })
    .join('');

  const now = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Arial, sans-serif; padding: 32px; color: #1E2A3A; }
        .header { text-align: center; margin-bottom: 24px; }
        .header h1 { font-size: 22px; color: #0F7A62; margin-bottom: 4px; }
        .header p { font-size: 12px; color: #6B7280; }
        .brand { display: inline-flex; align-items: center; gap: 8px; margin-bottom: 12px; }
        .brand .logo { width: 28px; height: 28px; background: #2FAE8F; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 800; font-size: 14px; }
        .brand span { font-size: 18px; font-weight: 800; }
        table { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 12px; }
        th { background-color: #0F7A62; color: #fff; padding: 10px 8px; text-align: left; font-weight: 700; }
        td { padding: 10px 8px; border-bottom: 1px solid #E3E8EC; }
        tr:nth-child(even) { background-color: #F7F9FA; }
        .footer { margin-top: 24px; text-align: center; font-size: 10px; color: #9CA3AF; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="brand">
          <div class="logo">S</div>
          <span>S-Tidy</span>
        </div>
        <h1>Jadwal Ujian</h1>
        <p>Diunduh pada ${now}</p>
      </div>

      <table>
        <thead>
          <tr>
            <th style="width:30px">No</th>
            <th>Mata Pelajaran</th>
            <th>Tanggal</th>
            <th>Waktu</th>
            <th>Ruangan</th>
            <th>Sisa Waktu</th>
            <th>Catatan</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>

      <div class="footer">
        <p>Dokumen ini dibuat otomatis oleh aplikasi S-Tidy.</p>
      </div>
    </body>
    </html>
  `;
}

/**
 * Generate PDF dari daftar ujian dan langsung share/download.
 */
export async function downloadExamPdf(exams: Exam[]): Promise<void> {
  if (exams.length === 0) {
    Alert.alert('Tidak ada data', 'Belum ada jadwal ujian untuk diunduh.');
    return;
  }

  try {
    const html = buildHtml(exams);

    // Generate PDF
    const { uri } = await Print.printToFileAsync({
      html,
      base64: false,
    });

    // Cek apakah sharing tersedia
    const isAvailable = await Sharing.isAvailableAsync();

    if (isAvailable) {
      await Sharing.shareAsync(uri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Unduh Jadwal Ujian',
        UTI: 'com.adobe.pdf',
      });
      Alert.alert('Berhasil! ✅', 'Jadwal ujian telah berhasil diunduh sebagai PDF.');
    } else {
      // Fallback jika sharing tidak tersedia (web)
      Alert.alert('Berhasil! ✅', `PDF tersimpan di:\n${uri}`);
    }
  } catch (error) {
    console.error('PDF export error:', error);
    Alert.alert('Gagal mengunduh', 'Terjadi kesalahan saat membuat PDF. Silakan coba lagi.');
  }
}

