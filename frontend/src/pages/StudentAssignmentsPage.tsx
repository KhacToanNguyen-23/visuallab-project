import React, { useEffect, useState } from 'react';
import { classService } from '../services/classService';
import { assignmentService } from '../services/assignmentService';
import type { ClassEnrollment } from '../types/class';
import type { Assignment } from '../types/assignment';
import { JoinClassModal } from '../components/class/JoinClassModal';
import { StudentLabAssignmentView } from '../components/assignment/StudentLabAssignmentView';

interface StudentAssignmentsPageProps {
  studentId: string;
  studentName: string;
  studentEmail: string;
  onBackToMain?: () => void;
}

export const StudentAssignmentsPage: React.FC<StudentAssignmentsPageProps> = ({
  studentId,
  studentName,
  studentEmail,
  onBackToMain,
}) => {
  const [enrollments, setEnrollments] = useState<ClassEnrollment[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [activeAssignment, setActiveAssignment] = useState<Assignment | null>(null);
  const [loading, setLoading] = useState(true);
  const [showJoinModal, setShowJoinModal] = useState(false);

  useEffect(() => {
    fetchEnrollments();
  }, [studentId]);

  const fetchEnrollments = async () => {
    setLoading(true);
    const data = await classService.getStudentEnrollments(studentId);
    setEnrollments(data);
    
    const searchParams = new URLSearchParams(window.location.search);
    const urlClassId = searchParams.get('classId');

    if (urlClassId && data.some(e => e.classId === urlClassId)) {
      handleSelectClass(urlClassId);
    } else if (data.length > 0) {
      handleSelectClass(data[0].classId);
    } else {
      setLoading(false);
    }
  };

  const handleSelectClass = async (classId: string) => {
    setSelectedClassId(classId);
    const asgs = await assignmentService.getAssignmentsByClass(classId);
    setAssignments(asgs);
    setLoading(false);
  };

  if (activeAssignment) {
    return (
      <StudentLabAssignmentView
        assignment={activeAssignment}
        studentId={studentId}
        studentName={studentName}
        onBack={() => setActiveAssignment(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-10 font-sans">
      {/* Header Bar */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">
            🎓 Lớp Học & Bài Tập Thí Nghiệm Đã Tham Gia
          </h1>
          <p className="text-sm text-slate-400 mt-1">Học sinh: {studentName} ({studentId})</p>
        </div>

        <div className="flex gap-3">
          {onBackToMain && (
            <button
              onClick={onBackToMain}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-semibold transition-all"
            >
              ← Về Mô Phỏng Lab
            </button>
          )}
          <button
            onClick={() => setShowJoinModal(true)}
            className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl font-bold shadow-lg shadow-cyan-900/30 transition-all flex items-center gap-2"
          >
            <span>➕</span> Tham Gia Lớp Bằng Class Code
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Enrolled Classes Sidebar (1 col) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 px-2">
            Lớp Học Đã Tham Gia ({enrollments.length})
          </h3>

          {enrollments.length === 0 ? (
            <p className="text-xs text-slate-500 p-2">Bạn chưa tham gia lớp học nào.</p>
          ) : (
            <div className="space-y-2">
              {enrollments.map(enr => (
                <button
                  key={enr.id}
                  onClick={() => handleSelectClass(enr.classId)}
                  className={`w-full text-left p-3 rounded-xl text-xs font-bold transition-all ${
                    selectedClassId === enr.classId
                      ? 'bg-cyan-600/20 text-cyan-300 border border-cyan-500/40'
                      : 'bg-slate-950 text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  🏫 {enr.className || `Lớp học (${enr.classCode || enr.classId})`}
                  <span className="block text-[10px] text-slate-500 font-normal mt-0.5">
                    Mã: <span className="font-mono text-cyan-400 font-bold">{enr.classCode || enr.classId}</span> | GV: {enr.teacherName || 'Giáo viên'}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Assignments List (3 cols) */}
        <div className="md:col-span-3">
          <h2 className="text-xl font-bold text-slate-200 mb-4">Danh Sách Bài Tập Lab Được Giao</h2>

          {loading ? (
            <div className="text-center py-12 text-slate-400">Đang tải danh sách bài tập...</div>
          ) : assignments.length === 0 ? (
            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-10 text-center text-slate-500">
              Chưa có bài tập nào được giao trong lớp này.
            </div>
          ) : (
            <div className="space-y-4">
              {assignments.map(asg => (
                <div
                  key={asg.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex justify-between items-center hover:border-slate-700 transition-all shadow-lg"
                >
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-2 inline-block">
                      {asg.labType} LAB
                    </span>
                    <h3 className="font-bold text-lg text-emerald-400">{asg.title}</h3>
                    <p className="text-xs text-slate-400 mt-1">{asg.description}</p>
                  </div>

                  <button
                    onClick={() => setActiveAssignment(asg)}
                    className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white rounded-xl text-sm font-bold shadow-md shadow-emerald-900/30 transition-all"
                  >
                    🚀 Mở Thí Nghiệm & Làm Bài
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showJoinModal && (
        <JoinClassModal
          studentId={studentId}
          studentName={studentName}
          studentEmail={studentEmail}
          onClose={() => setShowJoinModal(false)}
          onJoined={newEnr => setEnrollments(prev => [...prev, newEnr])}
        />
      )}
    </div>
  );
};

export default StudentAssignmentsPage;
