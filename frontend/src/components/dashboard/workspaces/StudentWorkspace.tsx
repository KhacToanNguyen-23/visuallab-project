import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { User } from '../../../context/AuthContext';
import { classService } from '../../../services/classService';
import { assignmentService } from '../../../services/assignmentService';
import { getLabRoute } from '../../../utils/labRoutes';
import { ClassJoinModal } from '../ClassJoinModal';
import { GitHubContributionGraph } from '../GitHubContributionGraph';

interface StudentWorkspaceProps {
  user: User | null;
  onEditProfile: () => void;
}

export const StudentWorkspace: React.FC<StudentWorkspaceProps> = ({ user, onEditProfile }) => {
  const navigate = useNavigate();

  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [joinedClasses, setJoinedClasses] = useState<any[]>([]);
  const [studentAssignments, setStudentAssignments] = useState<any[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const studentId = user?.id || 'u-2';
    classService.getStudentEnrollments(studentId).then(async data => {
      if (data && data.length > 0) {
        const joinedWithCounts: any[] = [];
        const allAsgs: any[] = [];
        for (const e of data) {
          const asgs = await assignmentService.getAssignmentsByClass(e.classId);
          joinedWithCounts.push({
            id: e.id,
            classId: e.classId,
            name: e.className || `Lớp ${e.classId}`,
            code: e.classCode || 'ENROLLED',
            teacher: e.teacherName || 'Giáo viên',
            count: asgs ? asgs.length : 0
          });
          if (asgs) {
            asgs.forEach(a => {
              allAsgs.push({
                id: a.id,
                title: a.title,
                className: e.className || `Lớp ${e.classId}`,
                route: getLabRoute(a.labType || a.id, a.title)
              });
            });
          }
        }
        setJoinedClasses(joinedWithCounts);
        setStudentAssignments(allAsgs);
      } else {
        setJoinedClasses([]);
        setStudentAssignments([]);
      }
    });
  }, [user?.id]);

  const handleJoinSuccess = async (className?: string, _teacherName?: string) => {
    const studentId = user?.id || 'u-2';
    const data = await classService.getStudentEnrollments(studentId);
    if (data && data.length > 0) {
      const joinedWithCounts = await Promise.all(
        data.map(async e => {
          const asgs = await assignmentService.getAssignmentsByClass(e.classId);
          return {
            id: e.id,
            classId: e.classId,
            name: e.className || `Lớp ${e.classId}`,
            code: e.classCode || 'ENROLLED',
            teacher: e.teacherName || 'Giáo viên',
            count: asgs ? asgs.length : 0
          };
        })
      );
      setJoinedClasses(joinedWithCounts);
    }
    setToastMessage(`Gia nhập lớp ${className || 'học mới'} thành công!`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Student Profile & Quick Stats Card */}
      <div 
        className="border rounded-xl p-6 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-6 transition-colors"
        style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded border flex items-center justify-center font-bold text-xs shrink-0" style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)', color: 'var(--accent-primary)' }}>
            [HS]
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border" style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)', color: 'var(--accent-primary)' }}>
                GÓC HỌC SINH
              </span>
              <span className="text-xs opacity-75" style={{ color: 'var(--text-muted)' }}>{user?.school || 'THPT Chuyên Hà Nội - Amsterdam'}</span>
            </div>
            <h3 className="text-lg font-bold tracking-tight mt-0.5">
              Xin chào, {user?.fullName || 'Học sinh'}!
            </h3>
            <p className="text-xs opacity-75 mt-0.5" style={{ color: 'var(--text-muted)' }}>
              Theo dõi lịch sử thực hành lab và nộp bài tập theo yêu cầu của Giáo viên.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsJoinModalOpen(true)}
            className="px-4 py-2 text-xs font-bold text-white rounded transition-opacity hover:opacity-90 shadow-xs flex items-center gap-1.5 cursor-pointer"
            style={{ backgroundColor: 'var(--accent-primary)' }}
          >
            <span>+ Tham gia Lớp học</span>
          </button>
          <button 
            onClick={onEditProfile}
            className="px-3 py-2 text-xs font-semibold rounded border transition-colors cursor-pointer"
            style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-main)', color: 'var(--text-main)' }}
          >
            Hồ sơ
          </button>
        </div>
      </div>

      {/* Success Toast Notification Banner */}
      {toastMessage && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-3.5 rounded-xl text-xs font-bold flex justify-between items-center animate-fade-in shadow-lg">
          <div className="flex items-center gap-2">
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="opacity-60 hover:opacity-100 text-sm font-bold">✕</button>
        </div>
      )}

      {/* GitHub 365-Day Contribution Graph Component */}
      <GitHubContributionGraph />

      {/* Class List & Assigned Homework */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Joined Classes */}
        <div className="border rounded-xl p-5" style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)' }}>
          <h4 className="font-bold text-sm mb-3 flex items-center justify-between" style={{ color: 'var(--text-main)' }}>
            <span>Lớp Học Của Tôi ({joinedClasses.length})</span>
            <button onClick={() => setIsJoinModalOpen(true)} className="text-xs font-semibold underline" style={{ color: 'var(--accent-primary)' }}>
              + Nhập mã lớp
            </button>
          </h4>

          <div className="space-y-3">
            {joinedClasses.map(c => (
              <div 
                key={c.id} 
                onClick={() => navigate(`/student-assignments?classId=${c.classId}`)}
                className="p-3 border rounded-lg flex justify-between items-center cursor-pointer hover:border-blue-500 transition-all group" 
                style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)' }}
              >
                <div>
                  <h5 className="font-bold text-xs group-hover:text-blue-400 transition-colors">{c.name}</h5>
                  <span className="text-[10px] opacity-75" style={{ color: 'var(--text-muted)' }}>GV: {c.teacher}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded border" style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)' }}>
                    {c.count} bài tập
                  </span>
                  <span className="text-xs text-blue-400 group-hover:translate-x-0.5 transition-transform">→</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Assigned Lab Homework */}
        <div className="border rounded-xl p-5" style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)' }}>
          <h4 className="font-bold text-sm mb-3 flex items-center justify-between" style={{ color: 'var(--text-main)' }}>
            <span>Bài Tập Thí Nghiệm</span>
            <span className="text-xs opacity-60">Hạn nộp sắp tới</span>
          </h4>

          <div className="space-y-3">
            {studentAssignments.length > 0 ? (
              studentAssignments.map(asg => (
                <div key={asg.id} className="p-3 border rounded-lg flex justify-between items-center" style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)' }}>
                  <div>
                    <h5 className="font-bold text-xs">{asg.title}</h5>
                    <span className="text-[10px] opacity-75 font-semibold" style={{ color: 'var(--text-muted)' }}>{asg.className}</span>
                  </div>
                  <button 
                    onClick={() => navigate(asg.route)}
                    className="px-3 py-1.5 text-xs font-bold text-white rounded transition-opacity hover:opacity-90 cursor-pointer"
                    style={{ backgroundColor: 'var(--accent-primary)' }}
                  >
                    Làm Bài
                  </button>
                </div>
              ))
            ) : (
              <p className="text-xs opacity-60 p-2 text-center">Chưa có bài tập nào được giao.</p>
            )}
          </div>
        </div>
      </div>

      {/* Class Join Modal */}
      <ClassJoinModal 
        isOpen={isJoinModalOpen} 
        onClose={() => setIsJoinModalOpen(false)} 
        onJoinSuccess={handleJoinSuccess} 
      />
    </div>
  );
};
