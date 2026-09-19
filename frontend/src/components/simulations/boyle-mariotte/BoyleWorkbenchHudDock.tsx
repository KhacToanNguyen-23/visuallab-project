import React from 'react';

interface BoyleWorkbenchHudDockProps {
  volume: number;
  pressure: number;
  isCompressing: boolean;
  onVolumeChange: (val: number) => void;
  onCompressStep: () => void;
  onExpandStep: () => void;
  onReset: () => void;
  onRecord: () => void;
  recordedCount: number;
}

export const BoyleWorkbenchHudDock: React.FC<BoyleWorkbenchHudDockProps> = ({
  volume,
  pressure,
  isCompressing,
  onVolumeChange,
  onCompressStep,
  onExpandStep,
  onReset,
  onRecord,
  recordedCount,
}) => {
  return (
    <div className="bg-slate-900/95 border border-slate-800 backdrop-blur-md rounded-2xl p-4 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
      {/* Parameter Sliders & Gauges */}
      <div className="flex items-center space-x-6 w-full md:w-auto">
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400 font-medium">Thể tích khí V:</span>
            <span className="text-sky-400 font-mono font-bold">{volume} cm³</span>
          </div>
          <input
            type="range"
            min="10"
            max="45"
            step="1"
            value={volume}
            onChange={e => onVolumeChange(parseFloat(e.target.value))}
            disabled={isCompressing}
            className="w-48 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>10 cm³ (Max p)</span>
            <span>45 cm³ (Min p)</span>
          </div>
        </div>

        <div className="h-10 w-[1px] bg-slate-800 hidden sm:block" />

        <div className="hidden sm:flex items-center space-x-4 text-xs font-mono">
          <div className="bg-slate-950/80 px-3 py-2 rounded-xl border border-slate-800/80">
            <span className="text-slate-500 block text-[10px] uppercase">Nhiệt độ T</span>
            <span className="text-emerald-400 font-bold">25.0 °C (298 K)</span>
          </div>
          <div className="bg-slate-950/80 px-3 py-2 rounded-xl border border-slate-800/80">
            <span className="text-slate-500 block text-[10px] uppercase">Áp suất p</span>
            <span className="text-sky-400 font-bold">{pressure.toFixed(2)} bar</span>
          </div>
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center space-x-2 w-full md:w-auto justify-end">
        <button
          onClick={onCompressStep}
          disabled={isCompressing || volume <= 10}
          title="Nén pít-tông 5 cm³"
          className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 hover:text-white rounded-xl text-xs font-semibold border border-slate-700 transition flex items-center space-x-1.5"
        >
          <span>Nén (-5 cm³)</span>
        </button>

        <button
          onClick={onExpandStep}
          disabled={isCompressing || volume >= 45}
          title="Kéo giãn pít-tông 5 cm³"
          className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 hover:text-white rounded-xl text-xs font-semibold border border-slate-700 transition flex items-center space-x-1.5"
        >
          <span>⬆️ Giãn (+5 cm³)</span>
        </button>

        <button
          onClick={onReset}
          disabled={isCompressing}
          title="Đặt lại về trạng thái ban đầu V = 40 cm³"
          className="px-3 py-2.5 bg-slate-800/80 hover:bg-slate-700/80 text-slate-400 hover:text-slate-200 rounded-xl text-xs transition"
        >
          ↺ Đặt Lại
        </button>

        <button
          onClick={onRecord}
          disabled={isCompressing}
          className="px-5 py-2.5 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-sky-900/30 border border-sky-400/30 transition transform active:scale-95 flex items-center space-x-2"
        >
          <span>+ Ghi Số Liệu</span>
          {recordedCount > 0 && (
            <span className="px-1.5 py-0.5 bg-sky-950 text-sky-300 border border-sky-400/40 rounded-full text-[10px] font-mono">
              {recordedCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
};
