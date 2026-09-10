export interface Classroom {
  id: string;
  name: string;
  description: string;
  code: string;
  teacherId: string;
  teacherName: string;
  createdAt: string;
}

export interface ClassEnrollment {
  id: string;
  classId: string;
  className?: string;
  classCode?: string;
  teacherName?: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  enrolledAt: string;
}
