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
    { label: 'Trang Chủ Dashboard', path: '/dashboard' },
    { label: 'Mô Phỏng Tương Tác 2D', path: '/simulation' },
    { label: 'Thực Hành SGK 5 Bước', path: '/srs-lab' },
  ];

  return (
    <aside 
      className="w-64 border-r flex flex-col justify-between p-5 min-h-screen sticky top-0 z-40 flex-shrink-0 font-sans transition-colors duration-200"
      style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
    >
      {/* Brand Header */}
      <div className="flex flex-col gap-6">
        <div
          onClick={() => navigate('/dashboard')}
          className="group cursor-pointer p-3 rounded-lg border flex items-center gap-3 transition-colors"
          style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)' }}
        >
          <div 
            className="w-8 h-8 rounded flex items-center justify-center font-bold text-white text-xs tracking-wider shrink-0" 
            style={{ backgroundColor: 'var(--accent-primary)' }}
          >
            VL
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider font-semibold block opacity-70" style={{ color: 'var(--text-muted)' }}>
              GDPT 2018
            </span>
            <h1 className="font-bold text-sm tracking-tight" style={{ color: 'var(--text-main)' }}>
              VISUAL<span style={{ color: 'var(--accent-primary)' }}>LAB</span>
            </h1>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-wider px-2 opacity-60" style={{ color: 'var(--text-muted)' }}>
            Điều Hướng Hệ Thống
          </span>
          {navItems.map(item => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`group flex items-center justify-between px-3 py-2.5 rounded text-xs font-medium transition-colors cursor-pointer border ${
                  isActive ? 'font-bold' : 'opacity-80 hover:opacity-100'
                }`}
                style={{ 
                  backgroundColor: isActive ? 'var(--bg-main)' : 'transparent',
                  borderColor: isActive ? 'var(--border-color)' : 'transparent',
                  color: isActive ? 'var(--accent-primary)' : 'var(--text-main)'
                }}
              >
                <span>{item.label}</span>
                <span className="text-xs opacity-50 group-hover:opacity-100 transition-opacity">→</span>
              </button>
            );
          })}
        </nav>

        {/* Role Specialized Enclosure */}
        <div className="flex flex-col gap-2 pt-5 border-t" style={{ borderColor: 'var(--border-color)' }}>
          <span className="text-[10px] font-semibold uppercase tracking-wider px-2 opacity-60" style={{ color: 'var(--text-muted)' }}>
            Tác Vụ [{role}]
          </span>

          {role === 'ADMIN' && (
            <button
              onClick={() => navigate('/srs-lab')}
              className="group flex items-center justify-between px-3 py-2.5 rounded text-xs font-bold border transition-colors cursor-pointer"
              style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
            >
              <span>[ADMIN] Quản Lý Hệ Thống</span>
              <span className="text-xs">→</span>
            </button>
          )}

          {role === 'TEACHER' && (
            <button
              onClick={() => navigate('/simulation')}
              className="group flex items-center justify-between px-3 py-2.5 rounded text-xs font-bold border transition-colors cursor-pointer"
              style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
            >
              <span>[GIÁO VIÊN] Trình Chiếu Lớp</span>
              <span className="text-xs">→</span>
            </button>
          )}

          {role === 'STUDENT' && (
            <button
              onClick={() => navigate('/srs-lab')}
              className="group flex items-center justify-between px-3 py-2.5 rounded text-xs font-bold border transition-colors cursor-pointer"
              style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
            >
              <span>[HỌC SINH] Báo Cáo Thực Hành</span>
              <span className="text-xs">→</span>
            </button>
          )}
        </div>
      </div>

      {/* User Profile Footer */}
      <div className="flex flex-col gap-3 pt-5 border-t" style={{ borderColor: 'var(--border-color)' }}>
        <div className="p-3 rounded border flex items-center justify-between" style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)' }}>
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-7 h-7 rounded border font-bold text-xs flex items-center justify-center shrink-0" style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)', color: 'var(--accent-primary)' }}>
              {user?.fullName ? user.fullName[0] : 'U'}
            </div>
            <div className="text-left overflow-hidden">
              <p className="text-xs font-bold truncate leading-tight" style={{ color: 'var(--text-main)' }}>{user?.fullName || 'Người dùng'}</p>
              <p className="text-[10px] font-semibold opacity-75 truncate" style={{ color: 'var(--text-muted)' }}>
                [{role}]
              </p>
            </div>
          </div>

          <button
            onClick={onEditProfile}
            className="px-2 py-1 rounded border text-[10px] font-semibold cursor-pointer transition-colors"
            style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-panel)', color: 'var(--text-main)' }}
            title="Chỉnh sửa hồ sơ"
          >
            Sửa
          </button>
        </div>

        <button
          onClick={() => {
            logout();
            navigate('/login');
          }}
          className="w-full py-2 rounded border text-xs font-semibold transition-colors cursor-pointer text-center"
          style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-main)', color: 'var(--text-main)' }}
        >
          Đăng Xuất
        </button>
      </div>
    </aside>
  );
};
