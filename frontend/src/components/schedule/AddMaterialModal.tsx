import { useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Colors, Radius } from '@/constants/auth-theme';
import GradientButton from '@/components/ui/GradientButton';

type Props = { visible: boolean; onClose: () => void; onSubmit: (title: string) => void };

export default function AddMaterialModal({ visible, onClose, onSubmit }: Props) {
  const [title, setTitle] = useState('');

  const close = () => { setTitle(''); onClose(); };
  const submit = () => {
    const value = title.trim();
    if (!value) return;
    onSubmit(value);
    close();
  };

  return (
    <Modal transparent visible={visible} animationType="fade" statusBarTranslucent onRequestClose={close}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Pressable style={styles.backdrop} onPress={close}>
          <Pressable style={styles.card}>
            <Text style={styles.title}>Tambah Materi</Text>
            <Text style={styles.sub}>Materi baru akan ditambahkan di urutan terakhir.</Text>
            <TextInput
              autoFocus value={title} onChangeText={setTitle} onSubmitEditing={submit}
              placeholder="Masukkan materi..." placeholderTextColor={Colors.placeholder}
              returnKeyType="done" style={styles.input}
            />
            <View style={styles.actions}>
              <GradientButton label="Batal" variant="outline" height={48} onPress={close} style={{ flex: 1 }} />
              <GradientButton label="Tambah" iconLeft="plus" height={48} onPress={submit} style={{ flex: 1 }} />
            </View>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'center', padding: 24 },
  card: { backgroundColor: '#fff', borderRadius: 24, padding: 20, width: '100%', maxWidth: 400, alignSelf: 'center' },
  title: { fontSize: 17, fontWeight: '800', color: Colors.text },
  sub: { fontSize: 11.5, color: Colors.muted, marginTop: 4, marginBottom: 16 },
  input: {
    height: 52, paddingHorizontal: 16, fontSize: 14, color: Colors.text,
    backgroundColor: Colors.inputBg, borderRadius: Radius.input, borderWidth: 1, borderColor: Colors.border,
  },
  actions: { flexDirection: 'row', gap: 10, marginTop: 16 },
});
