import React from 'react';
import { useTheme } from '../../context/ThemeContext';

interface Props {
  onExportImage: () => void;
  onShareURL: () => void;
  onReset: () => void;
  onLoadPreset: (presetType: string) => void;
}

export const Header: React.FC<Props> = ({
  onExportImage,
  onShareURL,
  onReset,
  onLoadPreset,
}) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header 
      className="h-14 border-b px-6 flex justify-between items-center transition-colors duration-200"
      style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
    >
      <div className="flex items-center gap-3">
        <div 
          className="w-8 h-8 rounded flex items-center justify-center font-bold text-white text-xs tracking-wider"
          style={{ backgroundColor: 'var(--accent-primary)' }}
        >
          VL
        </div>
        <div>
          <h1 className="font-bold text-sm tracking-tight" style={{ color: 'var(--text-main)' }}>
            EduLab Physics — Thí Nghiệm Vật Lý Tương Tác
          </h1>
          <p className="text-[11px] opacity-75" style={{ color: 'var(--text-muted)' }}>
            Chuẩn GDPT 2018 (THCS & THPT Việt Nam)
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Theme Toggle Button */}
        <button 
          onClick={toggleTheme} 
          className="p-1.5 rounded border transition-colors flex items-center justify-center cursor-pointer text-xs gap-1.5"
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
          <span className="font-medium text-[11px] hidden sm:inline">
            {theme === 'light' ? 'Chế độ Tối' : 'Chế độ Sáng'}
          </span>
        </button>

        {/* Preset Selector */}
        <select
          onChange={e => onLoadPreset(e.target.value)}
          defaultValue=""
          className="border text-xs rounded px-3 py-1.5 focus:outline-none transition-colors"
          style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
        >
          <option value="" disabled>-- Chọn Bài Thí Nghiệm Mẫu --</option>
          <option value="preset-dc-basic">Mạch Điện Đơn Giản (Định luật Ohm)</option>
          <option value="preset-dc-parallel">Mạch Nối Tiếp & Song Song</option>
        </select>

        <button
          onClick={onReset}
          className="px-3 py-1.5 text-xs font-semibold rounded border transition cursor-pointer"
          style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
        >
          Đặt Lại
        </button>

        <button
          onClick={onExportImage}
          className="px-3 py-1.5 text-white text-xs font-semibold rounded transition opacity-90 hover:opacity-100 cursor-pointer shadow-xs"
          style={{ backgroundColor: 'var(--accent-primary)' }}
        >
          Xuất Ảnh PNG
        </button>

        <button
          onClick={onShareURL}
          className="px-3 py-1.5 border text-xs font-semibold rounded transition cursor-pointer"
          style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
        >
          Chia Sẻ Link
        </button>
      </div>
    </header>
  );
};
