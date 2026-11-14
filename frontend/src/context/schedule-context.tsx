import { createContext, ReactNode, useContext, useState } from 'react';
import { MOCK_COURSES } from '@/constants/mock-schedule';
import { Attachment, Course, CourseInput, Material } from '@/types/schedule';
import { toISODate } from '@/utils/date';

type Ctx = {
  courses: Course[];
  getCourse: (id: string) => Course | undefined;
  addCourse: (input: CourseInput) => string;
  updateCourse: (id: string, input: CourseInput) => void;
  deleteCourse: (id: string) => void;
  addMaterial: (courseId: string, title: string) => void;
  toggleMaterial: (courseId: string, materialId: string) => void;
  saveNote: (courseId: string, materialId: string, note: string) => void;
  addAttachment: (courseId: string, materialId: string, file: Omit<Attachment, 'id'>) => void;
  removeAttachment: (courseId: string, materialId: string, attachmentId: string) => void;
};

const ScheduleContext = createContext<Ctx | null>(null);

export function useSchedule() {
  const ctx = useContext(ScheduleContext);
  if (!ctx) throw new Error('useSchedule harus dipakai di dalam ScheduleProvider');
  return ctx;
}

const newId = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

const newMaterial = (title: string): Material => ({
  id: newId(), title, estimateMinutes: 45, level: 'Menengah', done: false, note: '', attachments: [],
});

// TODO: sambungkan ke services/ (API backend) — saat ini state hanya hidup di memori
export function ScheduleProvider({ children }: { children: ReactNode }) {
  const [courses, setCourses] = useState<Course[]>(MOCK_COURSES);

  const patchMaterial = (courseId: string, materialId: string, fn: (m: Material) => Material) =>
    setCourses((prev) => prev.map((c) => (c.id !== courseId ? c : {
      ...c, materials: c.materials.map((m) => (m.id === materialId ? fn(m) : m)),
    })));

  const value: Ctx = {
    courses,
    getCourse: (id) => courses.find((c) => c.id === id),

    addCourse: (input) => {
      const id = newId();
      setCourses((prev) => [...prev, {
        id, name: input.name, examDate: input.examDate, hoursPerDay: input.hoursPerDay,
        materials: input.materials.map((m) => newMaterial(m.title)),
      }]);
      return id;
    },

    updateCourse: (id, input) =>
      setCourses((prev) => prev.map((c) => (c.id !== id ? c : {
        ...c, name: input.name, examDate: input.examDate, hoursPerDay: input.hoursPerDay,
        materials: input.materials.map((row) => {
          const existing = c.materials.find((m) => m.id === row.id);
          return existing ? { ...existing, title: row.title } : newMaterial(row.title);
        }),
      }))),

    deleteCourse: (id) => setCourses((prev) => prev.filter((c) => c.id !== id)),

    addMaterial: (courseId, title) =>
      setCourses((prev) => prev.map((c) => (c.id !== courseId ? c : {
        ...c, materials: [...c.materials, newMaterial(title)],
      }))),

    toggleMaterial: (courseId, materialId) =>
      patchMaterial(courseId, materialId, (m) => ({
        ...m, done: !m.done, completedAt: m.done ? undefined : toISODate(new Date()),
      })),

    saveNote: (courseId, materialId, note) => patchMaterial(courseId, materialId, (m) => ({ ...m, note })),

    addAttachment: (courseId, materialId, file) =>
      patchMaterial(courseId, materialId, (m) => ({ ...m, attachments: [...m.attachments, { id: newId(), ...file }] })),

    removeAttachment: (courseId, materialId, attachmentId) =>
      patchMaterial(courseId, materialId, (m) => ({
        ...m, attachments: m.attachments.filter((a) => a.id !== attachmentId),
      })),
  };

  return <ScheduleContext.Provider value={value}>{children}</ScheduleContext.Provider>;
}

/** Ringkasan progres satu mata kuliah. */
export function courseProgress(course: Course) {
  const total = course.materials.length;
  const done = course.materials.filter((m) => m.done).length;
  return { total, done, percent: total ? Math.round((done / total) * 100) : 0 };
}
