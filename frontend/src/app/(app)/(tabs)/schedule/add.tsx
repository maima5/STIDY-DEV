import { router } from 'expo-router';
import CourseForm from '@/components/schedule/CourseForm';
import { useSchedule } from '@/context/schedule-context';

const goBack = () => (router.canGoBack() ? router.back() : router.replace('/schedule'));

export default function AddCourseScreen() {
  const { addCourse } = useSchedule();
  return (
    <CourseForm
      mode="add"
      onCancel={goBack}
      onSubmit={(input) => { addCourse(input); goBack(); }}
    />
  );
}
