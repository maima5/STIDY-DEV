import { StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors } from '@/constants/auth-theme';

export default function EmptySchedule() {
  return (
    <View style={styles.card}>
      <View style={styles.icon}><Feather name="calendar" size={24} color={Colors.deep} /></View>
      <Text style={styles.title}>Belum ada jadwal</Text>
      <Text style={styles.sub}>Tambahkan mata kuliah pertamamu untuk mulai menyusun rencana belajar.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center', paddingVertical: 32, paddingHorizontal: 40, borderRadius: 24, marginBottom: 14,
    backgroundColor: 'rgba(255,255,255,0.7)', borderWidth: 1, borderStyle: 'dashed', borderColor: '#C9D6D2',
  },
  icon: {
    width: 56, height: 56, borderRadius: 18, backgroundColor: Colors.primarySoft,
    alignItems: 'center', justifyContent: 'center',
  },
  title: { fontSize: 15, fontWeight: '800', color: Colors.text, marginTop: 16 },
  sub: { fontSize: 11, lineHeight: 17, color: Colors.muted, textAlign: 'center', marginTop: 8 },
});
