import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import * as scheduleApi from '@/services/schedule';
import { Attachment, Course, CourseInput, Material } from '@/types/schedule';
import { notify } from '@/utils/confirm';
import { toISODate } from '@/utils/date';

type Ctx = {
  courses: Course[];
  /** true selama pemuatan pertama dari server */
  loading: boolean;
  /** pesan error pemuatan terakhir (null bila berhasil) */
  error: string | null;
  refresh: () => Promise<void>;
  getCourse: (id: string) => Course | undefined;
  /** Mengembalikan id course baru. Melempar error bila gagal (pesan sudah ditampilkan). */
  addCourse: (input: CourseInput) => Promise<string>;
  updateCourse: (id: string, input: CourseInput) => Promise<void>;
  deleteCourse: (id: string) => Promise<void>;
  addMaterial: (courseId: string, title: string) => Promise<void>;
  toggleMaterial: (courseId: string, materialId: string) => Promise<void>;
  saveNote: (courseId: string, materialId: string, note: string) => Promise<void>;
  addAttachment: (courseId: string, materialId: string, file: Omit<Attachment, 'id'>) => Promise<void>;
  removeAttachment: (courseId: string, materialId: string, attachmentId: string) => Promise<void>;
};

const ScheduleContext = createContext<Ctx | null>(null);

export function useSchedule() {
  const ctx = useContext(ScheduleContext);
  if (!ctx) throw new Error('useSchedule harus dipakai di dalam ScheduleProvider');
  return ctx;
}

const messageOf = (err: unknown) => (err instanceof Error ? err.message : 'Terjadi kesalahan, coba lagi.');

/** Jadwal belajar user, disinkronkan dengan backend `/api/schedules`. */
export function ScheduleProvider({ children }: { children: ReactNode }) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setCourses(await scheduleApi.fetchCourses());
      setError(null);
    } catch (err) {
      setError(messageOf(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const replaceCourse = (course: Course) =>
    setCourses((prev) => (prev.some((c) => c.id === course.id)
      ? prev.map((c) => (c.id === course.id ? course : c))
      : [...prev, course]));

  const patchMaterialLocal = (courseId: string, materialId: string, fn: (m: Material) => Material) =>
    setCourses((prev) => prev.map((c) => (c.id !== courseId ? c : {
      ...c, materials: c.materials.map((m) => (m.id === materialId ? fn(m) : m)),
    })));

  /** Jalankan request; tampilkan pesan & lempar ulang bila gagal. */
  const run = async <T,>(title: string, fn: () => Promise<T>): Promise<T> => {
    try {
      return await fn();
    } catch (err) {
      notify(title, messageOf(err));
      throw err;
    }
  };

  /** Update optimistis untuk satu materi; dikembalikan ke state semula bila request gagal. */
  const optimisticMaterial = async (
    courseId: string, materialId: string, fn: (m: Material) => Material,
    request: () => Promise<Course>, errorTitle: string,
  ) => {
    const before = courses.find((c) => c.id === courseId);
    patchMaterialLocal(courseId, materialId, fn);
    try {
      replaceCourse(await request());
    } catch (err) {
      if (before) replaceCourse(before);
      notify(errorTitle, messageOf(err));
    }
  };

  const value: Ctx = {
    courses,
    loading,
    error,
    refresh,
    getCourse: (id) => courses.find((c) => c.id === id),

    addCourse: (input) => run('Gagal menyimpan', async () => {
      const course = await scheduleApi.createCourse(input);
      replaceCourse(course);
      return course.id;
    }),

    updateCourse: (id, input) => run('Gagal menyimpan', async () => {
      replaceCourse(await scheduleApi.updateCourse(id, input));
    }),

    deleteCourse: (id) => run('Gagal menghapus', async () => {
      await scheduleApi.deleteCourse(id);
      setCourses((prev) => prev.filter((c) => c.id !== id));
    }),

    addMaterial: (courseId, title) => run('Gagal menambah materi', async () => {
      replaceCourse(await scheduleApi.createMaterial(courseId, title));
    }),

    toggleMaterial: async (courseId, materialId) => {
      const material = courses.find((c) => c.id === courseId)?.materials.find((m) => m.id === materialId);
      if (!material) return;
      const done = !material.done;
      const completedAt = done ? toISODate(new Date()) : undefined;
      await optimisticMaterial(
        courseId, materialId, (m) => ({ ...m, done, completedAt }),
        () => scheduleApi.updateMaterial(courseId, materialId, { done, completedAt }),
        'Gagal memperbarui materi',
      );
    },

    saveNote: (courseId, materialId, note) => optimisticMaterial(
      courseId, materialId, (m) => ({ ...m, note }),
      () => scheduleApi.updateMaterial(courseId, materialId, { note }),
      'Gagal menyimpan catatan',
    ),

    addAttachment: (courseId, materialId, file) => run('Gagal menambah lampiran', async () => {
      replaceCourse(await scheduleApi.createAttachment(courseId, materialId, file));
    }),

    removeAttachment: (courseId, materialId, attachmentId) => optimisticMaterial(
      courseId, materialId, (m) => ({ ...m, attachments: m.attachments.filter((a) => a.id !== attachmentId) }),
      () => scheduleApi.deleteAttachment(courseId, materialId, attachmentId),
      'Gagal menghapus lampiran',
    ),
  };

  return <ScheduleContext.Provider value={value}>{children}</ScheduleContext.Provider>;
}

/** Ringkasan progres satu mata kuliah. */
export function courseProgress(course: Course) {
  const total = course.materials.length;
  const done = course.materials.filter((m) => m.done).length;
  return { total, done, percent: total ? Math.round((done / total) * 100) : 0 };
}
