import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { AuthModal } from '../components/auth/AuthModal';
import { labService, type PublicLabItem } from '../services/labService';

export const CatalogPage: React.FC = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [labs, setLabs] = useState<PublicLabItem[]>([]);

  useEffect(() => {
    labService.getAllLabs().then(setLabs);
  }, []);

  return (
    <div className="min-h-screen flex flex-col font-sans transition-colors duration-200" style={{ backgroundColor: 'var(--bg-main)', color: 'var(--text-main)' }}>
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialTab="login"
        onSuccessRedirect={() => navigate('/dashboard')}
      />

      {/* Header Reused from LandingPage */}
      <header className="sticky top-0 z-50 border-b shadow-xs transition-colors duration-200" style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)' }}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-white text-sm tracking-wider shadow-xs" style={{ backgroundColor: 'var(--accent-primary)' }}>VL</div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-lg leading-none tracking-tight">VISUAL<span style={{ color: 'var(--accent-primary)' }}>LAB</span></span>
                </div>
                <span className="text-[10px] tracking-wider uppercase font-semibold mt-0.5 opacity-70" style={{ color: 'var(--text-muted)' }}>Cổng Thư Viện</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={toggleTheme} className="p-2 rounded-lg border transition-colors flex items-center justify-center cursor-pointer" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-main)', color: 'var(--text-main)' }}>
              {theme === 'light' ? '🌙' : '☀️'}
            </button>

            {user ? (
              <div className="flex items-center gap-3">
                <button onClick={() => navigate('/dashboard')} className="px-4 py-2 text-xs font-semibold rounded-lg text-white transition-opacity hover:opacity-90 shadow-xs cursor-pointer" style={{ backgroundColor: 'var(--accent-primary)' }}>
                  Vào Dashboard
                </button>
                <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-xs uppercase cursor-pointer" title={user.fullName}>
                  {user.fullName.charAt(0)}
                </div>
              </div>
            ) : (
              <button onClick={() => setIsAuthModalOpen(true)} className="px-4 py-2 text-xs font-semibold rounded-lg border transition-colors cursor-pointer" style={{ borderColor: 'var(--border-color)' }}>
                Đăng Nhập
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Catalog Layout */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-8 flex gap-8">
        
        {/* Sidebar Filters */}
        <aside className="w-64 flex-shrink-0 space-y-6 hidden md:block">
          <div className="p-5 rounded-xl border" style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)' }}>
            <h3 className="font-bold mb-4">Lớp Học</h3>
            <div className="space-y-2 text-sm opacity-60">
              <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" disabled /> Lớp 10</label>
              <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" disabled /> Lớp 11</label>
              <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" disabled /> Lớp 12</label>
            </div>
          </div>
          
          <div className="p-5 rounded-xl border" style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)' }}>
            <h3 className="font-bold mb-4">Chương (Môn Vật Lý)</h3>
            <div className="text-xs text-center opacity-60 italic py-4">Đang cập nhật dữ liệu...</div>
          </div>
        </aside>

        {/* Content */}
        <div className="flex-1 space-y-6">
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-2xl font-black">Khám Phá Thư Viện</h1>
              <p className="text-sm opacity-70 mt-1">Tìm kiếm và lọc các bài thí nghiệm mô phỏng</p>
            </div>
            <div className="text-sm font-semibold opacity-70">{labs.length} kết quả</div>
          </div>

          <div className="w-full flex items-center px-4 h-12 rounded-lg border" style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)' }}>
            <span className="opacity-50 mr-3">🔍</span>
            <input type="text" placeholder="Tìm kiếm bài thí nghiệm, chủ đề..." className="flex-1 bg-transparent border-none outline-none text-sm" disabled />
          </div>

          {labs.length === 0 ? (
            <div className="py-20 border border-dashed rounded-xl flex flex-col items-center justify-center text-center opacity-70" style={{ borderColor: 'var(--border-color)' }}>
              <span className="text-sm font-semibold mb-2">Chưa có bài Lab nào được công bố</span>
              <span className="text-xs">Vui lòng quay lại sau</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Lab cards will render here once data arrives */}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
