import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors } from '@/constants/auth-theme';
import { DaysBadge, ProgressBar } from '@/components/schedule/ScheduleBits';
import { courseProgress } from '@/context/schedule-context';
import { Course } from '@/types/schedule';
import { daysUntil, formatDateLong } from '@/utils/date';

type Props = { course: Course; onPress: () => void; onDelete: () => void };

export default function CourseCard({ course, onPress, onDelete }: Props) {
  const { total, done, percent } = courseProgress(course);

  return (
    <Pressable style={({ pressed }) => [styles.card, pressed && { opacity: 0.92 }]} onPress={onPress}>
      <View style={styles.accent} />
      <View style={styles.body}>
        <View style={styles.top}>
          <View style={styles.icon}><Feather name="book-open" size={18} color={Colors.deep} /></View>
          <View style={{ flex: 1 }} />
          <DaysBadge days={daysUntil(course.examDate)} />
          <Pressable style={styles.trash} onPress={onDelete} hitSlop={8}>
            <Feather name="trash-2" size={17} color={Colors.error} />
          </Pressable>
        </View>

        <Text style={styles.name} numberOfLines={2}>{course.name}</Text>

        <View style={styles.meta}>
          <Feather name="calendar" size={13} color={Colors.muted} />
          <Text style={styles.metaText}>{formatDateLong(course.examDate)}</Text>
          <Feather name="book-open" size={13} color={Colors.muted} style={{ marginLeft: 12 }} />
          <Text style={styles.metaText}>{total} materi</Text>
        </View>

        <View style={styles.progressRow}>
          <Text style={styles.progressText}>{done}/{total} selesai</Text>
          <Text style={styles.percent}>{percent}%</Text>
        </View>
        <ProgressBar percent={percent} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row', backgroundColor: '#fff', borderRadius: 24, overflow: 'hidden',
    borderWidth: 1, borderColor: Colors.border, marginBottom: 14,
  },
  accent: { width: 4, backgroundColor: Colors.primary },
  body: { flex: 1, padding: 16 },
  top: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  icon: {
    width: 36, height: 36, borderRadius: 12, backgroundColor: Colors.primarySoft,
    alignItems: 'center', justifyContent: 'center',
  },
  trash: { width: 34, height: 34, alignItems: 'center', justifyContent: 'center' },
  name: { fontSize: 17, fontWeight: '800', color: Colors.text, marginTop: 14 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10 },
  metaText: { fontSize: 11, color: Colors.muted },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 14, marginBottom: 8 },
  progressText: { fontSize: 10.5, color: Colors.muted },
  percent: { fontSize: 10.5, fontWeight: '800', color: Colors.text },
});
