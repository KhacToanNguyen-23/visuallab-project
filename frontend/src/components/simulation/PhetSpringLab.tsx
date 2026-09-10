import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SpringEngine } from '../../engine/physics/spring-engine';

type LabTabMode = 'explore' | 'compare' | 'predict' | 'measure' | 'graph' | 'challenge';

interface MeasurementRow {
  step: number;
  massM: number; // kg
  stiffnessK: number; // N/m
  stretchCm: number; // cm
  time10T: string; // s
  calcPeriodT: string; // s
}

const GRAVITY_PRESETS = [
  { label: '🌍 Trái Đất', value: 9.81 },
  { label: '🌙 Mặt Trăng', value: 1.62 },
  { label: '🔴 Sao Hỏa', value: 3.71 },
  { label: '🪐 Sao Mộc', value: 24.79 },
];

export const PhetSpringLab: React.FC = () => {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Tab & Learning Mode State
  const [activeTab, setActiveTab] = useState<LabTabMode>('explore');

  // Physics Engine
  const engineRef = useRef<SpringEngine>(
    new SpringEngine({ stiffness: 50, mass: 0.2, gravity: 9.81, damping: 0.05, naturalLength: 0.4 })
  );

  // Parameters
  const [stiffness, setStiffness] = useState<number>(50); // N/m
  const [mass, setMass] = useState<number>(0.2); // kg
  const [gravity, setGravity] = useState<number>(9.81);
  const [damping, setDamping] = useState<number>(0.05);

  // UI Toggles & Controls
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [showEquilibrium, setShowEquilibrium] = useState<boolean>(true);
  const [showRuler, setShowRuler] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Measurement Records
  const [records, setRecords] = useState<MeasurementRow[]>([]);

  // Stopwatch state
  const [stopwatchTime, setStopwatchTime] = useState<number>(0);
  const [isStopwatchRunning, setIsStopwatchRunning] = useState<boolean>(false);

  // Update engine params
  useEffect(() => {
    engineRef.current.updateConfig({ stiffness, mass, gravity, damping });
  }, [stiffness, mass, gravity, damping]);

  // Main Physics & Render Loop (60 FPS)
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      const dt = Math.min((currentTime - lastTime) / 1000, 0.033);
      lastTime = currentTime;

      if (isRunning) {
        engineRef.current.step(dt);
      }

      // Update stopwatch
      if (isStopwatchRunning) {
        setStopwatchTime(prev => prev + dt);
      }

      // Render Canvas
      renderCanvas();

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isRunning, isStopwatchRunning, showEquilibrium, showRuler, stiffness, mass]);

  const renderCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    // Background Grid
    ctx.strokeStyle = '#1E293B';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    const startX = width / 2 - 40;
    const startY = 50; // Ceiling

    // Draw Ceiling Mount
    ctx.fillStyle = '#475569';
    ctx.fillRect(startX - 60, startY - 12, 120, 12);
    ctx.strokeStyle = '#94A3B8';
    ctx.lineWidth = 2;
    ctx.strokeRect(startX - 60, startY - 12, 120, 12);

    const state = engineRef.current.getState();
    const config = engineRef.current.getConfig();

    const naturalPixels = config.naturalLength * 300; // 0.4m = 120px
    const eqStretchPixels = engineRef.current.getEquilibriumStretch() * 300;
    const currentDisplacementPixels = state.displacement * 300;

    const springEndY = startY + naturalPixels + eqStretchPixels + currentDisplacementPixels;

    // Draw Spring Coils
    ctx.beginPath();
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const coils = 14;
    const coilWidth = 24;
    const springLength = springEndY - startY;
    const stepY = springLength / coils;

    ctx.moveTo(startX, startY);
    for (let i = 0; i <= coils; i++) {
      const currentY = startY + i * stepY;
      const currentX = i === 0 || i === coils ? startX : startX + (i % 2 === 0 ? coilWidth : -coilWidth);
      ctx.lineTo(currentX, currentY);
    }
    ctx.stroke();

    // Draw Mass Weight Block
    const massRadius = 18 + mass * 30;
    ctx.fillStyle = '#EC4899';
    ctx.beginPath();
    ctx.arc(startX, springEndY + massRadius, massRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#F472B6';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Mass Label text
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 12px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`${(mass * 1000).toFixed(0)}g`, startX, springEndY + massRadius + 4);

    // Reference Lines
    if (showEquilibrium) {
      // Natural Length Line (Yellow)
      const naturalY = startY + naturalPixels;
      ctx.strokeStyle = '#FACC15';
      ctx.setLineDash([6, 6]);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(startX - 120, naturalY);
      ctx.lineTo(startX + 120, naturalY);
      ctx.stroke();
      ctx.fillStyle = '#FACC15';
      ctx.font = '10px sans-serif';
      ctx.fillText('Vị trí lò xo tự nhiên L0', startX + 130, naturalY + 4);

      // Equilibrium Line O (Green)
      const eqY = startY + naturalPixels + eqStretchPixels;
      ctx.strokeStyle = '#34D399';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(startX - 120, eqY);
      ctx.lineTo(startX + 120, eqY);
      ctx.stroke();
      ctx.fillStyle = '#34D399';
      ctx.fillText('Vị trí cân bằng (O)', startX + 130, eqY + 4);

      ctx.setLineDash([]);
    }

    // Draw Ruler Tool
    if (showRuler) {
      const rulerX = startX - 160;
      ctx.fillStyle = '#0F172A';
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2;
      ctx.fillRect(rulerX, startY, 40, height - startY - 20);
      ctx.strokeRect(rulerX, startY, 40, height - startY - 20);

      ctx.fillStyle = '#94A3B8';
      ctx.font = '9px monospace';
      ctx.textAlign = 'right';
      for (let y = startY; y < height - 30; y += 20) {
        ctx.beginPath();
        ctx.moveTo(rulerX + 25, y);
        ctx.lineTo(rulerX + 40, y);
        ctx.stroke();
        const cm = Math.round((y - startY) / 3);
        if (cm % 10 === 0) {
          ctx.fillText(`${cm}cm`, rulerX + 22, y + 3);
        }
      }
    }
  };

  const handlePullSpring = (offsetCm: number) => {
    engineRef.current.setDisplacement(offsetCm / 100);
  };

  const handleRecordData = () => {
    const theorT = engineRef.current.getTheoreticalPeriod();
    const stretch = engineRef.current.getEquilibriumStretch() * 100;
    const newRow: MeasurementRow = {
      step: records.length + 1,
      massM: mass,
      stiffnessK: stiffness,
      stretchCm: parseFloat(stretch.toFixed(1)),
      time10T: (theorT * 10).toFixed(2),
      calcPeriodT: theorT.toFixed(3),
    };
    setRecords(prev => [...prev, newRow]);
    setToastMessage(`Đã ghi nhận lần đo #${newRow.step}: T = ${newRow.calcPeriodT}s`);
    setTimeout(() => setToastMessage(null), 2500);
  };

  return (
    <div className="w-full h-full min-h-screen bg-slate-950 text-white font-sans flex flex-col select-none overflow-x-hidden">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-cyan-600 text-white px-4 py-2.5 rounded-xl shadow-2xl border border-cyan-400 font-bold text-xs animate-bounce flex items-center gap-2">
          <span>✨ {toastMessage}</span>
        </div>
      )}

      {/* Top Pedagogy Navigation Tabs */}
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-3 flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/student')}
            className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-300 text-xs font-bold transition cursor-pointer"
          >
            ← Về Bài Tập
          </button>
          <h1 className="text-base font-black text-cyan-400 tracking-tight flex items-center gap-2">
            <span>🌀 Thí Nghiệm Con Lắc Lò Xo & Định Luật Hooke</span>
          </h1>
        </div>

        <div className="flex gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
          {(['explore', 'compare', 'predict', 'measure', 'graph', 'challenge'] as LabTabMode[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-extrabold uppercase transition cursor-pointer ${
                activeTab === tab
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab === 'explore' && '🔍 Khám Phá'}
              {tab === 'compare' && '⚖️ So Sánh'}
              {tab === 'predict' && '💡 Dự Đoán'}
              {tab === 'measure' && '📏 Đo Đạc'}
              {tab === 'graph' && '📊 Đồ Thị'}
              {tab === 'challenge' && '🏆 AI Thử Thách'}
            </button>
          ))}
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 p-4">
        {/* Left Interactive Canvas Area (8 cols) */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between relative shadow-xl">
          <div className="flex justify-between items-center mb-2 bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div className="flex items-center gap-4 text-xs font-mono font-bold">
              <span className="text-cyan-400">
                Chu kỳ lý thuyết $T = 2\pi\sqrt{`{m/k}`}$: {(2 * Math.PI * Math.sqrt(mass / stiffness)).toFixed(3)}s
              </span>
              <span className="text-emerald-400">
                Độ giãn vị trí cân bằng $\Delta L_0$: {((mass * gravity) / stiffness * 100).toFixed(1)} cm
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setIsRunning(!isRunning)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  isRunning ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-emerald-500 text-slate-950'
                }`}
              >
                {isRunning ? '⏸ Tạm Dừng' : '▶ Tiếp Tục'}
              </button>
              <button
                onClick={() => {
                  engineRef.current.reset();
                }}
                className="px-3 py-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-bold cursor-pointer"
              >
                🔄 Reset
              </button>
            </div>
          </div>

          <div className="flex-1 flex justify-center items-center bg-slate-950 rounded-xl relative overflow-hidden border border-slate-800">
            <canvas ref={canvasRef} width={750} height={450} className="w-full h-[450px]" />

            {/* Drag Pull Controls Overlay */}
            <div className="absolute top-4 right-4 bg-slate-900/90 backdrop-blur-sm border border-slate-700 rounded-xl p-3 flex flex-col gap-2 text-xs">
              <span className="font-bold text-slate-300">Kéo lệch vị trí cân bằng:</span>
              <div className="flex gap-1.5">
                {[5, 10, 15, 20].map(cm => (
                  <button
                    key={cm}
                    onClick={() => handlePullSpring(cm)}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-cyan-600 text-white rounded-lg font-bold border border-slate-700 cursor-pointer"
                  >
                    +{cm}cm
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Stopwatch & Action Bar */}
          <div className="mt-3 flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
            <div className="flex items-center gap-3">
              <span className="font-bold text-slate-400">⏱️ Đồng hồ hiện số:</span>
              <span className="font-mono text-base font-black text-cyan-400">{stopwatchTime.toFixed(2)}s</span>
              <button
                onClick={() => setIsStopwatchRunning(!isStopwatchRunning)}
                className="px-2.5 py-1 bg-slate-800 border border-slate-700 rounded-md font-bold"
              >
                {isStopwatchRunning ? 'Dừng' : 'Bắt đầu'}
              </button>
              <button onClick={() => setStopwatchTime(0)} className="text-slate-400 hover:text-white">
                Reset
              </button>
            </div>

            <button
              onClick={handleRecordData}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg shadow-md transition cursor-pointer"
            >
              📥 Ghi Số Liệu Vào Bảng
            </button>
          </div>
        </div>

        {/* Right Persistent Parameters Panel ⚙️ (4 cols) */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col gap-4 shadow-xl">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-cyan-400 flex items-center gap-2 pb-2 border-b border-slate-800">
            <span>⚙️ Thông Số Thí Nghiệm Lò Xo</span>
          </h2>

          <div className="space-y-4 text-xs">
            {/* Stiffness k Slider */}
            <div>
              <div className="flex justify-between font-bold mb-1">
                <span className="text-slate-300">Độ cứng lò xo (k):</span>
                <span className="text-cyan-400 font-mono">{stiffness} N/m</span>
              </div>
              <input
                type="range"
                min={10}
                max={100}
                step={5}
                value={stiffness}
                onChange={e => setStiffness(parseFloat(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>

            {/* Mass m Slider */}
            <div>
              <div className="flex justify-between font-bold mb-1">
                <span className="text-slate-300">Khối lượng quả nặng (m):</span>
                <span className="text-pink-400 font-mono">{(mass * 1000).toFixed(0)} g</span>
              </div>
              <input
                type="range"
                min={0.05}
                max={0.5}
                step={0.05}
                value={mass}
                onChange={e => setMass(parseFloat(e.target.value))}
                className="w-full accent-pink-500 cursor-pointer"
              />
            </div>

            {/* Damping Slider */}
            <div>
              <div className="flex justify-between font-bold mb-1">
                <span className="text-slate-300">Ma sát / Lực cản không khí:</span>
                <span className="text-amber-400 font-mono">{damping.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min={0}
                max={0.5}
                step={0.01}
                value={damping}
                onChange={e => setDamping(parseFloat(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            {/* Gravity Presets */}
            <div>
              <label className="font-bold text-slate-300 block mb-1">Môi trường gia tốc trọng trường (g):</label>
              <div className="grid grid-cols-2 gap-2">
                {GRAVITY_PRESETS.map(g => (
                  <button
                    key={g.label}
                    onClick={() => setGravity(g.value)}
                    className={`py-1.5 px-2 rounded-lg text-xs font-bold border transition cursor-pointer ${
                      gravity === g.value
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    {g.label} ({g.value})
                  </button>
                ))}
              </div>
            </div>

            {/* Visual Toggles */}
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <label className="flex items-center gap-2 cursor-pointer text-slate-300 font-semibold">
                <input
                  type="checkbox"
                  checked={showEquilibrium}
                  onChange={e => setShowEquilibrium(e.target.checked)}
                  className="rounded accent-cyan-500"
                />
                Hiển thị Vị trí cân bằng (O) & L0
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-slate-300 font-semibold">
                <input
                  type="checkbox"
                  checked={showRuler}
                  onChange={e => setShowRuler(e.target.checked)}
                  className="rounded accent-cyan-500"
                />
                Hiển thị Thước đo milimét
              </label>
            </div>
          </div>

          {/* Measurements Table Data */}
          <div className="mt-auto pt-2 border-t border-slate-800">
            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              📋 Bảng Số Liệu Đo Đạc ({records.length} lần đo)
            </h3>
            <div className="max-h-36 overflow-y-auto border border-slate-800 rounded-lg">
              <table className="w-full text-left text-[11px]">
                <thead className="bg-slate-950 text-slate-400 sticky top-0">
                  <tr>
                    <th className="p-1.5">Lần</th>
                    <th className="p-1.5">m(g)</th>
                    <th className="p-1.5">k(N/m)</th>
                    <th className="p-1.5">ΔL(cm)</th>
                    <th className="p-1.5">T(s)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {records.map(r => (
                    <tr key={r.step} className="hover:bg-slate-800/50">
                      <td className="p-1.5 font-bold">#{r.step}</td>
                      <td className="p-1.5 font-mono">{(r.massM * 1000).toFixed(0)}</td>
                      <td className="p-1.5 font-mono">{r.stiffnessK}</td>
                      <td className="p-1.5 font-mono text-emerald-400">{r.stretchCm}</td>
                      <td className="p-1.5 font-mono text-cyan-400">{r.calcPeriodT}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
