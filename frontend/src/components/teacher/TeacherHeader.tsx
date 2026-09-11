import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

interface TeacherHeaderProps {
  onToggleMobileSidebar: () => void;
  onOpenProfileModal?: () => void;
}

export const TeacherHeader: React.FC<TeacherHeaderProps> = ({
  onToggleMobileSidebar,
  onOpenProfileModal,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const getBreadcrumbTitle = () => {
    switch (location.pathname) {
      case '/teacher':
        return 'Tổng Quan Lớp Học';
      case '/teacher/classes':
        return 'Quản Lý Lớp Học';
      case '/teacher/labs':
        return 'Kho Lab Mẫu GDPT';
      case '/teacher/assign':
        return 'Giao Bài Tập Thực Hành';
      case '/teacher/grading':
        return 'Sổ Điểm Tiến Độ';
      default:
        return 'Không Gian Giáo Viên';
    }
  };

  return (
    <header
      className="h-16 px-4 md:px-8 border-b flex items-center justify-between sticky top-0 z-20 backdrop-blur-md transition-colors"
      style={{
        backgroundColor: 'var(--bg-panel)',
        borderColor: 'var(--border-color)',
        color: 'var(--text-main)',
      }}
    >
      {/* Left: Mobile Toggle & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 rounded-lg border text-xs cursor-pointer font-bold"
          style={{
            borderColor: 'var(--border-color)',
            backgroundColor: 'var(--bg-main)',
          }}
          title="Mở menu"
        >
          Menu
        </button>

        <div className="flex items-center gap-2 text-xs">
          <span
            className="opacity-50 font-medium cursor-pointer hover:underline"
            onClick={() => navigate('/teacher')}
            style={{ color: 'var(--text-muted)' }}
          >
            Giáo Viên
          </span>
          <span className="opacity-40">/</span>
          <span className="font-bold tracking-tight text-sm" style={{ color: 'var(--text-main)' }}>
            {getBreadcrumbTitle()}
          </span>
        </div>
      </div>

      {/* Right: Theme Toggle & Profile Menu */}
      <div className="flex items-center gap-2.5">
        {/* Theme Switcher */}
        <button
          onClick={toggleTheme}
          className="p-2 px-3 rounded-lg border text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
          style={{
            borderColor: 'var(--border-color)',
            backgroundColor: 'var(--bg-main)',
            color: 'var(--text-main)',
          }}
          title={`Chuyển sang ${theme === 'light' ? 'Giao diện Tối' : 'Giao diện Sáng'}`}
        >
          <span className="font-medium">
            Giao diện {theme === 'light' ? 'Tối' : 'Sáng'}
          </span>
        </button>

        {/* Teacher Profile Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="w-9 h-9 rounded-full text-white font-extrabold text-sm uppercase flex items-center justify-center shadow-md hover:ring-2 hover:ring-blue-400 transition-all cursor-pointer"
            style={{ backgroundColor: 'var(--accent-primary)' }}
            title={user?.fullName || 'Giáo viên'}
            aria-label="User Menu"
          >
            {user?.fullName ? user.fullName.charAt(0) : 'G'}
          </button>

          {/* Profile Dropdown Menu */}
          {isProfileMenuOpen && (
            <div
              className="absolute right-0 mt-2.5 w-52 rounded-xl border shadow-xl py-1.5 z-50 text-xs transition-all"
              style={{
                backgroundColor: 'var(--bg-panel)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-main)',
              }}
            >
              {/* Top Pointer Arrow Centered on Avatar */}
              <div 
                className="absolute -top-[7px] right-5 w-3 h-3 rotate-45 border-t border-l z-50" 
                style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)' }} 
              />

              <div
                className="px-3 py-2 border-b space-y-0.5 relative z-10"
                style={{ borderColor: 'var(--border-color)' }}
              >
                <p className="font-bold truncate">{user?.fullName || 'Giáo viên Vật lý'}</p>
                <p className="opacity-60 text-[10px] font-mono truncate">{user?.email || 'teacher@edulab.vn'}</p>
              </div>

              {onOpenProfileModal && (
                <button
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    onOpenProfileModal();
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-slate-500/10 font-semibold cursor-pointer"
                >
                  <span>Hồ sơ cá nhân</span>
                </button>
              )}

              <button
                onClick={() => {
                  setIsProfileMenuOpen(false);
                  navigate('/dashboard');
                }}
                className="w-full text-left px-3 py-2 hover:bg-slate-500/10 font-semibold cursor-pointer"
              >
                <span>Chuyển qua Học Sinh View</span>
              </button>

              <div
                className="border-t my-1"
                style={{ borderColor: 'var(--border-color)' }}
              />

              <button
                onClick={() => {
                  setIsProfileMenuOpen(false);
                  logout();
                  navigate('/login');
                }}
                className="w-full text-left px-3 py-2 hover:bg-rose-500/10 text-rose-500 font-bold cursor-pointer"
              >
                <span>Đăng xuất</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
