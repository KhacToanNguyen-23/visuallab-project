import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface AdminSidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  userCount?: number;
  labCount?: number;
}

interface NavItem {
  id: string;
  label: string;
  path: string;
  count?: number;
  exact?: boolean;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
  userCount = 4,
  labCount = 6,
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems: NavItem[] = [
    {
      id: 'overview',
      label: 'Tổng Quan Hệ Thống',
      path: '/admin',
      exact: true,
    },
    {
      id: 'users',
      label: 'Quản Lý Người Dùng',
      path: '/admin/users',
      count: userCount,
    },
    {
      id: 'labs',
      label: 'Kho Lab Hệ Thống',
      path: '/admin/labs',
      count: labCount,
    },
    {
      id: 'audit',
      label: 'Nhật Ký & Audit Log',
      path: '/admin/audit',
    },
  ];

  const isActive = (item: NavItem) => {
    if (item.exact) {
      return location.pathname === item.path;
    }
    return location.pathname.startsWith(item.path);
  };

  const handleNavClick = (path: string) => {
    navigate(path);
    onCloseMobile();
  };

  const sidebarContent = (
    <div
      className={`h-full flex flex-col transition-all duration-300 border-r ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
      style={{
        backgroundColor: 'var(--bg-panel)',
        borderColor: 'var(--border-color)',
        color: 'var(--text-main)',
      }}
    >
      {/* Brand Header */}
      <div
        className="h-16 px-4 flex items-center justify-between border-b shrink-0"
        style={{ borderColor: 'var(--border-color)' }}
      >
        <div
          className="flex items-center gap-3 cursor-pointer overflow-hidden whitespace-nowrap"
          onClick={() => handleNavClick('/admin')}
        >
          <div
            className="w-9 h-9 rounded-lg font-black text-white text-sm flex items-center justify-center shrink-0 shadow-sm tracking-wider"
            style={{ backgroundColor: 'var(--accent-primary)' }}
          >
            VL
          </div>
          {!isCollapsed && (
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm tracking-tight truncate">
                  VISUAL<span style={{ color: 'var(--accent-primary)' }}>LAB</span>
                </span>
                <span
                  className="text-[9px] font-bold px-1.5 py-0.2 rounded border uppercase tracking-widest shrink-0"
                  style={{
                    backgroundColor: 'var(--bg-main)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--accent-primary)',
                  }}
                >
                  SAAS
                </span>
              </div>
              <span
                className="text-[10px] font-medium truncate opacity-60"
                style={{ color: 'var(--text-muted)' }}
              >
                Admin Control Center
              </span>
            </div>
          )}
        </div>

        {/* Collapse toggle button for desktop */}
        <button
          onClick={onToggleCollapse}
          className="hidden lg:flex w-7 h-7 rounded-md border items-center justify-center text-xs opacity-70 hover:opacity-100 transition-opacity cursor-pointer shrink-0"
          style={{
            borderColor: 'var(--border-color)',
            backgroundColor: 'var(--bg-main)',
          }}
          title={isCollapsed ? 'Mở rộng menu' : 'Thu gọn menu'}
        >
          {isCollapsed ? '→' : '←'}
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1.5">
        {!isCollapsed && (
          <div
            className="px-3 text-[10px] font-bold uppercase tracking-wider mb-2 opacity-50"
            style={{ color: 'var(--text-muted)' }}
          >
            Danh Mục Quản Trị
          </div>
        )}

        {navItems.map(item => {
          const active = isActive(item);
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                active ? 'shadow-xs' : 'opacity-75 hover:opacity-100'
              } ${isCollapsed ? 'justify-center px-0' : ''}`}
              style={{
                backgroundColor: active ? 'var(--accent-primary)' : 'transparent',
                color: active ? '#FFFFFF' : 'var(--text-main)',
              }}
              title={isCollapsed ? item.label : undefined}
            >
              {!isCollapsed ? (
                <span className="flex-1 text-left truncate font-medium">{item.label}</span>
              ) : (
                <span className="font-bold text-xs">{item.label.charAt(0)}</span>
              )}
              {!isCollapsed && item.count !== undefined && (
                <span
                  className="text-[10px] font-mono px-1.5 py-0.5 rounded border opacity-90 shrink-0"
                  style={{
                    borderColor: active ? 'rgba(255,255,255,0.4)' : 'var(--border-color)',
                    backgroundColor: active ? 'rgba(255,255,255,0.15)' : 'var(--bg-main)',
                  }}
                >
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer Info */}
      {!isCollapsed && (
        <div
          className="p-3.5 border-t text-[10px] space-y-1 opacity-60 shrink-0"
          style={{ borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}
        >
          <div className="font-semibold">VisualLab Admin v2.4</div>
          <div>GDPT 2018 Academic Platform</div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Permanent Sidebar */}
      <aside className="hidden lg:block h-screen sticky top-0 shrink-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop & Sidebar */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative z-10 w-64 h-full">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
