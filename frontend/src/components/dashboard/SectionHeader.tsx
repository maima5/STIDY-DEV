import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors } from '@/constants/auth-theme';

type Props = {
  eyebrow: string;
  title: string;
  action?: string;           // teks link, mis. "Lihat semua"
  onActionPress?: () => void;
  chip?: string;             // pill, mis. "8–14 Mei"
};

export default function SectionHeader({ eyebrow, title, action, onActionPress, chip }: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.eyebrow}>{eyebrow}</Text>
      <View style={styles.row}>
        <Text style={styles.title}>{title}</Text>
        {!!action && (
          <Pressable onPress={onActionPress}><Text style={styles.action}>{action}</Text></Pressable>
        )}
        {!!chip && <View style={styles.chip}><Text style={styles.chipText}>{chip}</Text></View>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: 28, marginBottom: 14 },
  eyebrow: { fontSize: 10.5, letterSpacing: 1.5, fontWeight: '700', color: Colors.muted, marginBottom: 6 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontSize: 20, fontWeight: '800', color: Colors.text },
  action: { fontSize: 12.5, fontWeight: '700', color: Colors.primary },
  chip: { backgroundColor: '#E6EFEC', borderRadius: 12, paddingVertical: 6, paddingHorizontal: 12 },
  chipText: { fontSize: 11.5, color: Colors.muted, fontWeight: '600' },
});