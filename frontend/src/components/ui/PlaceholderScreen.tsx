import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppHeader from '@/components/dashboard/AppHeader';
import { Colors } from '@/constants/auth-theme';
import { MOCK_USER } from '@/constants/mock-user';

export default function PlaceholderScreen({ title }: { title: string }) {
  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: Colors.cream }}>
      <AppHeader initials={MOCK_USER.initials} />
      <View style={styles.center}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.sub}>Segera hadir</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: '800', color: Colors.text },
  sub: { fontSize: 13, color: Colors.muted, marginTop: 6 },
});