import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import AppHeader from '@/components/dashboard/AppHeader';
import FocusCard from '@/components/dashboard/FocusCard';
import CountdownCard from '@/components/dashboard/CountdownCard';
import SectionHeader from '@/components/dashboard/SectionHeader';
import StatCard from '@/components/dashboard/StatCard';
import InsightCard from '@/components/dashboard/InsightCard';
import { Colors } from '@/constants/auth-theme';
import { MOCK_USER } from '@/constants/mock-user';
import { useFocusTimer } from '@/hooks/use-focus-timer';

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MEI', 'JUN', 'JUL', 'AGU', 'SEP', 'OKT', 'NOV', 'DES'];

export default function HomeScreen() {
  const timer = useFocusTimer();
  const today = new Date();

  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <AppHeader initials={MOCK_USER.initials} />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* greeting */}
        <View style={styles.greetRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.eyebrow}>SELAMAT DATANG KEMBALI</Text>
            <Text style={styles.hello}>Halo, {MOCK_USER.firstName}</Text>
            <Text style={styles.sub}>Satu sesi kecil hari ini, satu langkah lebih dekat.</Text>
          </View>
          <View style={styles.date}>
            <Text style={styles.dateNum}>{today.getDate()}</Text>
            <Text style={styles.dateMonth}>{MONTHS[today.getMonth()]}</Text>
          </View>
        </View>

        <FocusCard time={timer.time} running={timer.running} onToggle={timer.toggle} onReset={timer.reset} />

        {/* hitung mundur */}
        <SectionHeader
          eyebrow="TARGET TERDEKAT"
          title="Hitung mundur"
          action="Lihat semua"
          onActionPress={() => router.push('/countdown')}
        />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hScroll}>
          <CountdownCard variant="dark" label="Ujian TIK" value="04:30" />
          <CountdownCard variant="teal" label="Ujian Kimia" value="3" suffix="hari lagi" />
          <CountdownCard variant="add" />
        </ScrollView>

        {/* rekap */}
        <SectionHeader eyebrow="PROGRES MINGGU INI" title="Rekap belajar" chip="8–14 Mei" />
        <View style={styles.stats}>
          <StatCard
            highlighted badge="+12%" icon="clock"
            iconColor={Colors.primary} iconBg={Colors.primarySoft}
            label="Total fokus" value="15,5" unit="jam"
          />
          <StatCard
            icon="book-open" iconColor={Colors.amber} iconBg={Colors.amberSoft}
            label="Sesi selesai" value="18" unit="sesi"
          />
        </View>
        <InsightCard
          text="Waktu fokus terbaikmu ada di pagi hari. Pertahankan ritmenya."
          onPress={() => router.navigate('/ai-summary')}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.cream },
  scroll: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 24 },
  greetRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  eyebrow: { fontSize: 10.5, letterSpacing: 1.5, fontWeight: '700', color: Colors.muted },
  hello: { fontSize: 30, fontWeight: '800', color: Colors.text, marginTop: 6 },
  sub: { fontSize: 12.5, color: Colors.muted, marginTop: 6 },
  date: {
    width: 52, height: 56, borderRadius: 16, backgroundColor: '#fff', alignItems: 'center',
    justifyContent: 'center', borderWidth: 1, borderColor: Colors.border,
  },
  dateNum: { fontSize: 20, fontWeight: '800', color: Colors.primary },
  dateMonth: { fontSize: 9.5, fontWeight: '700', color: Colors.muted, letterSpacing: 1 },
  hScroll: { gap: 12, paddingRight: 8 },
  stats: { flexDirection: 'row', gap: 12 },
});