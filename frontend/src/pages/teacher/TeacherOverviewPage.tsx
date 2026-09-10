import React from 'react';
import { useNavigate } from 'react-router-dom';

export const TeacherOverviewPage: React.FC = () => {
  const navigate = useNavigate();

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
            2 Lớp
          </div>
          <span className="text-[10px] opacity-60">Lớp 12A1 & Lớp 11A3</span>
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
            80 Học Sinh
          </div>
          <span className="text-[10px] opacity-60">Tham gia thực hành ảo</span>
        </div>

        <div
          className="p-5 rounded-xl border space-y-2 shadow-xs cursor-pointer hover:border-purple-500/40 transition-all"
          onClick={() => navigate('/teacher/assign')}
          style={{
            backgroundColor: 'var(--bg-panel)',
            borderColor: 'var(--border-color)',
          }}
        >
          <div className="text-xs opacity-70 font-semibold">Bài Thực Hành Đã Giao</div>
          <div className="text-3xl font-black tracking-tight text-purple-500">
            5 Bài
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
            3 Bài
          </div>
          <span className="text-[10px] opacity-60">Chờ nhận xét & chấm điểm</span>
        </div>
      </div>
    </div>
  );
};
