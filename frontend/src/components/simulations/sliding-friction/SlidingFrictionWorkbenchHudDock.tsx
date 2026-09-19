import React from 'react';
import { type SurfacePreset, SURFACE_PRESETS } from './slidingFrictionEngine';

interface SlidingFrictionWorkbenchHudDockProps {
  selectedSurface: SurfacePreset;
  addedMassKg: number;
  isPulling: boolean;
  showVectors: boolean;
  showMicroView: boolean;
  soundEnabled: boolean;
  cameraMode: 'perspective' | 'side' | 'top';
  onSelectSurface: (surface: SurfacePreset) => void;
  onSelectAddedMass: (massKg: number) => void;
  onStartPull: () => void;
  onReset: () => void;
  onToggleVectors: () => void;
  onToggleMicroView: () => void;
  onToggleSound: () => void;
  onChangeCameraMode: (mode: 'perspective' | 'side' | 'top') => void;
  onRecordTrial: () => void;
}

export const SlidingFrictionWorkbenchHudDock: React.FC<SlidingFrictionWorkbenchHudDockProps> = ({
  selectedSurface,
  addedMassKg,
  isPulling,
  showVectors,
  showMicroView,
  soundEnabled,
  cameraMode,
  onSelectSurface,
  onSelectAddedMass,
  onStartPull,
  onReset,
  onToggleVectors,
  onToggleMicroView,
  onToggleSound,
  onChangeCameraMode,
  onRecordTrial,
}) => {
  return (
    <div className="w-full bg-slate-900/95 backdrop-blur-md rounded-2xl p-4 border border-slate-800 shadow-xl flex flex-col gap-3">
      {/* Top Row Controls: Surface, Weights, Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Surface Material Selection */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Bề Mặt:</span>
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 gap-1">
            {SURFACE_PRESETS.map(s => {
              const isActive = selectedSurface.id === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => !isPulling && onSelectSurface(s)}
                  disabled={isPulling}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  } ${isPulling ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <span>{s.icon}</span>
                  <span>{s.name}</span>
                  <span className="text-[10px] text-slate-500 font-mono">({s.mu})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Weights Addition */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tải Trọng:</span>
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 gap-1">
            {[
              { label: '+100g (m = 0.3kg)', mass: 0.1 },
              { label: '+200g (m = 0.4kg)', mass: 0.2 },
              { label: '+300g (m = 0.5kg)', mass: 0.3 },
            ].map(w => {
              const isActive = Math.abs(addedMassKg - w.mass) < 0.01;
              return (
                <button
                  key={w.mass}
                  onClick={() => !isPulling && onSelectAddedMass(w.mass)}
                  disabled={isPulling}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-sky-500/20 text-sky-300 border border-sky-500/50 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  } ${isPulling ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {w.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onStartPull}
            disabled={isPulling}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 ${
              isPulling
                ? 'bg-amber-600/50 text-white cursor-wait'
                : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white shadow-amber-500/20 active:scale-95'
            }`}
          >
            <span>{isPulling ? '⏳ Đang Kéo...' : '▶ Kéo Khối Gỗ'}</span>
          </button>

          <button
            onClick={onReset}
            disabled={isPulling}
            className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 bg-slate-800/80 hover:bg-slate-700 transition-all active:scale-95 border border-slate-700/60"
            title="Đưa khối gỗ về vị trí ban đầu"
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

      {/* Bottom Row Controls: Camera & View Toggles */}
      <div className="flex flex-wrap items-center justify-between pt-2 border-t border-slate-800/80 text-xs text-slate-400">
        {/* Camera Views */}
        <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
          <span className="text-[11px] font-semibold text-slate-500 mr-1.5">Góc nhìn:</span>
          {(['perspective', 'side', 'top'] as const).map(mode => (
            <button
              key={mode}
              onClick={() => onChangeCameraMode(mode)}
              className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                cameraMode === mode ? 'bg-slate-800 text-amber-300 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {mode === 'perspective' ? '3D Tự Do' : mode === 'side' ? 'Cạnh Bên' : 'Từ Trên Xuống'}
            </button>
          ))}
        </div>

        {/* Vector, Micro, Sound Toggles */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleVectors}
            className={`px-2.5 py-1 rounded-lg border transition-all text-[11px] font-medium flex items-center gap-1 ${
              showVectors
                ? 'bg-blue-500/15 border-blue-500/40 text-blue-300'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-300'
            }`}
          >
            <span>↗</span> Vector Lực ({showVectors ? 'Bật' : 'Tắt'})
          </button>

          <button
            onClick={onToggleMicroView}
            className={`px-2.5 py-1 rounded-lg border transition-all text-[11px] font-medium flex items-center gap-1 ${
              showMicroView
                ? 'bg-purple-500/15 border-purple-500/40 text-purple-300'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-300'
            }`}
          >
            <span>🔬</span> Cấu Trúc Vi Mô ({showMicroView ? 'Bật' : 'Tắt'})
          </button>

          <button
            onClick={onToggleSound}
            className={`px-2.5 py-1 rounded-lg border transition-all text-[11px] font-medium flex items-center gap-1 ${
              soundEnabled
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-300'
            }`}
          >
            <span>{soundEnabled ? '🔊' : '🔇'}</span> Âm Thanh Ma Sát
          </button>
        </div>
      </div>
    </div>
  );
};
