import React from 'react';

interface InductionWorkbenchHudDockProps {
  turnCountN: number;
  onTurnCountChange: (turns: number) => void;
  pole: 'N-S' | 'S-N';
  onFlipPole: () => void;
  onMoveInSlow: () => void;
  onMoveInFast: () => void;
  onMoveOut: () => void;
  onReset: () => void;
  onRecord: () => void;
  isAutoMoving: boolean;
  instantEmfMv: number;
  instantCurrentMa: number;
  recordedCount: number;
}

export const InductionWorkbenchHudDock: React.FC<InductionWorkbenchHudDockProps> = ({
  turnCountN,
  onTurnCountChange,
  pole,
  onFlipPole,
  onMoveInSlow,
  onMoveInFast,
  onMoveOut,
  onReset,
  onRecord,
  isAutoMoving,
  instantEmfMv,
  instantCurrentMa,
  recordedCount,
}) => {
  return (
    <div className="bg-slate-900/95 border border-slate-800 backdrop-blur-md rounded-2xl p-4 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
      {/* Parameter Controls: Coil turns & Pole */}
      <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
        {/* Turns Selector */}
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-slate-400 block">Số Vòng Dây Solenoid (N)</label>
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 space-x-1">
            {[100, 200, 400].map(n => (
              <button
                key={n}
                onClick={() => onTurnCountChange(n)}
                disabled={isAutoMoving}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
                  turnCountN === n
                    ? 'bg-sky-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Pole Orientation */}
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-slate-400 block">Đầu Cực Hướng Cuộn Dây</label>
          <button
            onClick={onFlipPole}
            disabled={isAutoMoving}
            className="px-3.5 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-bold transition cursor-pointer flex items-center space-x-2"
          >
            <span className={`px-2 py-0.5 rounded text-[11px] font-mono ${
              pole === 'N-S' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
            }`}>
              CỰC {pole === 'N-S' ? 'BẮC (N)' : 'NAM (S)'}
            </span>
            <span className="text-slate-400">🔄 Đổi Cực</span>
          </button>
        </div>

        {/* Real-time Status */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-1.5 flex items-center space-x-3 text-xs font-mono">
          <div>
            <span className="text-slate-500 block text-[10px]">Suất điện động e_c</span>
            <span className={`font-bold ${instantEmfMv !== 0 ? 'text-cyan-400' : 'text-slate-400'}`}>
              {instantEmfMv > 0 ? `+${instantEmfMv.toFixed(1)}` : instantEmfMv.toFixed(1)} mV
            </span>
          </div>
          <div className="border-l border-slate-800 pl-3">
            <span className="text-slate-500 block text-[10px]">Dòng I_c</span>
            <span className={`font-bold ${instantCurrentMa !== 0 ? 'text-amber-400' : 'text-slate-400'}`}>
              {instantCurrentMa > 0 ? `+${instantCurrentMa.toFixed(2)}` : instantCurrentMa.toFixed(2)} mA
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-2.5">
        <button
          onClick={onMoveInSlow}
          disabled={isAutoMoving}
          className="px-3 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center space-x-1"
          title="Đưa nam châm vào với vận tốc chậm 0.5 m/s"
        >
          <span>▶ Đưa Vào Chậm</span>
        </button>

        <button
          onClick={onMoveInFast}
          disabled={isAutoMoving}
          className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-xl text-xs font-semibold transition cursor-pointer flex items-center space-x-1 shadow-md shadow-indigo-600/20"
          title="Đưa nam châm vào với vận tốc nhanh 1.5 m/s"
        >
          <span>⏩ Đưa Vào Nhanh</span>
        </button>

        <button
          onClick={onMoveOut}
          disabled={isAutoMoving}
          className="px-3 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center space-x-1"
          title="Rút nam châm ra xa cuộn dây"
        >
          <span>◀ Rút Ra</span>
        </button>

        <button
          onClick={onReset}
          disabled={isAutoMoving}
          className="px-3 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-400 hover:text-slate-200 rounded-xl text-xs font-semibold transition cursor-pointer"
        >
          ↺ Đặt Lại
        </button>

        <button
          onClick={onRecord}
          className="px-4 py-2 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-sky-600/25 flex items-center space-x-1.5 cursor-pointer"
        >
          <span>+ Ghi Số Liệu</span>
          {recordedCount > 0 && (
            <span className="px-1.5 py-0.2 bg-white/20 rounded-full text-[10px]">
              {recordedCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
};
