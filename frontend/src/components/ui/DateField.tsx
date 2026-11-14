import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors, Radius } from '@/constants/auth-theme';
import { formatDateShort, MONTHS_LONG, parseISODate, toISODate } from '@/utils/date';

type Props = {
  /** Format YYYY-MM-DD, string kosong bila belum dipilih */
  value: string;
  onChange: (iso: string) => void;
  placeholder?: string;
  error?: boolean;
};

const WEEKDAYS = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

/** Input tanggal dengan kalender sederhana (tanpa dependensi native tambahan). */
export default function DateField({ value, onChange, placeholder = 'Pilih tanggal', error }: Props) {
  const [open, setOpen] = useState(false);
  const [cursor, setCursor] = useState(() => new Date());

  const todayIso = toISODate(new Date());
  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const offset = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array<null>(offset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const show = () => {
    setCursor(value ? parseISODate(value) : new Date());
    setOpen(true);
  };
  const shift = (delta: number) => setCursor(new Date(year, month + delta, 1));

  return (
    <>
      <Pressable style={[styles.box, error && styles.boxError]} onPress={show}>
        <Text style={[styles.text, !value && { color: Colors.placeholder }]} numberOfLines={1}>
          {value ? formatDateShort(value) : placeholder}
        </Text>
        <Feather name="calendar" size={16} color={Colors.placeholder} />
      </Pressable>

      <Modal transparent visible={open} animationType="fade" statusBarTranslucent onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <Pressable style={styles.card}>
            <View style={styles.head}>
              <Pressable style={styles.nav} onPress={() => shift(-1)} hitSlop={6}>
                <Feather name="chevron-left" size={18} color={Colors.text} />
              </Pressable>
              <Text style={styles.month}>{MONTHS_LONG[month]} {year}</Text>
              <Pressable style={styles.nav} onPress={() => shift(1)} hitSlop={6}>
                <Feather name="chevron-right" size={18} color={Colors.text} />
              </Pressable>
            </View>

            <View style={styles.grid}>
              {WEEKDAYS.map((w) => (
                <View key={w} style={styles.cell}><Text style={styles.weekday}>{w}</Text></View>
              ))}
              {cells.map((day, i) => {
                if (day === null) return <View key={`e${i}`} style={styles.cell} />;
                const iso = toISODate(new Date(year, month, day));
                const selected = iso === value;
                const past = iso < todayIso;
                return (
                  <Pressable
                    key={iso} style={styles.cell} disabled={past}
                    onPress={() => { onChange(iso); setOpen(false); }}
                  >
                    <View style={[styles.day, selected && styles.daySelected, iso === todayIso && !selected && styles.dayToday]}>
                      <Text style={[styles.dayText, past && styles.dayPast, selected && styles.dayTextSelected]}>{day}</Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  box: {
    height: 52, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: Colors.inputBg, borderRadius: Radius.input, borderWidth: 1, borderColor: Colors.border,
  },
  boxError: { borderColor: Colors.error, backgroundColor: Colors.errorBg },
  text: { flex: 1, fontSize: 14, color: Colors.text },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'center', padding: 24 },
  card: { backgroundColor: '#fff', borderRadius: 24, padding: 16, width: '100%', maxWidth: 360, alignSelf: 'center' },
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  nav: {
    width: 36, height: 36, borderRadius: 12, borderWidth: 1, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  month: { fontSize: 15, fontWeight: '800', color: Colors.text },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cell: { width: `${100 / 7}%`, height: 42, alignItems: 'center', justifyContent: 'center' },
  weekday: { fontSize: 10.5, fontWeight: '700', color: Colors.muted },
  day: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  daySelected: { backgroundColor: Colors.primary },
  dayToday: { backgroundColor: Colors.primarySoft },
  dayText: { fontSize: 13, fontWeight: '600', color: Colors.text },
  dayPast: { color: Colors.placeholder, fontWeight: '400' },
  dayTextSelected: { color: '#fff', fontWeight: '800' },
});
