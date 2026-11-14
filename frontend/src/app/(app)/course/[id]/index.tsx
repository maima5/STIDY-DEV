import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { Href, Redirect, router, useLocalSearchParams } from 'expo-router';
import AddMaterialModal from '@/components/schedule/AddMaterialModal';
import MaterialRow from '@/components/schedule/MaterialRow';
import ScreenBackground from '@/components/schedule/ScreenBackground';
import StackHeader from '@/components/schedule/StackHeader';
import { DaysBadge, Eyebrow } from '@/components/schedule/ScheduleBits';
import GradientButton from '@/components/ui/GradientButton';
import OptionSheet from '@/components/ui/OptionSheet';
import Select from '@/components/ui/Select';
import { Colors } from '@/constants/auth-theme';
import { courseProgress, useSchedule } from '@/context/schedule-context';
import { MaterialFilter } from '@/types/schedule';
import { confirmAction } from '@/utils/confirm';
import { daysUntil, formatDateShort } from '@/utils/date';

const FILTERS: { label: string; value: MaterialFilter }[] = [
  { label: 'Semua', value: 'all' },
  { label: 'Selesai', value: 'done' },
  { label: 'Belum Mulai', value: 'todo' },
];

const goBack = () => (router.canGoBack() ? router.back() : router.replace('/schedule'));

export default function CourseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { getCourse, deleteCourse, toggleMaterial, addMaterial } = useSchedule();
  const [filter, setFilter] = useState<MaterialFilter>('all');
  const [menuOpen, setMenuOpen] = useState(false);
  const [adding, setAdding] = useState(false);

  const course = getCourse(id);
  if (!course) return <Redirect href="/schedule" />;

  const { total, done, percent } = courseProgress(course);
  const visible = course.materials
    .map((material, index) => ({ material, number: index + 1 }))
    .filter(({ material }) => filter === 'all' || (filter === 'done') === material.done);

  const onMenu = (action: 'edit' | 'delete') => {
    if (action === 'edit') return router.push(`/schedule/edit/${course.id}` as Href);
    confirmAction('Hapus jadwal?', `"${course.name}" beserta seluruh materinya akan dihapus.`, () => {
      goBack();
      deleteCourse(course.id);
    });
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <StackHeader
        title={course.name}
        backLabel="Jadwal Belajar"
        onBack={goBack}
        right={
          <Pressable style={styles.more} onPress={() => setMenuOpen(true)}>
            <Feather name="more-horizontal" size={18} color={Colors.text} />
          </Pressable>
        }
      />

      <View style={{ flex: 1 }}>
        <ScreenBackground />
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* kartu ringkasan mata kuliah */}
          <View style={styles.hero}>
            <View style={styles.ring} />
            <View style={styles.heroTop}>
              <LinearGradient colors={[Colors.primaryLight, Colors.primaryDark]} style={styles.heroIcon}>
                <Feather name="book-open" size={22} color="#fff" />
              </LinearGradient>
              <View style={{ flex: 1 }}>
                <Eyebrow>MATA KULIAH</Eyebrow>
                <Text style={styles.heroName}>{course.name}</Text>
              </View>
            </View>

            <View style={styles.heroMeta}>
              <Feather name="calendar" size={14} color={Colors.muted} />
              <Text style={styles.heroDate}>Ujian: {formatDateShort(course.examDate)}</Text>
              <DaysBadge days={daysUntil(course.examDate)} />
            </View>

            <View style={styles.divider} />
            <View style={styles.progressRow}>
              <Text style={styles.progressText}>{done} dari {total} materi selesai</Text>
              <Text style={styles.percent}>{percent}%</Text>
            </View>

            <GradientButton
              label="Mulai Sesi Fokus" iconLeft="play"
              onPress={() => router.push('/focus-settings')}
              style={{ marginTop: 22 }}
            />
          </View>

          {/* daftar materi */}
          <View style={styles.sectionHead}>
            <View style={{ flex: 1 }}>
              <Eyebrow muted>RENCANA BELAJAR</Eyebrow>
              <View style={styles.sectionTitleRow}>
                <Text style={styles.sectionTitle}>Daftar Materi Belajar</Text>
                <View style={styles.count}><Text style={styles.countText}>{total} Materi</Text></View>
              </View>
            </View>
            <Select compact value={filter} options={FILTERS} onChange={setFilter} title="Filter materi" style={{ width: 116 }} />
          </View>

          {visible.length === 0 ? (
            <Text style={styles.empty}>
              {total === 0 ? 'Belum ada materi. Tambahkan materi pertamamu.' : 'Tidak ada materi pada filter ini.'}
            </Text>
          ) : (
            visible.map(({ material, number }) => (
              <MaterialRow
                key={material.id}
                material={material}
                number={number}
                onToggle={() => toggleMaterial(course.id, material.id)}
                onPress={() => router.push(`/course/${course.id}/material/${material.id}` as Href)}
              />
            ))
          )}
        </ScrollView>
      </View>

      <View style={[styles.bottom, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <GradientButton label="Tambah Materi" iconLeft="plus" variant="soft" height={50} onPress={() => setAdding(true)} />
      </View>

      <OptionSheet
        visible={menuOpen}
        title={course.name}
        options={[
          { label: 'Edit Mata Kuliah', value: 'edit' as const, icon: 'edit-2' },
          { label: 'Hapus Mata Kuliah', value: 'delete' as const, icon: 'trash-2', destructive: true },
        ]}
        onSelect={onMenu}
        onClose={() => setMenuOpen(false)}
      />
      <AddMaterialModal
        visible={adding}
        onClose={() => setAdding(false)}
        onSubmit={(title) => addMaterial(course.id, title)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.cream },
  scroll: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 24 },
  more: {
    width: 38, height: 38, borderRadius: 12, backgroundColor: '#fff', borderWidth: 1,
    borderColor: Colors.border, alignItems: 'center', justifyContent: 'center',
  },
  hero: {
    backgroundColor: Colors.mintWash, borderRadius: 24, padding: 18, overflow: 'hidden',
    borderWidth: 1, borderColor: Colors.mintBorder,
  },
  ring: {
    position: 'absolute', top: -50, right: -40, width: 160, height: 160, borderRadius: 80,
    borderWidth: 26, borderColor: 'rgba(255,255,255,0.55)',
  },
  heroTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  heroIcon: { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  heroName: { fontSize: 20, fontWeight: '800', color: Colors.text, marginTop: 6 },
  heroMeta: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 18 },
  heroDate: { flex: 1, fontSize: 11.5, fontWeight: '600', color: Colors.text },
  divider: { height: 1, backgroundColor: Colors.mintBorder, marginTop: 16, marginBottom: 14 },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  progressText: { fontSize: 11, color: Colors.muted },
  percent: { fontSize: 12, fontWeight: '800', color: Colors.deep },
  sectionHead: { flexDirection: 'row', alignItems: 'flex-end', gap: 10, marginTop: 28, marginBottom: 14 },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginTop: 6 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: Colors.text },
  count: { backgroundColor: Colors.primarySoft, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  countText: { fontSize: 9, fontWeight: '800', color: Colors.deep },
  empty: { fontSize: 12, color: Colors.muted, textAlign: 'center', paddingVertical: 28 },
  bottom: {
    paddingHorizontal: 20, paddingTop: 12, backgroundColor: Colors.cream,
    borderTopWidth: 1, borderTopColor: Colors.border,
  },
});
