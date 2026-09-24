import React from 'react';
import { useNavigate } from 'react-router-dom';

export const LandingFooter: React.FC = () => {
  const navigate = useNavigate();

  return (
    <footer className="border-t mt-16 transition-colors" style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}>
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-xs tracking-wider shadow-xs" style={{ backgroundColor: 'var(--accent-primary)' }}>
                VL
              </div>
              <span className="font-extrabold text-base tracking-tight">
                VISUAL<span style={{ color: 'var(--accent-primary)' }}>LAB</span>
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                GDPT 2018
              </span>
            </div>

            <p className="text-xs leading-relaxed opacity-75 max-w-md" style={{ color: 'var(--text-muted)' }}>
              Cổng phòng thí nghiệm Vật lý số hóa bám sát chuẩn chương trình Giáo dục phổ thông 2018. 
              Môi trường thực hành mô phỏng trực quan 60 FPS & 3D WebGL phục vụ học tập và nghiên cứu khoa học.
            </p>

            <div className="text-[11px] font-mono opacity-60">
              Kiểm định toán học · Tích phân số Verlet · 60 FPS Canvas & 3D WebGL
            </div>
          </div>

          {/* Column: Tài Nguyên SGK */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold uppercase tracking-wider text-[11px]" style={{ color: 'var(--text-main)' }}>
              Tài Nguyên Thí Nghiệm
            </h4>
            <ul className="space-y-2 opacity-80" style={{ color: 'var(--text-muted)' }}>
              <li>
                <button onClick={() => navigate('/thu-vien')} className="hover:underline text-left cursor-pointer">
                  Thư Viện 14 Bài Thực Hành SGK
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    const el = document.querySelector('#curriculum');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }} 
                  className="hover:underline text-left cursor-pointer"
                >
                  Chương Trình Lớp 10 · 11 · 12
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    const el = document.querySelector('#hero');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }} 
                  className="hover:underline text-left cursor-pointer"
                >
                  Về Trang Chủ
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="pt-6 border-t flex flex-col sm:flex-row items-center justify-between text-xs gap-3 opacity-60" style={{ borderColor: 'var(--border-color)' }}>
          <span>© 2026 VisualLab · Cổng Thí Nghiệm Vật Lý Mô Phỏng Trực Quan Học Thuật.</span>
          <span className="font-mono text-[11px]">VIETNAM GDPT 2018 STANDARD</span>
        </div>
      </div>
    </footer>
  );
};
