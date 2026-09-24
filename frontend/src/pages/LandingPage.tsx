import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { AuthModal } from '../components/auth/AuthModal';
import { EditProfileModal } from '../components/auth/EditProfileModal';
import { LandingCommandPalette } from '../components/landing/LandingCommandPalette';
import { LandingHero } from '../components/landing/LandingHero';
import { LandingMetricsStrip } from '../components/landing/LandingMetricsStrip';
import { LandingCurriculumTracks } from '../components/landing/LandingCurriculumTracks';
import { LandingFooter } from '../components/landing/LandingFooter';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const openAuthModal = (tab: 'login' | 'register') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  const getWorkspacePath = () => {
    if (user?.role === 'ADMIN') return '/admin';
    if (user?.role === 'TEACHER') return '/teacher/classes';
    return '/student/classes';
  };

  const getWorkspaceLabel = () => {
    if (user?.role === 'ADMIN') return 'Trang Quản Trị Hệ Thống';
    if (user?.role === 'TEACHER') return 'Không Gian Giáo Viên';
    return 'Không Gian Lớp Học';
  };

  const scrollToSection = (selector: string) => {
    const el = document.querySelector(selector);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans transition-colors duration-200" style={{ backgroundColor: 'var(--bg-main)', color: 'var(--text-main)' }}>
      {/* Auth Modals */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialTab={authModalTab}
        onSuccessRedirect={() => navigate(getWorkspacePath())}
      />

      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
      />

      {/* Command Palette Modal (Ctrl+K) */}
      <LandingCommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
      />

      {/* Pure Physics Lab Academic Header */}
      <header className="sticky top-0 z-40 border-b shadow-xs transition-colors duration-200" style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)' }}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => { window.location.href = '/'; }}>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-white text-sm tracking-wider shadow-xs" style={{ backgroundColor: 'var(--accent-primary)' }}>
                VL
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-lg leading-none tracking-tight">VISUAL<span style={{ color: 'var(--accent-primary)' }}>LAB</span></span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">GDPT 2018</span>
                </div>
                <span className="text-[10px] tracking-wider uppercase font-semibold mt-0.5 opacity-70" style={{ color: 'var(--text-muted)' }}>Cổng Thí Nghiệm Vật Lý Mô Phỏng</span>
              </div>
            </div>

            {/* Academic Navigation Links */}
            <nav className="hidden md:flex items-center gap-6 text-xs font-semibold ml-4" style={{ color: 'var(--text-muted)' }}>
              <button 
                type="button" 
                onClick={() => scrollToSection('#hero')} 
                className="hover:opacity-80 transition cursor-pointer" 
                style={{ color: 'var(--text-main)' }}
              >
                Trang Chủ
              </button>

              <button 
                type="button" 
                onClick={() => scrollToSection('#curriculum')} 
                className="hover:opacity-80 transition cursor-pointer" 
                style={{ color: 'var(--text-main)' }}
              >
                Chương Trình GDPT
              </button>

              <button 
                type="button" 
                onClick={() => navigate('/thu-vien')} 
                className="hover:opacity-80 transition cursor-pointer text-blue-500 font-bold" 
              >
                Thư Viện Thí Nghiệm
              </button>
            </nav>
          </div>

          {/* Right Action Rail */}
          <div className="flex items-center gap-3">
            {/* Quick Search Button (Command Trigger) */}
            <button
              type="button"
              onClick={() => setIsCommandPaletteOpen(true)}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-mono transition-colors hover:bg-slate-500/10 cursor-pointer"
              style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-main)', color: 'var(--text-muted)' }}
              title="Tìm kiếm bài thí nghiệm (Ctrl + K)"
              aria-label="Tìm kiếm bài thí nghiệm"
            >
              <svg className="w-3.5 h-3.5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>Tìm bài học</span>
              <kbd className="text-[10px] px-1 py-0.2 rounded border opacity-60">⌘K</kbd>
            </button>

            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme} 
              className="p-2 rounded-lg border transition-colors flex items-center justify-center cursor-pointer"
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

            {/* Auth Button or User Dropdown */}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="w-9 h-9 rounded-full text-white flex items-center justify-center font-extrabold text-sm uppercase shadow-xs transition-transform duration-150 cursor-pointer hover:scale-105 active:scale-95 border border-white/20"
                  style={{ backgroundColor: 'var(--accent-primary)' }}
                  title={user.fullName}
                  aria-label="User Menu"
                >
                  {user.fullName ? user.fullName.charAt(0) : 'U'}
                </button>

                {isUserDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2.5 w-60 border rounded-xl shadow-xl p-2 z-50 transition-all duration-150 animate-fadeIn"
                    style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
                  >
                    <div 
                      className="absolute -top-[7px] right-3.5 w-3 h-3 rotate-45 border-t border-l z-50" 
                      style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)' }} 
                    />
                    
                    <div className="px-3 py-2 border-b space-y-1 relative z-10" style={{ borderColor: 'var(--border-color)' }}>
                      <div className="font-bold text-xs truncate" style={{ color: 'var(--text-main)' }}>
                        {user.fullName}
                      </div>
                      <div className="text-[11px] truncate opacity-70" style={{ color: 'var(--text-muted)' }}>
                        {user.email}
                      </div>
                      <span className="inline-block text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider mt-1" style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)', color: 'var(--accent-primary)' }}>
                        {user.role || 'STUDENT'}
                      </span>
                    </div>

                    <div className="py-1 space-y-0.5">
                      <button
                        type="button"
                        onClick={() => {
                          setIsUserDropdownOpen(false);
                          navigate(getWorkspacePath());
                        }}
                        className="w-full text-left px-3 py-2 text-xs font-medium rounded-md hover:bg-slate-500/10 transition flex items-center justify-between cursor-pointer"
                      >
                        <span>{getWorkspaceLabel()}</span>
                        <span className="opacity-50">→</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setIsUserDropdownOpen(false);
                          setIsEditProfileOpen(true);
                        }}
                        className="w-full text-left px-3 py-2 text-xs font-medium rounded-md hover:bg-slate-500/10 transition cursor-pointer"
                      >
                        Hồ Sơ Cá Nhân
                      </button>
                    </div>

                    <div className="pt-1 border-t mt-1" style={{ borderColor: 'var(--border-color)' }}>
                      <button
                        type="button"
                        onClick={() => {
                          setIsUserDropdownOpen(false);
                          logout();
                          navigate('/');
                        }}
                        className="w-full text-left px-3 py-2 text-xs font-semibold text-red-500 hover:bg-red-500/10 rounded-md transition cursor-pointer"
                      >
                        Đăng Xuất
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openAuthModal('login')}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors hover:bg-slate-500/10 cursor-pointer"
                  style={{ color: 'var(--text-main)' }}
                >
                  Đăng nhập
                </button>
                <button
                  onClick={() => openAuthModal('register')}
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-lg text-white transition-opacity hover:opacity-90 shadow-xs cursor-pointer"
                  style={{ backgroundColor: 'var(--accent-primary)' }}
                >
                  Đăng ký
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Landing Sections */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-6 space-y-12">
        {/* Typographic Hero & Lab Platform Highlights */}
        <LandingHero
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          onExploreLabs={() => navigate('/thu-vien')}
        />

        {/* Metrics & Quality Assurance Banner */}
        <LandingMetricsStrip />

        {/* 3 Curriculum Tracks for Grade 10, 11, 12 */}
        <LandingCurriculumTracks />
      </main>

      {/* Academic Footer */}
      <LandingFooter />
    </div>
  );
};
