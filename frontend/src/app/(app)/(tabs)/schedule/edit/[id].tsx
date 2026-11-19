import { Redirect, router, useLocalSearchParams } from 'expo-router';
import CourseForm from '@/components/schedule/CourseForm';
import LoadingScreen from '@/components/schedule/LoadingScreen';
import { useSchedule } from '@/context/schedule-context';

const goBack = () => (router.canGoBack() ? router.back() : router.replace('/schedule'));

export default function EditCourseScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getCourse, updateCourse, loading } = useSchedule();
  const course = getCourse(id);

  if (!course && loading) return <LoadingScreen />;
  if (!course) return <Redirect href="/schedule" />;

  return (
    <CourseForm
      mode="edit"
      initial={course}
      onCancel={goBack}
      onSubmit={async (input) => { await updateCourse(course.id, input); goBack(); }}
    />
  );
}
