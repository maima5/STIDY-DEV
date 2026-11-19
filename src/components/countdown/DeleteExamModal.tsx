import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors, Radius } from '@/constants/auth-theme';

type Props = {
  visible: boolean;
  subjectName: string;
  onClose: () => void;
  onConfirm: () => void;
};

/**
 * Dialog konfirmasi hapus ujian.
 */
export default function DeleteExamModal({ visible, subjectName, onClose, onConfirm }: Props) {
  return (
    <Modal transparent visible={visible} animationType="fade" statusBarTranslucent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Icon */}
          <View style={styles.iconCircle}>
            <Feather name="trash-2" size={26} color={Colors.error} />
          </View>

          <Text style={styles.eyebrow}>KONFIRMASI TINDAKAN</Text>
          <Text style={styles.title}>Hapus jadwal ujian?</Text>
          <Text style={styles.desc}>
            Jadwal <Text style={{ fontWeight: '700' }}>{subjectName}</Text> akan dihapus dari daftar ujian dan tidak
            dapat dikembalikan.
          </Text>

          <View style={styles.row}>
            <Pressable style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelText}>Batal</Text>
            </Pressable>
            <Pressable style={styles.deleteBtn} onPress={onConfirm}>
              <Feather name="trash-2" size={16} color="#fff" />
              <Text style={styles.deleteText}>Ya, Hapus</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: Radius.card,
    padding: 28,
    alignItems: 'center',
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.errorBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  eyebrow: {
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: Colors.error,
    marginBottom: 6,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 8,
  },
  desc: {
    fontSize: 13,
    color: Colors.muted,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  cancelBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: Radius.button,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cancelText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },
  deleteBtn: {
    flex: 1.3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: Radius.button,
    backgroundColor: Colors.error,
  },
  deleteText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
});

