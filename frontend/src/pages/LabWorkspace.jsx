import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

export default function LabWorkspace() {
  const [mass, setMass] = useState(500);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('params'); // 'params' | 'tasks'
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <div className="h-full flex flex-col font-sans select-none transition-colors duration-200" style={{ backgroundColor: 'var(--bg-main)', color: 'var(--text-main)' }}>
      {/* Top Academic Lab Header */}
      <header className="h-14 border-b flex items-center justify-between px-5 shrink-0" style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)' }}>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/')} 
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded border transition-colors"
            style={{ borderColor: 'var(--border-color)', color: 'var(--text-muted)', backgroundColor: 'var(--bg-main)' }}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Thư viện</span>
          </button>
          
          <div className="h-4 w-[1px]" style={{ backgroundColor: 'var(--border-color)' }}></div>

          <div className="flex items-center gap-2 text-sm">
            <span className="text-xs font-medium uppercase tracking-wide opacity-70" style={{ color: 'var(--text-muted)' }}>Vật lý 12 / Bài 1</span>
            <span className="font-bold tracking-tight" style={{ color: 'var(--text-main)' }}>Khảo sát Con lắc Lò xo</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Progress Indicator */}
          <div className="hidden sm:flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
            <span>Tiến độ thực hành:</span>
            <div className="w-24 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--border-color)' }}>
              <div className="w-1/3 h-full" style={{ backgroundColor: 'var(--accent-primary)' }}></div>
            </div>
            <span className="font-semibold" style={{ color: 'var(--text-main)' }}>33%</span>
          </div>

          {/* Theme Switcher */}
          <button 
            onClick={toggleTheme} 
            className="p-1.5 rounded border transition-colors flex items-center justify-center"
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

          {/* Save Action */}
          <button 
            onClick={() => alert('Đã ghi nhận dữ liệu thí nghiệm!')} 
            className="px-3.5 py-1.5 text-xs font-semibold rounded text-white transition-opacity hover:opacity-90 shadow-xs"
            style={{ backgroundColor: 'var(--accent-primary)' }}
          >
            Lưu Kết quả
          </button>
        </div>
      </header>

      {/* Main Lab Area */}
      <main className="flex-1 flex overflow-hidden relative">
        {/* Dominant Simulation Canvas */}
        <section 
          className="flex-1 relative flex items-center justify-center overflow-hidden transition-all duration-300"
          style={{ backgroundColor: 'var(--canvas-bg)' }}
        >
          {/* Academic Coordinate Grid */}
          <div 
            className="absolute inset-0 opacity-40" 
            style={{ 
              backgroundImage: `radial-gradient(circle, var(--grid-dot) 1px, transparent 1px)`, 
              backgroundSize: '24px 24px' 
            }}
          ></div>
          
          {/* Lab Specimen Graphic */}
          <div className="relative z-10 flex flex-col items-center">
            {/* Rigid Support Plate */}
            <div className="w-44 h-3 rounded-xs border border-b-2" style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)' }}></div>
            
            {/* Spring Line Representation */}
            <div 
              className="w-0.5 border-r-2 border-dashed transition-all duration-150" 
              style={{ 
                height: `${120 + mass / 8}px`,
                borderColor: 'var(--text-muted)' 
              }}
            ></div>
            
            {/* Suspended Mass Block */}
            <div 
              className="w-20 h-20 rounded border flex flex-col items-center justify-center shadow-xs transition-all duration-150"
              style={{ 
                backgroundColor: 'var(--bg-panel)', 
                borderColor: 'var(--border-color)',
                color: 'var(--text-main)'
              }}
            >
              <span className="text-xs font-semibold uppercase opacity-60">m =</span>
              <span className="text-lg font-bold">{mass}g</span>
            </div>

            {/* Gravity Vector Arrow */}
            <div className="absolute -bottom-16 flex flex-col items-center">
              <div className="w-0.5 h-10" style={{ backgroundColor: 'var(--accent-primary)' }}></div>
              <div className="w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-6" style={{ borderTColor: 'var(--accent-primary)' }}></div>
              <span className="text-xs font-bold mt-1" style={{ color: 'var(--accent-primary)' }}>P = mg</span>
            </div>
          </div>

          {/* Floating Minimalist Playback Controls */}
          <div 
            className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-lg border shadow-sm flex items-center gap-3 backdrop-blur-xs"
            style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)' }}
          >
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-3 py-1.5 text-xs font-semibold rounded border transition-colors flex items-center gap-1.5"
              style={{ borderColor: 'var(--border-color)', color: 'var(--text-main)', backgroundColor: 'var(--bg-main)' }}
            >
              {isPlaying ? (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
                  </svg>
                  <span>Tạm dừng</span>
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  </svg>
                  <span>Bắt đầu</span>
                </>
              )}
            </button>

            <button 
              onClick={() => { setMass(500); setIsPlaying(false); }}
              className="px-3 py-1.5 text-xs font-semibold rounded border transition-colors flex items-center gap-1.5"
              style={{ borderColor: 'var(--border-color)', color: 'var(--text-main)', backgroundColor: 'var(--bg-main)' }}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Đặt lại</span>
            </button>
          </div>

          {/* Panel Toggle Button on Canvas Border */}
          <button
            onClick={() => setIsPanelOpen(!isPanelOpen)}
            className="absolute right-0 top-1/2 -translate-y-1/2 w-6 h-12 rounded-l border border-r-0 flex items-center justify-center transition-colors z-20"
            style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
            title={isPanelOpen ? 'Thu gọn bảng điều khiển' : 'Mở rộng bảng điều khiển'}
            aria-label="Toggle side panel"
          >
            <span className="text-xs font-bold">{isPanelOpen ? '›' : '⟨'}</span>
          </button>
        </section>

        {/* Enterprise Collapsible Sidebar Panel / Rail */}
        <aside 
          className="border-l transition-all duration-300 flex flex-col shrink-0 overflow-hidden"
          style={{ 
            width: isPanelOpen ? '320px' : '48px',
            backgroundColor: 'var(--bg-panel)', 
            borderColor: 'var(--border-color)' 
          }}
        >
          {isPanelOpen ? (
            /* Full Expanded Sidebar */
            <div className="flex-1 flex flex-col h-full overflow-hidden">
              {/* Tab Navigation Header */}
              <div className="flex border-b text-xs font-semibold shrink-0" style={{ borderColor: 'var(--border-color)' }}>
                <button 
                  onClick={() => setActiveTab('params')}
                  className={`flex-1 py-3 px-4 text-center border-b-2 transition-colors ${activeTab === 'params' ? 'font-bold' : 'opacity-70'}`}
                  style={{ 
                    borderBottomColor: activeTab === 'params' ? 'var(--accent-primary)' : 'transparent',
                    color: activeTab === 'params' ? 'var(--accent-primary)' : 'var(--text-muted)'
                  }}
                >
                  Thông số Thí nghiệm
                </button>
                <button 
                  onClick={() => setActiveTab('tasks')}
                  className={`flex-1 py-3 px-4 text-center border-b-2 transition-colors ${activeTab === 'tasks' ? 'font-bold' : 'opacity-70'}`}
                  style={{ 
                    borderBottomColor: activeTab === 'tasks' ? 'var(--accent-primary)' : 'transparent',
                    color: activeTab === 'tasks' ? 'var(--accent-primary)' : 'var(--text-muted)'
                  }}
                >
                  Nhiệm vụ & Bài tập
                </button>
              </div>

              {/* Tab Content */}
              <div className="flex-1 overflow-y-auto p-5">
                {activeTab === 'params' ? (
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-xs font-semibold uppercase tracking-wider opacity-80" style={{ color: 'var(--text-muted)' }}>Khối lượng vật nặng (m)</label>
                        <span className="text-xs font-bold px-2 py-0.5 rounded border" style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)', color: 'var(--accent-primary)' }}>
                          {mass} g
                        </span>
                      </div>
                      <input 
                        type="range" 
                        min="100" max="1000" step="50"
                        value={mass}
                        onChange={(e) => setMass(Number(e.target.value))}
                        className="w-full accent-primary cursor-pointer" 
                      />
                      <div className="flex justify-between text-[10px] mt-1 opacity-60" style={{ color: 'var(--text-muted)' }}>
                        <span>100g</span>
                        <span>500g</span>
                        <span>1000g</span>
                      </div>
                    </div>

                    <div className="border-t pt-4" style={{ borderColor: 'var(--border-color)' }}>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-xs font-semibold uppercase tracking-wider opacity-80" style={{ color: 'var(--text-muted)' }}>Độ cứng lò xo (k)</label>
                        <span className="text-xs font-bold px-2 py-0.5 rounded border opacity-60" style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)' }}>
                          100 N/m
                        </span>
                      </div>
                      <input type="range" disabled value="100" className="w-full opacity-40 cursor-not-allowed" />
                    </div>

                    <div className="border-t pt-4" style={{ borderColor: 'var(--border-color)' }}>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-xs font-semibold uppercase tracking-wider opacity-80" style={{ color: 'var(--text-muted)' }}>Hệ số ma sát (μ)</label>
                        <span className="text-xs opacity-60">Bỏ qua</span>
                      </div>
                      <input type="range" disabled value="0" className="w-full opacity-40 cursor-not-allowed" />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col h-full">
                    <div className="mb-4">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border" style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)', color: 'var(--accent-primary)' }}>
                        Yêu cầu bài thực hành
                      </span>
                      <p className="text-xs mt-3 leading-relaxed" style={{ color: 'var(--text-main)' }}>
                        Hãy điều chỉnh khối lượng quả nặng lên <b>800g</b>. Quan sát sự thay đổi độ giãn lò xo và tính lực kéo về cực đại tác dụng lên quả nặng?
                      </p>
                    </div>

                    <div className="flex-1 flex flex-col mt-2">
                      <label className="text-xs font-semibold mb-1.5" style={{ color: 'var(--text-muted)' }}>Câu trả lời / Tính toán:</label>
                      <textarea 
                        className="w-full flex-1 border rounded-md p-3 text-xs focus:outline-none transition-colors"
                        style={{ 
                          backgroundColor: 'var(--bg-main)', 
                          borderColor: 'var(--border-color)',
                          color: 'var(--text-main)' 
                        }}
                        rows={5}
                        placeholder="Nhập bước tính và kết quả của em vào đây..."
                      ></textarea>
                    </div>

                    <button 
                      onClick={() => alert('Đã nộp bài giải!')}
                      className="w-full py-2.5 mt-4 text-xs font-bold text-white rounded transition-opacity hover:opacity-90"
                      style={{ backgroundColor: 'var(--accent-primary)' }}
                    >
                      Nộp Bài giải
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Collapsed Icon Rail */
            <div className="flex flex-col items-center py-4 gap-6">
              <button 
                onClick={() => { setIsPanelOpen(true); setActiveTab('params'); }}
                className="p-2 rounded hover:bg-opacity-10 transition-colors"
                style={{ color: activeTab === 'params' ? 'var(--accent-primary)' : 'var(--text-muted)' }}
                title="Mở Thông số"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </button>

              <button 
                onClick={() => { setIsPanelOpen(true); setActiveTab('tasks'); }}
                className="p-2 rounded hover:bg-opacity-10 transition-colors"
                style={{ color: activeTab === 'tasks' ? 'var(--accent-primary)' : 'var(--text-muted)' }}
                title="Mở Nhiệm vụ"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </button>
            </div>
          )}
        </aside>
      </main>
    </div>
  );
}
