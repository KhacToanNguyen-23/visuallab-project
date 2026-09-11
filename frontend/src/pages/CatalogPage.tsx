import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { AuthModal } from '../components/auth/AuthModal';
import { labService, type PublicLabItem } from '../services/labService';

// Structure for Option B: Grade & Chapter Sidebar Tree
interface ChapterNode {
  name: string;
}

interface GradeNode {
  grade: string;
  chapters: ChapterNode[];
}

const SIDEBAR_TREE: GradeNode[] = [
  {
    grade: 'Lớp 10',
    chapters: [
      { name: 'Chương II: Động học' },
      { name: 'Chương III: Động lực học' },
      { name: 'Chương IV: Năng lượng & Ma sát' },
      { name: 'Chương V: Động lượng & Va chạm' },
      { name: 'Chương VI: Định luật Hooke' },
    ],
  },
  {
    grade: 'Lớp 11',
    chapters: [
      { name: 'Chương I: Dao động' },
      { name: 'Chương II: Sóng' },
      { name: 'Chương III: Quang học' },
      { name: 'Chương IV: Dòng điện không đổi' },
    ],
  },
  {
    grade: 'Lớp 12',
    chapters: [
      { name: 'Chương I: Vật lý nhiệt' },
      { name: 'Chương II: Khí lý tưởng' },
      { name: 'Chương III: Từ trường & Cảm ứng điện từ' },
    ],
  },
];

