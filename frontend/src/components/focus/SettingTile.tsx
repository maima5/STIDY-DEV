import { StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors } from '@/constants/auth-theme';

type Props = {
  icon: keyof typeof Feather.glyphMap;
  iconColor: string;
  iconBg: string;
  label: string;
  value: number;
  unit: string;
};

/** Kotak ringkas pengaturan (Fokus / Istirahat / Target). */
export default function SettingTile({ icon, iconColor, iconBg, label, value, unit }: Props) {
  return (
    <View style={styles.tile}>
      <View style={[styles.icon, { backgroundColor: iconBg }]}>
        <Feather name={icon} size={18} color={iconColor} />
      </View>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.valueRow}>
        <Text style={styles.value}>{value}</Text>
        <Text style={styles.unit}>{unit}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tile: { flex: 1, padding: 14, borderRadius: 20, backgroundColor: '#fff', borderWidth: 1, borderColor: Colors.border },
  icon: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  label: { fontSize: 10.5, color: Colors.muted, marginTop: 16 },
  valueRow: { flexDirection: 'row', alignItems: 'baseline', gap: 4, marginTop: 6 },
  value: { fontSize: 20, fontWeight: '800', color: Colors.text },
  unit: { fontSize: 10.5, color: Colors.muted },
});
