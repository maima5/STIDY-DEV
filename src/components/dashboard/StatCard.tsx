import { StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors } from '@/constants/auth-theme';

type Props = {
  icon: keyof typeof Feather.glyphMap;
  iconColor: string;
  iconBg: string;
  label: string;
  value: string;
  unit: string;
  badge?: string;
  highlighted?: boolean;
};

export default function StatCard({ icon, iconColor, iconBg, label, value, unit, badge, highlighted }: Props) {
  return (
    <View style={[styles.card, highlighted && styles.highlighted]}>
      {!!badge && <View style={styles.badge}><Text style={styles.badgeText}>{badge}</Text></View>}
      <View style={[styles.icon, { backgroundColor: iconBg }]}>
        <Feather name={icon} size={22} color={iconColor} />
      </View>
      <View>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.valueRow}>
          <Text style={styles.value}>{value}</Text>
          <Text style={styles.unit}>{unit}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderRadius: 20,
    backgroundColor: '#fff', borderWidth: 1, borderColor: Colors.border,
  },
  highlighted: { borderWidth: 2, borderColor: Colors.primary },
  icon: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  label: { fontSize: 11, color: Colors.muted },
  valueRow: { flexDirection: 'row', alignItems: 'baseline', gap: 4, marginTop: 2 },
  value: { fontSize: 20, fontWeight: '800', color: Colors.text },
  unit: { fontSize: 11.5, fontWeight: '600', color: Colors.text },
  badge: {
    position: 'absolute', top: 8, right: 10, backgroundColor: Colors.primarySoft,
    borderRadius: 8, paddingHorizontal: 6, paddingVertical: 2,
  },
  badgeText: { fontSize: 10, fontWeight: '700', color: Colors.primary },
});