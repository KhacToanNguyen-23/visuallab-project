import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { AuthModal } from '../components/auth/AuthModal';
import { EditProfileModal } from '../components/auth/EditProfileModal';
import { LandingCommandPalette } from '../components/landing/LandingCommandPalette';
import { labService, type PublicLabItem } from '../services/labService';

const LAB_CODE_MAP: Record<string, string> = {
  'sim-speed-measurement': 'VL10-DH01',
  'sim-free-fall': 'VL10-DH02',
  'sim-friction-coefficient': 'VL10-CL01',
  'sim-newton-second-law': 'VL10-CL02',
  'sim-mechanical-energy-conservation': 'VL10-NL01',
  'sim-hooke-law': 'VL10-BD01',
  'sim-spring-pendulum': 'VL11-DD01',
  'sim-simple-pendulum': 'VL11-DD02',
  'sim-wave-interference': 'VL11-SG01',
  'sim-sound-resonance': 'VL11-SG02',
  'sim-light-refraction': 'VL11-Q01',
  'sim-emf-internal-r': 'VL11-DC01',
  'sim-boyle-mariotte': 'VL12-KT01',
  'sim-latent-heat': 'VL12-NH01',
  'sim-induction': 'VL12-DT01',
};

export const CatalogPage: React.FC = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  
  const [labs, setLabs] = useState<PublicLabItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [expandedGrades, setExpandedGrades] = useState<Record<string, boolean>>({
    'Lớp 10': true,
    'Lớp 11': true,
    'Lớp 12': true,
  });

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    labService.getAllLabs().then(setLabs);
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

  const toggleGrade = (grade: string) => {
    setExpandedGrades(prev => ({ ...prev, [grade]: !prev[grade] }));
  };

  // Build tree data from actual labs (strictly Grade 10, 11, 12)
  const treeData = labs.reduce((acc, lab) => {
    if (lab.grade && ['Lớp 10', 'Lớp 11', 'Lớp 12'].includes(lab.grade)) {
      if (!acc[lab.grade]) acc[lab.grade] = new Set();
      if (lab.domain) acc[lab.grade].add(lab.domain);
    }
    return acc;
  }, {} as Record<string, Set<string>>);

  const sortedGrades = Object.keys(treeData).sort((a, b) => a.localeCompare(b, 'vi', { numeric: true }));

  const filteredLabs = labs.filter(lab => {
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch = !q || 
      lab.title.toLowerCase().includes(q) ||
      lab.description.toLowerCase().includes(q) ||
      (lab.domain && lab.domain.toLowerCase().includes(q)) ||
      (LAB_CODE_MAP[lab.id] && LAB_CODE_MAP[lab.id].toLowerCase().includes(q)) ||
      lab.tags.some(t => t.toLowerCase().includes(q));

    const matchesGrade = !selectedGrade || lab.grade === selectedGrade;
    const matchesDomain = !selectedDomain || lab.domain === selectedDomain;

    return matchesSearch && matchesGrade && matchesDomain;
  });

  return (
    <div className="min-h-screen flex flex-col font-sans transition-colors duration-200" style={{ backgroundColor: 'var(--bg-main)', color: 'var(--text-main)' }}>
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialTab="login"
        onSuccessRedirect={() => navigate(getWorkspacePath())}
      />

      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
      />

      <LandingCommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
      />

      {/* Synchronized Academic Header */}
      <header className="sticky top-0 z-40 border-b shadow-xs transition-colors duration-200" style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)' }}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-white text-sm tracking-wider shadow-xs" style={{ backgroundColor: 'var(--accent-primary)' }}>
                VL
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-lg leading-none tracking-tight">VISUAL<span style={{ color: 'var(--accent-primary)' }}>LAB</span></span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">GDPT 2018</span>
                </div>
                <span className="text-[10px] tracking-wider uppercase font-semibold mt-0.5 opacity-70" style={{ color: 'var(--text-muted)' }}>Cổng Thư Viện Thí Nghiệm</span>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-6 text-xs font-semibold ml-4" style={{ color: 'var(--text-muted)' }}>
              <button 
                type="button" 
                onClick={() => navigate('/')} 
                className="hover:opacity-80 transition cursor-pointer" 
                style={{ color: 'var(--text-main)' }}
              >
                Trang Chủ
              </button>

              <button 
                type="button" 
                onClick={() => navigate('/thu-vien')} 
                className="text-blue-500 font-bold transition cursor-pointer" 
              >
                Thư Viện Thí Nghiệm
              </button>
            </nav>
          </div>

          {/* Right Action Rail */}
          <div className="flex items-center gap-3">
            {/* Quick Search Button */}
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

            {/* Auth Dropdown / Login */}
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
                          navigate('/thu-vien');
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
                  onClick={() => setIsAuthModalOpen(true)}
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-lg text-white transition-opacity hover:opacity-90 shadow-xs cursor-pointer"
                  style={{ backgroundColor: 'var(--accent-primary)' }}
                >
                  Đăng nhập
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area: Sidebar Tree + Labs Grid */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-8 flex flex-col md:flex-row gap-8">
        
        {/* Left Sidebar: Cây Thư Mục GDPT 2018 */}
        <aside className="w-full md:w-64 shrink-0 space-y-6">
          <div 
            className="p-5 rounded-2xl border shadow-xs transition-colors sticky top-24" 
            style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)' }}
          >
            <div className="flex items-center justify-between pb-3 mb-3 border-b" style={{ borderColor: 'var(--border-color)' }}>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
                <h3 className="font-bold text-xs uppercase tracking-wider" style={{ color: 'var(--text-main)' }}>
                  Cây Thư Mục SGK
                </h3>
              </div>
              {(selectedGrade || selectedDomain) && (
                <button 
                  onClick={() => { setSelectedGrade(null); setSelectedDomain(null); }} 
                  className="text-[11px] text-blue-500 hover:underline font-semibold cursor-pointer"
                >
                  Xóa lọc
                </button>
              )}
            </div>
            
            <div className="space-y-1.5 font-sans">
              {sortedGrades.map(grade => (
                <div key={grade} className="flex flex-col">
                  {/* Grade Node Accordion */}
                  <div 
                    className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition text-xs font-semibold ${
                      selectedGrade === grade && !selectedDomain 
                        ? 'bg-blue-500/10 text-blue-500 font-bold border border-blue-500/20' 
                        : 'hover:bg-slate-500/10'
                    }`}
                    style={{ color: selectedGrade === grade && !selectedDomain ? 'var(--accent-primary)' : 'var(--text-main)' }}
                    onClick={() => {
                      if (selectedGrade === grade && !selectedDomain) {
                        setSelectedGrade(null);
                      } else {
                        setSelectedGrade(grade);
                        setSelectedDomain(null);
                        setExpandedGrades(prev => ({ ...prev, [grade]: true }));
                      }
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <button 
                        type="button"
                        onClick={(e) => { e.stopPropagation(); toggleGrade(grade); }}
                        className="w-4 h-4 flex items-center justify-center opacity-60 hover:opacity-100"
                      >
                        {expandedGrades[grade] ? (
                          <span className="text-[10px] font-mono">▼</span>
                        ) : (
                          <span className="text-[10px] font-mono">▶</span>
                        )}
                      </button>
                      <span>{grade}</span>
                    </div>
                    <span className="text-[10px] font-mono opacity-50 px-1.5 py-0.2 rounded border" style={{ borderColor: 'var(--border-color)' }}>
                      {labs.filter(l => l.grade === grade).length}
                    </span>
                  </div>
                  
                  {/* Domain Sub-nodes */}
                  {expandedGrades[grade] && (
                    <div className="ml-5 mt-1 flex flex-col border-l pl-2.5 space-y-1" style={{ borderColor: 'var(--border-color)' }}>
                      {Array.from(treeData[grade]).sort().map(domain => {
                        const isDomainActive = selectedGrade === grade && selectedDomain === domain;
                        const count = labs.filter(l => l.grade === grade && l.domain === domain).length;
                        return (
                          <div 
                            key={domain}
                            className={`flex items-center justify-between p-1.5 text-xs rounded-lg cursor-pointer transition ${
                              isDomainActive 
                                ? 'bg-blue-500/10 text-blue-500 font-bold border border-blue-500/20' 
                                : 'hover:bg-slate-500/10 opacity-75 hover:opacity-100'
                            }`}
                            style={{ color: isDomainActive ? 'var(--accent-primary)' : 'var(--text-muted)' }}
                            onClick={() => {
                              setSelectedGrade(grade);
                              setSelectedDomain(domain);
                            }}
                          >
                            <span className="truncate pr-1">• {domain}</span>
                            <span className="text-[10px] font-mono opacity-50">{count}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
              
              {sortedGrades.length === 0 && (
                <div className="text-xs opacity-50 p-2 italic">Đang tải danh mục...</div>
              )}
            </div>
          </div>
        </aside>

        {/* Right Main Content */}
        <div className="flex-1 space-y-6 min-w-0">
          
          {/* Top Title & Universal Lab Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-blue-500">THƯ VIỆN THÍ NGHIỆM</span>
                <span className="text-xs opacity-50">·</span>
                <span className="text-xs font-semibold opacity-70">Chuẩn SGK GDPT 2018</span>
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight" style={{ color: 'var(--text-main)' }}>
                {selectedGrade ? (selectedDomain ? `${selectedGrade} · ${selectedDomain}` : `Chuyên Đề ${selectedGrade}`) : 'Tất Cả Bài Thí Nghiệm'}
              </h1>
            </div>

            {/* Action button to open virtual lab */}
            <button
              onClick={() => navigate('/workbench/universal')}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-white shadow-md hover:opacity-95 active:scale-98 transition flex items-center justify-center gap-2 cursor-pointer shrink-0"
              style={{ backgroundColor: 'var(--accent-primary)' }}
            >
              <span>✨ Mở Bàn Thí Nghiệm Ảo</span>
              <span className="font-mono">→</span>
            </button>
          </div>

          {/* Search Bar with Correct Font & Responsive Width */}
          <div className="flex items-center gap-3">
            <div 
              className="flex-1 flex items-center px-4 h-11 rounded-xl border transition-colors"
              style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)' }}
            >
              <svg className="w-4 h-4 opacity-50 shrink-0 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Nhập tên bài học, mã môn học (VD: VL10, con lắc, sóng, boyle)..."
                className="w-full bg-transparent border-none outline-hidden text-xs sm:text-sm font-medium placeholder:opacity-50"
                style={{ color: 'var(--text-main)' }}
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="text-xs px-2 py-0.5 rounded opacity-60 hover:opacity-100 transition cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            <span className="text-xs font-mono opacity-60 shrink-0">
              {filteredLabs.length} BÀI LAB
            </span>
          </div>

          {/* Labs Grid */}
          {filteredLabs.length === 0 ? (
            <div 
              className="py-16 border border-dashed rounded-2xl flex flex-col items-center justify-center text-center space-y-2 opacity-70"
              style={{ borderColor: 'var(--border-color)' }}
            >
              <span className="text-xl">🔍</span>
              <p className="text-sm font-bold">Không tìm thấy bài thí nghiệm phù hợp</p>
              <p className="text-xs opacity-60">Thử tìm kiếm với từ khóa khác hoặc bấm "Xóa lọc" ở cây thư mục</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredLabs.map(lab => {
                const labCode = LAB_CODE_MAP[lab.id] || 'VL-GDPT';
                return (
                  <article
                    key={lab.id}
                    onClick={() => window.open(lab.route, '_blank')}
                    className="p-5 border rounded-2xl shadow-xs transition-all duration-200 hover:-translate-y-1 hover:shadow-md cursor-pointer flex flex-col justify-between group"
                    style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)' }}
                  >
                    <div className="space-y-3.5">
                      {/* Header Tag Bar */}
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                          {labCode}
                        </span>
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded border opacity-70" style={{ borderColor: 'var(--border-color)', color: 'var(--text-main)' }}>
                          {lab.grade || 'Lớp 10'}
                        </span>
                      </div>

                      {/* Title & Domain */}
                      <div>
                        <span className="text-[11px] font-mono uppercase tracking-wider opacity-60 block mb-1" style={{ color: 'var(--text-muted)' }}>
                          {lab.domain || 'CƠ HỌC'}
                        </span>
                        <h3 className="text-sm font-bold leading-snug group-hover:text-blue-500 transition-colors" style={{ color: 'var(--text-main)' }}>
                          {lab.title}
                        </h3>
                      </div>

                      {/* Description */}
                      <p className="text-xs leading-relaxed opacity-75 line-clamp-2" style={{ color: 'var(--text-muted)' }}>
                        {lab.description}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {lab.tags?.slice(0, 3).map((tag, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-500/5 border opacity-70"
                            style={{ borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action link */}
                    <div className="pt-4 mt-3 border-t flex items-center justify-between text-xs font-bold text-blue-500 group-hover:translate-x-0.5 transition-transform" style={{ borderColor: 'var(--border-color)' }}>
                      <span>Vào phòng thí nghiệm</span>
                      <span className="font-mono">→</span>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

        </div>
      </main>
    </div>
  );
};
