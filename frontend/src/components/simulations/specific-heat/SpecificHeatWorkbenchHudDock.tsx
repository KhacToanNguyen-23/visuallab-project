import React from 'react';
import { type LiquidPreset, LIQUID_PRESETS } from './specificHeatEngine';

interface SpecificHeatWorkbenchHudDockProps {
  selectedLiquid: LiquidPreset;
  massKg: number;
  powerW: number;
  isHeating: boolean;
  hasStirrer: boolean;
  soundEnabled: boolean;
  cameraMode: 'perspective' | 'front' | 'top';
  onSelectLiquid: (liquid: LiquidPreset) => void;
  onSelectMass: (massKg: number) => void;
  onSelectPower: (powerW: number) => void;
  onToggleStirrer: () => void;
  onToggleSound: () => void;
  onChangeCameraMode: (mode: 'perspective' | 'front' | 'top') => void;
  onStartHeating: () => void;
  onStopHeating: () => void;
  onReset: () => void;
  onRecordTrial: () => void;
}

export const SpecificHeatWorkbenchHudDock: React.FC<SpecificHeatWorkbenchHudDockProps> = ({
  selectedLiquid,
  massKg,
  powerW,
  isHeating,
  hasStirrer,
  soundEnabled,
  cameraMode,
  onSelectLiquid,
  onSelectMass,
  onSelectPower,
  onToggleStirrer,
  onToggleSound,
  onChangeCameraMode,
  onStartHeating,
  onStopHeating,
  onReset,
  onRecordTrial,
}) => {
  return (
    <div className="w-full bg-slate-900/95 backdrop-blur-md rounded-2xl p-4 border border-slate-800 shadow-xl flex flex-col gap-3">
      {/* Top Row: Liquid, Mass, Power & Primary Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Liquid selection */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Chất Lỏng:</span>
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 gap-1">
            {LIQUID_PRESETS.map(liq => {
              const isActive = selectedLiquid.id === liq.id;
              return (
                <button
                  key={liq.id}
                  onClick={() => !isHeating && onSelectLiquid(liq)}
                  disabled={isHeating}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  } ${isHeating ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <span>{liq.icon}</span>
                  <span>{liq.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Mass Selection */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Khối Lượng:</span>
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 gap-1">
            {[
              { label: '200g (0.2kg)', mass: 0.2 },
              { label: '300g (0.3kg)', mass: 0.3 },
              { label: '400g (0.4kg)', mass: 0.4 },
            ].map(m => {
              const isActive = Math.abs(massKg - m.mass) < 0.01;
              return (
                <button
                  key={m.mass}
                  onClick={() => !isHeating && onSelectMass(m.mass)}
                  disabled={isHeating}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-sky-500/20 text-sky-300 border border-sky-500/50 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  } ${isHeating ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {m.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Power Selection */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Công Suất:</span>
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 gap-1">
            {[50, 100, 250, 500, 1000].map(p => {
              const isActive = powerW === p;
              return (
                <button
                  key={p}
                  onClick={() => !isHeating && onSelectPower(p)}
                  disabled={isHeating}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  } ${isHeating ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {p}W
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {isHeating ? (
            <button
              onClick={onStopHeating}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/20 transition-all active:scale-95 flex items-center gap-1.5"
            >
              <span>⏹ Dừng Đun</span>
            </button>
          ) : (
            <button
              onClick={onStartHeating}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white shadow-lg shadow-amber-500/20 transition-all active:scale-95 flex items-center gap-1.5"
            >
              <span>▶ Bắt Đầu Đun</span>
            </button>
          )}

          <button
            onClick={onReset}
            className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 bg-slate-800/80 hover:bg-slate-700 transition-all active:scale-95 border border-slate-700/60"
            title="Làm nguội và đặt lại"
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

      {/* Bottom Row: Stirrer toggle, Sound, Camera mode */}
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

        {/* Stirrer & Sound Toggles */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleStirrer}
            className={`px-3 py-1 rounded-lg border transition-all text-[11px] font-medium flex items-center gap-1.5 ${
              hasStirrer
                ? 'bg-blue-500/15 border-blue-500/40 text-blue-300'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-300'
            }`}
          >
            <span>🌀</span> Que Khuấy Nhiệt ({hasStirrer ? 'Đang Bật' : 'Đang Tắt'})
          </button>

          <button
            onClick={onToggleSound}
            className={`px-2.5 py-1 rounded-lg border transition-all text-[11px] font-medium flex items-center gap-1 ${
              soundEnabled
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-300'
            }`}
          >
            <span>{soundEnabled ? '🔊' : '🔇'}</span> Âm Thanh Sôi
          </button>
        </div>
      </div>
    </div>
  );
};
