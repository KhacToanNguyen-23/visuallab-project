import React from 'react';

interface MomentumWorkbenchHudDockProps {
  m1G: number;
  onM1Change: (val: number) => void;
  m2G: number;
  onM2Change: (val: number) => void;
  collisionType: 'elastic' | 'inelastic';
  onCollisionTypeChange: (type: 'elastic' | 'inelastic') => void;
  springSpeed: number;
  onSpringSpeedChange: (speed: number) => void;
  onLaunch: () => void;
  onReset: () => void;
  onRecord: () => void;
  isLaunched: boolean;
  recordedCount: number;
}

export const MomentumWorkbenchHudDock: React.FC<MomentumWorkbenchHudDockProps> = ({
  m1G,
  onM1Change,
  m2G,
  onM2Change,
  collisionType,
  onCollisionTypeChange,
  springSpeed,
  onSpringSpeedChange,
  onLaunch,
  onReset,
  onRecord,
  isLaunched,
  recordedCount,
}) => {
  return (
    <div className="bg-slate-900/95 border border-slate-800 backdrop-blur-md rounded-2xl p-4 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
      {/* Parameters: Masses, Spring, and Collision Type */}
      <div className="flex flex-wrap items-center gap-5 w-full md:w-auto">
        {/* Mass 1 Slider */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400 font-medium">Khối lượng m₁:</span>
            <span className="text-rose-400 font-mono font-bold">{m1G} g</span>
          </div>
          <input
            type="range"
            min="100"
            max="300"
            step="50"
            value={m1G}
            onChange={e => onM1Change(parseFloat(e.target.value))}
            disabled={isLaunched}
            className="w-32 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
          />
        </div>

        {/* Mass 2 Slider */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400 font-medium">Khối lượng m₂:</span>
            <span className="text-sky-400 font-mono font-bold">{m2G} g</span>
          </div>
          <input
            type="range"
            min="100"
            max="300"
            step="50"
            value={m2G}
            onChange={e => onM2Change(parseFloat(e.target.value))}
            disabled={isLaunched}
            className="w-32 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
          />
        </div>

        {/* Spring Force Slider */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400 font-medium">Lực nén lò xo (v₀):</span>
            <span className="text-amber-400 font-mono font-bold">{springSpeed.toFixed(1)} m/s</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="2.0"
            step="0.1"
            value={springSpeed}
            onChange={e => onSpringSpeedChange(parseFloat(e.target.value))}
            disabled={isLaunched}
            className="w-32 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
        </div>

        {/* Collision Type Toggle */}
        <div className="space-y-1">
          <span className="text-slate-400 text-xs block font-medium">Đầu va chạm</span>
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 space-x-1">
            <button
              onClick={() => onCollisionTypeChange('elastic')}
              disabled={isLaunched}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                collisionType === 'elastic'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              ⚡ Đàn Hồi
            </button>
            <button
              onClick={() => onCollisionTypeChange('inelastic')}
              disabled={isLaunched}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                collisionType === 'inelastic'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              🧲 Mềm (Dính)
            </button>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-2.5">
        <button
          onClick={onLaunch}
          disabled={isLaunched}
          className="px-4 py-2 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-rose-600/25 flex items-center space-x-1.5 cursor-pointer"
        >
          <span>🚀 Phóng Xe 1</span>
        </button>

        <button
          onClick={onReset}
          className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition cursor-pointer"
        >
          ↺ Đặt Lại
        </button>

        <button
          onClick={onRecord}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition shadow-md shadow-indigo-600/25 flex items-center space-x-1.5 cursor-pointer"
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
