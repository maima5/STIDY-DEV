import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Href, Redirect, router, useLocalSearchParams } from 'expo-router';
import { AttachmentsTab, NotesTab, SummaryTab } from '@/components/schedule/MaterialTabs';
import ScreenBackground from '@/components/schedule/ScreenBackground';
import StackHeader from '@/components/schedule/StackHeader';
import { Eyebrow } from '@/components/schedule/ScheduleBits';
import GradientButton from '@/components/ui/GradientButton';
import { Colors } from '@/constants/auth-theme';
import { useSchedule } from '@/context/schedule-context';
import { notify } from '@/utils/confirm';

type TabKey = 'summary' | 'notes' | 'files';
const TABS: { key: TabKey; label: string }[] = [
  { key: 'summary', label: 'Ringkasan Materi' },
  { key: 'notes', label: 'Catatan Pribadi' },
  { key: 'files', label: 'Lampiran / File' },
];

export default function MaterialDetailScreen() {
  const { id, materialId } = useLocalSearchParams<{ id: string; materialId: string }>();
  const insets = useSafeAreaInsets();
  const { getCourse, toggleMaterial, saveNote, removeAttachment } = useSchedule();
  const [tab, setTab] = useState<TabKey>('summary');

  const course = getCourse(id);
  const index = course?.materials.findIndex((m) => m.id === materialId) ?? -1;
  if (!course || index < 0) return <Redirect href="/schedule" />;
  const material = course.materials[index];

  const goBack = () => (router.canGoBack() ? router.back() : router.replace(`/course/${course.id}` as Href));

  // TODO: pasang expo-document-picker lalu panggil addAttachment() dari useSchedule
  const onAddFile = () => notify('Segera hadir', 'Unggah file akan tersedia setelah pemilih dokumen dipasang.');

  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <StackHeader title="Detail Materi" backLabel={course.name} onBack={goBack} />

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScreenBackground />
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.intro}>
            <View style={styles.crumbs}>
              <Text style={styles.crumbLink} onPress={goBack}>{course.name}</Text>
              <Feather name="chevron-right" size={12} color={Colors.placeholder} />
              <Text style={styles.crumb}>Materi {index + 1}</Text>
            </View>

            <Eyebrow>TOPIK PEMBELAJARAN</Eyebrow>
            <Text style={styles.title}>{material.title}</Text>

            <View style={styles.chips}>
              <View style={[styles.chip, styles.chipPlain]}>
                <Feather name="clock" size={13} color={Colors.text} />
                <Text style={styles.chipText}>Estimasi: {material.estimateMinutes} Menit</Text>
              </View>
              <View style={[styles.chip, styles.chipMint]}>
                <Text style={[styles.chipText, { color: Colors.deep }]}>Tingkat: {material.level}</Text>
              </View>
            </View>
          </View>

          {/* tab */}
          <View style={styles.tabs}>
            {TABS.map((t) => {
              const active = t.key === tab;
              return (
                <Pressable key={t.key} style={styles.tab} onPress={() => setTab(t.key)}>
                  <Text style={[styles.tabText, active && styles.tabTextActive]} numberOfLines={1}>{t.label}</Text>
                  <View style={[styles.tabLine, active && styles.tabLineActive]} />
                </Pressable>
              );
            })}
          </View>

          <View style={styles.content}>
            {tab === 'summary' && <SummaryTab material={material} onAskAI={() => router.navigate('/ai-summary')} />}
            {tab === 'notes' && (
              <NotesTab key={material.id} material={material} onSave={(note) => saveNote(course.id, material.id, note)} />
            )}
            {tab === 'files' && (
              <AttachmentsTab
                attachments={material.attachments}
                onAdd={onAddFile}
                onRemove={(attachmentId) => removeAttachment(course.id, material.id, attachmentId)}
              />
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={[styles.bottom, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <GradientButton
          label="Mulai Timer" iconLeft="play" variant="soft" height={52}
          onPress={() => router.push('/focus-settings')} style={{ flex: 0.9 }}
        />
        <GradientButton
          label={material.done ? 'Batalkan Selesai' : 'Tandai Selesai'}
          iconLeft={material.done ? 'rotate-ccw' : 'check'} height={52}
          onPress={() => toggleMaterial(course.id, material.id)} style={{ flex: 1 }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.cream },
  scroll: { paddingBottom: 28 },
  intro: { paddingHorizontal: 20, paddingTop: 22 },
  crumbs: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 22 },
  crumbLink: { fontSize: 10.5, fontWeight: '700', color: Colors.deep },
  crumb: { fontSize: 10.5, color: Colors.muted },
  title: { fontSize: 26, lineHeight: 32, fontWeight: '800', color: Colors.text, marginTop: 10, letterSpacing: -0.4 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 16 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 6, height: 32, paddingHorizontal: 10, borderRadius: 10, borderWidth: 1 },
  chipPlain: { backgroundColor: '#fff', borderColor: Colors.border },
  chipMint: { backgroundColor: Colors.primarySoft, borderColor: Colors.mintBorder },
  chipText: { fontSize: 10.5, fontWeight: '600', color: Colors.text },
  tabs: { flexDirection: 'row', marginTop: 20, paddingHorizontal: 12, borderBottomWidth: 1, borderBottomColor: Colors.border },
  tab: { flex: 1, alignItems: 'center', paddingTop: 14 },
  tabText: { fontSize: 10.5, color: Colors.muted, marginBottom: 12 },
  tabTextActive: { fontWeight: '800', color: Colors.deep },
  tabLine: { height: 2.5, width: '86%', borderRadius: 2, backgroundColor: 'transparent' },
  tabLineActive: { backgroundColor: Colors.primary },
  content: { paddingHorizontal: 20, paddingTop: 18 },
  bottom: {
    flexDirection: 'row', gap: 10, paddingHorizontal: 18, paddingTop: 12,
    backgroundColor: Colors.cream, borderTopWidth: 1, borderTopColor: Colors.border,
  },
});
