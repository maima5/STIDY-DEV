import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import FocusSettingsSheet from '@/components/focus/FocusSettingsSheet';
import SettingTile from '@/components/focus/SettingTile';
import TimerCard from '@/components/focus/TimerCard';
import ScreenBackground from '@/components/schedule/ScreenBackground';
import { Eyebrow } from '@/components/schedule/ScheduleBits';
import { Colors } from '@/constants/auth-theme';
import { MOCK_USER } from '@/constants/mock-user';
import { useFocus } from '@/context/focus-context';

const goBack = () => (router.canGoBack() ? router.back() : router.replace('/home'));

export default function FocusScreen() {
  const focus = useFocus();
  const [editing, setEditing] = useState(false);
  const { settings } = focus;

  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      {/* header */}
      <View style={styles.header}>
        <Pressable style={styles.back} onPress={goBack}>
          <Feather name="chevron-left" size={20} color={Colors.text} />
        </Pressable>
        <View style={styles.headerText}>
          <Eyebrow>POMODORO</Eyebrow>
          <Text style={styles.headerTitle}>Waktu Fokus</Text>
        </View>
        <Pressable style={styles.avatar} onPress={() => router.navigate('/profile')}>
          <Text style={styles.avatarText}>{MOCK_USER.initials}</Text>
        </Pressable>
      </View>

      <View style={{ flex: 1 }}>
        <ScreenBackground />
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <TimerCard
            phase={focus.phase}
            time={focus.time}
            running={focus.running}
            idle={focus.idle}
            session={focus.session}
            totalSessions={settings.sessions}
            onToggle={focus.toggle}
            onReset={focus.reset}
            onOpenSettings={() => setEditing(true)}
          />

          {/* pengaturan waktu */}
          <View style={styles.sectionHead}>
            <View style={{ flex: 1 }}>
              <Eyebrow muted>RITME BELAJAR</Eyebrow>
              <Text style={styles.sectionTitle}>Pengaturan waktu</Text>
            </View>
            <Pressable style={styles.edit} onPress={() => setEditing(true)}>
              <Feather name="edit-2" size={13} color={Colors.deep} />
              <Text style={styles.editText}>Edit</Text>
            </Pressable>
          </View>

          <View style={styles.tiles}>
            <SettingTile
              icon="book-open" iconColor={Colors.deep} iconBg={Colors.primarySoft}
              label="Fokus" value={settings.focusMinutes} unit="menit"
            />
            <SettingTile
              icon="coffee" iconColor={Colors.amber} iconBg={Colors.amberSoft}
              label="Istirahat" value={settings.breakMinutes} unit="menit"
            />
            <SettingTile
              icon="target" iconColor={Colors.violet} iconBg={Colors.violetSoft}
              label="Target" value={settings.sessions} unit="sesi"
            />
          </View>

          <View style={styles.tips}>
            <View style={styles.tipsIcon}><Ionicons name="sparkles-outline" size={18} color="#fff" /></View>
            <View style={{ flex: 1 }}>
              <Eyebrow>TIPS FOKUS</Eyebrow>
              <Text style={styles.tipsText}>Jauhkan ponsel dan siapkan air minum sebelum sesi dimulai.</Text>
            </View>
          </View>
        </ScrollView>
      </View>

      <FocusSettingsSheet
        visible={editing}
        settings={settings}
        onSave={focus.saveSettings}
        onClose={() => setEditing(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.cream },
  header: {
    height: 72, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.cream, borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  back: {
    width: 40, height: 40, borderRadius: 12, backgroundColor: '#fff', borderWidth: 1,
    borderColor: Colors.border, alignItems: 'center', justifyContent: 'center',
  },
  headerText: { flex: 1, alignItems: 'center' },
  headerTitle: { fontSize: 16, fontWeight: '800', color: Colors.text, marginTop: 5 },
  avatar: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.deep, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontWeight: '800', fontSize: 13 },
  scroll: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 28 },
  sectionHead: { flexDirection: 'row', alignItems: 'flex-end', marginTop: 28, marginBottom: 14 },
  sectionTitle: { fontSize: 19, fontWeight: '800', color: Colors.text, marginTop: 8 },
  edit: {
    flexDirection: 'row', alignItems: 'center', gap: 8, height: 34, paddingHorizontal: 14,
    borderRadius: 12, backgroundColor: Colors.primarySoft,
  },
  editText: { fontSize: 11.5, fontWeight: '700', color: Colors.deep },
  tiles: { flexDirection: 'row', gap: 10 },
  tips: {
    flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, marginTop: 12,
    borderRadius: 20, backgroundColor: '#E8F0ED',
  },
  tipsIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.deep, alignItems: 'center', justifyContent: 'center' },
  tipsText: { fontSize: 11, lineHeight: 17, color: Colors.muted, marginTop: 6 },
});
