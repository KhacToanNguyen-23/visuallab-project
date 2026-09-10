import React from 'react';
import { useNavigate } from 'react-router-dom';

export const AdminOverviewPage: React.FC = () => {
  const navigate = useNavigate();

  const recentLogs: { id: string; time: string; user: string; action: string; module: string }[] = [];

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
              VISUALLAB ADMIN CENTER
            </span>
            <span className="text-xs font-semibold text-emerald-500 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Hệ thống hoạt động bình thường
            </span>
          </div>
          <h2 className="text-2xl font-black tracking-tight" style={{ color: 'var(--text-main)' }}>
            Chào mừng trở lại, System Admin!
          </h2>
          <p className="text-xs opacity-75 max-w-xl" style={{ color: 'var(--text-muted)' }}>
            Bảng tổng quan sức khỏe hệ thống, thống kê lượt dùng bài lab thí nghiệm mô phỏng Vật lý GDPT 2018.
          </p>
        </div>

        <div className="flex items-center gap-3 z-10 shrink-0">
          <button
            onClick={() => navigate('/admin/users')}
            className="px-4 py-2 rounded-lg text-xs font-bold text-white shadow-sm transition-opacity hover:opacity-90 cursor-pointer"
            style={{ backgroundColor: 'var(--accent-primary)' }}
          >
            Quản Lý Người Dùng
          </button>
          <button
            onClick={() => navigate('/admin/labs')}
            className="px-4 py-2 rounded-lg text-xs font-semibold border transition-colors cursor-pointer"
            style={{
              borderColor: 'var(--border-color)',
              backgroundColor: 'var(--bg-main)',
              color: 'var(--text-main)',
            }}
          >
            Kho Lab Hệ Thống
          </button>
        </div>
      </div>

      {/* Metric Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          className="p-5 rounded-xl border space-y-2 shadow-xs transition-all hover:border-blue-500/40"
          style={{
            backgroundColor: 'var(--bg-panel)',
            borderColor: 'var(--border-color)',
          }}
        >
          <div className="flex items-center justify-between text-xs opacity-70">
            <span>Tổng Lượt Chạy Lab</span>
          </div>
          <div className="text-3xl font-black tracking-tight" style={{ color: 'var(--accent-primary)' }}>
            —
          </div>
          <div className="flex items-center gap-1.5 text-[11px]">
            <span className="opacity-60" style={{ color: 'var(--text-muted)' }}>Chưa có dữ liệu</span>
          </div>
        </div>

        <div
          className="p-5 rounded-xl border space-y-2 shadow-xs transition-all hover:border-emerald-500/40"
          style={{
            backgroundColor: 'var(--bg-panel)',
            borderColor: 'var(--border-color)',
          }}
        >
          <div className="flex items-center justify-between text-xs opacity-70">
            <span>Tài Khoản Học Sinh</span>
          </div>
          <div className="text-3xl font-black tracking-tight text-emerald-500">
            —
          </div>
          <div className="flex items-center gap-1.5 text-[11px]">
            <span className="opacity-60" style={{ color: 'var(--text-muted)' }}>Đã xác minh qua Google OAuth</span>
          </div>
        </div>

        <div
          className="p-5 rounded-xl border space-y-2 shadow-xs transition-all hover:border-purple-500/40"
          style={{
            backgroundColor: 'var(--bg-panel)',
            borderColor: 'var(--border-color)',
          }}
        >
          <div className="flex items-center justify-between text-xs opacity-70">
            <span>Giáo Viên Kích Hoạt</span>
          </div>
          <div className="text-3xl font-black tracking-tight text-purple-500">
            —
          </div>
          <div className="flex items-center gap-1.5 text-[11px]">
            <span className="opacity-60" style={{ color: 'var(--text-muted)' }}>Từ 45 trường THPT trên toàn quốc</span>
          </div>
        </div>

        <div
          className="p-5 rounded-xl border space-y-2 shadow-xs transition-all hover:border-amber-500/40"
          style={{
            backgroundColor: 'var(--bg-panel)',
            borderColor: 'var(--border-color)',
          }}
        >
          <div className="flex items-center justify-between text-xs opacity-70">
            <span>Lớp Học Đang Mở</span>
          </div>
          <div className="text-3xl font-black tracking-tight text-amber-500">
            —
          </div>
          <div className="flex items-center gap-1.5 text-[11px]">
            <span className="opacity-60" style={{ color: 'var(--text-muted)' }}>Đang giao bài thực hành</span>
          </div>
        </div>
      </div>

      {/* System Status & Recent Activity Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Activity Stream */}
        <div
          className="lg:col-span-2 p-6 rounded-xl border space-y-4 shadow-xs"
          style={{
            backgroundColor: 'var(--bg-panel)',
            borderColor: 'var(--border-color)',
          }}
        >
          <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: 'var(--border-color)' }}>
            <div>
              <h3 className="font-bold text-sm" style={{ color: 'var(--text-main)' }}>
                Nhật Ký Hoạt Động Gần Đây
              </h3>
              <p className="text-[11px] opacity-60" style={{ color: 'var(--text-muted)' }}>
                Sự kiện hệ thống phát sinh theo thời gian thực
              </p>
            </div>
            <button
              onClick={() => navigate('/admin/audit')}
              className="text-xs font-bold hover:underline cursor-pointer"
              style={{ color: 'var(--accent-primary)' }}
            >
              Xem Tất Cả Audit Log →
            </button>
          </div>

          <div className="space-y-3">
            {recentLogs.map(log => (
              <div
                key={log.id}
                className="p-3 rounded-lg border flex items-center justify-between gap-3 text-xs"
                style={{
                  backgroundColor: 'var(--bg-main)',
                  borderColor: 'var(--border-color)',
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[10px] opacity-60 px-2 py-0.5 rounded border" style={{ borderColor: 'var(--border-color)' }}>
                    {log.time}
                  </span>
                  <div>
                    <span className="font-bold">{log.user}: </span>
                    <span className="opacity-80">{log.action}</span>
                  </div>
                </div>
                <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded border opacity-60 shrink-0" style={{ borderColor: 'var(--border-color)' }}>
                  {log.module}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Platform Health */}
        <div
          className="p-6 rounded-xl border space-y-4 shadow-xs"
          style={{
            backgroundColor: 'var(--bg-panel)',
            borderColor: 'var(--border-color)',
          }}
        >
          <h3 className="font-bold text-sm border-b pb-3" style={{ color: 'var(--text-main)', borderColor: 'var(--border-color)' }}>
            Sức Khỏe Hạ Tầng
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)' }}>
              <span>REST API Backend</span>
              <span className="font-bold text-emerald-500 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                200 OK (18ms)
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)' }}>
              <span>Physics Canvas Engine</span>
              <span className="font-bold text-emerald-500 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                60 FPS Smooth
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)' }}>
              <span>GDPT Curriculum API</span>
              <span className="font-bold text-emerald-500 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Active
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)' }}>
              <span>Google OAuth 2.0</span>
              <span className="font-bold text-emerald-500 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Connected
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
