import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Href, router } from 'expo-router';
import AppHeader from '@/components/dashboard/AppHeader';
import CourseCard from '@/components/schedule/CourseCard';
import EmptySchedule from '@/components/schedule/EmptySchedule';
import ScreenBackground from '@/components/schedule/ScreenBackground';
import { Eyebrow } from '@/components/schedule/ScheduleBits';
import GradientButton from '@/components/ui/GradientButton';
import { Colors } from '@/constants/auth-theme';
import { MOCK_USER } from '@/constants/mock-user';
import { useSchedule } from '@/context/schedule-context';
import { Course } from '@/types/schedule';
import { confirmAction } from '@/utils/confirm';

export default function ScheduleScreen() {
  const { courses, deleteCourse } = useSchedule();

  const onDelete = (course: Course) =>
    confirmAction('Hapus jadwal?', `"${course.name}" beserta seluruh materinya akan dihapus.`, () => deleteCourse(course.id));

  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <AppHeader initials={MOCK_USER.initials} />
      <View style={{ flex: 1 }}>
        <ScreenBackground />
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* breadcrumb */}
          <View style={styles.crumbs}>
            <Text style={styles.crumb} onPress={() => router.navigate('/home')}>Beranda</Text>
            <Feather name="chevron-right" size={12} color={Colors.placeholder} />
            <Text style={styles.crumb}>Jadwal Belajar</Text>
          </View>

          <Pressable style={styles.back} onPress={() => router.navigate('/home')} hitSlop={8}>
            <Feather name="chevron-left" size={18} color={Colors.text} />
            <Text style={styles.backText}>Dashboard</Text>
          </Pressable>

          <Eyebrow>RENCANA BELAJAR</Eyebrow>
          <Text style={styles.title}>Jadwal Belajar</Text>
          <Text style={styles.sub}>Atur target belajar berdasarkan mata kuliah agar progresmu tetap terarah.</Text>

          <View style={styles.list}>
            {courses.length === 0 ? (
              <EmptySchedule />
            ) : (
              courses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onPress={() => router.push(`/course/${course.id}` as Href)}
                  onDelete={() => onDelete(course)}
                />
              ))
            )}
          </View>

          <GradientButton
            label="Tambah Jadwal Belajar" iconLeft="plus"
            onPress={() => router.push('/schedule/add' as Href)}
          />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.cream },
  scroll: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 32 },
  crumbs: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  crumb: { fontSize: 10.5, color: Colors.muted },
  back: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'center', marginTop: 22, marginBottom: 26 },
  backText: { fontSize: 12.5, fontWeight: '700', color: Colors.text },
  title: { fontSize: 30, fontWeight: '800', color: Colors.text, marginTop: 14, letterSpacing: -0.5 },
  sub: { fontSize: 12.5, lineHeight: 20, color: Colors.muted, marginTop: 10, maxWidth: 340 },
  list: { marginTop: 26 },
});
