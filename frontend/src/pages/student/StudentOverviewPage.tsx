import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { JoinClassDrawer } from '../../components/student/JoinClassDrawer';

export const StudentOverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const [isJoinDrawerOpen, setIsJoinDrawerOpen] = useState(false);

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
              VISUALLAB STUDENT CENTER
            </span>
            <span className="text-xs font-semibold text-emerald-500">
              Học Sinh • GDPT 2018
            </span>
          </div>
          <h2 className="text-2xl font-black tracking-tight" style={{ color: 'var(--text-main)' }}>
            Không Gian Học Tập & Làm Bài Thí Nghiệm
          </h2>
          <p className="text-xs opacity-75 max-w-xl" style={{ color: 'var(--text-muted)' }}>
            Theo dõi lớp học, thực hành bài lab mô phỏng và nộp báo cáo kết quả cho Giáo viên.
          </p>
        </div>

        <div className="flex items-center gap-3 z-10 shrink-0">
          <button
            onClick={() => setIsJoinDrawerOpen(true)}
            className="px-4 py-2 rounded-lg text-xs font-bold text-white shadow-sm transition-opacity hover:opacity-90 cursor-pointer"
            style={{ backgroundColor: 'var(--accent-primary)' }}
          >
            + Tham Gia Lớp Bằng Mã
          </button>
          <button
            onClick={() => navigate('/student/assignments')}
            className="px-4 py-2 rounded-lg text-xs font-semibold border transition-colors cursor-pointer"
            style={{
              borderColor: 'var(--border-color)',
              backgroundColor: 'var(--bg-main)',
              color: 'var(--text-main)',
            }}
          >
            Xem Bài Tập Cần Nộp
          </button>
        </div>
      </div>

      {/* KPI Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          className="p-5 rounded-xl border space-y-2 shadow-xs cursor-pointer hover:border-blue-500/40 transition-all"
          onClick={() => navigate('/student/classes')}
          style={{
            backgroundColor: 'var(--bg-panel)',
            borderColor: 'var(--border-color)',
          }}
        >
          <div className="text-xs opacity-70 font-semibold">Lớp Học Đã Tham Gia</div>
          <div className="text-3xl font-black tracking-tight" style={{ color: 'var(--accent-primary)' }}>
            1 Lớp
          </div>
          <span className="text-[10px] opacity-60">Lớp 12-A1 Chuyên Lý</span>
        </div>

        <div
          className="p-5 rounded-xl border space-y-2 shadow-xs cursor-pointer hover:border-amber-500/40 transition-all"
          onClick={() => navigate('/student/assignments')}
          style={{
            backgroundColor: 'var(--bg-panel)',
            borderColor: 'var(--border-color)',
          }}
        >
          <div className="text-xs opacity-70 font-semibold">Bài Tập Cần Nộp</div>
          <div className="text-3xl font-black tracking-tight text-amber-500">
            2 Bài
          </div>
          <span className="text-[10px] opacity-60">Đang trong hạn làm bài</span>
        </div>

        <div
          className="p-5 rounded-xl border space-y-2 shadow-xs cursor-pointer hover:border-emerald-500/40 transition-all"
          onClick={() => navigate('/student/history')}
          style={{
            backgroundColor: 'var(--bg-panel)',
            borderColor: 'var(--border-color)',
          }}
        >
          <div className="text-xs opacity-70 font-semibold">Bài Đã Hoàn Thành</div>
          <div className="text-3xl font-black tracking-tight text-emerald-500">
            4 Bài
          </div>
          <span className="text-[10px] opacity-60">Đã gửi báo cáo thí nghiệm</span>
        </div>

        <div
          className="p-5 rounded-xl border space-y-2 shadow-xs cursor-pointer hover:border-purple-500/40 transition-all"
          onClick={() => navigate('/student/history')}
          style={{
            backgroundColor: 'var(--bg-panel)',
            borderColor: 'var(--border-color)',
          }}
        >
          <div className="text-xs opacity-70 font-semibold">Điểm Trung Bình Thực Hành</div>
          <div className="text-3xl font-black tracking-tight text-purple-500">
            9.2 / 10
          </div>
          <span className="text-[10px] opacity-60">Giáo viên đã đánh giá</span>
        </div>
      </div>

      {/* Join Class Slide-over Drawer */}
      <JoinClassDrawer
        isOpen={isJoinDrawerOpen}
        onClose={() => setIsJoinDrawerOpen(false)}
        onJoinSuccess={() => navigate('/student/classes')}
      />
    </div>
  );
};
