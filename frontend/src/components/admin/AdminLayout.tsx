import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { EditProfileModal } from '../auth/EditProfileModal';

export const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Handle Cmd+K keyboard shortcut
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const searchRoutes = [
    { title: 'Quản Lý Người Dùng & Phân Quyền', path: '/admin/users', category: 'Trang Admin' },
    { title: 'Kho Lab Hệ Thống & Trạng Thái Mô Phỏng', path: '/admin/labs', category: 'Trang Admin' },
    { title: 'Nhật Ký Hoạt Động (Audit Log)', path: '/admin/audit', category: 'Trang Admin' },
    { title: 'Tổng Quan Hệ Thống & KPIs', path: '/admin', category: 'Trang Admin' },
    { title: 'Thí nghiệm Mạch Điện Đơn Giản & Ohm', path: '/simulation', category: 'Bài Thí Nghiệm' },
    { title: 'Thí nghiệm Đo Gia Tốc Rơi Tự Do g', path: '/srs-lab', category: 'Bài Thí Nghiệm' },
  ];

  const filteredSearch = searchRoutes.filter(r =>
    !searchQuery ||
    r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      className="min-h-screen w-screen flex font-sans overflow-x-hidden transition-colors duration-200"
      style={{ backgroundColor: 'var(--bg-main)', color: 'var(--text-main)' }}
    >
      {/* Permanent / Mobile Sidebar */}
      <AdminSidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden">
        <AdminHeader
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenProfileModal={() => setIsEditProfileOpen(true)}
        />

        {/* Dynamic Route Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
          <Outlet />
        </main>
      </div>

      {/* Cmd+K Quick Search Command Palette Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-900/60 backdrop-blur-xs">
          <div
            className="w-full max-w-xl border rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
            style={{
              backgroundColor: 'var(--bg-panel)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-main)',
            }}
          >
            <div
              className="p-4 border-b flex items-center gap-3"
              style={{ borderColor: 'var(--border-color)' }}
            >
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm nhanh trang quản trị hoặc bài thí nghiệm (Gõ tên...)"
                className="flex-1 bg-transparent text-sm font-medium focus:outline-none"
                style={{ color: 'var(--text-main)' }}
              />
              <button
                onClick={() => setIsSearchOpen(false)}
                className="text-xs px-2 py-1 rounded border opacity-60 hover:opacity-100"
                style={{ borderColor: 'var(--border-color)' }}
              >
                ESC
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto p-2 space-y-1">
              {filteredSearch.length > 0 ? (
                filteredSearch.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      setIsSearchOpen(false);
                      setSearchQuery('');
                      navigate(item.path);
                    }}
                    className="p-3 rounded-lg hover:bg-slate-500/10 cursor-pointer flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold px-2 py-0.5 rounded border opacity-75" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-main)' }}>
                        {item.category}
                      </span>
                      <span className="text-xs font-semibold">{item.title}</span>
                    </div>
                    <span className="text-[11px] font-mono opacity-50">{item.path}</span>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-xs opacity-60">
                  Không tìm thấy trang phù hợp với "{searchQuery}"
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Profile Edit Modal */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
      />
    </div>
  );
};
