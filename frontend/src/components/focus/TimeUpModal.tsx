import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import GradientButton from '@/components/ui/GradientButton';
import { Eyebrow } from '@/components/schedule/ScheduleBits';
import { Colors } from '@/constants/auth-theme';
import { FocusFinish } from '@/types/focus';

type Props = {
  /** null = modal tertutup */
  finish: FocusFinish | null;
  /** Nomor sesi yang dimulai setelah istirahat */
  nextSession: number;
  onContinue: () => void;
  onLater: () => void;
};

export default function TimeUpModal({ finish, nextSession, onContinue, onLater }: Props) {
  const copy = {
    'focus-end': {
      eyebrow: 'SESI SELESAI', title: 'Waktu Habis!',
      message: 'Kerja bagus! Ambil waktu sejenak untuk beristirahat.',
      action: 'Mulai Istirahat', icon: 'play' as const,
    },
    'break-end': {
      eyebrow: 'ISTIRAHAT SELESAI', title: 'Waktu Habis!',
      message: `Kamu sudah siap untuk melanjutkan ke sesi ${nextSession}.`,
      action: `Mulai Sesi ${nextSession}`, icon: 'play' as const,
    },
    'all-done': {
      eyebrow: 'TARGET TERCAPAI', title: 'Semua Sesi Selesai!',
      message: 'Luar biasa! Kamu menuntaskan seluruh target sesi fokus hari ini.',
      action: 'Selesai', icon: 'check' as const,
    },
  }[finish ?? 'focus-end'];

  return (
    <Modal transparent visible={finish !== null} animationType="fade" statusBarTranslucent onRequestClose={onLater}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <View style={styles.haloOuter}>
            <View style={styles.haloInner}><Feather name="check" size={26} color={Colors.primary} /></View>
          </View>
          <Eyebrow>{copy.eyebrow}</Eyebrow>
          <Text style={styles.title}>{copy.title}</Text>
          <Text style={styles.message}>{copy.message}</Text>
          <GradientButton label={copy.action} iconLeft={copy.icon} onPress={onContinue} style={styles.action} />
          {finish !== 'all-done' && (
            <Pressable onPress={onLater} hitSlop={10} style={styles.later}>
              <Text style={styles.laterText}>Nanti saja</Text>
            </Pressable>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(27,61,54,0.45)', justifyContent: 'center', padding: 24 },
  card: {
    backgroundColor: '#fff', borderRadius: 28, paddingHorizontal: 24, paddingTop: 30, paddingBottom: 24,
    alignItems: 'center', width: '100%', maxWidth: 400, alignSelf: 'center',
  },
  haloOuter: {
    width: 76, height: 76, borderRadius: 38, backgroundColor: Colors.primarySoft,
    alignItems: 'center', justifyContent: 'center', marginBottom: 20,
  },
  haloInner: {
    width: 58, height: 58, borderRadius: 29, backgroundColor: Colors.mintWash,
    alignItems: 'center', justifyContent: 'center',
  },
  title: { fontSize: 22, fontWeight: '800', color: Colors.text, marginTop: 14, textAlign: 'center' },
  message: { fontSize: 12.5, lineHeight: 19, color: Colors.muted, marginTop: 12, textAlign: 'center' },
  action: { alignSelf: 'stretch', marginTop: 22 },
  later: { marginTop: 18, marginBottom: 4 },
  laterText: { fontSize: 12, fontWeight: '700', color: Colors.muted },
});
