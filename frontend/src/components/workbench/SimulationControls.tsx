import React from 'react';

interface SimulationControlsProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  speed: number;
  onChangeSpeed: (speed: number) => void;
  onReset: () => void;
  showGrid: boolean;
  onToggleGrid: () => void;
  showRuler: boolean;
  onToggleRuler: () => void;
  hasSelection: boolean;
  onDeleteSelected: () => void;
  onClearAll: () => void;
}

export const SimulationControls: React.FC<SimulationControlsProps> = ({
  isPlaying,
  onTogglePlay,
  speed,
  onChangeSpeed,
  onReset,
  showGrid,
  onToggleGrid,
  showRuler,
  onToggleRuler,
  hasSelection,
  onDeleteSelected,
  onClearAll,
}) => {
  return (
    <div className="bg-white/95 backdrop-blur px-4 py-2.5 rounded-xl shadow-md border border-slate-200/80 flex items-center gap-3 select-none flex-wrap">
      {/* Play / Pause button */}
      <button
        type="button"
        onClick={onTogglePlay}
        className={`px-4 py-1.5 rounded-lg text-xs font-bold text-white shadow-sm flex items-center gap-1.5 transition-colors ${
          isPlaying ? 'bg-amber-600 hover:bg-amber-700' : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        <span>{isPlaying ? '⏸️ Tạm Dừng' : '▶️ Chạy Mô Phỏng'}</span>
      </button>

      {/* Speed Multiplier */}
      <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-xs font-medium">
        {[0.2, 0.5, 1.0].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onChangeSpeed(s)}
            className={`px-2 py-1 rounded-md transition-colors ${
              speed === s ? 'bg-white text-blue-700 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {s}x
          </button>
        ))}
      </div>

      <div className="h-4 w-px bg-slate-200" />

      {/* Reset */}
      <button
        type="button"
        onClick={onReset}
        title="Khôi phục trạng thái ban đầu"
        className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
      >
        🔄 Đặt lại
      </button>

      {/* Ruler toggle */}
      <button
        type="button"
        onClick={onToggleRuler}
        className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
          showRuler ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'text-slate-700 hover:bg-slate-100'
        }`}
      >
        📏 {showRuler ? 'Ẩn Thước' : 'Hiện Thước'}
      </button>

      {/* Grid toggle */}
      <button
        type="button"
        onClick={onToggleGrid}
        className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
          showGrid ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'text-slate-700 hover:bg-slate-100'
        }`}
      >
        📐 {showGrid ? 'Ẩn Lưới' : 'Hiện Lưới'}
      </button>

      <div className="h-4 w-px bg-slate-200 ml-auto" />

      {/* Delete selected item */}
      {hasSelection && (
        <button
          type="button"
          onClick={onDeleteSelected}
          className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
        >
          🗑️ Xóa Vật Đang Chọn
        </button>
      )}

      {/* Clear all */}
      <button
        type="button"
        onClick={onClearAll}
        className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-500 hover:text-red-600 hover:bg-slate-100 transition-colors"
      >
        Dọn Bàn
      </button>
    </div>
  );
};
