import React from 'react';

interface LatentHeatWorkbenchHudDockProps {
  iceMassG: number;
  onIceMassChange: (valG: number) => void;
  isMelting: boolean;
  onStartMelting: () => void;
  onReset: () => void;
  onRecord: () => void;
  currentTemp: number;
  recordedCount: number;
}

export const LatentHeatWorkbenchHudDock: React.FC<LatentHeatWorkbenchHudDockProps> = ({
  iceMassG,
  onIceMassChange,
  isMelting,
  onStartMelting,
  onReset,
  onRecord,
  currentTemp,
  recordedCount,
}) => {
  return (
    <div className="bg-slate-900/95 border border-slate-800 backdrop-blur-md rounded-2xl p-4 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
      {/* Parameter Sliders */}
      <div className="flex items-center space-x-6 w-full md:w-auto">
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400 font-medium">Khối lượng nước đá m_đá:</span>
            <span className="text-emerald-400 font-mono font-bold">{iceMassG} g</span>
          </div>
          <input
            type="range"
            min="15"
            max="60"
            step="1"
            value={iceMassG}
            onChange={e => onIceMassChange(parseFloat(e.target.value))}
            disabled={isMelting}
            className="w-48 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>15g (Nhiệm vụ 1)</span>
            <span>60g (Nhiệm vụ 3)</span>
          </div>
        </div>

        <div className="h-10 w-[1px] bg-slate-800 hidden sm:block" />

        <div className="hidden sm:flex items-center space-x-4 text-xs font-mono">
          <div className="bg-slate-950/80 px-3 py-2 rounded-xl border border-slate-800/80">
            <span className="text-slate-500 block text-[10px] uppercase">Nước ấm m_n</span>
            <span className="text-sky-300 font-bold">250g (0.25 kg)</span>
          </div>
          <div className="bg-slate-950/80 px-3 py-2 rounded-xl border border-slate-800/80">
            <span className="text-slate-500 block text-[10px] uppercase">Nhiệt độ hiện tại</span>
            <span className="text-rose-400 font-bold">{currentTemp.toFixed(1)} °C</span>
          </div>
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center space-x-2 w-full md:w-auto justify-end">
        <button
          onClick={onStartMelting}
          disabled={isMelting}
          className="px-4 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-lg shadow-amber-900/30 transition transform active:scale-95 flex items-center space-x-1.5 cursor-pointer"
        >
          <span>{isMelting ? 'Đang Hòa Tan...' : 'Thả Đá & Hòa Tan'}</span>
        </button>

        <button
          onClick={onReset}
          disabled={isMelting}
          title="Đặt lại trạng thái ban đầu"
          className="px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs transition cursor-pointer"
        >
          ↺ Đặt Lại
        </button>

        <button
          onClick={onRecord}
          disabled={isMelting}
          className="px-5 py-2.5 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-sky-900/30 border border-sky-400/30 transition transform active:scale-95 flex items-center space-x-2 cursor-pointer"
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
