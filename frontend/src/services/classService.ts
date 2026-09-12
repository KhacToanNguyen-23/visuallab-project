import type { Classroom, ClassEnrollment } from '../types/class';
import { API_BASE_URL } from '../config/api';

const API_BASE = `${API_BASE_URL}/classes`;

export const classService = {
  async createClass(name: string, description: string, teacherId: string, teacherName: string): Promise<Classroom> {
    const res = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description, teacherId, teacherName }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Không thể tạo lớp học');
    }
    return res.json();
  },

  async joinClass(code: string, studentId: string, studentName: string, studentEmail: string): Promise<ClassEnrollment> {
    const res = await fetch(`${API_BASE}/join`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, studentId, studentName, studentEmail }),
    });
    if (!res.ok) {
      const err = await res.json();
      const error: any = new Error(err.message || 'Không thể tham gia lớp học');
      if (res.status === 409 || err.code === 'ALREADY_JOINED') {
        error.isDuplicate = true;
      }
      throw error;
    }
    return res.json();
  },

  async getTeacherClasses(teacherId: string): Promise<Classroom[]> {
    const res = await fetch(`${API_BASE}/teacher/${teacherId}`);
    if (!res.ok) return [];
    return res.json();
  },

  async getStudentEnrollments(studentId: string): Promise<ClassEnrollment[]> {
    const res = await fetch(`${API_BASE}/student/${studentId}`);
    if (!res.ok) return [];
    return res.json();
  },

  async getClassRoster(classId: string): Promise<ClassEnrollment[]> {
    const res = await fetch(`${API_BASE}/${classId}/roster`);
    if (!res.ok) return [];
    return res.json();
  },

  async getClassDetails(classId: string): Promise<Classroom | null> {
    const res = await fetch(`${API_BASE}/${classId}`);
    if (!res.ok) return null;
    return res.json();
  }
};