export const CatalogPage: React.FC = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [labs, setLabs] = useState<PublicLabItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Active Filter States
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Open/collapsed state for grade nodes in sidebar
  const [openGrades, setOpenGrades] = useState<Record<string, boolean>>({
    'Lớp 10': true,
    'Lớp 11': true,
    'Lớp 12': true,
  });

  useEffect(() => {
    setIsLoading(true);
    labService
      .getAllLabs()
      .then((data) => {
        setLabs(data);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const toggleGradeAccordion = (grade: string) => {
    setOpenGrades((prev) => ({ ...prev, [grade]: !prev[grade] }));
  };

  const handleSelectGrade = (grade: string | null) => {
    setSelectedGrade(grade);
    setSelectedChapter(null);
  };

  const handleSelectChapter = (grade: string, chapter: string) => {
    setSelectedGrade(grade);
    setSelectedChapter(chapter);
  };

  const handleClearFilters = () => {
    setSelectedGrade(null);
    setSelectedChapter(null);
    setSearchQuery('');
  };

  // Filtered labs
  const filteredLabs = labs.filter((lab) => {
    // Grade filter
    if (selectedGrade) {
      const matchGrade = lab.subject.toLowerCase().includes(selectedGrade.toLowerCase());
      if (!matchGrade) return false;
    }

    // Chapter filter
    if (selectedChapter) {
      const matchChapter = lab.chapter.toLowerCase().includes(selectedChapter.toLowerCase());
      if (!matchChapter) return false;
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchTitle = lab.title.toLowerCase().includes(q);
      const matchDesc = lab.description.toLowerCase().includes(q);
      const matchTags = lab.tags.some((t) => t.toLowerCase().includes(q));
      const matchTools = lab.tools?.some((t) => t.toLowerCase().includes(q));
      const matchChapterText = lab.chapter.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchTags && !matchTools && !matchChapterText) {
        return false;
      }
    }

    return true;
  });

  return (
    <div
      className="min-h-screen flex flex-col font-sans transition-colors duration-200"
      style={{ backgroundColor: 'var(--bg-main)', color: 'var(--text-main)' }}
    >
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialTab="login"
        onSuccessRedirect={() => navigate('/dashboard')}
      />

      {/* Header Reused & Aligned (Zero Decorative Emojis) */}
      <header
        className="sticky top-0 z-50 border-b shadow-xs transition-colors duration-200"
        style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)' }}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => { window.location.href = '/'; }}>
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-white text-sm tracking-wider shadow-xs"
                style={{ backgroundColor: 'var(--accent-primary)' }}
              >
                VL
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-lg leading-none tracking-tight">
                    VISUAL<span style={{ color: 'var(--accent-primary)' }}>LAB</span>
                  </span>
                </div>
                <span
                  className="text-[10px] tracking-wider uppercase font-semibold mt-0.5 opacity-70"
                  style={{ color: 'var(--text-muted)' }}
                >
                  Thư Viện Bài Thí Nghiệm
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Pure text theme toggle (No Emojis) */}
            <button
              onClick={toggleTheme}
              className="px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors flex items-center justify-center cursor-pointer"
              style={{
                borderColor: 'var(--border-color)',
                backgroundColor: 'var(--bg-main)',
                color: 'var(--text-main)',
              }}
              title="Đổi Giao Diện Light/Dark"
            >
              {theme === 'light' ? 'Chế độ Tối' : 'Chế độ Sáng'}
            </button>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="w-9 h-9 rounded-full bg-blue-600 text-white font-bold text-sm uppercase flex items-center justify-center shadow-md hover:ring-2 hover:ring-blue-400 transition-all cursor-pointer"
                  title={user.fullName}
                >
                  {user.fullName.charAt(0)}
                </button>

                {isUserDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2.5 w-56 rounded-xl border shadow-xl p-2 z-50 transition-all"
                    style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)' }}
                  >
                    {/* Top Pointer Arrow Centered on Avatar */}
                    <div 
                      className="absolute -top-[7px] right-3.5 w-3 h-3 rotate-45 border-t border-l z-50" 
                      style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)' }} 
                    />

                    <div className="px-3 py-2 border-b mb-1 opacity-80 relative z-10" style={{ borderColor: 'var(--border-color)' }}>
                      <div className="font-bold text-sm truncate">{user.fullName}</div>
                      <div className="text-[11px] opacity-70 truncate">{user.email}</div>
                    </div>
                    <button
                      onClick={() => {
                        setIsUserDropdownOpen(false);
                        navigate('/dashboard');
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-semibold rounded-lg hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      Vào Dashboard
                    </button>
                    <button
                      onClick={() => {
                        setIsUserDropdownOpen(false);
                        logout();
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-semibold rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                    >
                      Đăng Xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors hover:bg-slate-500/10 cursor-pointer"
                  style={{ color: 'var(--text-main)' }}
                >
                  Đăng nhập
                </button>
                <button
                  onClick={() => setIsAuthModalOpen(true)}
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

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 flex gap-8">
        
        {/* SIDEBAR TREE VIEW (Option B - Zero Emojis) */}
        <aside className="w-72 flex-shrink-0 hidden md:block">
          <div
            className="p-5 rounded-2xl border sticky top-24 space-y-4"
            style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)' }}
          >
            <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--border-color)' }}>
              <span className="font-bold text-xs uppercase tracking-wider opacity-80">Danh Mục Bài Học</span>
              {(selectedGrade || selectedChapter || searchQuery) && (
                <button
                  onClick={handleClearFilters}
                  className="text-[11px] font-semibold text-blue-500 hover:underline cursor-pointer"
                >
                  Xóa lọc
                </button>
              )}
            </div>

            {/* Tree Node: All */}
            <div
              onClick={() => handleSelectGrade(null)}
              className={`px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-colors flex items-center justify-between ${
                selectedGrade === null && selectedChapter === null
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>Tất Cả Bài Thí Nghiệm</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold">
                {labs.length}
              </span>
            </div>

            {/* Tree Nodes: Grades & Chapters */}
            <div className="space-y-3 pt-1">
              {SIDEBAR_TREE.map((gradeNode) => {
                const isGradeSelected = selectedGrade === gradeNode.grade && !selectedChapter;
                const isOpen = openGrades[gradeNode.grade];

                return (
                  <div key={gradeNode.grade} className="space-y-1">
                    {/* Grade Header */}
                    <div className="flex items-center justify-between group">
                      <div
                        onClick={() => handleSelectGrade(gradeNode.grade)}
                        className={`flex-1 px-3 py-2 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                          isGradeSelected
                            ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'
                            : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        {gradeNode.grade}
                      </div>

                      <button
                        onClick={() => toggleGradeAccordion(gradeNode.grade)}
                        className="px-2 py-1 text-[10px] font-mono opacity-60 hover:opacity-100 cursor-pointer"
                      >
                        {isOpen ? '[-]' : '[+]'}
                      </button>
                    </div>

                    {/* Chapters List */}
                    {isOpen && (
                      <div className="pl-3 space-y-1 border-l ml-3" style={{ borderColor: 'var(--border-color)' }}>
                        {gradeNode.chapters.map((chap) => {
                          const isChapSelected =
                            selectedGrade === gradeNode.grade && selectedChapter === chap.name;

                          return (
                            <div
                              key={chap.name}
                              onClick={() => handleSelectChapter(gradeNode.grade, chap.name)}
                              className={`px-3 py-1.5 rounded-md text-[11px] font-medium cursor-pointer transition-colors truncate ${
                                isChapSelected
                                  ? 'bg-blue-600 text-white font-semibold shadow-xs'
                                  : 'opacity-70 hover:opacity-100 hover:bg-slate-100 dark:hover:bg-slate-800'
                              }`}
                              title={chap.name}
                            >
                              {chap.name}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </aside>

        {/* CATALOG EXPERIMENTS LIST */}
        <div className="flex-1 space-y-6">
          
          {/* Header & Search Bar */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-black tracking-tight">Thư Viện Bài Thí Nghiệm</h1>
                <p className="text-xs opacity-70 mt-1">
                  Tổng hợp bài thực hành Vật lý 10, 11, 12 chuẩn SGK GDPT 2018
                </p>
              </div>

              {/* Result Count Badge */}
              <div className="text-xs font-semibold px-3 py-1.5 rounded-full border self-start sm:self-center" style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)' }}>
                Hiển thị <span className="text-blue-500 font-bold">{filteredLabs.length}</span> / {labs.length} bài
              </div>
            </div>

            {/* Search Input (No Emojis) */}
            <div
              className="w-full flex items-center px-4 h-12 rounded-xl border shadow-xs transition-all"
              style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)' }}
            >
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-3">Tìm kiếm:</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Nhập tên bài, từ khóa SGK, dụng cụ..."
                className="flex-1 bg-transparent border-none outline-none text-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-xs font-bold opacity-50 hover:opacity-100 px-2 py-1 cursor-pointer"
                >
                  Xóa
                </button>
              )}
            </div>

            {/* Active Filter Tags */}
            {(selectedGrade || selectedChapter || searchQuery) && (
              <div className="flex flex-wrap items-center gap-2 text-xs pt-1">
                <span className="opacity-60 text-[11px] font-semibold">Đang lọc:</span>
                {selectedGrade && (
                  <span className="px-2.5 py-1 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-300 font-semibold flex items-center gap-1">
                    {selectedGrade}
                    <button onClick={() => setSelectedGrade(null)} className="hover:text-red-500 cursor-pointer ml-1 font-bold">✕</button>
                  </span>
                )}
                {selectedChapter && (
                  <span className="px-2.5 py-1 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 font-semibold flex items-center gap-1">
                    {selectedChapter}
                    <button onClick={() => setSelectedChapter(null)} className="hover:text-red-500 cursor-pointer ml-1 font-bold">✕</button>
                  </span>
                )}
                {searchQuery && (
                  <span className="px-2.5 py-1 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-300 font-semibold flex items-center gap-1">
                    "{searchQuery}"
                    <button onClick={() => setSearchQuery('')} className="hover:text-red-500 cursor-pointer ml-1 font-bold">✕</button>
                  </span>
                )}
              </div>
            )}
          </div>

          {/* LAB CARDS GRID */}
          {isLoading ? (
            <div className="py-20 border border-dashed rounded-2xl flex flex-col items-center justify-center text-center opacity-60" style={{ borderColor: 'var(--border-color)' }}>
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
              <span className="text-xs font-semibold">Đang tải danh mục bài thí nghiệm...</span>
            </div>
          ) : filteredLabs.length === 0 ? (
            <div
              className="py-16 border border-dashed rounded-2xl flex flex-col items-center justify-center text-center p-6"
              style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-panel)' }}
            >
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">TRỐNG</div>
              <span className="text-sm font-bold mb-1">Không tìm thấy bài thí nghiệm phù hợp</span>
              <span className="text-xs opacity-70 mb-4 max-w-sm">
                Hãy thử chọn khối lớp khác hoặc xóa từ khóa tìm kiếm.
              </span>
              <button
                onClick={handleClearFilters}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white cursor-pointer hover:bg-blue-700 transition-colors"
              >
                Xem Tất Cả Bài Thí Nghiệm
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {filteredLabs.map((lab) => (
                <div
                  key={lab.id}
                  className="rounded-2xl border p-5 flex flex-col justify-between transition-all hover:shadow-lg hover:-translate-y-0.5 group"
                  style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)' }}
                >
                  <div className="space-y-3">
                    {/* Header Badges */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-300">
                        {lab.subject}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border" style={{ borderColor: 'var(--border-color)' }}>
                        {lab.chapter}
                      </span>
                      {lab.pageRef && (
                        <span className="text-[10px] opacity-60 font-semibold ml-auto">
                          {lab.pageRef}
                        </span>
                      )}
                    </div>

                    {/* Title & Description */}
                    <div>
                      <h3 className="font-bold text-base group-hover:text-blue-500 transition-colors leading-snug">
                        {lab.title}
                      </h3>
                      <p className="text-xs opacity-70 mt-2 line-clamp-3 leading-relaxed">
                        {lab.description}
                      </p>
                    </div>

                    {/* Tools Tags if available */}
                    {lab.tools && lab.tools.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {lab.tools.map((tool) => (
                          <span
                            key={tool}
                            className="px-2 py-0.5 rounded-md text-[9px] font-mono font-medium bg-slate-100 dark:bg-slate-800/80 opacity-70"
                          >
                            {tool}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Footer Action */}
                  <div className="pt-4 border-t mt-4 flex items-center justify-between" style={{ borderColor: 'var(--border-color)' }}>
                    <div className="flex gap-1.5">
                      {lab.tags.map((t) => (
                        <span key={t} className="text-[10px] font-semibold opacity-60">
                          #{t}
                        </span>
                      ))}
                    </div>

                    <button
                      onClick={() => navigate(lab.route)}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-xs cursor-pointer flex items-center gap-1 group-hover:px-5"
                    >
                      <span>Vào Thực Hành</span>
                      <span>→</span>
                    </button>
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

export default CatalogPage;
