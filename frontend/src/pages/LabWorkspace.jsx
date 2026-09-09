import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LabWorkspace() {
  const [mass, setMass] = useState(500);
  const navigate = useNavigate();

  return (
    <div className="h-full flex flex-col bg-app-bg font-sans">
      {/* Header */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/')} className="text-slate-500 hover:text-primary transition-colors flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Thoát
          </button>
          <h1 className="text-lg font-semibold text-slate-900">Bài 1: Khảo sát con lắc lò xo</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
            <div className="w-1/3 h-full bg-physics-accel"></div>
          </div>
          <span className="text-sm text-slate-500">Tiến độ 1/3</span>
          <button onClick={() => alert('Vui lòng đăng nhập để lưu kết quả!')} className="ml-4 px-4 py-1.5 text-sm font-medium text-white bg-primary hover:bg-primary-hover rounded-lg shadow-sm transition-colors">
            Lưu
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 flex overflow-hidden p-4 gap-4">
        {/* Simulation Canvas (Left 70%) */}
        <section className="flex-[7] bg-white rounded-xl shadow-sm border border-slate-200 relative flex items-center justify-center overflow-hidden">
          {/* Lưới toạ độ */}
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, #E2E8F0 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
          
          {/* Mockup của 1 thí nghiệm */}
          <div className="relative z-10 flex flex-col items-center">
            {/* Điểm treo */}
            <div className="w-32 h-2 bg-slate-400 rounded"></div>
            {/* Lò xo (đường line nét đứt tạm thời) */}
            <div className="w-2 border-l-2 border-dashed border-slate-400" style={{ height: `${100 + mass/10}px` }}></div>
            {/* Quả nặng (màu Năng lượng/Khối lượng) */}
            <div className="w-16 h-16 bg-physics-energy rounded-lg flex items-center justify-center text-white shadow-md font-semibold">
              {mass}g
            </div>
            {/* Vector Lực (Màu Đỏ) */}
            <div className="absolute -bottom-16 w-1 bg-physics-force" style={{ height: '50px' }}>
              <div className="absolute -bottom-2 -left-1.5 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[10px] border-t-physics-force"></div>
            </div>
            <span className="absolute -bottom-16 left-4 text-physics-force font-bold">P</span>
          </div>

          {/* Floating Playback Controls */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white px-4 py-2 rounded-lg shadow-md border border-slate-200 flex gap-4">
            <button className="p-2 text-slate-700 hover:text-primary transition-colors font-semibold">
              ▶ Play
            </button>
            <button className="p-2 text-slate-700 hover:text-primary transition-colors font-semibold">
              ⏸ Pause
            </button>
            <button className="p-2 text-slate-700 hover:text-primary transition-colors font-semibold">
              ↺ Reset
            </button>
          </div>
        </section>

        {/* Right Panel (Right 30%) */}
        <aside className="flex-[3] flex flex-col gap-4">
          {/* Tab 1: Thông số */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex-1 overflow-y-auto">
            <h2 className="text-base font-semibold text-slate-900 mb-4 border-b border-slate-100 pb-2">Điều chỉnh thông số</h2>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium text-slate-700">Khối lượng (g)</label>
                  <span className="text-sm text-physics-energy font-semibold">{mass}g</span>
                </div>
                <input 
                  type="range" 
                  min="100" max="1000" step="50"
                  value={mass}
                  onChange={(e) => setMass(Number(e.target.value))}
                  className="w-full accent-primary" 
                />
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium text-slate-700">Ma sát</label>
                  <span className="text-sm text-slate-500">Bỏ qua</span>
                </div>
                <input type="range" disabled className="w-full accent-slate-300 opacity-50 cursor-not-allowed" />
              </div>
            </div>
          </div>

          {/* Tab 2: Bài tập */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex-1 flex flex-col">
            <h2 className="text-base font-semibold text-slate-900 mb-4 border-b border-slate-100 pb-2">Nhiệm vụ</h2>
            <div className="flex-1">
              <p className="text-sm text-slate-700 mb-4">
                Hãy điều chỉnh khối lượng quả nặng lên <b>800g</b> và quan sát sự thay đổi của độ giãn lò xo. Tính lực kéo về cực đại?
              </p>
              <textarea 
                className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                rows="4"
                placeholder="Nhập câu trả lời của em vào đây..."
              ></textarea>
            </div>
            <button onClick={() => alert('Vui lòng đăng nhập để nộp bài!')} className="w-full bg-primary hover:bg-primary-hover text-white font-semibold py-3 rounded-lg mt-4 transition-colors shadow-sm">
              Nộp Bài
            </button>
          </div>
        </aside>
      </main>
    </div>
  );
}
