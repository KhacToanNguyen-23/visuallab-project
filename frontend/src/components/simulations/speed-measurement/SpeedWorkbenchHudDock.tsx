import React from 'react';

export interface LabTaskTarget {
  id: string;
  targetAngle: number;
  targetDistance: number;
  targetGateE: number;
  targetTrials: number;
  description: string;
}

interface SpeedWorkbenchHudDockProps {
  displayTimeSec: number | null;
  isRunning: boolean;
  trackAngleDeg: number;
  gateEPosCm: number;
  gateFPosCm: number;
  onTrackAngleChange: (angle: number) => void;
  onGateEChange: (cm: number) => void;
  onGateFChange: (cm: number) => void;
  wireEConnected: boolean;
  wireFConnected: boolean;
  onToggleWireE: () => void;
  onToggleWireF: () => void;
  onReleaseBall: () => void;
  onReset: () => void;
  mode: 'AVERAGE_SPEED' | 'INSTANTANEOUS_SPEED';
  isBallReleased: boolean;
  task: LabTaskTarget;
  onRandomizeTask: () => void;
}

export const SpeedWorkbenchHudDock: React.FC<SpeedWorkbenchHudDockProps> = ({
  displayTimeSec,
  isRunning,
  trackAngleDeg,
  gateEPosCm,
  gateFPosCm,
  onTrackAngleChange,
  onGateEChange,
  onGateFChange,
  wireEConnected,
  wireFConnected,
  onToggleWireE,
  onToggleWireF,
  onReleaseBall,
  onReset,
  mode,
  isBallReleased,
  task,
  onRandomizeTask,
}) => {
  const isCorrectWiring =
    mode === 'AVERAGE_SPEED'
      ? wireEConnected && wireFConnected
      : wireEConnected;

  const formattedTime = displayTimeSec !== null ? displayTimeSec.toFixed(3) : '0.000';

  const currentDistanceCm =
    mode === 'AVERAGE_SPEED'
      ? Math.abs(gateFPosCm - gateEPosCm)
      : 2.0;

  const isAngleMatched = trackAngleDeg === task.targetAngle;
  const isDistanceMatched =
    mode === 'AVERAGE_SPEED'
      ? Math.abs(currentDistanceCm - task.targetDistance) < 0.5
      : gateEPosCm === task.targetGateE;

  const isTaskMatched = isAngleMatched && isDistanceMatched;

  return (
    <div className="bg-slate-900/95 backdrop-blur-md border border-slate-800 rounded-2xl p-3.5 shadow-2xl space-y-3">
      {/* Integrated Task Target Bar right inside HUD Dock */}
      <div className={`p-2.5 rounded-xl border transition-all flex items-center justify-between gap-2 ${
        isTaskMatched
          ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200 shadow-[0_0_12px_rgba(16,185,129,0.15)]'
          : 'bg-slate-950/80 border-amber-500/40 text-amber-200'
      }`}>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-base">{isTaskMatched ? '🎯' : '📝'}</span>
          <div className="leading-tight">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[11px] uppercase tracking-wider text-slate-100">
                Mục Tiêu Đề Bài:
              </span>
              {isTaskMatched ? (
                <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">
                  ✓ Đã khớp đề bài
                </span>
              ) : (
                <span className="text-[10px] font-mono text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/30">
                  Chỉnh slider theo mục tiêu bên dưới
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-300 font-mono mt-0.5">
              {mode === 'AVERAGE_SPEED'
                ? `Cần góc α = ${task.targetAngle}° • Quãng đường s = ${task.targetDistance}cm (E=${task.targetGateE}cm, F=${task.targetGateE + task.targetDistance}cm)`
                : `Cần góc α = ${task.targetAngle}° • Cổng E đặt tại vạch s_E = ${task.targetGateE}cm`}
            </p>
          </div>
        </div>

        <button
          onClick={onRandomizeTask}
          className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[11px] font-semibold border border-slate-700 flex items-center gap-1 cursor-pointer transition-all active:scale-95 whitespace-nowrap"
          title="Sinh đề bài ngẫu nhiên mới"
        >
          <span>🎲 Đổi đề</span>
        </button>
      </div>

      {/* Row 2: LCD Stopwatch + Start/Reset Controls in the same frame */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center">
        {/* LCD Stopwatch (6 cols) */}
        <div className="sm:col-span-6 bg-black/90 border-2 border-slate-800 rounded-xl px-3.5 py-2 flex items-center justify-between shadow-inner relative overflow-hidden">
          <div className="flex flex-col">
            <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-wider">
              {mode === 'AVERAGE_SPEED' ? 'ĐỒNG HỒ (A ↔ B)' : 'ĐỒNG HỒ (MODE A)'}
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`w-2 h-2 rounded-full ${isRunning ? 'bg-amber-400 animate-ping' : isCorrectWiring ? 'bg-emerald-400' : 'bg-rose-500'}`} />
              <span className="text-[10px] font-mono text-slate-400">
                {isRunning ? 'ĐANG ĐO...' : isCorrectWiring ? 'SẴN SÀNG' : 'CHƯA NỐI DÂY'}
              </span>
            </div>
          </div>

          <div className="font-mono text-3xl sm:text-4xl font-extrabold tracking-widest text-emerald-400 select-all drop-shadow-[0_0_10px_rgba(52,211,153,0.35)]">
            {formattedTime}
            <span className="text-sm ml-1 text-emerald-600 font-semibold">s</span>
          </div>
        </div>

        {/* Start / Reset Action Buttons (6 cols) */}
        <div className="sm:col-span-6 grid grid-cols-2 gap-2">
          <button
            onClick={onReleaseBall}
            disabled={isBallReleased || !isCorrectWiring}
            className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer ${
              isBallReleased || !isCorrectWiring
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/40'
                : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-cyan-500/20 active:scale-[0.98]'
            }`}
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            <span>Thả Bi (Start)</span>
          </button>

          <button
            onClick={onReset}
            className="py-2.5 px-3 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Đặt Lại (Reset)</span>
          </button>
        </div>
      </div>

      {/* Row 3: Sliders with Target Indicators Right at the Slider Thumb */}
      <div className="pt-2 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center text-xs">
        {/* Sliders (8 cols) */}
        <div className="sm:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-2">
          {/* Angle Slider */}
          <div className={`p-2 rounded-xl border transition-all ${
            isAngleMatched
              ? 'bg-emerald-950/30 border-emerald-500/50 shadow-[0_0_8px_rgba(16,185,129,0.1)]'
              : 'bg-slate-950/70 border-slate-800'
          }`}>
            <div className="flex justify-between text-[10px] font-mono mb-1">
              <span className="text-slate-400">Góc α:</span>
              <span className={isAngleMatched ? 'text-emerald-400 font-bold' : 'text-cyan-300 font-bold'}>
                {trackAngleDeg}° {isAngleMatched ? '✓' : `(Đề: ${task.targetAngle}°)`}
              </span>
            </div>
            <input
              type="range"
              min={5}
              max={30}
              step={1}
              value={trackAngleDeg}
              onChange={e => onTrackAngleChange(Number(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
          </div>

          {/* Gate E Slider */}
          <div className="bg-slate-950/70 p-2 rounded-xl border border-slate-800">
            <div className="flex justify-between text-[10px] font-mono mb-1">
              <span className="text-slate-400">Cổng E:</span>
              <span className="text-cyan-300 font-bold">{gateEPosCm} cm</span>
            </div>
            <input
              type="range"
              min={5}
              max={mode === 'AVERAGE_SPEED' ? gateFPosCm - 10 : 90}
              step={1}
              value={gateEPosCm}
              onChange={e => onGateEChange(Number(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
          </div>

          {/* Gate F Slider / Distance status */}
          {mode === 'AVERAGE_SPEED' ? (
            <div className={`p-2 rounded-xl border transition-all col-span-2 sm:col-span-1 ${
              isDistanceMatched
                ? 'bg-emerald-950/30 border-emerald-500/50 shadow-[0_0_8px_rgba(16,185,129,0.1)]'
                : 'bg-slate-950/70 border-slate-800'
            }`}>
              <div className="flex justify-between text-[10px] font-mono mb-1">
                <span className="text-slate-400">Cổng F (s={currentDistanceCm}cm):</span>
                <span className={isDistanceMatched ? 'text-emerald-400 font-bold' : 'text-purple-300 font-bold'}>
                  {gateFPosCm}cm {isDistanceMatched ? '✓' : `(s=${task.targetDistance})`}
                </span>
              </div>
              <input
                type="range"
                min={gateEPosCm + 10}
                max={95}
                step={1}
                value={gateFPosCm}
                onChange={e => onGateFChange(Number(e.target.value))}
                className="w-full accent-purple-500 cursor-pointer"
              />
            </div>
          ) : (
            <div className="bg-slate-950/70 p-2 rounded-xl border border-slate-800 flex items-center justify-center text-[10px] text-slate-500 font-mono col-span-2 sm:col-span-1">
              <span>d = 2.0 cm (bi thép)</span>
            </div>
          )}
        </div>

        {/* Cable Badges (4 cols) */}
        <div className="sm:col-span-4 flex items-center justify-end gap-1.5">
          <button
            onClick={onToggleWireE}
            className={`px-2.5 py-1.5 rounded-lg border text-[10px] font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
              wireEConnected
                ? 'bg-cyan-950/50 border-cyan-500/40 text-cyan-300 shadow-[0_0_6px_rgba(6,182,212,0.15)]'
                : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}
            title="Đấu nối Cổng E vào Ngõ A"
          >
            <span className={`w-1.5 h-1.5 rounded-full ${wireEConnected ? 'bg-cyan-400' : 'bg-slate-600'}`} />
            <span>Cáp E ➔ A</span>
          </button>

          {mode === 'AVERAGE_SPEED' && (
            <button
              onClick={onToggleWireF}
              className={`px-2.5 py-1.5 rounded-lg border text-[10px] font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
                wireFConnected
                  ? 'bg-purple-950/50 border-purple-500/40 text-purple-300 shadow-[0_0_6px_rgba(168,85,247,0.15)]'
                : 'bg-slate-900 border-slate-800 text-slate-500'
              }`}
              title="Đấu nối Cổng F vào Ngõ B"
            >
              <span className={`w-1.5 h-1.5 rounded-full ${wireFConnected ? 'bg-purple-400' : 'bg-slate-600'}`} />
              <span>Cáp F ➔ B</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
