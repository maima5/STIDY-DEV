import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/auth-theme';

export default function InsightCard({ text, onPress }: { text: string; onPress?: () => void }) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.icon}>
        <Ionicons name="sparkles-outline" size={22} color="#fff" />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.eyebrow}>INSIGHT HARI INI</Text>
        <Text style={styles.text}>{text}</Text>
      </View>
      <Feather name="chevron-right" size={20} color={Colors.text} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 20,
    backgroundColor: '#E8F1EE', marginTop: 12,
  },
  icon: { width: 44, height: 44, borderRadius: 14, backgroundColor: Colors.deep, alignItems: 'center', justifyContent: 'center' },
  eyebrow: { fontSize: 10, letterSpacing: 1.2, fontWeight: '700', color: Colors.muted, marginBottom: 4 },
  text: { fontSize: 11.5, color: Colors.muted, lineHeight: 16 },
});