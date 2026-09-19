import React from 'react';
import { type OpticalMedium, OPTICAL_MEDIA_PRESETS } from './refractionEngine';

interface RefractionWorkbenchHudDockProps {
  medium1: OpticalMedium;
  medium2: OpticalMedium;
  direction: 'medium1_to_medium2' | 'medium2_to_medium1';
  incidentAngleDeg: number;
  laserWavelength: 'red' | 'green' | 'blue';
  cameraMode: 'perspective' | 'front' | 'top';
  onSelectMedium1: (m: OpticalMedium) => void;
  onSelectMedium2: (m: OpticalMedium) => void;
  onToggleDirection: () => void;
  onIncidentAngleChange: (angle: number) => void;
  onSelectWavelength: (w: 'red' | 'green' | 'blue') => void;
  onChangeCameraMode: (mode: 'perspective' | 'front' | 'top') => void;
  onReset: () => void;
  onRecordTrial: () => void;
}

export const RefractionWorkbenchHudDock: React.FC<RefractionWorkbenchHudDockProps> = ({
  medium1: _medium1,
  medium2,
  direction,
  incidentAngleDeg,
  laserWavelength,
  cameraMode,
  onSelectMedium1: _onSelectMedium1,
  onSelectMedium2,
  onToggleDirection,
  onIncidentAngleChange,
  onSelectWavelength,
  onChangeCameraMode,
  onReset,
  onRecordTrial,
}) => {
  return (
    <div className="w-full bg-slate-900/95 backdrop-blur-md rounded-xl p-3 border border-slate-800 shadow-xl flex flex-col gap-2">
      {/* Top Row: Medium, Direction, Angle Slider & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        {/* Medium Selection */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Khối:</span>
          <select
            value={medium2.id}
            onChange={e => {
              const found = OPTICAL_MEDIA_PRESETS.find(m => m.id === e.target.value);
              if (found) onSelectMedium2(found);
            }}
            className="bg-slate-950 text-slate-200 text-xs font-semibold px-2.5 py-1 rounded-lg border border-slate-800 focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            {OPTICAL_MEDIA_PRESETS.filter(m => m.id !== 'air').map(m => (
              <option key={m.id} value={m.id}>
                {m.name} (n = {m.id === 'mystery_x' ? '???' : m.refractiveIndex.toFixed(3)})
              </option>
            ))}
          </select>
        </div>

        {/* Direction Toggle */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onToggleDirection}
            className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 transition-all flex items-center gap-1 active:scale-95 shadow-sm"
          >
            <span>🔄</span>
            <span>{direction === 'medium1_to_medium2' ? 'Không Khí → Kính (Khúc Xạ)' : 'Kính → Không Khí (Phản Xạ TP)'}</span>
          </button>
        </div>

        {/* Laser Angle Control */}
        <div className="flex items-center gap-2 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
          <span className="text-[11px] font-bold text-slate-400">Góc i:</span>
          <input
            type="range"
            min={0}
            max={85}
            step={0.5}
            value={incidentAngleDeg}
            onChange={e => onIncidentAngleChange(Number(e.target.value))}
            className="w-20 sm:w-24 accent-rose-500 cursor-pointer"
          />
          <div className="flex items-center bg-slate-900 px-1.5 py-0.5 rounded border border-slate-700/60">
            <input
              type="number"
              min={0}
              max={85}
              step={0.5}
              value={incidentAngleDeg}
              onChange={e => {
                const val = Math.max(0, Math.min(85, Number(e.target.value) || 0));
                onIncidentAngleChange(val);
              }}
              className="w-8 bg-transparent text-xs font-mono font-bold text-rose-400 text-right focus:outline-none"
            />
            <span className="text-xs font-bold text-slate-400 ml-0.5">°</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onReset}
            className="px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-400 hover:text-slate-200 bg-slate-800 hover:bg-slate-700 transition-all active:scale-95 border border-slate-700/60"
            title="Đặt lại góc"
          >
            🔄 Đặt Lại
          </button>

          <button
            onClick={onRecordTrial}
            className="px-3.5 py-1 rounded-lg text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md shadow-emerald-600/20 transition-all active:scale-95 flex items-center gap-1"
          >
            <span>+ Ghi Số Liệu</span>
          </button>
        </div>
      </div>

      {/* Bottom Row: Laser Color & Camera Views */}
      <div className="flex flex-wrap items-center justify-between pt-1.5 border-t border-slate-800/80 text-xs text-slate-400">
        {/* Laser Color */}
        <div className="flex items-center gap-1">
          <span className="text-[10px] font-semibold text-slate-500 mr-1">Tia Laser:</span>
          {(['red', 'green', 'blue'] as const).map(w => (
            <button
              key={w}
              onClick={() => onSelectWavelength(w)}
              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-all flex items-center gap-1 border ${
                laserWavelength === w
                  ? w === 'red'
                    ? 'bg-red-500/20 text-red-400 border-red-500/50'
                    : w === 'green'
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50'
                    : 'bg-blue-500/20 text-blue-400 border-blue-500/50'
                  : 'border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${w === 'red' ? 'bg-red-500' : w === 'green' ? 'bg-emerald-500' : 'bg-blue-500'}`} />
              {w === 'red' ? 'Đỏ 650nm' : w === 'green' ? 'Lục 532nm' : 'Lam 405nm'}
            </button>
          ))}
        </div>

        {/* Camera Views */}
        <div className="flex items-center gap-1 bg-slate-950 px-1.5 py-0.5 rounded-lg border border-slate-800">
          <span className="text-[10px] font-semibold text-slate-500 mr-1">Góc nhìn:</span>
          {(['perspective', 'front', 'top'] as const).map(mode => (
            <button
              key={mode}
              onClick={() => onChangeCameraMode(mode)}
              className={`px-1.5 py-0.5 rounded text-[10px] font-medium transition-colors ${
                cameraMode === mode ? 'bg-slate-800 text-amber-300 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {mode === 'perspective' ? '3D' : mode === 'front' ? 'Chính Diện' : 'Từ Trên'}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
