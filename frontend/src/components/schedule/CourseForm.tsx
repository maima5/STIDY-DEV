import { useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import AppHeader from '@/components/dashboard/AppHeader';
import ScreenBackground from '@/components/schedule/ScreenBackground';
import { Eyebrow } from '@/components/schedule/ScheduleBits';
import DateField from '@/components/ui/DateField';
import GradientButton from '@/components/ui/GradientButton';
import Select from '@/components/ui/Select';
import { Colors, Radius } from '@/constants/auth-theme';
import { MOCK_USER } from '@/constants/mock-user';
import { Course, CourseInput } from '@/types/schedule';

type Props = {
  mode: 'add' | 'edit';
  initial?: Course;
  onSubmit: (input: CourseInput) => void;
  onCancel: () => void;
};

type Row = { key: string; id?: string; title: string };

const HOUR_OPTIONS = [1, 2, 3, 4, 5, 6].map((h) => ({ label: `${h} jam`, value: h }));

const COPY = {
  add: { title: 'Tambah Mata Kuliah', hint: 'Tambahkan mata kuliah dan target ujianmu.', submit: 'Tambahkan Mata Kuliah' },
  edit: { title: 'Edit Mata Kuliah', hint: 'Perbarui detail mata kuliah dan target ujianmu.', submit: 'Simpan Perubahan' },
};

export default function CourseForm({ mode, initial, onSubmit, onCancel }: Props) {
  const copy = COPY[mode];
  const keySeq = useRef(0);
  const nextKey = () => `row-${keySeq.current++}`;

  const [name, setName] = useState(initial?.name ?? '');
  const [examDate, setExamDate] = useState(initial?.examDate ?? '');
  const [hoursPerDay, setHoursPerDay] = useState(initial?.hoursPerDay ?? 2);
  const [rows, setRows] = useState<Row[]>(() =>
    initial?.materials.length
      ? initial.materials.map((m) => ({ key: m.id, id: m.id, title: m.title }))
      : [{ key: 'row-init', title: '' }],
  );
  const [errors, setErrors] = useState<{ name?: string; examDate?: string; materials?: string }>({});

  const addRow = () => setRows((prev) => [...prev, { key: nextKey(), title: '' }]);
  const removeRow = (key: string) =>
    setRows((prev) => (prev.length > 1 ? prev.filter((r) => r.key !== key) : [{ ...prev[0], id: undefined, title: '' }]));
  const editRow = (key: string, title: string) =>
    setRows((prev) => prev.map((r) => (r.key === key ? { ...r, title } : r)));

  const submit = () => {
    const materials = rows
      .map((r) => ({ id: r.id, title: r.title.trim() }))
      .filter((r) => r.title);
    const next: typeof errors = {};
    if (!name.trim()) next.name = 'Nama mata kuliah wajib diisi';
    if (!examDate) next.examDate = 'Pilih tanggal ujian';
    if (!materials.length) next.materials = 'Tambahkan minimal satu materi';
    setErrors(next);
    if (Object.keys(next).length) return;
    onSubmit({ name: name.trim(), examDate, hoursPerDay, materials });
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <AppHeader initials={MOCK_USER.initials} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScreenBackground />
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* judul */}
          <View style={styles.head}>
            <Pressable style={styles.back} onPress={onCancel}>
              <Feather name="chevron-left" size={20} color={Colors.text} />
            </Pressable>
            <View style={styles.headText}>
              <Eyebrow>JADWAL BELAJAR</Eyebrow>
              <Text style={styles.pageTitle}>{copy.title}</Text>
            </View>
            <View style={{ width: 40 }} />
          </View>

          <View style={styles.card}>
            {/* informasi utama */}
            <View style={styles.step}>
              <View style={styles.stepNum}><Text style={styles.stepNumText}>01</Text></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.stepTitle}>Informasi utama</Text>
                <Text style={styles.stepHint}>{copy.hint}</Text>
              </View>
            </View>
            <View style={styles.divider} />

            <Text style={styles.label}>Nama Mata Kuliah</Text>
            <TextInput
              value={name} onChangeText={setName}
              placeholder="Contoh: Matematika Diskrit" placeholderTextColor={Colors.placeholder}
              style={[styles.input, !!errors.name && styles.inputError]}
            />
            {!!errors.name && <Text style={styles.error}>{errors.name}</Text>}

            <View style={styles.cols}>
              <View style={{ flex: 1.3 }}>
                <Text style={styles.label}>Tanggal Ujian</Text>
                <DateField value={examDate} onChange={setExamDate} error={!!errors.examDate} />
                {!!errors.examDate && <Text style={styles.error}>{errors.examDate}</Text>}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Belajar per Hari</Text>
                <Select value={hoursPerDay} options={HOUR_OPTIONS} onChange={setHoursPerDay} title="Belajar per Hari" />
              </View>
            </View>

            {/* materi */}
            <View style={styles.materiHead}>
              <View style={{ flex: 1 }}>
                <Eyebrow muted>DAFTAR BELAJAR</Eyebrow>
                <Text style={styles.materiTitle}>Materi Kuliah</Text>
              </View>
              <Pressable style={styles.addBtn} onPress={addRow}>
                <Feather name="plus" size={15} color={Colors.deep} />
                <Text style={styles.addBtnText}>Tambah Materi</Text>
              </Pressable>
            </View>
            <Text style={styles.materiHint}>Susun materi satu per satu agar progres lebih mudah dipantau.</Text>

            {rows.map((row, i) => (
              <View key={row.key} style={styles.row}>
                <MaterialCommunityIcons name="drag-vertical" size={16} color="#C9D1CE" />
                <Text style={styles.rowNum}>{String(i + 1).padStart(2, '0')}</Text>
                <TextInput
                  value={row.title} onChangeText={(t) => editRow(row.key, t)}
                  placeholder="Masukkan materi..." placeholderTextColor={Colors.placeholder}
                  style={[styles.rowInput, !row.title && { fontStyle: 'italic' }]}
                />
                <Pressable onPress={() => removeRow(row.key)} hitSlop={8}>
                  <Feather name="trash-2" size={16} color={Colors.muted} />
                </Pressable>
              </View>
            ))}
            {!!errors.materials && <Text style={[styles.error, { marginTop: 0, marginBottom: 8 }]}>{errors.materials}</Text>}

            <GradientButton label={copy.submit} iconRight="check" onPress={submit} style={{ marginTop: 8 }} />
            <GradientButton label="Batal" variant="outline" height={48} onPress={onCancel} style={{ marginTop: 10 }} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.cream },
  scroll: { paddingHorizontal: 20, paddingTop: 22, paddingBottom: 32 },
  head: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
  back: {
    width: 40, height: 40, borderRadius: 12, backgroundColor: '#fff', borderWidth: 1,
    borderColor: Colors.border, alignItems: 'center', justifyContent: 'center',
  },
  headText: { flex: 1, alignItems: 'center' },
  pageTitle: { fontSize: 19, fontWeight: '800', color: Colors.text, marginTop: 6 },
  card: { backgroundColor: '#fff', borderRadius: 24, padding: 18, borderWidth: 1, borderColor: Colors.border },
  step: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  stepNum: {
    width: 38, height: 38, borderRadius: 12, backgroundColor: Colors.primarySoft,
    alignItems: 'center', justifyContent: 'center',
  },
  stepNumText: { fontSize: 11, fontWeight: '800', color: Colors.deep },
  stepTitle: { fontSize: 15, fontWeight: '800', color: Colors.text },
  stepHint: { fontSize: 10, color: Colors.muted, marginTop: 4 },
  divider: { height: 1, backgroundColor: Colors.border, marginTop: 16, marginBottom: 4 },
  label: { fontSize: 12.5, fontWeight: '700', color: Colors.text, marginTop: 16, marginBottom: 8 },
  input: {
    height: 52, paddingHorizontal: 16, fontSize: 14, color: Colors.text,
    backgroundColor: Colors.inputBg, borderRadius: Radius.input, borderWidth: 1, borderColor: Colors.border,
  },
  inputError: { borderColor: Colors.error, backgroundColor: Colors.errorBg },
  error: { fontSize: 11, color: Colors.error, marginTop: 6 },
  cols: { flexDirection: 'row', gap: 10 },
  materiHead: { flexDirection: 'row', alignItems: 'center', marginTop: 28 },
  materiTitle: { fontSize: 16, fontWeight: '800', color: Colors.text, marginTop: 6 },
  addBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6, height: 36, paddingHorizontal: 12, borderRadius: 12,
    backgroundColor: Colors.primarySoft, borderWidth: 1, borderColor: Colors.mintBorder,
  },
  addBtnText: { fontSize: 11, fontWeight: '700', color: Colors.deep },
  materiHint: { fontSize: 10, color: Colors.muted, marginTop: 8, marginBottom: 12 },
  row: {
    flexDirection: 'row', alignItems: 'center', gap: 10, height: 50, paddingHorizontal: 12, marginBottom: 8,
    borderRadius: 14, borderWidth: 1, borderColor: Colors.border, backgroundColor: '#fff',
  },
  rowNum: { fontSize: 11, fontWeight: '800', color: Colors.deep, width: 22 },
  rowInput: { flex: 1, fontSize: 13, color: Colors.text, height: '100%' },
});
