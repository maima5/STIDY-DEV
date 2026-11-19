import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors, Radius } from '@/constants/auth-theme';
import { Exam } from '@/types/countdown';
import { formatTimeLeft } from '@/utils/time';

type Props = {
  exam: Exam;
  expanded?: boolean;
  onPress?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onCountdown?: () => void;
};

/**
 * Kartu ujian di daftar Hitung Mundur.
 * Badge otomatis menampilkan hari/jam/menit/detik yang sesuai.
 */
export default function ExamListCard({
  exam,
  expanded = false,
  onPress,
  onEdit,
  onDelete,
  onCountdown,
}: Props) {
  const deadline = new Date(exam.date);
  const isValidDate = !isNaN(deadline.getTime());

  const dateStr = isValidDate
    ? deadline.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : 'Tanggal belum diatur';

  const badgeLabel = formatTimeLeft(exam.date);
  const isPast = badgeLabel === 'Sudah lewat';

  return (
    <Pressable style={styles.card} onPress={onPress}>
      {/* Header row */}
      <View style={styles.headerRow}>
        <Pressable style={styles.starBtn}>
          <Feather name="star" size={18} color={Colors.amber} />
        </Pressable>

        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.subject}>{exam.subject}</Text>
          <View style={styles.metaRow}>
            <Feather name="calendar" size={13} color={Colors.muted} />
            <Text style={styles.metaText}>{dateStr}</Text>
          </View>
          <View style={styles.metaRow}>
            <Feather name="clock" size={13} color={Colors.muted} />
            <Text style={styles.metaText}>Pukul {exam.time}</Text>
          </View>
        </View>

        <View style={[styles.badge, isPast && styles.badgePast]}>
          <Text style={[styles.badgeText, isPast && styles.badgeTextPast]}>{badgeLabel}</Text>
        </View>

        <Feather
          name={expanded ? 'chevron-up' : 'chevron-right'}
          size={18}
          color={Colors.muted}
          style={{ marginLeft: 8 }}
        />
      </View>

      {/* Expanded area */}
      {expanded && (
        <View style={styles.expandedArea}>
          {exam.room && (
            <View style={styles.metaRow}>
              <Feather name="map-pin" size={13} color={Colors.muted} />
              <Text style={styles.metaText}>{exam.room}</Text>
            </View>
          )}
          <View style={styles.actions}>
            <Pressable style={styles.editBtn} onPress={onEdit}>
              <Feather name="edit-2" size={14} color={Colors.text} />
              <Text style={styles.editText}>Edit</Text>
            </Pressable>
            <Pressable style={styles.deleteBtn} onPress={onDelete}>
              <Feather name="trash-2" size={14} color={Colors.error} />
              <Text style={styles.deleteText}>Hapus</Text>
            </Pressable>
          </View>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: Radius.card,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  starBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: Colors.amberSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subject: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 3,
  },
  metaText: {
    fontSize: 12.5,
    color: Colors.muted,
  },
  badge: {
    backgroundColor: Colors.primarySoft,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: Colors.deep,
  },
  badgePast: {
    backgroundColor: Colors.errorBg,
  },
  badgeTextPast: {
    color: Colors.error,
  },
  expandedArea: {
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 14,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: '#fff',
  },
  editText: { fontSize: 13, fontWeight: '600', color: Colors.text },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: Colors.errorBg,
  },
  deleteText: { fontSize: 13, fontWeight: '600', color: Colors.error },
});
