import type { Assignment, StudentAssignmentInstance, AssignmentSubmission } from '../types/assignment';

const API_BASE = 'http://localhost:8080/api';

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
  }): Promise<Assignment> {
    const res = await fetch(`${API_BASE}/assignments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Không thể tạo bài tập');
    }
    return res.json();
  },

  async getAssignmentsByClass(classId: string): Promise<Assignment[]> {
    const res = await fetch(`${API_BASE}/assignments/class/${classId}`);
    if (!res.ok) return [];
    return res.json();
  },

  async getStudentInstance(assignmentId: string, studentId: string): Promise<StudentAssignmentInstance> {
    const res = await fetch(`${API_BASE}/assignments/${assignmentId}/student-instance?studentId=${studentId}`);
    if (!res.ok) {
      const err = await res.json();
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
    const res = await fetch(`${API_BASE}/submissions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Chấm bài thất bại');
    }
    return res.json();
  },

  async getSubmissionsByAssignment(assignmentId: string): Promise<AssignmentSubmission[]> {
    const res = await fetch(`${API_BASE}/submissions/assignment/${assignmentId}`);
    if (!res.ok) return [];
    return res.json();
  },

  async getStudentSubmission(assignmentId: string, studentId: string): Promise<AssignmentSubmission | null> {
    const res = await fetch(`${API_BASE}/submissions/assignment/${assignmentId}/student/${studentId}`);
    if (!res.ok) return null;
    return res.json();
  }
};
