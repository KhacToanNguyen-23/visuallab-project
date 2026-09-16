import type { Assignment, StudentAssignmentInstance, AssignmentSubmission } from '../types/assignment';
import { API_BASE_URL } from '../config/api';
import { fetchWithAuth } from './apiClient';

const API_BASE = API_BASE_URL;

export const assignmentService = {
  async createAssignment(data: {
    classId: string;
    title: string;
    description: string;
    labType: string;
    paramBoundsJson: string;
    targetFormula: string;
    tolerancePercent: number;
    teacherId: string;
    dueDate?: string;
  }): Promise<Assignment> {
    const res = await fetchWithAuth(`${API_BASE}/assignments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Không thể tạo bài tập');
    }
    return res.json();
  },

  async getAssignmentsByClass(classId: string): Promise<Assignment[]> {
    const res = await fetchWithAuth(`${API_BASE}/assignments/class/${classId}`);
    if (!res.ok) return [];
    const list: Assignment[] = await res.json();
    return Array.from(
      new Map(list.map(a => [(a.labType && a.labType.trim()) || a.title, a])).values()
    );
  },

  async deleteAssignment(id: string): Promise<boolean> {
    const res = await fetchWithAuth(`${API_BASE}/assignments/${id}`, {
      method: 'DELETE',
    });
    return res.ok;
  },

  async getStudentInstance(assignmentId: string, studentId: string): Promise<StudentAssignmentInstance> {
    const res = await fetchWithAuth(`${API_BASE}/assignments/${assignmentId}/student-instance?studentId=${studentId}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Không thể lấy thông số bài tập cá nhân');
    }
    return res.json();
  },

  async submitAssignment(data: {
    instanceId: string;
    studentId: string;
    studentName: string;
    submittedAnswersJson: string;
    explanation: string;
  }): Promise<AssignmentSubmission> {
    const res = await fetchWithAuth(`${API_BASE}/submissions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Chấm bài thất bại');
    }
    return res.json();
  },

  async getSubmissionsByAssignment(assignmentId: string): Promise<AssignmentSubmission[]> {
    const res = await fetchWithAuth(`${API_BASE}/submissions/assignment/${assignmentId}`);
    if (!res.ok) return [];
    return res.json();
  },

  async getStudentSubmission(assignmentId: string, studentId: string): Promise<AssignmentSubmission | null> {
    const res = await fetchWithAuth(`${API_BASE}/submissions/assignment/${assignmentId}/student/${studentId}`);
    if (!res.ok) return null;
    return res.json();
  },

  async getSubmissionsByTeacher(teacherId: string): Promise<AssignmentSubmission[]> {
    const res = await fetchWithAuth(`${API_BASE}/submissions/teacher/${teacherId}`);
    if (!res.ok) return [];
    return res.json();
  },

  async gradeSubmission(id: string, totalScore: number, feedback?: string): Promise<AssignmentSubmission> {
    const res = await fetchWithAuth(`${API_BASE}/submissions/${id}/grade`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ totalScore, feedback }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Không thể lưu điểm');
    }
    return res.json();
  },
};
