import React, { useEffect, useState } from 'react';
import { classService } from '../services/classService';
import type { Classroom } from '../types/class';
import { CreateClassModal } from '../components/class/CreateClassModal';
import { CreateAssignmentModal } from '../components/assignment/CreateAssignmentModal';
import { ClassRosterView } from '../components/class/ClassRosterView';

interface TeacherClassesPageProps {
  teacherId: string;
  teacherName: string;
  onBackToMain?: () => void;
}

export const TeacherClassesPage: React.FC<TeacherClassesPageProps> = ({ teacherId, teacherName, onBackToMain }) => {
  const [classes, setClasses] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateClass, setShowCreateClass] = useState(false);
  const [selectedClassForAssignment, setSelectedClassForAssignment] = useState<Classroom | null>(null);
  const [selectedClassForRoster, setSelectedClassForRoster] = useState<Classroom | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    fetchClasses();
  }, [teacherId]);

  const fetchClasses = async () => {
    setLoading(true);
    const data = await classService.getTeacherClasses(teacherId);
    setClasses(data);
    setLoading(false);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-10 font-sans">
      {/* Header Bar */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
            👨‍🏫 Quản Lý Lớp Học & Bài Tập PhET
          </h1>
          <p className="text-sm text-slate-400 mt-1">Giáo viên: {teacherName} ({teacherId})</p>
        </div>

        <div className="flex gap-3">
          {onBackToMain && (
            <button
              onClick={onBackToMain}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-semibold transition-all"
            >
              ← Về Thí Nghiệm
            </button>
          )}
          <button
            onClick={() => setShowCreateClass(true)}
            className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white rounded-xl font-bold shadow-lg shadow-emerald-900/30 transition-all flex items-center gap-2"
          >
            <span>✨</span> Tạo Lớp Học Mới
          </button>
        </div>
      </div>

      {/* Class List Grid */}
      <div className="max-w-6xl mx-auto">
        {loading ? (
          <div className="text-center py-16 text-slate-400 animate-pulse">Đang tải danh sách lớp học...</div>
        ) : classes.length === 0 ? (
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-12 text-center max-w-lg mx-auto">
            <div className="text-5xl mb-4">🏫</div>
            <h3 className="text-lg font-bold text-slate-200 mb-2">Chưa có lớp học nào</h3>
            <p className="text-xs text-slate-400 mb-6">Hãy tạo lớp học đầu tiên để lấy Mã Lớp (Class Code) gửi cho học sinh và giao bài tập cá nhân hóa bằng AI Groq.</p>
            <button
              onClick={() => setShowCreateClass(true)}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-semibold"
            >
              Tạo Lớp Ngay
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map(cls => (
              <div
                key={cls.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-700 transition-all shadow-xl group"
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-lg text-emerald-400 group-hover:text-emerald-300 transition-colors">
                      {cls.name}
                    </h3>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Active
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mb-4 line-clamp-2">{cls.description || 'Không có mô tả'}</p>

                  {/* Class Code Card */}
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 mb-6 flex justify-between items-center">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-bold block">Class Code (Mã Lớp)</span>
                      <span className="font-mono text-xl font-extrabold text-cyan-400 tracking-widest">{cls.code}</span>
                    </div>
                    <button
                      onClick={() => handleCopyCode(cls.code)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 rounded-lg transition-colors flex items-center gap-1"
                    >
                      {copiedCode === cls.code ? '✓ Đã Copy' : '📋 Copy'}
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80">
                  <button
                    onClick={() => setSelectedClassForAssignment(cls)}
                    className="px-3 py-2 bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 rounded-xl text-xs font-semibold transition-colors text-center"
                  >
                    🧪 Giao Bài Tập
                  </button>
                  <button
                    onClick={() => setSelectedClassForRoster(cls)}
                    className="px-3 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-semibold transition-colors text-center"
                  >
                    📊 Bảng Điểm & AI
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {showCreateClass && (
        <CreateClassModal
          teacherId={teacherId}
          teacherName={teacherName}
          onClose={() => setShowCreateClass(false)}
          onCreated={newCls => setClasses(prev => [newCls, ...prev])}
        />
      )}

      {selectedClassForAssignment && (
        <CreateAssignmentModal
          classId={selectedClassForAssignment.id}
          teacherId={teacherId}
          onClose={() => setSelectedClassForAssignment(null)}
          onCreated={() => alert('Đã giao bài tập thành công!')}
        />
      )}

      {selectedClassForRoster && (
        <ClassRosterView
          classId={selectedClassForRoster.id}
          classNameTitle={selectedClassForRoster.name}
          onClose={() => setSelectedClassForRoster(null)}
        />
      )}
    </div>
  );
};

export default TeacherClassesPage;
