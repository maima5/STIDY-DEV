import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors } from '@/constants/auth-theme';

type Props =
  | { variant: 'dark' | 'teal'; label: string; value: string; suffix?: string; onPress?: () => void }
  | { variant: 'add'; onPress?: () => void };

export default function CountdownCard(props: Props) {
  if (props.variant === 'add') {
    return (
      <Pressable style={[styles.card, styles.add]} onPress={props.onPress}>
        <Feather name="plus" size={26} color={Colors.muted} />
        <Text style={styles.addText}>Tambah</Text>
      </Pressable>
    );
  }

  const dark = props.variant === 'dark';
  return (
    <Pressable
      onPress={props.onPress}
      style={[styles.card, { backgroundColor: dark ? Colors.forest : '#35B193', width: dark ? 180 : 140 }]}
    >
      <View style={styles.circle} />
      <Text style={styles.label}>{props.label}</Text>
      <View style={styles.valueRow}>
        <Text style={styles.value}>{props.value}</Text>
        {!!props.suffix && <Text style={styles.suffix}>{props.suffix}</Text>}
      </View>
      <Feather name="chevron-right" size={16} color="rgba(255,255,255,0.7)" style={styles.chev} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { height: 100, borderRadius: 24, padding: 16, justifyContent: 'center', overflow: 'hidden' },
  circle: {
    position: 'absolute', right: -24, bottom: -28, width: 90, height: 90, borderRadius: 45,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  label: { color: 'rgba(255,255,255,0.8)', fontSize: 11.5, marginBottom: 6 },
  valueRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  value: { color: '#fff', fontSize: 30, fontWeight: '800' },
  suffix: { color: '#fff', fontSize: 12, fontWeight: '700', width: 36, lineHeight: 14 },
  chev: { position: 'absolute', right: 14, bottom: 14 },
  add: {
    width: 76, backgroundColor: '#F0F2F1', alignItems: 'center',
    borderWidth: 1.5, borderStyle: 'dashed', borderColor: '#C9D1CE',
  },
  addText: { fontSize: 11, color: Colors.muted, marginTop: 4 },
});