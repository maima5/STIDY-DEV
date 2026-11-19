import { api } from './api';
import { Attachment, Course, CourseInput, Material, MaterialLevel } from '@/types/schedule';

// Semua endpoint mutasi mengembalikan Course lengkap terbaru (lihat backend schedules.routes.ts).

export async function fetchCourses() {
  return (await api<Course[]>('/schedules')).data;
}

export async function createCourse(input: CourseInput) {
  return (await api<Course>('/schedules', { method: 'POST', body: input })).data;
}

export async function updateCourse(id: string, input: CourseInput) {
  return (await api<Course>(`/schedules/${id}`, { method: 'PUT', body: input })).data;
}

export async function deleteCourse(id: string) {
  await api(`/schedules/${id}`, { method: 'DELETE' });
}

export async function createMaterial(courseId: string, title: string) {
  return (await api<Course>(`/schedules/${courseId}/materials`, { method: 'POST', body: { title } })).data;
}

export interface MaterialPatch {
  title?: string;
  done?: boolean;
  /** Tanggal lokal saat ditandai selesai, "YYYY-MM-DD" */
  completedAt?: string;
  note?: string;
  estimateMinutes?: number;
  level?: MaterialLevel;
}

export async function updateMaterial(courseId: string, materialId: Material['id'], patch: MaterialPatch) {
  return (await api<Course>(`/schedules/${courseId}/materials/${materialId}`, { method: 'PATCH', body: patch })).data;
}

export async function createAttachment(courseId: string, materialId: string, file: Omit<Attachment, 'id'>) {
  return (await api<Course>(`/schedules/${courseId}/materials/${materialId}/attachments`, {
    method: 'POST', body: file,
  })).data;
}

export async function deleteAttachment(courseId: string, materialId: string, attachmentId: string) {
  return (await api<Course>(`/schedules/${courseId}/materials/${materialId}/attachments/${attachmentId}`, {
    method: 'DELETE',
  })).data;
}
