import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { classService } from '../../services/classService';
import { assignmentService } from '../../services/assignmentService';

export const TeacherOverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState({
    classCount: 0,
    classesLabel: 'Chưa có lớp',
    studentCount: 0,
    assignmentCount: 0,
    submissionCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      setLoading(true);
      classService
        .getTeacherClasses(user.id)
        .then(async classes => {
          const classList = classes || [];
          let totalStudents = 0;
          let totalAssignments = 0;
          let totalSubmissions = 0;

          const names = classList.map(c => c.name).join(' & ');

          await Promise.all(
            classList.map(async c => {
              const [roster, asgs] = await Promise.all([
                classService.getClassRoster(c.id),
                assignmentService.getAssignmentsByClass(c.id),
              ]);
              totalStudents += (roster || []).length;
              totalAssignments += (asgs || []).length;

              if (asgs && asgs.length > 0) {
                await Promise.all(
                  asgs.map(async a => {
                    const subs = await assignmentService.getSubmissionsByAssignment(a.id);
                    totalSubmissions += (subs || []).length;
                  })
                );
              }
            })
          );

          setStats({
            classCount: classList.length,
            classesLabel: names ? `Lớp ${names}` : 'Chưa có lớp',
            studentCount: totalStudents,
            assignmentCount: totalAssignments,
            submissionCount: totalSubmissions,
          });
        })
        .catch(err => console.error('Lỗi khi tải thống kê:', err))
        .finally(() => setLoading(false));
    }
  }, [user]);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div
        className="p-6 rounded-2xl border relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs"
        style={{
          backgroundColor: 'var(--bg-panel)',
          borderColor: 'var(--border-color)',
        }}
      >
        <div className="space-y-1 z-10">
          <div className="flex items-center gap-2">
            <span
              className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded border"
              style={{
                backgroundColor: 'var(--bg-main)',
                borderColor: 'var(--border-color)',
                color: 'var(--accent-primary)',
              }}
            >
              VISUALLAB TEACHER CENTER
            </span>
            <span className="text-xs font-semibold text-emerald-500">
              Học kỳ I • GDPT 2018
            </span>
          </div>
          <h2 className="text-2xl font-black tracking-tight" style={{ color: 'var(--text-main)' }}>
            Không Gian Quản Lý Lớp Học & Chấm Bài
          </h2>
          <p className="text-xs opacity-75 max-w-xl" style={{ color: 'var(--text-muted)' }}>
            Quản lý sĩ số lớp học, giao bài tập thí nghiệm mô phỏng và theo dõi tiến độ thực hành của học sinh.
          </p>
        </div>

        <div className="flex items-center gap-3 z-10 shrink-0">
          <button
            onClick={() => navigate('/teacher/classes')}
            className="px-4 py-2 rounded-lg text-xs font-bold text-white shadow-sm transition-opacity hover:opacity-90 cursor-pointer"
            style={{ backgroundColor: 'var(--accent-primary)' }}
          >
            Quản Lý Lớp Học
          </button>
          <button
            onClick={() => navigate('/teacher/grading')}
            className="px-4 py-2 rounded-lg text-xs font-semibold border transition-colors cursor-pointer"
            style={{
              borderColor: 'var(--border-color)',
              backgroundColor: 'var(--bg-main)',
              color: 'var(--text-main)',
            }}
          >
            Sổ Điểm Tiến Độ
          </button>
        </div>
      </div>

      {/* KPI Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          className="p-5 rounded-xl border space-y-2 shadow-xs cursor-pointer hover:border-blue-500/40 transition-all"
          onClick={() => navigate('/teacher/classes')}
          style={{
            backgroundColor: 'var(--bg-panel)',
            borderColor: 'var(--border-color)',
          }}
        >
          <div className="text-xs opacity-70 font-semibold">Lớp Học Đang Giảng Dạy</div>
          <div className="text-3xl font-black tracking-tight" style={{ color: 'var(--accent-primary)' }}>
            {loading ? '...' : `${stats.classCount} Lớp`}
          </div>
          <span className="text-[10px] opacity-60 truncate block">{stats.classesLabel}</span>
        </div>

        <div
          className="p-5 rounded-xl border space-y-2 shadow-xs cursor-pointer hover:border-emerald-500/40 transition-all"
          onClick={() => navigate('/teacher/classes')}
          style={{
            backgroundColor: 'var(--bg-panel)',
            borderColor: 'var(--border-color)',
          }}
        >
          <div className="text-xs opacity-70 font-semibold">Tổng Sĩ Số Học Sinh</div>
          <div className="text-3xl font-black tracking-tight text-emerald-500">
            {loading ? '...' : `${stats.studentCount} Học Sinh`}
          </div>
          <span className="text-[10px] opacity-60">Tham gia thực hành ảo</span>
        </div>

        <div
          className="p-5 rounded-xl border space-y-2 shadow-xs cursor-pointer hover:border-purple-500/40 transition-all"
          onClick={() => navigate('/teacher/classes')}
          style={{
            backgroundColor: 'var(--bg-panel)',
            borderColor: 'var(--border-color)',
          }}
        >
          <div className="text-xs opacity-70 font-semibold">Bài Thực Hành Đã Giao</div>
          <div className="text-3xl font-black tracking-tight text-purple-500">
            {loading ? '...' : `${stats.assignmentCount} Bài`}
          </div>
          <span className="text-[10px] opacity-60">Đang mở bài làm</span>
        </div>

        <div
          className="p-5 rounded-xl border space-y-2 shadow-xs cursor-pointer hover:border-amber-500/40 transition-all"
          onClick={() => navigate('/teacher/grading')}
          style={{
            backgroundColor: 'var(--bg-panel)',
            borderColor: 'var(--border-color)',
          }}
        >
          <div className="text-xs opacity-70 font-semibold">Bài Nộp Cần Chấm</div>
          <div className="text-3xl font-black tracking-tight text-amber-500">
            {loading ? '...' : `${stats.submissionCount} Bài`}
          </div>
          <span className="text-[10px] opacity-60">Bài làm của học sinh</span>
        </div>
      </div>
    </div>
  );
};
