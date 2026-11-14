import { Redirect, router, useLocalSearchParams } from 'expo-router';
import CourseForm from '@/components/schedule/CourseForm';
import { useSchedule } from '@/context/schedule-context';

const goBack = () => (router.canGoBack() ? router.back() : router.replace('/schedule'));

export default function EditCourseScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getCourse, updateCourse } = useSchedule();
  const course = getCourse(id);

  if (!course) return <Redirect href="/schedule" />;

  return (
    <CourseForm
      mode="edit"
      initial={course}
      onCancel={goBack}
      onSubmit={(input) => { updateCourse(course.id, input); goBack(); }}
    />
  );
}
