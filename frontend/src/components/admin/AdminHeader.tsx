import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

interface AdminHeaderProps {
  onToggleMobileSidebar: () => void;
  onOpenSearch?: () => void;
  onOpenProfileModal?: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  onToggleMobileSidebar,
  onOpenSearch,
  onOpenProfileModal,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  // Compute breadcrumbs
  const getBreadcrumbTitle = () => {
    switch (location.pathname) {
      case '/admin':
        return 'Tổng Quan Hệ Thống';
      case '/admin/users':
        return 'Quản Lý Người Dùng';
      case '/admin/labs':
        return 'Kho Lab Hệ Thống';
      case '/admin/audit':
        return 'Nhật Ký & Audit Log';
      default:
        return 'Admin Workspace';
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
          className="lg:hidden p-2 rounded-lg border text-xs cursor-pointer"
          style={{
            borderColor: 'var(--border-color)',
            backgroundColor: 'var(--bg-main)',
          }}
          title="Mở menu"
        >
          ☰
        </button>

        <div className="flex items-center gap-2 text-xs">
          <span
            className="opacity-50 font-medium cursor-pointer hover:underline"
            onClick={() => navigate('/admin')}
            style={{ color: 'var(--text-muted)' }}
          >
            Admin
          </span>
          <span className="opacity-40">/</span>
          <span className="font-bold tracking-tight text-sm" style={{ color: 'var(--text-main)' }}>
            {getBreadcrumbTitle()}
          </span>
        </div>
      </div>

      {/* Right: Quick Search, Theme Toggle, Profile Menu */}
      <div className="flex items-center gap-2.5">
        {/* Cmd+K Quick Search Trigger */}
        <button
          onClick={onOpenSearch}
          className="hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-lg border text-xs font-medium opacity-75 hover:opacity-100 transition-opacity cursor-pointer"
          style={{
            backgroundColor: 'var(--bg-main)',
            borderColor: 'var(--border-color)',
            color: 'var(--text-muted)',
          }}
        >
          <span>Tìm kiếm nhanh...</span>
          <kbd
            className="px-1.5 py-0.5 rounded border text-[10px] font-mono opacity-80"
            style={{
              backgroundColor: 'var(--bg-panel)',
              borderColor: 'var(--border-color)',
            }}
          >
            ⌘K
          </kbd>
        </button>

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

        {/* Admin Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border transition-colors cursor-pointer"
            style={{
              borderColor: 'var(--border-color)',
              backgroundColor: 'var(--bg-main)',
            }}
          >
            <div
              className="w-6 h-6 rounded-md text-[10px] font-extrabold text-white flex items-center justify-center shrink-0"
              style={{ backgroundColor: 'var(--accent-primary)' }}
            >
              AD
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-bold leading-tight truncate max-w-[120px]">
                {user?.fullName || 'System Admin'}
              </span>
              <span
                className="text-[9px] uppercase font-bold tracking-wider opacity-60"
                style={{ color: 'var(--text-muted)' }}
              >
                {user?.role || 'ADMIN'}
              </span>
            </div>
            <span className="text-[10px] opacity-60">▼</span>
          </button>

          {/* Profile Dropdown Menu */}
          {isProfileMenuOpen && (
            <div
              className="absolute right-0 mt-2 w-48 rounded-xl border shadow-lg py-1.5 z-50 text-xs transition-all"
              style={{
                backgroundColor: 'var(--bg-panel)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-main)',
              }}
            >
              <div
                className="px-3 py-2 border-b space-y-0.5"
                style={{ borderColor: 'var(--border-color)' }}
              >
                <p className="font-bold truncate">{user?.fullName || 'Administrator'}</p>
                <p className="opacity-60 text-[10px] font-mono truncate">{user?.email || 'admin@edulab.vn'}</p>
              </div>

              {onOpenProfileModal && (
                <button
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    onOpenProfileModal();
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-slate-500/10 font-semibold cursor-pointer flex items-center gap-2"
                >
                  <span>Hồ sơ cá nhân</span>
                </button>
              )}

              <button
                onClick={() => {
                  setIsProfileMenuOpen(false);
                  navigate('/dashboard');
                }}
                className="w-full text-left px-3 py-2 hover:bg-slate-500/10 font-semibold cursor-pointer flex items-center gap-2"
              >
                <span>Chuyển qua Học Sinh/GV View</span>
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
                className="w-full text-left px-3 py-2 hover:bg-rose-500/10 text-rose-500 font-bold cursor-pointer flex items-center gap-2"
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
