import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { AuthModal } from '../components/auth/AuthModal';
import { EditProfileModal } from '../components/auth/EditProfileModal';
import { labService, type PublicLabItem } from '../services/labService';

const THUMBNAIL_RENDERERS = [
  () => (
    <svg width="90" height="80" viewBox="0 0 100 90" className="stroke-blue-600 fill-none stroke-2">
      <line x1="10" y1="10" x2="90" y2="10" stroke="#94a3b8" strokeWidth="4" />
      <path d="M50 10 L50 20 L60 25 L40 35 L60 45 L40 55 L50 60 L50 70" />
      <rect x="38" y="70" width="24" height="18" rx="3" fill="#2563eb" stroke="#3b82f6" />
    </svg>
  ),
  () => (
    <svg width="90" height="80" viewBox="0 0 100 90" className="stroke-emerald-600 fill-none stroke-2">
      <line x1="50" y1="10" x2="50" y2="80" stroke="#94a3b8" strokeDasharray="3,3" />
      <circle cx="50" cy="30" r="8" fill="#059669" stroke="#10b981" />
      <rect x="25" y="55" width="50" height="16" rx="2" fill="#0f172a" stroke="#10b981" />
      <text x="50" y="66" textAnchor="middle" fill="#10b981" fontSize="9" fontFamily="monospace">MC-964</text>
    </svg>
  ),
  () => (
    <svg width="100" height="80" viewBox="0 0 110 90" className="stroke-cyan-600 fill-none stroke-2">
      <path d="M10 45 Q 25 15, 40 45 T 70 45 T 100 45" stroke="#0891b2" strokeWidth="2.5" />
      <line x1="5" y1="45" x2="105" y2="45" stroke="#94a3b8" strokeDasharray="2,2" />
    </svg>
  ),
];

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');
  const [labs, setLabs] = useState<PublicLabItem[]>([]);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    labService.getFeaturedLabs().then(setLabs);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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

  return (
    <div className="min-h-screen flex flex-col font-sans transition-colors duration-200" style={{ backgroundColor: 'var(--bg-main)', color: 'var(--text-main)' }}>
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

      {/* Header V2 (High Trust Academic Header) */}
      <header className="sticky top-0 z-50 border-b shadow-xs transition-colors duration-200" style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)' }}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
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

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-6 text-xs font-semibold ml-4" style={{ color: 'var(--text-muted)' }}>
              <a href="#hero" className="font-bold" style={{ color: 'var(--accent-primary)' }}>Trang Chủ</a>
              <a href="#catalog" className="hover:opacity-80 transition" style={{ color: 'var(--text-main)' }}>Thí Nghiệm SGK</a>
              <a href="#resources" className="hover:opacity-80 transition" style={{ color: 'var(--text-main)' }}>Tài Nguyên Giáo Viên</a>
              <a href="#accreditation" className="hover:opacity-80 transition" style={{ color: 'var(--text-main)' }}>Chuẩn Thẩm Định</a>
            </nav>
          </div>

          <div className="flex items-center gap-3">
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

                {/* Dropdown Menu Card */}
                {isUserDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2.5 w-60 border rounded-xl shadow-xl p-2 z-50 transition-all duration-150 animate-fadeIn"
                    style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
                  >
                    {/* Top Pointer Arrow Centered on Avatar */}
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

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-10 space-y-12">
        
        {/* Hero Section Visual Split (Pop-out Card Contrast) */}
        <section id="hero" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border rounded-2xl p-8 shadow-sm transition-colors" style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)' }}>
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full border" style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)', color: 'var(--accent-primary)' }}>
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              <span>CHUẨN CHƯƠNG TRÌNH VẬT LÝ GDPT 2018</span>
            </div>

            <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight" style={{ color: 'var(--text-main)' }}>
              Cổng Thí nghiệm Vật lý <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-cyan-500 to-emerald-500">
                Mô phỏng Trực quan Học thuật
              </span>
            </h1>

            <p className="text-sm lg:text-base leading-relaxed max-w-xl" style={{ color: 'var(--text-muted)' }}>
              Khám phá thế giới Cơ học, Điện từ và Quang học bằng công nghệ mô phỏng tương tác thời gian thực. Tối ưu cho giảng dạy và học tập chuẩn hóa tại các trường THPT.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={() => navigate('/thu-vien')}
                className="px-6 py-3 text-xs font-bold text-white rounded-xl transition shadow-md flex items-center gap-2 cursor-pointer hover:opacity-90"
                style={{ backgroundColor: 'var(--accent-primary)' }}
              >
                <span>Vào Thí Nghiệm Ngay</span>
                <span>→</span>
              </button>
              <button
                onClick={() => navigate('/srs-lab')}
                className="px-6 py-3 text-xs font-semibold rounded-xl border transition cursor-pointer"
                style={{ borderColor: 'var(--border-color)', color: 'var(--text-main)', backgroundColor: 'var(--bg-main)' }}
              >
                Xem Thí nghiệm SGK (SRS)
              </button>
            </div>

            {/* Social Proof Trust Metrics */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t" style={{ borderColor: 'var(--border-color)' }}>
              <div>
                <div className="text-xl font-extrabold" style={{ color: 'var(--accent-primary)' }}>50+</div>
                <div className="text-[11px] font-medium" style={{ color: 'var(--text-muted)' }}>Trường THPT tin dùng</div>
              </div>
              <div>
                <div className="text-xl font-extrabold text-emerald-500">100%</div>
                <div className="text-[11px] font-medium" style={{ color: 'var(--text-muted)' }}>Chuẩn Thẩm định GDPT</div>
              </div>
              <div>
                <div className="text-xl font-extrabold text-cyan-500">&lt; 1ms</div>
                <div className="text-[11px] font-medium" style={{ color: 'var(--text-muted)' }}>Độ trễ mô phỏng</div>
              </div>
            </div>
          </div>

          {/* Right Column: Card with Pop-Out contrast */}
          <div className="lg:col-span-5 border rounded-xl p-6 space-y-4 shadow-md transition-colors" style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)' }}>
            <div className="flex items-center justify-between text-xs pb-3 border-b" style={{ borderColor: 'var(--border-color)' }}>
              <span className="font-bold flex items-center gap-2" style={{ color: 'var(--accent-primary)' }}>
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></span>
                Xem Trước Mô Phỏng Trực Tiếp
              </span>
              <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Con lắc lò xo dao động</span>
            </div>

            {/* Inner Simulation Canvas View */}
            <div className="h-44 rounded-lg border relative flex items-center justify-center overflow-hidden shadow-inner" style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)' }}>
              <div className="flex flex-col items-center justify-center">
                <svg width="36" height="55" viewBox="0 0 40 70" className="stroke-cyan-500 fill-none stroke-2">
                  <path d="M20 0 L20 10 L30 15 L10 25 L30 35 L10 45 L30 55 L20 60 L20 70" />
                </svg>
                <div className="w-12 h-9 rounded border shadow-xs flex items-center justify-center text-[10px] font-bold text-white" style={{ backgroundColor: 'var(--accent-primary)', borderColor: 'var(--border-color)' }}>
                  m = 0.5kg
                </div>
              </div>
              <div className="absolute bottom-2 right-2 border rounded px-2 py-1 text-[9px] font-mono" style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}>
                <div>x = 5.2 cm</div>
                <div>t = 1.24 s</div>
              </div>
            </div>

            {/* Simulated Slider Controls */}
            <div className="space-y-2 text-xs pt-1">
              <div className="flex items-center justify-between text-[11px] font-medium" style={{ color: 'var(--text-muted)' }}>
                <span>Độ cứng lò xo (k):</span>
                <span className="font-bold" style={{ color: 'var(--accent-primary)' }}>100 N/m</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--bg-panel)' }}>
                <div className="h-full w-1/2 rounded-full" style={{ backgroundColor: 'var(--accent-primary)' }}></div>
              </div>
            </div>
          </div>
        </section>

        {/* Catalog Grid */}
        <section id="catalog" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold tracking-tight" style={{ color: 'var(--text-main)' }}>
                Danh mục Bài Thí nghiệm Trực quan
              </h2>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                Mô phỏng 2D/3D trực quan phẳng cho học sinh THPT
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs px-3 py-1 rounded-full font-semibold border hidden sm:inline" style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>
                {labs.length} Bài Thực Hành
              </span>
              <Link 
                to="/thu-vien"
                className="px-4 py-1.5 text-xs font-bold rounded-lg border transition-all hover:opacity-80 flex items-center gap-1.5 cursor-pointer shadow-xs"
                style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)', color: 'var(--accent-primary)' }}
              >
                <span>Xem Tất Cả Bài Thí Nghiệm</span>
                <span>→</span>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {labs.map((lab, index) => {
              const ThumbnailRenderer = THUMBNAIL_RENDERERS[index % THUMBNAIL_RENDERERS.length];
              return (
                <div 
                  key={lab.id} 
                  className="border rounded-xl overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-md transition-all"
                  style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)' }}
                >
                  {/* Visual Thumbnail */}
                  <div className="p-4 border-b h-36 flex items-center justify-center relative" style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)' }}>
                    <ThumbnailRenderer />
                    <span className="absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded border" style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)', color: 'var(--accent-primary)' }}>
                      {lab.subject}
                    </span>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="text-[11px] font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>
                        {lab.chapter}
                      </div>
                      <h3 className="text-base font-bold mb-1.5" style={{ color: 'var(--text-main)' }}>
                        {lab.title}
                      </h3>
                      <p className="text-xs leading-relaxed line-clamp-2" style={{ color: 'var(--text-muted)' }}>
                        {lab.description}
                      </p>
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {lab.tags.map((tag, idx) => (
                          <span 
                            key={idx} 
                            className="text-[10px] px-2 py-0.5 rounded font-medium border"
                            style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t flex items-center justify-between" style={{ borderColor: 'var(--border-color)' }}>
                      <span className="text-xs font-semibold text-emerald-500">Sẵn sàng</span>
                      <button 
                        onClick={() => navigate(lab.route)}
                        className="px-3.5 py-1.5 text-xs font-semibold rounded-lg text-white transition-opacity hover:opacity-90 shadow-xs cursor-pointer"
                        style={{ backgroundColor: 'var(--accent-primary)' }}
                      >
                        Thực hành
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* Comprehensive 4-Column Academic Footer V2 */}
      <footer className="mt-12 border-t transition-colors duration-200" style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)' }}>
        <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-xs">
            
            {/* Col 1: Brand & Mission */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded flex items-center justify-center font-bold text-white text-xs" style={{ backgroundColor: 'var(--accent-primary)' }}>VL</div>
                <span className="font-extrabold text-base tracking-tight" style={{ color: 'var(--text-main)' }}>VISUAL<span style={{ color: 'var(--accent-primary)' }}>LAB</span></span>
              </div>
              <p className="leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                Nền tảng Thí nghiệm Vật lý Mô phỏng Học thuật chuẩn GDPT 2018. Giải pháp trực quan hóa phòng thí nghiệm dành cho THCS & THPT Việt Nam.
              </p>
              <div className="text-[11px] font-semibold opacity-70" style={{ color: 'var(--text-muted)' }}>
                Phiên bản v2.4 Academic Pro
              </div>
            </div>

            {/* Col 2: High School Topics */}
            <div className="space-y-3">
              <h4 className="font-bold uppercase tracking-wider text-[11px]" style={{ color: 'var(--text-main)' }}>Chương Trình Học Thuật</h4>
              <ul className="space-y-2 font-medium" style={{ color: 'var(--text-muted)' }}>
                <li><a href="#catalog" className="hover:opacity-80 transition">Vật lý 10 — Động lực học & Gia tốc</a></li>
                <li><a href="#catalog" className="hover:opacity-80 transition">Vật lý 11 — Điện tích & Dòng điện</a></li>
                <li><a href="#catalog" className="hover:opacity-80 transition">Vật lý 12 — Con lắc lò xo & Sóng cơ</a></li>
                <li><a href="#catalog" className="hover:opacity-80 transition">Vật lý 12 — Dòng điện xoay chiều RLC</a></li>
              </ul>
            </div>

            {/* Col 3: Educator & Student Resources */}
            <div id="resources" className="space-y-3">
              <h4 className="font-bold uppercase tracking-wider text-[11px]" style={{ color: 'var(--text-main)' }}>Tài Nguyên & Công Cụ</h4>
              <ul className="space-y-2 font-medium" style={{ color: 'var(--text-muted)' }}>
                <li><a href="#hero" className="hover:opacity-80 transition">Hướng dẫn Giáo viên Tạo Lớp</a></li>
                <li><a href="#hero" className="hover:opacity-80 transition">Mẫu Báo cáo Thí nghiệm PDF</a></li>
                <li><a href="#hero" className="hover:opacity-80 transition">Ngân hàng Thí nghiệm SRS</a></li>
                <li><a href="#accreditation" className="hover:opacity-80 transition">Kiểm định & Thẩm định BGD</a></li>
              </ul>
            </div>

            {/* Col 4: Accreditation & Contact */}
            <div id="accreditation" className="space-y-3">
              <h4 className="font-bold uppercase tracking-wider text-[11px]" style={{ color: 'var(--text-main)' }}>Thông Tin Khác</h4>
              <div className="p-3 rounded-lg border space-y-1.5" style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)' }}>
                <div className="font-bold text-emerald-500">Chuẩn Thẩm Định GDPT 2018</div>
                <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>Hỗ trợ giảng dạy STEM & phòng thí nghiệm ảo số hóa.</div>
              </div>
              <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                Liên hệ: <span className="font-semibold" style={{ color: 'var(--text-main)' }}>support@visuallab.edu.vn</span>
              </div>
            </div>

          </div>

          {/* Sub Footer */}
          <div className="pt-6 border-t flex flex-col md:flex-row items-center justify-between text-xs font-medium gap-4" style={{ borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>
            <div>
              © 2026 VisualLab Physics Platform. Bản quyền thuộc về Dự án Thí nghiệm Học thuật Việt Nam.
            </div>
            <div className="flex gap-6">
              <a href="#hero" className="hover:opacity-80 transition">Điều khoản sử dụng</a>
              <a href="#hero" className="hover:opacity-80 transition">Chính sách bảo mật</a>
              <a href="#hero" className="hover:opacity-80 transition">Sơ đồ trang</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
