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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);

  useEffect(() => {
    labService.getAllLabs().then(setLabs);
  }, []);

  const getDifficultyBadge = (diff?: string) => {
    switch ((diff || '').toUpperCase()) {
      case 'EASY':
      case 'DỄ':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-950 text-emerald-400 border border-emerald-700/50">Dễ</span>;
      case 'HARD':
      case 'NÂNG CAO':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-950 text-rose-400 border border-rose-700/50">Nâng Cao</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-950 text-amber-400 border border-amber-700/50">Trung Bình</span>;
    }
  };

  const filteredLabs = labs.filter(lab => {
    const matchesSearch = searchQuery === '' || 
      lab.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lab.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lab.domain && lab.domain.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesGrade = !selectedGrade || lab.grade === selectedGrade;
    const matchesDomain = !selectedDomain || lab.domain === selectedDomain;

    return matchesSearch && matchesGrade && matchesDomain;
  });

  const domains = Array.from(new Set(labs.map(l => l.domain).filter(Boolean)));

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
      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-8 flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 flex-shrink-0 space-y-6">
          <div className="p-5 rounded-2xl border" style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)' }}>
            <h3 className="font-bold mb-4 text-sm flex items-center justify-between">
              <span>Lớp Học</span>
              {selectedGrade && (
                <button onClick={() => setSelectedGrade(null)} className="text-[11px] text-cyan-500 hover:underline font-normal">Xóa lọc</button>
              )}
            </h3>
            <div className="space-y-2 text-xs">
              {['Lớp 10', 'Lớp 11', 'Lớp 12'].map(g => (
                <label key={g} className="flex items-center gap-2 cursor-pointer hover:text-cyan-400 transition">
                  <input
                    type="radio"
                    name="grade"
                    checked={selectedGrade === g}
                    onChange={() => setSelectedGrade(selectedGrade === g ? null : g)}
                    className="accent-cyan-500"
                  />
                  <span>{g}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div className="p-5 rounded-2xl border" style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)' }}>
            <h3 className="font-bold mb-4 text-sm flex items-center justify-between">
              <span>Phân Môn / Chủ Đề</span>
              {selectedDomain && (
                <button onClick={() => setSelectedDomain(null)} className="text-[11px] text-cyan-500 hover:underline font-normal">Xóa lọc</button>
              )}
            </h3>
            <div className="space-y-2 text-xs">
              {domains.map(d => (
                <label key={d} className="flex items-center gap-2 cursor-pointer hover:text-cyan-400 transition">
                  <input
                    type="radio"
                    name="domain"
                    checked={selectedDomain === d}
                    onChange={() => setSelectedDomain(selectedDomain === d ? null : d!)}
                    className="accent-cyan-500"
                  />
                  <span>{d}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 space-y-6">
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-2xl font-black">Khám Phá Thư Viện Bài Thí Nghiệm</h1>
              <p className="text-sm opacity-70 mt-1">Tìm kiếm và tương tác các bài thực hành mô phỏng chuẩn GDPT 2018</p>
            </div>
            <div className="text-sm font-semibold opacity-70">{filteredLabs.length} bài lab</div>
          </div>

          <div className="w-full flex items-center px-4 h-12 rounded-xl border" style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)' }}>
            <span className="opacity-50 mr-3">🔍</span>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm bài thí nghiệm, chủ đề..."
              className="flex-1 bg-transparent border-none outline-none text-sm"
            />
          </div>

          {filteredLabs.length === 0 ? (
            <div className="py-20 border border-dashed rounded-2xl flex flex-col items-center justify-center text-center opacity-70" style={{ borderColor: 'var(--border-color)' }}>
              <span className="text-2xl mb-2">🔍</span>
              <span className="text-sm font-semibold mb-1">Không tìm thấy bài Lab nào phù hợp</span>
              <span className="text-xs">Vui lòng thử bỏ chọn bộ lọc hoặc nhập từ khóa tìm kiếm khác</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLabs.map(lab => (
                <div
                  key={lab.id}
                  className="group rounded-2xl border flex flex-col overflow-hidden transition-all duration-200 hover:scale-[1.02] shadow-lg cursor-pointer"
                  style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)' }}
                  onClick={() => navigate(lab.route)}
                >
                  {/* Thumbnail Cover Image */}
                  <div className="relative h-40 bg-black overflow-hidden">
                    <img
                      src={lab.thumbnail}
                      alt={lab.title}
                      className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      {lab.domain && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-cyan-950 text-cyan-400 border border-cyan-700/50 shadow-xs">
                          {lab.domain}
                        </span>
                      )}
                      {lab.grade && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-900 text-slate-300 border border-slate-700/50">
                          {lab.grade}
                        </span>
                      )}
                    </div>

                    <div className="absolute top-3 right-3">
                      {getDifficultyBadge(lab.difficulty)}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="font-extrabold text-base line-clamp-2 leading-snug group-hover:text-cyan-400 transition">
                        {lab.title}
                      </h3>
                      <p className="text-xs opacity-70 mt-2 line-clamp-3 leading-relaxed">
                        {lab.description}
                      </p>
                    </div>

                    {/* Tags & Action CTA */}
                    <div className="space-y-3 pt-2 border-t" style={{ borderColor: 'var(--border-color)' }}>
                      <div className="flex flex-wrap gap-1.5">
                        {lab.tags?.map((t, idx) => (
                          <span key={idx} className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800/50 text-slate-400">
                            #{t.trim()}
                          </span>
                        ))}
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(lab.route);
                        }}
                        className="w-full py-2.5 rounded-xl font-extrabold text-xs text-white shadow-md transition-opacity hover:opacity-90 flex items-center justify-center gap-2 cursor-pointer"
                        style={{ backgroundColor: 'var(--accent-primary)' }}
                      >
                        <span>Trải Nghiệm Thí Nghiệm →</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
