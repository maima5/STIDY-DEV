import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors } from '@/constants/auth-theme';
import { Material } from '@/types/schedule';
import { formatDayMonth } from '@/utils/date';

type Props = {
  material: Material;
  /** Nomor urut materi (mulai dari 1) */
  number: number;
  onPress: () => void;
  onToggle: () => void;
};

export default function MaterialRow({ material, number, onPress, onToggle }: Props) {
  const { done } = material;
  return (
    <Pressable style={({ pressed }) => [styles.row, pressed && { opacity: 0.92 }]} onPress={onPress}>
      <Pressable style={[styles.check, done && styles.checkOn]} onPress={onToggle} hitSlop={8}>
        {done && <Feather name="check" size={15} color="#fff" />}
      </Pressable>

      <View style={{ flex: 1 }}>
        <Text style={[styles.title, done && styles.titleDone]} numberOfLines={2}>
          {number}. {material.title}
        </Text>
        <View style={styles.meta}>
          <Feather name={done ? 'check' : 'clock'} size={12} color={done ? Colors.primary : Colors.muted} />
          <Text style={[styles.metaText, done && { color: Colors.primary }]}>
            {done
              ? `Selesai${material.completedAt ? ` ${formatDayMonth(material.completedAt)}` : ''}`
              : `Estimasi: ${material.estimateMinutes} menit`}
          </Text>
        </View>
      </View>

      <View style={[styles.chip, done ? styles.chipDone : styles.chipTodo]}>
        <Text style={[styles.chipText, { color: done ? Colors.deep : Colors.muted }]}>
          {done ? 'Selesai' : 'Belum Mulai'}
        </Text>
      </View>
      {!done && <Feather name="chevron-right" size={18} color={Colors.muted} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, minHeight: 70,
    backgroundColor: '#fff', borderRadius: 20, borderWidth: 1, borderColor: Colors.border, marginBottom: 10,
  },
  check: {
    width: 24, height: 24, borderRadius: 8, borderWidth: 1.5, borderColor: '#C9D1CE',
    backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center',
  },
  checkOn: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  title: { fontSize: 12.5, fontWeight: '700', color: Colors.text },
  titleDone: { color: Colors.muted, textDecorationLine: 'line-through' },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 },
  metaText: { fontSize: 10.5, color: Colors.muted },
  chip: { paddingHorizontal: 8, paddingVertical: 5, borderRadius: 8 },
  chipDone: { backgroundColor: Colors.primarySoft },
  chipTodo: { backgroundColor: '#EEF0EF' },
  chipText: { fontSize: 9, fontWeight: '700' },
});
