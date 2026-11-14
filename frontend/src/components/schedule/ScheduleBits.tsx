import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '@/constants/auth-theme';

/** Badge "10 hari menuju ujian". */
export function DaysBadge({ days }: { days: number }) {
  return (
    <View style={styles.badge}>
      <Text style={styles.badgeNum}>{days}</Text>
      <Text style={styles.badgeText}>hari menuju ujian</Text>
    </View>
  );
}

/** Progress bar tipis. */
export function ProgressBar({ percent }: { percent: number }) {
  return (
    <View style={styles.track}>
      <View style={[styles.fill, { width: `${Math.min(100, Math.max(0, percent))}%` }]} />
    </View>
  );
}

/** Label kecil huruf kapital, mis. "RENCANA BELAJAR". */
export function Eyebrow({ children, muted }: { children: string; muted?: boolean }) {
  return <Text style={[styles.eyebrow, muted && { color: Colors.muted }]}>{children}</Text>;
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, height: 30,
    borderRadius: 10, backgroundColor: Colors.primarySoft, borderWidth: 1, borderColor: Colors.mintBorder,
  },
  badgeNum: { fontSize: 13, fontWeight: '800', color: Colors.deep },
  badgeText: { fontSize: 9.5, color: Colors.muted },
  track: { height: 6, borderRadius: 3, backgroundColor: Colors.track, overflow: 'hidden' },
  fill: { height: 6, borderRadius: 3, backgroundColor: Colors.primaryLight },
  eyebrow: { fontSize: 9.5, letterSpacing: 1.4, fontWeight: '800', color: Colors.primary },
});
