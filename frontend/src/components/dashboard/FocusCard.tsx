import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { Colors } from '@/constants/auth-theme';

type Props = {
  time: string;
  running: boolean;
  onToggle: () => void;
  onReset: () => void;
  session?: string;
};

export default function FocusCard({ time, running, onToggle, onReset, session = 'Sesi 1 dari 4' }: Props) {
  return (
    <View style={styles.shadow}>
      <LinearGradient colors={['#0E8A70', '#2FAE8F']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.card}>
        <View style={styles.circleBig} />
        <View style={styles.circleSmall} />

        <View style={styles.top}>
          <View style={styles.eyebrowRow}>
            <View style={styles.ring} />
            <Text style={styles.eyebrow}>MODE FOKUS</Text>
          </View>
          <Text style={styles.session}>{session}</Text>
        </View>

        <View style={styles.body}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>Belajar tanpa distraksi</Text>
            <Text style={styles.sub}>Atur ritmemu, lalu mulai fokus.</Text>
            <Text style={styles.time}>{time}</Text>
          </View>
          <View style={styles.actions}>
            <Pressable style={styles.play} onPress={onToggle}>
              <Feather name={running ? 'pause-circle' : 'play-circle'} size={28} color={Colors.deep} />
            </Pressable>
            <Pressable style={styles.reset} onPress={onReset}>
              <Text style={styles.resetText}>Atur ulang</Text>
            </Pressable>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  shadow: {
    marginTop: 20, borderRadius: 28,
    shadowColor: Colors.deep, shadowOpacity: 0.3, shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 }, elevation: 8,
  },
  card: { borderRadius: 28, padding: 20, overflow: 'hidden' },
  circleBig: {
    position: 'absolute', right: -50, bottom: -60, width: 200, height: 200, borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  circleSmall: {
    position: 'absolute', right: -20, top: -50, width: 120, height: 120, borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  eyebrowRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  ring: { width: 9, height: 9, borderRadius: 5, borderWidth: 1.5, borderColor: '#fff' },
  eyebrow: { color: '#fff', fontSize: 10.5, fontWeight: '700', letterSpacing: 1.5 },
  session: { color: 'rgba(255,255,255,0.75)', fontSize: 11.5 },
  body: { flexDirection: 'row', marginTop: 18 },
  title: { color: '#fff', fontSize: 20, fontWeight: '800' },
  sub: { color: 'rgba(255,255,255,0.75)', fontSize: 12.5, marginTop: 6 },
  time: { color: '#fff', fontSize: 40, fontWeight: '800', marginTop: 14, fontVariant: ['tabular-nums'] },
  actions: { alignItems: 'flex-end', justifyContent: 'space-between' },
  play: { width: 56, height: 56, borderRadius: 18, backgroundColor: '#EAFBF4', alignItems: 'center', justifyContent: 'center' },
  reset: { backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: 12, paddingVertical: 8, paddingHorizontal: 14 },
  resetText: { color: '#fff', fontSize: 11.5, fontWeight: '600' },
});