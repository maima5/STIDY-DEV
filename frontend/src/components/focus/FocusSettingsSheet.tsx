import { useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Eyebrow } from '@/components/schedule/ScheduleBits';
import { Colors, Radius } from '@/constants/auth-theme';
import { FocusSettings } from '@/types/focus';

type Props = {
  visible: boolean;
  settings: FocusSettings;
  onSave: (settings: FocusSettings) => void;
  onClose: () => void;
};

const FIELDS = [
  { key: 'focusMinutes', label: 'Fokus', min: 1, max: 180, unit: 'menit' },
  { key: 'breakMinutes', label: 'Istirahat', min: 1, max: 60, unit: 'menit' },
  { key: 'sessions', label: 'Sesi', min: 1, max: 12, unit: 'sesi' },
] as const;

type Draft = Record<(typeof FIELDS)[number]['key'], string>;

const toDraft = (s: FocusSettings): Draft => ({
  focusMinutes: String(s.focusMinutes), breakMinutes: String(s.breakMinutes), sessions: String(s.sessions),
});

/** Isi sheet dipisah agar draft selalu mulai dari pengaturan terbaru setiap kali dibuka. */
function SheetBody({ settings, onSave, onClose }: Omit<Props, 'visible'>) {
  const insets = useSafeAreaInsets();
  const [draft, setDraft] = useState<Draft>(() => toDraft(settings));
  const [error, setError] = useState('');

  const save = () => {
    const next = {} as FocusSettings;
    for (const f of FIELDS) {
      const n = Number(draft[f.key]);
      if (!Number.isInteger(n) || n < f.min || n > f.max) {
        return setError(`${f.label} harus ${f.min}–${f.max} ${f.unit}.`);
      }
      next[f.key] = n;
    }
    onSave(next);
    onClose();
  };

  return (
    <Pressable style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 16) + 8 }]}>
      <View style={styles.grabber} />
      <Eyebrow>SESUAIKAN RITMEMU</Eyebrow>
      <Text style={styles.title}>Pengaturan waktu</Text>
      <Text style={styles.sub}>Atur durasi yang paling nyaman untuk menjaga fokusmu.</Text>

      <View style={styles.fields}>
        {FIELDS.map((f) => (
          <View key={f.key} style={{ flex: 1 }}>
            <Text style={styles.label}>{f.label}</Text>
            <TextInput
              value={draft[f.key]}
              onChangeText={(t) => { setError(''); setDraft((d) => ({ ...d, [f.key]: t.replace(/[^0-9]/g, '') })); }}
              keyboardType="number-pad" maxLength={3} selectTextOnFocus
              style={styles.input}
            />
          </View>
        ))}
      </View>
      {!!error && <Text style={styles.error}>{error}</Text>}

      <Pressable style={({ pressed }) => [styles.save, pressed && { opacity: 0.9 }]} onPress={save}>
        <Text style={styles.saveText}>Simpan pengaturan</Text>
        <Feather name="check" size={18} color="#fff" />
      </Pressable>
      <Pressable style={styles.cancel} onPress={onClose} hitSlop={8}>
        <Text style={styles.cancelText}>Batal</Text>
      </Pressable>
    </Pressable>
  );
}

export default function FocusSettingsSheet({ visible, settings, onSave, onClose }: Props) {
  return (
    <Modal transparent visible={visible} animationType="slide" statusBarTranslucent onRequestClose={onClose}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Pressable style={styles.backdrop} onPress={onClose}>
          {visible && <SheetBody settings={settings} onSave={onSave} onClose={onClose} />}
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(27,61,54,0.45)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: '#fff', borderTopLeftRadius: 28, borderTopRightRadius: 28,
    paddingHorizontal: 20, paddingTop: 12, alignItems: 'center',
  },
  grabber: { width: 40, height: 4, borderRadius: 2, backgroundColor: Colors.border, marginBottom: 22 },
  title: { fontSize: 20, fontWeight: '800', color: Colors.text, marginTop: 12 },
  sub: { fontSize: 12, color: Colors.muted, marginTop: 10, textAlign: 'center' },
  fields: { flexDirection: 'row', gap: 10, alignSelf: 'stretch', marginTop: 20 },
  label: { fontSize: 11.5, fontWeight: '700', color: Colors.text, marginBottom: 8 },
  input: {
    height: 50, paddingHorizontal: 12, fontSize: 14, fontWeight: '700', color: Colors.text,
    backgroundColor: Colors.inputBg, borderRadius: Radius.input, borderWidth: 1, borderColor: Colors.border,
  },
  error: { alignSelf: 'flex-start', fontSize: 11, color: Colors.error, marginTop: 8 },
  save: {
    alignSelf: 'stretch', height: 52, borderRadius: Radius.button, marginTop: 18, backgroundColor: Colors.deep,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
  },
  saveText: { fontSize: 14, fontWeight: '700', color: '#fff' },
  cancel: { paddingVertical: 16 },
  cancelText: { fontSize: 12, fontWeight: '600', color: Colors.muted },
});
