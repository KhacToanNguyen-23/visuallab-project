import React from 'react';

interface DigitalTimerPanelProps {
  displayTimeSec: number | null;
  isRunning: boolean;
  wireEConnected: boolean;
  wireFConnected: boolean;
  onToggleWireE: () => void;
  onToggleWireF: () => void;
  onReleaseBall: () => void;
  onReset: () => void;
  mode: 'AVERAGE_SPEED' | 'INSTANTANEOUS_SPEED';
  isBallReleased: boolean;
}

export const DigitalTimerPanel: React.FC<DigitalTimerPanelProps> = ({
  displayTimeSec,
  isRunning,
  wireEConnected,
  wireFConnected,
  onToggleWireE,
  onToggleWireF,
  onReleaseBall,
  onReset,
  mode,
  isBallReleased,
}) => {
  const isCorrectWiring =
    mode === 'AVERAGE_SPEED'
      ? wireEConnected && wireFConnected
      : wireEConnected;

  const formattedTime = displayTimeSec !== null ? displayTimeSec.toFixed(3) : '0.000';

  return (
    <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col justify-between space-y-4">
      {/* Header & Status Indicator */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Đồng Hồ Đo Thời Gian Hiện Số (0.001s)
          </h4>
        </div>
        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-cyan-400 border border-cyan-500/20">
          {mode === 'AVERAGE_SPEED' ? 'CHẾ ĐỘ: A ↔ B' : 'CHẾ ĐỘ: MODE A'}
        </span>
      </div>

      {/* Realistic Digital LCD Screen */}
      <div className="bg-black/90 border-2 border-slate-800 rounded-xl p-4 flex flex-col items-center justify-center relative shadow-inner overflow-hidden">
        <div className="absolute top-2 left-3 flex items-center gap-1.5 text-[9px] font-mono text-slate-500 uppercase">
          <span>THỜI GIAN Δt:</span>
        </div>

        {/* Big Glow Numbers */}
        <div className="font-mono text-4xl sm:text-5xl font-extrabold tracking-widest text-emerald-400 select-all drop-shadow-[0_0_12px_rgba(52,211,153,0.4)] my-1">
          {formattedTime}
          <span className="text-xl ml-1 text-emerald-600">s</span>
        </div>

        {/* State LED */}
        <div className="flex items-center gap-4 text-[10px] font-mono text-slate-400 mt-1">
          <span className={`flex items-center gap-1 ${isRunning ? 'text-amber-400' : 'text-slate-600'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isRunning ? 'bg-amber-400 animate-ping' : 'bg-slate-600'}`} />
            COUNTING
          </span>
          <span className={`flex items-center gap-1 ${isCorrectWiring ? 'text-emerald-400' : 'text-rose-400'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isCorrectWiring ? 'bg-emerald-400' : 'bg-rose-400'}`} />
            {isCorrectWiring ? 'READY' : 'NO SENSOR'}
          </span>
        </div>
      </div>

      {/* Signal Cable Ports Section */}
      <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 space-y-2">
        <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold">
          <span className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Đấu Nối Cáp Tín Hiệu:
          </span>
          {isCorrectWiring ? (
            <span className="flex items-center gap-1 text-emerald-400 text-[10px]">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Chuẩn kết nối
            </span>
          ) : (
            <span className="flex items-center gap-1 text-amber-400 text-[10px]">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Cần cắm đủ dây
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2">
          {/* Port A (Gate E) */}
          <button
            onClick={onToggleWireE}
            className={`p-2 rounded-lg border text-xs font-mono font-medium flex items-center justify-between transition-all cursor-pointer ${
              wireEConnected
                ? 'bg-cyan-950/40 border-cyan-500/50 text-cyan-300 shadow-[0_0_8px_rgba(6,182,212,0.2)]'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <span>Cổng E ➔ Ngõ A</span>
            <span
              className={`w-2 h-2 rounded-full ${
                wireEConnected ? 'bg-cyan-400 shadow-[0_0_6px_#22d3ee]' : 'bg-slate-700'
              }`}
            />
          </button>

          {/* Port B (Gate F) */}
          {mode === 'AVERAGE_SPEED' ? (
            <button
              onClick={onToggleWireF}
              className={`p-2 rounded-lg border text-xs font-mono font-medium flex items-center justify-between transition-all cursor-pointer ${
                wireFConnected
                  ? 'bg-purple-950/40 border-purple-500/50 text-purple-300 shadow-[0_0_8px_rgba(168,85,247,0.2)]'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <span>Cổng F ➔ Ngõ B</span>
              <span
                className={`w-2 h-2 rounded-full ${
                  wireFConnected ? 'bg-purple-400 shadow-[0_0_6px_#c084fc]' : 'bg-slate-700'
                }`}
              />
            </button>
          ) : (
            <div className="p-2 rounded-lg border border-slate-800 bg-slate-900/40 text-slate-600 text-xs font-mono flex items-center justify-center">
              <span>(Ngõ B không dùng)</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Action Buttons */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        <button
          onClick={onReleaseBall}
          disabled={isBallReleased || !isCorrectWiring}
          className={`py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer ${
            isBallReleased || !isCorrectWiring
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
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
          className="py-2.5 px-4 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Đặt Lại (Reset)</span>
        </button>
      </div>
    </div>
  );
};
