import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const labs = [
    {
      id: '1',
      title: 'Bài 1: Khảo sát Con lắc lò xo',
      subject: 'Vật lý 12',
      chapter: 'Chương 1: Dao động cơ',
      description: 'Mô phỏng tương tác mối quan hệ giữa khối lượng, độ cứng lò xo và chu kỳ dao động.',
      tags: ['Cơ học', 'Mô phỏng 2D', 'Tương tác']
    },
    {
      id: '2',
      title: 'Bài 2: Đo Gia tốc rơi tự do',
      subject: 'Vật lý 10',
      chapter: 'Chương 2: Động lực học',
      description: 'Bi sắt rơi qua cổng quang điện, đồng hồ MC-964 ghi nhận thời gian t.',
      tags: ['Cơ học', 'Cổng quang điện', 'Số liệu']
    },
    {
      id: '3',
      title: 'Bài 3: Mạch điện RLC nối tiếp',
      subject: 'Vật lý 12',
      chapter: 'Chương 3: Dòng điện xoay chiều',
      description: 'Mô phỏng hiện tượng cộng hưởng điện và đồ thị tần số dòng điện xoay chiều.',
      tags: ['Điện từ', 'Đồ thị', 'Cộng hưởng']
    }
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans transition-colors duration-200" style={{ backgroundColor: 'var(--bg-main)', color: 'var(--text-main)' }}>
      {/* Top Navbar */}
      <header className="h-16 border-b sticky top-0 z-50 px-8 flex items-center justify-between" style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)' }}>
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-8 h-8 rounded flex items-center justify-center font-bold text-white text-sm tracking-wider" style={{ backgroundColor: 'var(--accent-primary)' }}>
            VL
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg leading-none tracking-tight">VISUAL<span style={{ color: 'var(--accent-primary)' }}>LAB</span></span>
            <span className="text-[10px] tracking-wider uppercase font-semibold mt-0.5 opacity-70" style={{ color: 'var(--text-muted)' }}>Academic Simulation Portal</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={toggleTheme} 
            className="p-2 rounded border transition-colors flex items-center justify-center cursor-pointer"
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
            onClick={() => navigate('/login')}
            className="px-4 py-2 text-xs font-semibold rounded border transition-colors cursor-pointer"
            style={{ borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
          >
            Đăng Nhập
          </button>
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 text-xs font-semibold rounded text-white transition-opacity hover:opacity-90 shadow-xs cursor-pointer"
            style={{ backgroundColor: 'var(--accent-primary)' }}
          >
            Đăng Ký
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-8 py-10">
        {/* Hero Section */}
        <section className="mb-10 border-b pb-8" style={{ borderColor: 'var(--border-color)' }}>
          <div className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded mb-3" style={{ backgroundColor: 'var(--border-color)', color: 'var(--accent-primary)' }}>
            CHUẨN CHƯƠNG TRÌNH GDPT 2018
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3" style={{ color: 'var(--text-main)' }}>
            Cổng Thí nghiệm Vật lý Mô phỏng Học thuật
          </h1>
          <p className="text-base max-w-3xl leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            Khám phá thế giới Cơ học, Điện từ và Quang học bằng công nghệ mô phỏng trực quan phẳng, chính xác. Thiết kế dành riêng cho môi trường giảng dạy và học tập chuẩn hóa.
          </p>

          <div className="mt-6 flex gap-3">
            <button
              onClick={() => navigate('/simulation')}
              className="px-5 py-2.5 text-xs font-bold text-white rounded transition-opacity hover:opacity-90 flex items-center gap-2 cursor-pointer"
              style={{ backgroundColor: 'var(--accent-primary)' }}
            >
              <span>Vào Thí Nghiệm Ngay</span>
              <span>→</span>
            </button>
            <button
              onClick={() => navigate('/srs-lab')}
              className="px-5 py-2.5 text-xs font-semibold rounded border transition-colors cursor-pointer"
              style={{ borderColor: 'var(--border-color)', color: 'var(--text-main)', backgroundColor: 'var(--bg-panel)' }}
            >
              Xem Thí nghiệm SGK (SRS)
            </button>
          </div>
        </section>

        {/* Catalog Grid */}
        <section>
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2" style={{ color: 'var(--text-main)' }}>
            <span>Danh mục Bài Thí nghiệm</span>
            <span className="text-xs font-normal px-2 py-0.5 rounded" style={{ backgroundColor: 'var(--border-color)', color: 'var(--text-muted)' }}>{labs.length} bài</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {labs.map((lab) => (
              <div 
                key={lab.id} 
                className="border rounded-lg p-6 flex flex-col justify-between transition-shadow hover:shadow-md"
                style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)' }}
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold mb-2" style={{ color: 'var(--text-muted)' }}>
                    <span>{lab.subject} • {lab.chapter}</span>
                  </div>
                  <h3 className="text-base font-bold mb-2" style={{ color: 'var(--text-main)' }}>
                    {lab.title}
                  </h3>
                  <p className="text-xs mb-4 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                    {lab.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mb-6">
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

                <div className="pt-4 border-t flex items-center justify-between" style={{ borderColor: 'var(--border-color)' }}>
                  <span className="text-xs font-medium opacity-70" style={{ color: 'var(--text-muted)' }}>Sẵn sàng</span>
                  <Link 
                    to="/simulation"
                    className="px-3 py-1.5 text-xs font-semibold rounded text-white transition-opacity hover:opacity-90"
                    style={{ backgroundColor: 'var(--accent-primary)' }}
                  >
                    Thực hành
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-6 text-center text-xs font-medium transition-colors" style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>
        © 2026 VisualLab Physics Platform — Nền tảng Thí nghiệm Học thuật
      </footer>
    </div>
  );
};

export default LandingPage;
