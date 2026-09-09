import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface SidebarNavProps {
  onEditProfile: () => void;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({ onEditProfile }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const role = user?.role || 'STUDENT';

  const navItems = [
    { label: 'Trang Chủ Dashboard', path: '/dashboard', icon: '🏠' },
    { label: 'Mô Phỏng Tương Tác 2D', path: '/simulation', icon: '⚡' },
    { label: 'Thực Hành SGK 5 Bước', path: '/srs-lab', icon: '📝' },
  ];

  return (
    <aside className="w-72 bg-[#080B11]/90 border-r border-white/10 flex flex-col justify-between p-5 min-h-screen sticky top-0 z-40 backdrop-blur-2xl flex-shrink-0 font-sans">
      {/* Brand Header with Double-Bezel Outer Enclosure */}
      <div className="flex flex-col gap-8">
        <div
          onClick={() => navigate('/dashboard')}
          className="group cursor-pointer p-2.5 rounded-[1.5rem] bg-white/[0.03] border border-white/10 ring-1 ring-black/20 hover:border-cyan-500/40 transition-all duration-500 flex items-center gap-3.5 shadow-2xl"
        >
          <div className="w-11 h-11 rounded-[calc(1.5rem-0.375rem)] bg-gradient-to-tr from-blue-600 via-cyan-500 to-teal-300 flex items-center justify-center text-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] group-hover:scale-105 transition duration-500">
            ⚛️
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-cyan-400 block">
              GDPT 2018
            </span>
            <h1 className="font-extrabold text-base tracking-tight text-white group-hover:text-cyan-200 transition">
              EduLab Physics
            </h1>
          </div>
        </div>

        {/* Navigation Items with Haptic Hover & Micro Pill Badges */}
        <nav className="flex flex-col gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-slate-500 px-3">
            Điều Hướng Hệ Thống
          </span>
          {navItems.map(item => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`group flex items-center justify-between px-4 py-3 rounded-full text-xs font-semibold transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 text-white shadow-lg shadow-cyan-500/20 font-bold scale-[1.02]'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.05] border border-transparent hover:border-white/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-base group-hover:scale-110 transition">{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                <div className="w-6 h-6 rounded-full bg-black/20 dark:bg-white/10 flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition duration-300">
                  ↗
                </div>
              </button>
            );
          })}
        </nav>

        {/* Role Specialized Enclosure */}
        <div className="flex flex-col gap-2 pt-6 border-t border-white/10">
          <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-slate-500 px-3">
            Tác Vụ {role === 'ADMIN' ? 'Quản Trị' : role === 'TEACHER' ? 'Giáo Viên' : 'Học Sinh'}
          </span>

          {role === 'ADMIN' && (
            <button
              onClick={() => navigate('/srs-lab')}
              className="group flex items-center justify-between px-4 py-3 rounded-full text-xs font-bold text-rose-300 bg-rose-950/30 border border-rose-500/30 hover:border-rose-500/60 hover:bg-rose-900/40 transition duration-300 cursor-pointer shadow-lg shadow-rose-950/50"
            >
              <div className="flex items-center gap-2.5">
                <span>🛡️</span>
                <span>Quản Lý Hệ Thống</span>
              </div>
              <div className="w-6 h-6 rounded-full bg-rose-500/20 flex items-center justify-center text-[10px] group-hover:translate-x-0.5 transition">
                ↗
              </div>
            </button>
          )}

          {role === 'TEACHER' && (
            <button
              onClick={() => navigate('/simulation')}
              className="group flex items-center justify-between px-4 py-3 rounded-full text-xs font-bold text-purple-300 bg-purple-950/30 border border-purple-500/30 hover:border-purple-500/60 hover:bg-purple-900/40 transition duration-300 cursor-pointer shadow-lg shadow-purple-950/50"
            >
              <div className="flex items-center gap-2.5">
                <span>👨‍🏫</span>
                <span>Trình Chiếu Lớp Học</span>
              </div>
              <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-[10px] group-hover:translate-x-0.5 transition">
                ↗
              </div>
            </button>
          )}

          {role === 'STUDENT' && (
            <button
              onClick={() => navigate('/srs-lab')}
              className="group flex items-center justify-between px-4 py-3 rounded-full text-xs font-bold text-cyan-300 bg-cyan-950/30 border border-cyan-500/30 hover:border-cyan-500/60 hover:bg-cyan-900/40 transition duration-300 cursor-pointer shadow-lg shadow-cyan-950/50"
            >
              <div className="flex items-center gap-2.5">
                <span>🎓</span>
                <span>Báo Cáo Thực Hành A4</span>
              </div>
              <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center text-[10px] group-hover:translate-x-0.5 transition">
                ↗
              </div>
            </button>
          )}
        </div>
      </div>

      {/* Double-Bezel User Profile Island */}
      <div className="flex flex-col gap-3 pt-6 border-t border-white/10">
        <div className="p-1.5 rounded-[1.25rem] bg-white/[0.03] border border-white/10 ring-1 ring-black/30">
          <div className="p-3 rounded-[calc(1.25rem-0.375rem)] bg-[#0C1019] flex items-center justify-between shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-400 text-white flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-md">
                {user?.fullName ? user.fullName[0] : 'U'}
              </div>
              <div className="text-left overflow-hidden">
                <p className="text-xs font-bold text-slate-100 truncate leading-tight">{user?.fullName || 'Người dùng'}</p>
                <p className="text-[10px] text-slate-400 truncate">
                  <span className="text-cyan-400 font-semibold">{role === 'ADMIN' ? '🛡️ Quản trị' : role === 'TEACHER' ? 'Giáo viên' : 'Học sinh'}</span>
                </p>
              </div>
            </div>

            <button
              onClick={onEditProfile}
              className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white flex items-center justify-center text-xs cursor-pointer transition flex-shrink-0"
              title="Chỉnh sửa hồ sơ"
            >
              ✏️
            </button>
          </div>
        </div>

        <button
          onClick={() => {
            logout();
            navigate('/login');
          }}
          className="w-full py-2.5 rounded-full bg-red-500/10 hover:bg-red-600 border border-red-500/20 hover:border-red-500 text-red-400 hover:text-white text-xs font-bold transition duration-300 cursor-pointer flex items-center justify-center gap-2 shadow-lg"
        >
          <span>🚪</span> Đăng Xuất An Toàn
        </button>
      </div>
    </aside>
  );
};
