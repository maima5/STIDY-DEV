import { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors } from '@/constants/auth-theme';

type Props = {
  title: string;
  backLabel: string;
  onBack: () => void;
  right?: ReactNode;
};

/** Header halaman detail: tombol kembali berlabel di kiri, judul di tengah. */
export default function StackHeader({ title, backLabel, onBack, right }: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.side}>
        <Pressable style={styles.back} onPress={onBack} hitSlop={10}>
          <Feather name="chevron-left" size={20} color={Colors.text} />
          <Text style={styles.backText} numberOfLines={1}>{backLabel}</Text>
        </Pressable>
      </View>
      <Text style={styles.title} numberOfLines={1}>{title}</Text>
      <View style={[styles.side, { alignItems: 'flex-end' }]}>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    height: 64, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.cream, borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  side: { flex: 1 },
  back: { flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start', maxWidth: '100%' },
  backText: { fontSize: 11.5, fontWeight: '700', color: Colors.text, flexShrink: 1 },
  title: { fontSize: 15, fontWeight: '800', color: Colors.text, maxWidth: '46%', textAlign: 'center' },
});
