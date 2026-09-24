import React, { useState, useEffect, useRef, useMemo } from 'react';
import { DEFAULT_PUBLIC_LABS, type PublicLabItem } from '../../services/labService';

interface LandingCommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

// Map lab IDs to standard GDPT 2018 monospace codes
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

export const LandingCommandPalette: React.FC<LandingCommandPaletteProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setSelectedIndex(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  const filteredLabs = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return DEFAULT_PUBLIC_LABS.slice(0, 8);

    return DEFAULT_PUBLIC_LABS.filter((lab) => {
      const code = (LAB_CODE_MAP[lab.id] || '').toLowerCase();
      const title = lab.title.toLowerCase();
      const desc = lab.description.toLowerCase();
      const grade = (lab.grade || '').toLowerCase();
      const domain = (lab.domain || '').toLowerCase();
      const tags = lab.tags.map(t => t.toLowerCase()).join(' ');

      return (
        code.includes(query) ||
        title.includes(query) ||
        desc.includes(query) ||
        grade.includes(query) ||
        domain.includes(query) ||
        tags.includes(query)
      );
    });
  }, [searchQuery]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
          e.preventDefault();
          // Trigger handled by parent state
        }
        return;
      }

      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (filteredLabs.length ? (prev + 1) % filteredLabs.length : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (filteredLabs.length ? (prev - 1 + filteredLabs.length) % filteredLabs.length : 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredLabs[selectedIndex]) {
          handleSelect(filteredLabs[selectedIndex]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredLabs, selectedIndex, onClose]);

  const handleSelect = (lab: PublicLabItem) => {
    onClose();
    window.open(lab.route, '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fadeIn" 
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog Box */}
      <div 
        className="relative w-full max-w-2xl border rounded-2xl shadow-2xl overflow-hidden flex flex-col z-10 transition-all duration-200 animate-scaleUp"
        style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
        role="dialog"
        aria-label="Tìm kiếm bài thí nghiệm VisualLab"
      >
        {/* Top Search Bar */}
        <div className="p-4 border-b flex items-center gap-3" style={{ borderColor: 'var(--border-color)' }}>
          <svg className="w-5 h-5 opacity-50 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên bài học, mã GDPT (VD: VL10, con lắc, sóng, boyle)..."
            className="w-full bg-transparent text-sm font-medium focus:outline-hidden placeholder:opacity-50"
            style={{ color: 'var(--text-main)' }}
            aria-label="Ô nhập từ khóa tìm kiếm"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="text-xs px-2 py-0.5 rounded opacity-60 hover:opacity-100 transition"
              title="Xóa tìm kiếm"
            >
              ✕
            </button>
          )}
          <span className="font-mono text-[11px] px-1.5 py-0.5 rounded border opacity-60 shrink-0" style={{ borderColor: 'var(--border-color)' }}>
            ESC
          </span>
        </div>

        {/* Results Info & Filtered Items */}
        <div className="px-4 py-2 text-[11px] font-mono opacity-60 border-b flex items-center justify-between" style={{ borderColor: 'var(--border-color)' }}>
          <span>{filteredLabs.length} BÀI THÍ NGHIỆM PHÙ HỢP</span>
          <span>DÙNG PHÍM ↑ ↓ ĐỂ DI CHUYỂN · ENTER ĐỂ VÀO</span>
        </div>

        <div 
          ref={resultsContainerRef}
          className="max-h-[380px] overflow-y-auto p-2 space-y-1 divide-y divide-transparent"
        >
          {filteredLabs.length > 0 ? (
            filteredLabs.map((lab, idx) => {
              const isSelected = idx === selectedIndex;
              const labCode = LAB_CODE_MAP[lab.id] || 'VL-GDPT';
              return (
                <div
                  key={lab.id}
                  onClick={() => handleSelect(lab)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`p-3 rounded-xl cursor-pointer transition flex items-start justify-between gap-3 ${
                    isSelected ? 'bg-blue-500/10 border border-blue-500/30' : 'hover:bg-slate-500/5 border border-transparent'
                  }`}
                >
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-[11px] font-bold px-1.5 py-0.5 rounded bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                        {labCode}
                      </span>
                      <span className="text-[11px] font-semibold px-1.5 py-0.5 rounded border opacity-75" style={{ borderColor: 'var(--border-color)' }}>
                        {lab.grade || 'Lớp 10'}
                      </span>
                      <span className="text-[11px] opacity-70 truncate" style={{ color: 'var(--text-muted)' }}>
                        {lab.domain}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold truncate" style={{ color: 'var(--text-main)' }}>
                      {lab.title}
                    </h4>
                    <p className="text-xs line-clamp-1 opacity-75" style={{ color: 'var(--text-muted)' }}>
                      {lab.description}
                    </p>
                  </div>

                  <div className="shrink-0 flex items-center self-center gap-1 font-mono text-xs text-blue-500 font-bold">
                    <span>MỞ</span>
                    <span>→</span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center space-y-2">
              <p className="text-sm font-bold opacity-75">Không tìm thấy bài thí nghiệm phù hợp</p>
              <p className="text-xs opacity-50">Thử tìm kiếm với từ khóa: "đo tốc độ", "rơi tự do", "lực ma sát", "con lắc", "boyle"</p>
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="p-3 bg-slate-500/5 border-t text-[11px] flex items-center justify-between opacity-70" style={{ borderColor: 'var(--border-color)' }}>
          <div className="flex items-center gap-3">
            <span><kbd className="font-mono px-1 py-0.5 rounded border border-current">↵</kbd> Vào phòng Lab</span>
            <span><kbd className="font-mono px-1 py-0.5 rounded border border-current">↑</kbd> <kbd className="font-mono px-1 py-0.5 rounded border border-current">↓</kbd> Chọn bài</span>
          </div>
          <span>Chuẩn SGK GDPT 2018</span>
        </div>
      </div>
    </div>
  );
};
