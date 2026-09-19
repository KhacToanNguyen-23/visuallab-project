import React from 'react';
import { type PowerSourcePreset, POWER_SOURCE_PRESETS } from './emfInternalREngine';

interface EmfInternalRWorkbenchHudDockProps {
  selectedSource: PowerSourcePreset;
  rheostatROhms: number;
  switchOpen: boolean;
  meterMode: 'analog' | 'digital';
  cameraMode: 'perspective' | 'front' | 'top';
  onSelectSource: (source: PowerSourcePreset) => void;
  onRheostatChange: (val: number) => void;
  onToggleSwitch: () => void;
  onToggleMeterMode: () => void;
  onChangeCameraMode: (mode: 'perspective' | 'front' | 'top') => void;
  onReset: () => void;
  onRecordTrial: () => void;
}

export const EmfInternalRWorkbenchHudDock: React.FC<EmfInternalRWorkbenchHudDockProps> = ({
  selectedSource,
  rheostatROhms,
  switchOpen,
  meterMode,
  cameraMode,
  onSelectSource,
  onRheostatChange,
  onToggleSwitch,
  onToggleMeterMode,
  onChangeCameraMode,
  onReset,
  onRecordTrial,
}) => {
  return (
    <div className="w-full bg-slate-900/95 backdrop-blur-md rounded-2xl p-4 border border-slate-800 shadow-xl flex flex-col gap-3">
      {/* Top Row: Power Source, Switch, Slider, Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Source selection */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Nguồn Pin:</span>
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 gap-1">
            {POWER_SOURCE_PRESETS.map(src => {
              const isActive = selectedSource.id === src.id;
              return (
                <button
                  key={src.id}
                  onClick={() => onSelectSource(src)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <span>{src.icon}</span>
                  <span>{src.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Switch Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleSwitch}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 ${
              switchOpen
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-600/20'
                : 'bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white shadow-rose-600/20'
            }`}
          >
            <span>{switchOpen ? '⚡ Đóng Khóa K (Bật Mạch)' : '🔌 Mở Khóa K (Ngắt Mạch)'}</span>
          </button>
        </div>

        {/* Rheostat Slider & Input Control */}
        <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
          <span className="text-xs font-bold text-slate-400">Biến Trở R:</span>
          <input
            type="range"
            min={0.1}
            max={100}
            step={0.1}
            value={rheostatROhms}
            onChange={e => onRheostatChange(Math.round(Number(e.target.value) * 10) / 10)}
            className="w-24 sm:w-28 accent-amber-500 cursor-pointer"
          />
          <div className="flex items-center bg-slate-900 px-2 py-0.5 rounded border border-slate-700/60">
            <input
              type="number"
              min={0.1}
              max={100}
              step={0.1}
              value={rheostatROhms}
              onChange={e => {
                const v = Math.max(0.1, Math.min(100, Number(e.target.value) || 0.1));
                onRheostatChange(Math.round(v * 10) / 10);
              }}
              className="w-12 bg-transparent text-xs font-mono font-bold text-amber-400 text-right focus:outline-none"
            />
            <span className="text-xs font-bold text-slate-400 ml-1">Ω</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onReset}
            className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 bg-slate-800/80 hover:bg-slate-700 transition-all active:scale-95 border border-slate-700/60"
            title="Đặt lại mạch điện"
          >
            🔄 Đặt Lại
          </button>

          <button
            onClick={onRecordTrial}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-600/20 transition-all active:scale-95 flex items-center gap-1.5"
          >
            <span>+ Ghi Số Liệu</span>
          </button>
        </div>
      </div>

      {/* Bottom Row: Camera, Meter Mode */}
      <div className="flex flex-wrap items-center justify-between pt-2 border-t border-slate-800/80 text-xs text-slate-400">
        {/* Camera Views */}
        <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
          <span className="text-[11px] font-semibold text-slate-500 mr-1.5">Góc nhìn:</span>
          {(['perspective', 'front', 'top'] as const).map(mode => (
            <button
              key={mode}
              onClick={() => onChangeCameraMode(mode)}
              className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                cameraMode === mode ? 'bg-slate-800 text-amber-300 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {mode === 'perspective' ? '3D Tự Do' : mode === 'front' ? 'Chính Diện' : 'Từ Trên Xuống'}
            </button>
          ))}
        </div>

        {/* Meter Display Switch */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleMeterMode}
            className="px-3 py-1 rounded-lg border border-slate-700/60 bg-slate-950 text-slate-300 hover:text-amber-300 transition-all text-[11px] font-medium flex items-center gap-1.5"
          >
            <span>📟</span> Đổi Đồng Hồ: <strong>{meterMode === 'analog' ? 'Kim Vạch' : 'Hiện Số LED'}</strong>
          </button>
        </div>
      </div>
    </div>
  );
};
