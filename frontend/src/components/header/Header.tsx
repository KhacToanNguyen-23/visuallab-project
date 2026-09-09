import React from 'react';

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
  return (
    <header className="h-14 bg-slate-950 border-b border-slate-800 text-white px-6 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center font-bold text-lg">
          ⚛️
        </div>
        <div>
          <h1 className="font-bold text-base tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
            EduLab Physics — Thí Nghiệm Vật Lý Tương Tác
          </h1>
          <p className="text-xs text-slate-400">Chuẩn GDPT 2018 (THCS & THPT Việt Nam)</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Preset Selector */}
        <select
          onChange={e => onLoadPreset(e.target.value)}
          defaultValue=""
          className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="" disabled>-- Chọn Bài Thí Nghiệm Mẫu --</option>
          <option value="preset-dc-basic">Mạch Điện Đơn Giản (Định luật Ohm)</option>
          <option value="preset-dc-parallel">Mạch Nối Tiếp & Song Song</option>
        </select>

        <button
          onClick={onReset}
          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition"
        >
          🔄 Đặt Lại
        </button>

        <button
          onClick={onExportImage}
          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition shadow-sm"
        >
          📸 Xuất Ảnh PNG
        </button>

        <button
          onClick={onShareURL}
          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition shadow-sm"
        >
          🔗 Chia Sẻ Link
        </button>
      </div>
    </header>
  );
};
