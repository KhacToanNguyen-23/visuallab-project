import React from 'react';

export const LandingMetricsStrip: React.FC = () => {
  return (
    <section className="border-y py-6 my-4 transition-colors" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-panel)' }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
          
          <div className="space-y-1">
            <div className="font-mono text-2xl lg:text-3xl font-extrabold" style={{ color: 'var(--accent-primary)' }}>
              100%
            </div>
            <p className="text-xs font-semibold" style={{ color: 'var(--text-main)' }}>
              Chuẩn GDPT 2018
            </p>
            <p className="text-[11px] opacity-70" style={{ color: 'var(--text-muted)' }}>
              Phủ trọn 3 bộ sách KNTT, Cánh Diều, CTST
            </p>
          </div>

          <div className="space-y-1">
            <div className="font-mono text-2xl lg:text-3xl font-extrabold text-emerald-500">
              16+
            </div>
            <p className="text-xs font-semibold" style={{ color: 'var(--text-main)' }}>
              Phòng Lab Số Hóa
            </p>
            <p className="text-[11px] opacity-70" style={{ color: 'var(--text-muted)' }}>
              Mô phỏng 2D tương tác & 3D Three.js PBR
            </p>
          </div>

          <div className="space-y-1">
            <div className="font-mono text-2xl lg:text-3xl font-extrabold text-cyan-500">
              &lt; 16ms
            </div>
            <p className="text-xs font-semibold" style={{ color: 'var(--text-main)' }}>
              Độ Trễ 60 FPS
            </p>
            <p className="text-[11px] opacity-70" style={{ color: 'var(--text-muted)' }}>
              Thuật toán giải tích Euler & Verlet chính xác
            </p>
          </div>

          <div className="space-y-1">
            <div className="font-mono text-2xl lg:text-3xl font-extrabold text-amber-500">
              10 · 11 · 12
            </div>
            <p className="text-xs font-semibold" style={{ color: 'var(--text-main)' }}>
              3 Khối Lớp THPT
            </p>
            <p className="text-[11px] opacity-70" style={{ color: 'var(--text-muted)' }}>
              Đầy đủ các chuyên đề Cơ - Nhiệt - Điện - Quang
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};
