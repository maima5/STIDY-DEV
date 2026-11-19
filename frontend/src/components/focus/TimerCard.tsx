import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import GradientButton from '@/components/ui/GradientButton';
import { Colors } from '@/constants/auth-theme';
import { FocusPhase } from '@/types/focus';

type Props = {
  phase: FocusPhase;
  time: string;
  running: boolean;
  idle: boolean;
  session: number;
  totalSessions: number;
  onToggle: () => void;
  onReset: () => void;
  onOpenSettings: () => void;
};

const BREAK_BUTTON: [string, string] = ['#D9B062', '#B8893A'];

export default function TimerCard({
  phase, time, running, idle, session, totalSessions, onToggle, onReset, onOpenSettings,
}: Props) {
  const onBreak = phase === 'break';
  const hint = running ? 'Tetap fokus, kamu hebat' : idle ? 'Siap untuk dimulai' : 'Timer dijeda';

  return (
    <LinearGradient
      colors={onBreak ? ['#FBF6EC', '#F3F8F4'] : [Colors.mintWash, '#F6FBF9']}
      start={{ x: 1, y: 0 }} end={{ x: 0, y: 1 }}
      style={styles.card}
    >
      <View style={styles.deco} />

      <View style={styles.top}>
        <View style={styles.modeRow}>
          <View style={styles.modeDot} />
          <Text style={styles.mode}>{onBreak ? 'WAKTU ISTIRAHAT' : 'MODE FOKUS'}</Text>
        </View>
        <Text style={styles.session}>Sesi {session} dari {totalSessions}</Text>
      </View>

      {/* lingkaran timer */}
      <View style={styles.ring}>
        <View style={styles.face}>
          <Text style={styles.phase}>{onBreak ? 'ISTIRAHAT' : 'BELAJAR'}</Text>
          <Text style={styles.time}>{time}</Text>
          <Text style={styles.hint}>{hint}</Text>
        </View>
      </View>

      <View style={styles.controls}>
        <Pressable style={styles.side} onPress={onReset}>
          <Feather name="rotate-ccw" size={18} color={Colors.text} />
        </Pressable>
        <GradientButton
          label={running ? 'Jeda' : idle ? 'Mulai' : 'Lanjut'}
          iconLeft={running ? 'pause' : 'play'}
          colors={onBreak ? BREAK_BUTTON : undefined}
          onPress={onToggle}
          style={styles.main}
        />
        <Pressable style={styles.side} onPress={onOpenSettings}>
          <Feather name="target" size={18} color={Colors.text} />
        </Pressable>
      </View>

      {/* indikator sesi */}
      <View style={styles.dots}>
        {Array.from({ length: totalSessions }, (_, i) => (
          <View key={i} style={[styles.dot, i + 1 === session && styles.dotActive, i + 1 < session && styles.dotDone]} />
        ))}
      </View>
    </LinearGradient>
  );
}

const RING = 232;

const styles = StyleSheet.create({
  card: {
    borderRadius: 28, paddingHorizontal: 18, paddingTop: 18, paddingBottom: 56, overflow: 'hidden',
    borderWidth: 1, borderColor: Colors.mintBorder, alignItems: 'center',
  },
  deco: {
    position: 'absolute', top: -70, right: -60, width: 200, height: 200, borderRadius: 100,
    borderWidth: 30, borderColor: 'rgba(255,255,255,0.5)',
  },
  top: { alignSelf: 'stretch', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  modeRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  modeDot: { width: 8, height: 8, borderRadius: 4, borderWidth: 1.5, borderColor: Colors.primary },
  mode: { fontSize: 10, fontWeight: '800', letterSpacing: 1.3, color: Colors.deep },
  session: { fontSize: 10.5, color: Colors.muted },
  ring: {
    width: RING, height: RING, borderRadius: RING / 2, marginTop: 24, padding: 8,
    borderWidth: 9, borderColor: '#35BFA0', backgroundColor: '#D6EFE7',
    shadowColor: Colors.primary, shadowOpacity: 0.25, shadowRadius: 24, shadowOffset: { width: 0, height: 10 },
  },
  face: {
    flex: 1, borderRadius: RING / 2, backgroundColor: '#EEF7F3', borderWidth: 1, borderColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
  },
  phase: { fontSize: 10, fontWeight: '800', letterSpacing: 1.6, color: Colors.deep },
  time: {
    fontSize: 52, fontWeight: '800', color: Colors.text, letterSpacing: -1, marginTop: 4,
    fontVariant: ['tabular-nums'],
  },
  hint: { fontSize: 10.5, color: Colors.muted, marginTop: 6 },
  controls: { flexDirection: 'row', alignItems: 'center', gap: 16, marginTop: -8 },
  side: {
    width: 44, height: 44, borderRadius: 14, backgroundColor: '#fff', borderWidth: 1,
    borderColor: Colors.border, alignItems: 'center', justifyContent: 'center',
  },
  main: { width: 132 },
  dots: { flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 16 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#D5DEDB' },
  dotDone: { backgroundColor: Colors.primaryLight },
  dotActive: { width: 24, backgroundColor: Colors.primary },
});
