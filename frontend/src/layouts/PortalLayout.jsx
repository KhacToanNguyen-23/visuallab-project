import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

export default function PortalLayout() {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-200" style={{ backgroundColor: 'var(--bg-main)', color: 'var(--text-main)' }}>
      {/* Cisco / Academic Style Top Portal Navigation */}
      <header className="h-16 flex items-center justify-between px-8 sticky top-0 z-50 border-b" style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)' }}>
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded flex items-center justify-center font-bold text-white text-sm tracking-wider" style={{ backgroundColor: 'var(--accent-primary)' }}>
              VL
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-none tracking-tight">VISUAL<span style={{ color: 'var(--accent-primary)' }}>LAB</span></span>
              <span className="text-[10px] tracking-wider uppercase font-semibold mt-0.5 opacity-70" style={{ color: 'var(--text-muted)' }}>Academic Simulation Portal</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            <Link 
              to="/" 
              className={`px-4 py-2 rounded transition-colors ${location.pathname === '/' ? 'font-semibold' : 'opacity-80 hover:opacity-100'}`}
              style={{ 
                color: location.pathname === '/' ? 'var(--accent-primary)' : 'var(--text-main)',
                backgroundColor: location.pathname === '/' ? 'var(--bg-main)' : 'transparent' 
              }}
            >
              Thư viện Thí nghiệm
            </Link>
            <a 
              href="#documents" 
              className="px-4 py-2 rounded transition-colors opacity-80 hover:opacity-100"
              style={{ color: 'var(--text-main)' }}
            >
              Tài liệu Học thuật
            </a>
            <a 
              href="#about" 
              className="px-4 py-2 rounded transition-colors opacity-80 hover:opacity-100"
              style={{ color: 'var(--text-main)' }}
            >
              Giới thiệu
            </a>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {/* Theme Toggle Button */}
          <button 
            onClick={toggleTheme} 
            className="p-2 rounded-md border transition-colors flex items-center justify-center"
            style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-main)', color: 'var(--text-main)' }}
            title={`Chuyển sang giao diện ${theme === 'light' ? 'Tối' : 'Sáng'}`}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            )}
          </button>

          <button 
            className="px-4 py-2 text-sm font-medium rounded border transition-colors"
            style={{ borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
          >
            Đăng nhập
          </button>
        </div>
      </header>

      {/* Main Portal Body */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Academic Footer */}
      <footer className="py-6 border-t text-center text-xs font-medium transition-colors" style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>&copy; 2026 VisualLab Vietnam — Interactive Academic Physics Lab</div>
          <div className="flex gap-6">
            <a href="#privacy" className="hover:underline">Bảo mật</a>
            <a href="#terms" className="hover:underline">Điều khoản sử dụng</a>
            <a href="#contact" className="hover:underline">Liên hệ</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
