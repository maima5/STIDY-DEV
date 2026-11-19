import { useEffect, useState } from 'react';
import { Alert, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors, Radius } from '@/constants/auth-theme';
import { Exam } from '@/types/countdown';

type Props = {
  visible: boolean;
  /** Jika ada, mode Edit; jika undefined, mode Tambah */
  exam?: Exam;
  onClose: () => void;
  onSave: (data: Omit<Exam, 'id'>) => void;
};

/**
 * Modal bottom-sheet untuk Tambah / Edit Ujian.
 */
export default function ExamFormModal({ visible, exam, onClose, onSave }: Props) {
  const isEdit = !!exam;

  const [subject, setSubject] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [room, setRoom] = useState('');
  const [notes, setNotes] = useState('');

  // ✅ FIX: Sinkronisasi state setiap kali exam / visible berubah
  useEffect(() => {
    if (visible) {
      setSubject(exam?.subject ?? '');
      setDate(exam?.date ? exam.date.slice(0, 10) : '');
      setTime(exam?.time ?? '');
      setRoom(exam?.room ?? '');
      setNotes(exam?.notes ?? '');
    }
  }, [visible, exam]);

  const handleSave = () => {
    if (!subject.trim()) {
      Alert.alert('Data belum lengkap', 'Nama mata pelajaran wajib diisi.');
      return;
    }
    if (!isEdit && !date.trim()) {
      Alert.alert('Data belum lengkap', 'Tanggal ujian wajib diisi.');
      return;
    }

    // ✅ FIX: Bangun ISO date yang valid
    const timeStr = time.trim() || '08.00';
    const [hh, mm] = timeStr.replace('.', ':').split(':');
    const hours = String(hh || '08').padStart(2, '0');
    const mins = String(mm || '00').padStart(2, '0');

    let isoDate: string;
    if (isEdit) {
      // Mode edit: pakai tanggal lama tapi update waktu
      const baseDateStr = exam!.date.slice(0, 10);
      isoDate = `${baseDateStr}T${hours}:${mins}:00+07:00`;
    } else {
      // Mode tambah: format tanggal dari input
      // Dukung format DD/MM/YYYY, DD-MM-YYYY, atau YYYY-MM-DD
      let dateParsed = date.trim();
      if (dateParsed.includes('/')) {
        const parts = dateParsed.split('/');
        if (parts.length === 3) {
          dateParsed = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
        }
      } else if (dateParsed.match(/^\d{2}-\d{2}-\d{4}$/)) {
        const parts = dateParsed.split('-');
        dateParsed = `${parts[2]}-${parts[1]}-${parts[0]}`;
      }
      isoDate = `${dateParsed}T${hours}:${mins}:00+07:00`;
    }

    // Validasi apakah tanggal valid
    const testDate = new Date(isoDate);
    if (isNaN(testDate.getTime())) {
      Alert.alert('Format tanggal salah', 'Gunakan format YYYY-MM-DD, DD/MM/YYYY, atau DD-MM-YYYY.');
      return;
    }

    onSave({
      subject: subject.trim(),
      date: isoDate,
      time: `${hours}.${mins}`,
      room: room.trim() || undefined,
      notes: notes.trim() || undefined,
    });
  };

  return (
    <Modal transparent visible={visible} animationType="slide" statusBarTranslucent onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose} />

      <ScrollView
        style={styles.sheetScroll}
        contentContainerStyle={styles.sheet}
        keyboardShouldPersistTaps="handled"
        bounces={false}
      >
        {/* Ikon kalender */}
        <View style={styles.iconCircle}>
          <Feather name="calendar" size={24} color="#fff" />
        </View>

        <Text style={styles.title}>{isEdit ? 'Edit Ujian' : 'Tambah Ujian'}</Text>
        <Text style={styles.desc}>
          {isEdit ? 'Perbarui informasi jadwal ujianmu.' : 'Tambahkan agenda ujian baru.'}
        </Text>

        {/* Form fields */}
        <Text style={styles.label}>Mata pelajaran</Text>
        <TextInput
          style={styles.input}
          placeholder="Contoh: Bahasa Indonesia"
          placeholderTextColor={Colors.placeholder}
          value={subject}
          onChangeText={setSubject}
        />

        {!isEdit && (
          <>
            <Text style={styles.label}>Tanggal ujian</Text>
            <TextInput
              style={styles.input}
              placeholder="YYYY-MM-DD atau DD/MM/YYYY"
              placeholderTextColor={Colors.placeholder}
              value={date}
              onChangeText={setDate}
            />
          </>
        )}

        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Waktu</Text>
            <TextInput
              style={styles.input}
              placeholder="10.00"
              placeholderTextColor={Colors.placeholder}
              value={time}
              onChangeText={setTime}
            />
          </View>
          <View style={{ width: 14 }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Ruangan</Text>
            <TextInput
              style={styles.input}
              placeholder="Ruang B-204"
              placeholderTextColor={Colors.placeholder}
              value={room}
              onChangeText={setRoom}
            />
          </View>
        </View>

        <Text style={styles.label}>
          Catatan <Text style={{ fontWeight: '400', color: Colors.placeholder }}>Opsional</Text>
        </Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Contoh: Bawa kartu ujian dan kalkulator..."
          placeholderTextColor={Colors.placeholder}
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />

        {/* Actions */}
        <Pressable style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>{isEdit ? 'Simpan Perubahan' : 'Tambahkan Ujian'}</Text>
          <Feather name="check" size={18} color="#fff" />
        </Pressable>

        <Pressable style={styles.cancelBtn} onPress={onClose}>
          <Text style={styles.cancelText}>Batal</Text>
        </Pressable>
      </ScrollView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  sheetScroll: {
    maxHeight: '85%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  sheet: {
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 32,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 14,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.text,
    textAlign: 'center',
  },
  desc: {
    fontSize: 13,
    color: Colors.muted,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 22,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: Colors.inputBg,
    borderRadius: Radius.input,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: Colors.text,
  },
  textArea: {
    minHeight: 80,
  },
  row: {
    flexDirection: 'row',
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    borderRadius: Radius.button,
    paddingVertical: 16,
    marginTop: 24,
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  cancelBtn: {
    alignItems: 'center',
    paddingVertical: 14,
    marginTop: 4,
  },
  cancelText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.muted,
  },
});
