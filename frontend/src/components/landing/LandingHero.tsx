import React from 'react';
import { useNavigate } from 'react-router-dom';

interface LandingHeroProps {
  onOpenCommandPalette: () => void;
  onExploreLabs: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onOpenCommandPalette,
  onExploreLabs,
}) => {
  const navigate = useNavigate();

  const scrollToSection = (id: string) => {
    const el = document.querySelector(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-6 pb-2">
      {/* Left Column: Mission & Pedagogical Value */}
      <div 
        className="lg:col-span-7 flex flex-col justify-between p-8 sm:p-10 border rounded-3xl shadow-sm transition-colors relative overflow-hidden"
        style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)' }}
      >
        <div className="space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-mono font-bold uppercase tracking-wider rounded-full border" style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)', color: 'var(--accent-primary)' }}>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>HỌC TẬP VẬT LÝ BẰNG THỰC NGHIỆM TRỰC QUAN</span>
          </div>

          {/* Core Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.15]" style={{ color: 'var(--text-main)' }}>
            Khám phá. Mô phỏng. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-cyan-500 to-emerald-500">
              Thực nghiệm. Đo lường.
            </span>
          </h1>

          {/* Lede Statement focusing on support and learning outcomes */}
          <p className="text-sm sm:text-base leading-relaxed opacity-85 max-w-xl font-normal" style={{ color: 'var(--text-muted)' }}>
            VisualLab giúp biến các định luật Vật lý và bài thực hành SGK thành trải nghiệm tương tác trực quan. 
            Xóa bỏ rào cản thiếu thốn dụng cụ, tạo môi trường an toàn để học sinh tự do khám phá, hiểu sâu bản chất hiện tượng và rèn luyện tư duy khoa học thực nghiệm.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-8 flex flex-wrap items-center gap-3">
          <button
            onClick={onExploreLabs}
            className="px-6 py-3 text-xs sm:text-sm font-bold rounded-xl text-white shadow-md hover:opacity-95 active:scale-98 transition flex items-center gap-2 cursor-pointer"
            style={{ backgroundColor: 'var(--accent-primary)' }}
          >
            <span>Khám phá Thư viện Thí nghiệm</span>
            <span className="font-mono">→</span>
          </button>

          <button
            onClick={onOpenCommandPalette}
            className="inline-flex items-center gap-2 px-4 py-3 text-xs font-mono font-semibold rounded-xl border border-dashed opacity-80 hover:opacity-100 hover:bg-slate-500/5 transition cursor-pointer"
            style={{ borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}
            title="Mở bảng tìm kiếm nhanh"
          >
            <svg className="w-4 h-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span>Tìm bài học</span>
            <kbd className="px-1.5 py-0.5 rounded border border-current text-[10px]">⌘K</kbd>
          </button>
        </div>
      </div>

      {/* Right Column: What the platform conveys & supports */}
      <div 
        className="lg:col-span-5 flex flex-col justify-between p-8 sm:p-10 border rounded-3xl shadow-sm transition-colors"
        style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)' }}
      >
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--border-color)' }}>
            <span className="font-mono text-xs font-bold tracking-wider" style={{ color: 'var(--accent-primary)' }}>
              VISUALLAB / GIÁ TRỊ CỐT LÕI
            </span>
            <span className="text-[11px] font-mono opacity-60">HỖ TRỢ HỌC TẬP</span>
          </div>

          <ul className="space-y-3 font-mono text-xs">
            <li>
              <div
                onClick={() => navigate('/thu-vien')}
                className="w-full text-left p-3 rounded-xl border border-transparent hover:border-slate-500/20 hover:bg-slate-500/5 transition flex items-center justify-between group cursor-pointer"
              >
                <div className="space-y-0.5">
                  <div className="font-bold flex items-center gap-2" style={{ color: 'var(--text-main)' }}>
                    <span className="text-blue-500 font-mono">01 ·</span>
                    <span>Trực Quan Hóa Khái Niệm Trừu Tượng</span>
                  </div>
                  <p className="text-[11px] font-sans opacity-70" style={{ color: 'var(--text-muted)' }}>
                    Nhìn thấy rõ chuyển động, sóng, điện trường và phân tử khí một cách trực quan
                  </p>
                </div>
                <span className="font-bold text-blue-500 group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </li>

            <li>
              <div
                onClick={() => scrollToSection('#curriculum')}
                className="w-full text-left p-3 rounded-xl border border-transparent hover:border-slate-500/20 hover:bg-slate-500/5 transition flex items-center justify-between group cursor-pointer"
              >
                <div className="space-y-0.5">
                  <div className="font-bold flex items-center gap-2" style={{ color: 'var(--text-main)' }}>
                    <span className="text-emerald-500 font-mono">02 ·</span>
                    <span>Tự Do Thử Nghiệm & An Toàn Tuyệt Đối</span>
                  </div>
                  <p className="text-[11px] font-sans opacity-70" style={{ color: 'var(--text-muted)' }}>
                    Thay đổi thông số, kiểm chứng các giả thuyết và lặp lại thí nghiệm không giới hạn
                  </p>
                </div>
                <span className="font-bold text-emerald-500 group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </li>

            <li>
              <div
                onClick={() => scrollToSection('#curriculum')}
                className="w-full text-left p-3 rounded-xl border border-transparent hover:border-slate-500/20 hover:bg-slate-500/5 transition flex items-center justify-between group cursor-pointer"
              >
                <div className="space-y-0.5">
                  <div className="font-bold flex items-center gap-2" style={{ color: 'var(--text-main)' }}>
                    <span className="text-amber-500 font-mono">03 ·</span>
                    <span>Rèn Luyện Tư Duy Nghiên Cứu Khoa Học</span>
                  </div>
                  <p className="text-[11px] font-sans opacity-70" style={{ color: 'var(--text-muted)' }}>
                    Hình thành kỹ năng đo đạc, thu thập số liệu, đọc đồ thị và xử lý sai số thực nghiệm
                  </p>
                </div>
                <span className="font-bold text-amber-500 group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </li>

            <li>
              <div
                onClick={() => navigate('/thu-vien')}
                className="w-full text-left p-3 rounded-xl border border-transparent hover:border-slate-500/20 hover:bg-slate-500/5 transition flex items-center justify-between group cursor-pointer"
              >
                <div className="space-y-0.5">
                  <div className="font-bold flex items-center gap-2" style={{ color: 'var(--text-main)' }}>
                    <span className="text-purple-500 font-mono">04 ·</span>
                    <span>Bám Sát Bài Học & Đề Thi GDPT 2018</span>
                  </div>
                  <p className="text-[11px] font-sans opacity-70" style={{ color: 'var(--text-muted)' }}>
                    Hỗ trợ tối đa cho học sinh tự học tại nhà và củng cố kiến thức trước các kỳ thi
                  </p>
                </div>
                <span className="font-bold text-purple-500 group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </li>
          </ul>
        </div>

        <div className="pt-4 mt-4 border-t flex items-center justify-between text-[11px] font-mono opacity-60" style={{ borderColor: 'var(--border-color)' }}>
          <span>PHƯƠNG PHÁP HỌC TẬP THỰC NGHIỆM</span>
          <span>PHÁT TRIỂN NĂNG LỰC</span>
        </div>
      </div>
    </section>
  );
};
