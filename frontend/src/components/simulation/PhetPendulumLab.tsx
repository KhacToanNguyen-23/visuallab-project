import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PendulumEngine } from '../../engine/physics/pendulum-engine';

type LabTabMode = 'explore' | 'compare' | 'predict' | 'measure' | 'graph' | 'challenge';

interface MeasurementRow {
  step: number;
  lengthL: number; // m
  massM: number; // kg
  time10T: string; // s
}

const GRAVITY_PRESETS = [
  { label: '🌍 Trái Đất', value: 9.81 },
  { label: '🌙 Mặt Trăng', value: 1.62 },
  { label: '🔴 Sao Hỏa', value: 3.71 },
  { label: '🪐 Sao Mộc', value: 24.79 },
];

export const PhetPendulumLab: React.FC = () => {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Tab & Learning Mode State
  const [activeTab, setActiveTab] = useState<LabTabMode>('explore');

  // Physics Engines (Primary A & Compare B)
  const engineARef = useRef<PendulumEngine>(new PendulumEngine({ length: 1.0, mass: 0.5, gravity: 9.81 }));
  const engineBRef = useRef<PendulumEngine>(new PendulumEngine({ length: 1.0, mass: 2.0, gravity: 9.81 }));

  // Controls & Parameters
  const [lengthA, setLengthA] = useState<number>(1.0); // m
  const [massA, setMassA] = useState<number>(0.5); // kg
  const [gravityPreset, setGravityPreset] = useState<number>(9.81);
  const [dampingA, setDampingA] = useState<number>(0.0); // air resistance

  // Compare Mode Controls
  const [lengthB] = useState<number>(1.0);
  const [massB] = useState<number>(2.0);

  // Visual Overlays Switches
  const [showForces, setShowForces] = useState<boolean>(true);
  const [showVelocity, setShowVelocity] = useState<boolean>(true);
  const [showEnergyBar, setShowEnergyBar] = useState<boolean>(true);
  const [showTrajectory, setShowTrajectory] = useState<boolean>(false);

  // Simulation Running State
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [isDraggingBob, setIsDraggingBob] = useState<boolean>(false);

  // Trajectory History (Canvas points)
  const [trajectoryPoints, setTrajectoryPoints] = useState<{ x: number; y: number }[]>([]);

  // Measurement Tool State
  const [stopwatchTime, setStopwatchTime] = useState<number>(0);
  const [isStopwatchRunning, setIsStopwatchRunning] = useState<boolean>(false);
  const [measurementRows, setMeasurementRows] = useState<MeasurementRow[]>([
    { step: 1, lengthL: 0.8, massM: 0.5, time10T: '' },
    { step: 2, lengthL: 1.0, massM: 0.5, time10T: '' },
    { step: 3, lengthL: 1.2, massM: 0.5, time10T: '' },
  ]);
  const [userReportG, setUserReportG] = useState<string>('');
  const [reportResult, setReportResult] = useState<{ pass: boolean; score: number } | null>(null);

  // Prediction State
  const [predictionAnswer, setPredictionAnswer] = useState<string | null>(null);
  const [predictionSubmitted, setPredictionSubmitted] = useState<boolean>(false);

  // Challenge State
  const [targetChallengeScore, setTargetChallengeScore] = useState<boolean | null>(null);

  // Sync Slider State to Physics Engine
  useEffect(() => {
    engineARef.current.setParams({
      length: lengthA,
      mass: massA,
      gravity: gravityPreset,
      damping: dampingA,
    });
  }, [lengthA, massA, gravityPreset, dampingA]);

  useEffect(() => {
    engineBRef.current.setParams({
      length: lengthB,
      mass: massB,
      gravity: gravityPreset,
      damping: dampingA,
    });
  }, [lengthB, massB, gravityPreset, dampingA]);

  // Stopwatch Loop
  useEffect(() => {
    let timerId: number;
    if (isStopwatchRunning) {
      timerId = window.setInterval(() => {
        setStopwatchTime(prev => prev + 0.01);
      }, 10);
    }
    return () => clearInterval(timerId);
  }, [isStopwatchRunning]);

  // Main Render & Fixed Sub-step Physics Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const fixedDt = 0.016; // 60 updates/sec deterministic physics

    const render = () => {
      const engineA = engineARef.current;
      const engineB = engineBRef.current;

      // 1. Step Physics Engine if running
      if (isSimulating && !isDraggingBob) {
        engineA.step(fixedDt);
        if (activeTab === 'compare') {
          engineB.step(fixedDt);
        }

        // Record Trajectory
        if (showTrajectory) {
          const pivotX = canvas.width / (activeTab === 'compare' ? 4 : 2);
          const pivotY = 70;
          const pixelLength = 100 + engineA.params.length * 110;
          const bobX = pivotX + pixelLength * Math.sin(engineA.state.theta);
          const bobY = pivotY + pixelLength * Math.cos(engineA.state.theta);

          setTrajectoryPoints(prev => [...prev.slice(-120), { x: bobX, y: bobY }]);
        }
      }

      // 2. Clear Canvas
      ctx.fillStyle = '#060911';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Grid background
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      // Render Scene
      if (activeTab === 'compare') {
        // Draw Two Pendulums (A left, B right)
        renderSinglePendulum(ctx, engineA, canvas.width / 4, 70, 'Con Lắc A (m=0.5kg)', '#38bdf8');
        renderSinglePendulum(ctx, engineB, (canvas.width * 3) / 4, 70, 'Con Lắc B (m=2.0kg)', '#f59e0b');
      } else {
        // Draw Main Pendulum A
        renderSinglePendulum(ctx, engineA, canvas.width / 2, 70, 'Con Lắc Đơn', '#38bdf8');
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationId);
  }, [isSimulating, isDraggingBob, activeTab, showForces, showVelocity, showEnergyBar, showTrajectory]);

  // Render Function for Single Pendulum Scene with Vectors & Overlay
  const renderSinglePendulum = (
    ctx: CanvasRenderingContext2D,
    engine: PendulumEngine,
    pivotX: number,
    pivotY: number,
    label: string,
    colorHex: string
  ) => {
    const { state, params } = engine;

    // 1. Support Beam & Pivot Pin
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(pivotX - 100, pivotY - 16, 200, 14);
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 2;
    ctx.strokeRect(pivotX - 100, pivotY - 16, 200, 14);

    ctx.beginPath();
    ctx.arc(pivotX, pivotY, 6, 0, Math.PI * 2);
    ctx.fillStyle = colorHex;
    ctx.fill();

    // 2. Protractor Scale Overlay
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.25)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(pivotX, pivotY, 110, (Math.PI / 180) * 45, (Math.PI / 180) * 135);
    ctx.stroke();

    // Trajectory Path Rendering
    if (showTrajectory && trajectoryPoints.length > 1) {
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      trajectoryPoints.forEach((pt, i) => {
        if (i === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      });
      ctx.stroke();
    }

    // Convert Physical SI Position to Canvas Pixel Coords
    const pixelLength = 100 + params.length * 110;
    const bobX = pivotX + pixelLength * Math.sin(state.theta);
    const bobY = pivotY + pixelLength * Math.cos(state.theta);

    // 3. Hanging String (Rope)
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(pivotX, pivotY);
    ctx.lineTo(bobX, bobY);
    ctx.stroke();

    // 4. Mass Bob
    const bobRadius = 14 + params.mass * 5;
    ctx.shadowBlur = isDraggingBob ? 25 : 12;
    ctx.shadowColor = colorHex;
    ctx.beginPath();
    ctx.arc(bobX, bobY, bobRadius, 0, Math.PI * 2);
    ctx.fillStyle = colorHex;
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Bob Center Dot
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(bobX, bobY, 3, 0, Math.PI * 2);
    ctx.fill();

    // Labels
    ctx.font = 'bold 11px Inter, sans-serif';
    ctx.fillStyle = '#f8fafc';
    ctx.fillText(`${label} (L=${params.length}m, m=${params.mass}kg)`, pivotX - 80, pivotY - 26);

    const degrees = Math.round((state.theta * 180) / Math.PI);
    ctx.fillStyle = colorHex;
    ctx.fillText(`\u03B8 = ${degrees}°`, bobX - 15, bobY + bobRadius + 16);

    // 5. Force Vectors Visualization Overlays (mg, T, Fnet)
    if (showForces) {
      const forceScale = 8; // Vector visual scaling factor

      // Weight Force (Fg = mg) -> Points Straight Down (Red)
      const fgLength = state.weightForce * forceScale;
      drawVector(ctx, bobX, bobY, bobX, bobY + fgLength, '#ef4444', 'm·g');

      // Tension Force (T) -> Points along rope to Pivot (Blue)
      const tensionX = bobX - Math.sin(state.theta) * state.tensionForce * forceScale;
      const tensionY = bobY - Math.cos(state.theta) * state.tensionForce * forceScale;
      drawVector(ctx, bobX, bobY, tensionX, tensionY, '#3b82f6', 'T');
    }

    // 6. Velocity Vector Overlay -> Tangential (Green)
    if (showVelocity) {
      const vScale = 30;
      const vx = Math.cos(state.theta) * state.vTan * vScale;
      const vy = -Math.sin(state.theta) * state.vTan * vScale;
      drawVector(ctx, bobX, bobY, bobX + vx, bobY + vy, '#22c55e', `v=${state.vTan.toFixed(2)}m/s`);
    }

    // 7. Realtime Energy Bar Visualization Overlay
    if (showEnergyBar && activeTab !== 'compare') {
      const barX = 25;
      const barY = 120;
      const maxE = Math.max(0.1, state.totalEnergy);

      const epRatio = state.potentialEnergy / maxE;
      const ekRatio = state.kineticEnergy / maxE;

      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1;
      ctx.fillRect(barX, barY, 130, 110);
      ctx.strokeRect(barX, barY, 130, 110);

      ctx.font = 'bold 10px Inter, sans-serif';
      ctx.fillStyle = '#f8fafc';
      ctx.fillText('Năng Lượng (J)', barX + 10, barY + 20);

      // Potential Energy Bar (Blue)
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(barX + 10, barY + 35, epRatio * 100, 14);
      ctx.fillText(`Thế năng Ep: ${state.potentialEnergy.toFixed(2)}J`, barX + 10, barY + 46);

      // Kinetic Energy Bar (Green)
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(barX + 10, barY + 60, ekRatio * 100, 14);
      ctx.fillText(`Động năng Ek: ${state.kineticEnergy.toFixed(2)}J`, barX + 10, barY + 71);

      // Total Energy Bar (Amber)
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(barX + 10, barY + 85, 100, 14);
      ctx.fillText(`Cơ năng E: ${state.totalEnergy.toFixed(2)}J`, barX + 10, barY + 96);
    }
  };

  // Helper function to draw clean vector arrows
  const drawVector = (
    ctx: CanvasRenderingContext2D,
    fromX: number,
    fromY: number,
    toX: number,
    toY: number,
    colorHex: string,
    label: string
  ) => {
    const headLen = 8;
    const dx = toX - fromX;
    const dy = toY - fromY;
    const angle = Math.atan2(dy, dx);

    ctx.strokeStyle = colorHex;
    ctx.fillStyle = colorHex;
    ctx.lineWidth = 2.5;

    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();

    // Arrowhead
    ctx.beginPath();
    ctx.moveTo(toX, toY);
    ctx.lineTo(toX - headLen * Math.cos(angle - Math.PI / 6), toY - headLen * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(toX - headLen * Math.cos(angle + Math.PI / 6), toY - headLen * Math.sin(angle + Math.PI / 6));
    ctx.lineTo(toX, toY);
    ctx.fill();

    // Label
    ctx.font = 'bold 10px Inter, sans-serif';
    ctx.fillText(label, toX + 6, toY + 4);
  };

  // Direct Mouse Dragging of Pendulum Bob on Canvas
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const pivotX = canvas.width / 2;
    const pivotY = 70;
    const dx = clickX - pivotX;
    const dy = clickY - pivotY;

    // Calculate angle from vertical
    const draggedAngleRad = Math.atan2(dx, dy);

    setIsDraggingBob(true);
    setIsSimulating(false);
    engineARef.current.reset(draggedAngleRad);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDraggingBob || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const pivotX = canvasRef.current.width / 2;
    const pivotY = 70;
    const dx = clickX - pivotX;
    const dy = clickY - pivotY;

    // Constrain angle to max 85 degrees
    const draggedAngleRad = Math.max(-1.5, Math.min(1.5, Math.atan2(dx, dy)));
    engineARef.current.reset(draggedAngleRad);
  };

  const handleMouseUp = () => {
    if (isDraggingBob) {
      setIsDraggingBob(false);
      setIsSimulating(true);
    }
  };

  // Measurement Sheet Handlers
  const handleMeasurementRowChange = (index: number, val: string) => {
    const updated = [...measurementRows];
    updated[index].time10T = val;
    setMeasurementRows(updated);
  };

  const handleSubmitMeasurementReport = () => {
    const parsedG = parseFloat(userReportG);
    if (isNaN(parsedG)) return;

    const errMargin = Math.abs(parsedG - gravityPreset) / gravityPreset;
    const score = errMargin <= 0.05 ? 10 : errMargin <= 0.15 ? 8 : 5;

    setReportResult({ pass: score >= 7, score });
  };

  // Prediction Submit Handler
  const handleCheckPrediction = (selected: string) => {
    setPredictionAnswer(selected);
    setPredictionSubmitted(true);
  };

  return (
    <div className="min-h-screen w-screen bg-[#05070C] text-slate-100 p-4 md:p-6 flex flex-col items-center font-sans overflow-x-hidden">
      {/* Navigation & Header Bar */}
      <div className="w-full max-w-[1600px] flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 rounded-full bg-slate-900 border border-slate-700/60 text-slate-300 hover:text-white text-xs font-bold transition cursor-pointer flex items-center gap-2"
          >
            ← Về Dashboard
          </button>
          <div>
            <h1 className="text-lg font-extrabold text-white tracking-tight flex items-center gap-3">
              <span>Phòng Thí Nghiệm Vật Lý Ảo: Con Lắc Đơn</span>
              <span className="text-[10px] uppercase font-bold tracking-widest bg-cyan-950 text-cyan-400 border border-cyan-700/50 px-3 py-1 rounded-full">
                PhET Physics Engine & GDPT 2018
              </span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Môi trường tương tác khám phá trực tiếp, hiển thị Vector lực, Động năng - Thế năng & Đồ thị
            </p>
          </div>
        </div>

        {/* Tab Navigation Modes */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveTab('explore')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'explore' ? 'bg-cyan-500 text-black shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            🔬 Khám Phá
          </button>
          <button
            onClick={() => setActiveTab('compare')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'compare' ? 'bg-amber-500 text-black shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            ⚖️ So Sánh 2 Con Lắc
          </button>
          <button
            onClick={() => setActiveTab('predict')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'predict' ? 'bg-purple-500 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            🧠 Dự Đoán
          </button>
          <button
            onClick={() => setActiveTab('measure')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'measure' ? 'bg-emerald-500 text-black shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            ⏱️ Đo Đạc & Báo Cáo
          </button>
          <button
            onClick={() => setActiveTab('graph')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'graph' ? 'bg-blue-500 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            📊 Đồ Thị T²-L
          </button>
          <button
            onClick={() => setActiveTab('challenge')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'challenge' ? 'bg-rose-500 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            🎯 Thử Thách
          </button>
        </div>
      </div>

      {/* Main Interactive Grid */}
      <div className="w-full max-w-[1600px] grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1">
        {/* Left Interactive Canvas Simulation Workspace */}
        <div className="lg:col-span-7 bg-[#0A0E17] border border-slate-800 rounded-3xl p-4 shadow-2xl flex flex-col justify-between relative overflow-hidden">
          {/* Top Canvas Controls Overlay */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 mb-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSimulating(!isSimulating)}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold border transition shadow-md cursor-pointer ${
                  isSimulating
                    ? 'bg-amber-950 text-amber-300 border-amber-700/60'
                    : 'bg-emerald-950 text-emerald-300 border-emerald-700/60'
                }`}
              >
                {isSimulating ? '⏸️ Tạm Dừng Mô Phỏng' : '▶️ Bắt Đầu Cho Lắc'}
              </button>

              <button
                onClick={() => {
                  setIsSimulating(false);
                  setTrajectoryPoints([]);
                  engineARef.current.reset();
                  engineBRef.current.reset();
                }}
                className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
              >
                🔄 Reset Simulation
              </button>
            </div>

            {/* Physics Visual Switches */}
            <div className="flex items-center gap-4 text-xs font-semibold text-slate-300">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showForces}
                  onChange={e => setShowForces(e.target.checked)}
                  className="accent-rose-500 rounded"
                />
                <span>Vector Lực</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showVelocity}
                  onChange={e => setShowVelocity(e.target.checked)}
                  className="accent-emerald-500 rounded"
                />
                <span>Vận Tốc</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showEnergyBar}
                  onChange={e => setShowEnergyBar(e.target.checked)}
                  className="accent-cyan-500 rounded"
                />
                <span>Năng Lượng</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showTrajectory}
                  onChange={e => setShowTrajectory(e.target.checked)}
                  className="accent-amber-500 rounded"
                />
                <span>Quỹ Đạo</span>
              </label>
            </div>
          </div>

          {/* Interactive Physics Canvas */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-800/80 bg-black flex items-center justify-center">
            <canvas
              ref={canvasRef}
              width={720}
              height={420}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              className="cursor-grab active:cursor-grabbing w-full h-auto"
            />
            {isDraggingBob && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-cyan-950 text-cyan-300 px-3 py-1 rounded-full text-xs font-bold border border-cyan-700 animate-pulse">
                ✋ Đang kéo kéo quả tạ để thay đổi góc lệch ban đầu!
              </div>
            )}
          </div>

          {/* Live Gravity Selector & Parameters Footer */}
          <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3 p-3 bg-slate-900/80 border border-slate-800 rounded-2xl">
            {/* Slider 1: Length */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400 font-semibold">Chiều dài dây L:</span>
                <span className="text-cyan-400 font-bold">{lengthA.toFixed(1)} m</span>
              </div>
              <input
                type="range"
                min={0.2}
                max={2.0}
                step={0.1}
                value={lengthA}
                onChange={e => setLengthA(Number(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>

            {/* Slider 2: Mass */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400 font-semibold">Khối lượng tạ m:</span>
                <span className="text-cyan-400 font-bold">{massA.toFixed(1)} kg</span>
              </div>
              <input
                type="range"
                min={0.1}
                max={5.0}
                step={0.1}
                value={massA}
                onChange={e => setMassA(Number(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>

            {/* Selector 3: Environment Gravity Preset */}
            <div className="flex flex-col gap-1">
              <span className="text-[11px] text-slate-400 font-semibold">Môi Trường Trọng Trường g:</span>
              <select
                value={gravityPreset}
                onChange={e => setGravityPreset(Number(e.target.value))}
                className="bg-slate-950 border border-slate-700 rounded-xl px-2 py-1 text-xs text-emerald-400 font-bold focus:outline-none"
              >
                {GRAVITY_PRESETS.map(g => (
                  <option key={g.label} value={g.value}>
                    {g.label} ({g.value} m/s²)
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Right Dynamic Content Panel Depending on Active Mode */}
        <div className="lg:col-span-5 flex flex-col gap-4 overflow-y-auto max-h-[85vh] pr-1">
          {/* TAB 1: EXPLORE MODE */}
          {activeTab === 'explore' && (
            <div className="bg-[#0A0E17] border border-cyan-500/30 rounded-3xl p-5 shadow-xl flex flex-col gap-4">
              <h3 className="text-sm font-extrabold text-white uppercase tracking-wider border-b border-slate-800 pb-3 flex items-center gap-2">
                <span>🔬 Chế Độ Khám Phá Tự Do</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Tự do tương tác kéo thả quả nặng trực tiếp trên màn hình, thay đổi chiều dài dây L, khối lượng m và môi trường trọng trường. Bật các tùy chọn xem Vector lực và Chuyển hóa Năng Lượng!
              </p>

              {/* Damping / Air Resistance Slider */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col gap-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 font-semibold">Lực cản không khí (Air Resistance Damping):</span>
                  <span className="text-amber-400 font-bold">{(dampingA * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min={0.0}
                  max={0.5}
                  step={0.05}
                  value={dampingA}
                  onChange={e => setDampingA(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <span className="text-[10px] text-slate-400">
                  Khi lực cản &gt; 0, cơ năng giảm dần làm biên độ dao động tắt dần theo thời gian.
                </span>
              </div>
            </div>
          )}

          {/* TAB 2: COMPARE MODE */}
          {activeTab === 'compare' && (
            <div className="bg-[#0A0E17] border border-amber-500/30 rounded-3xl p-5 shadow-xl flex flex-col gap-4">
              <h3 className="text-sm font-extrabold text-white uppercase tracking-wider border-b border-slate-800 pb-3 flex items-center gap-2">
                <span>⚖️ So Sảnh Hai Con Lắc A & B</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Thí nghiệm kiểm chứng: <strong>"Khối lượng m có ảnh hưởng đến Chu kỳ T của con lắc đơn không?"</strong>
              </p>

              <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs">
                <div className="flex flex-col gap-1 text-cyan-300">
                  <span className="font-bold">Con Lắc A:</span>
                  <span>L = 1.0m, m = 0.5kg</span>
                  <span className="font-extrabold text-white">T = {(2 * Math.PI * Math.sqrt(1.0 / gravityPreset)).toFixed(2)}s</span>
                </div>
                <div className="flex flex-col gap-1 text-amber-400">
                  <span className="font-bold">Con Lắc B:</span>
                  <span>L = 1.0m, m = 2.0kg</span>
                  <span className="font-extrabold text-white">T = {(2 * Math.PI * Math.sqrt(1.0 / gravityPreset)).toFixed(2)}s</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-800/40 text-xs text-emerald-200">
                💡 <strong>Kết luận Vật Lý:</strong> Hai con lắc A và B có khối lượng chênh lệch gấp 4 lần (0.5kg vs 2.0kg) nhưng dao động hoàn toàn đồng pha với chu kỳ T y hệt nhau!
              </div>
            </div>
          )}

          {/* TAB 3: PREDICTION MODE */}
          {activeTab === 'predict' && (
            <div className="bg-[#0A0E17] border border-purple-500/30 rounded-3xl p-5 shadow-xl flex flex-col gap-4">
              <h3 className="text-sm font-extrabold text-white uppercase tracking-wider border-b border-slate-800 pb-3 flex items-center gap-2">
                <span>🧠 Đặt Giả Thuyết & Dự Đoán</span>
              </h3>
              <p className="text-xs text-slate-200 font-semibold">
                Câu hỏi: "Nếu bạn tăng chiều dài dây L từ 1.0m lên gấp đôi (2.0m), chu kỳ dao động T sẽ thay đổi thế nào?"
              </p>

              <div className="flex flex-col gap-2">
                {[
                  { id: 'increase', label: 'A. Chu kỳ T tăng lên' },
                  { id: 'decrease', label: 'B. Chu kỳ T giảm đi' },
                  { id: 'unchanged', label: 'C. Chu kỳ T giữ nguyên không đổi' },
                ].map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => handleCheckPrediction(opt.id)}
                    className={`w-full text-left p-3 rounded-2xl text-xs font-bold transition border cursor-pointer ${
                      predictionAnswer === opt.id
                        ? 'bg-purple-950 text-purple-200 border-purple-500'
                        : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              {predictionSubmitted && (
                <div
                  className={`p-4 rounded-2xl text-xs flex flex-col gap-1 border ${
                    predictionAnswer === 'increase'
                      ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-200'
                      : 'bg-rose-950/60 border-rose-500/40 text-rose-200'
                  }`}
                >
                  <span className="font-bold text-sm">
                    {predictionAnswer === 'increase' ? '✅ CHÍNH XÁC! TỰ THỦ THỰC NGHIỆM' : '❌ CHƯA CHÍNH XÁC'}
                  </span>
                  <p>
                    Giải thích: Vì công thức chu kỳ T = 2π√(L/g), nên khi L tăng thì chu kỳ T cũng tăng theo tỉ lệ căn bậc hai!
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: MEASURE & REPORT MODE */}
          {activeTab === 'measure' && (
            <div className="bg-[#0A0E17] border border-emerald-500/30 rounded-3xl p-5 shadow-xl flex flex-col gap-4">
              <h3 className="text-sm font-extrabold text-white uppercase tracking-wider border-b border-slate-800 pb-3 flex items-center justify-between">
                <span>⏱️ Thu Thập Số Liệu Đo gia tốc g</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-cyan-400">{stopwatchTime.toFixed(2)}s</span>
                  <button
                    onClick={() => setIsStopwatchRunning(!isStopwatchRunning)}
                    className="px-2.5 py-1 rounded-lg bg-cyan-950 text-cyan-300 border border-cyan-700 text-xs font-bold cursor-pointer"
                  >
                    {isStopwatchRunning ? 'Dừng' : 'Bấm'}
                  </button>
                </div>
              </h3>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-900 text-slate-300 border-b border-slate-800">
                      <th className="p-2">Lần đo</th>
                      <th className="p-2">Chiều dài L (m)</th>
                      <th className="p-2">Thời gian 10T (s)</th>
                      <th className="p-2">Chu kỳ T (s)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {measurementRows.map((row, idx) => {
                      const t10 = parseFloat(row.time10T);
                      const calcT = !isNaN(t10) && t10 > 0 ? (t10 / 10).toFixed(2) : '-';

                      return (
                        <tr key={row.step} className="border-b border-slate-800/60">
                          <td className="p-2 font-bold text-cyan-400">Lần {row.step}</td>
                          <td className="p-2 font-bold text-slate-200">{row.lengthL}m</td>
                          <td className="p-2">
                            <input
                              type="number"
                              step="0.01"
                              placeholder="10T(s)"
                              value={row.time10T}
                              onChange={e => handleMeasurementRowChange(idx, e.target.value)}
                              className="w-20 px-2 py-1 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
                            />
                          </td>
                          <td className="p-2 font-bold text-emerald-400">{calcT}s</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-col gap-1 pt-1">
                <label className="text-xs text-slate-400 font-semibold">Gia tốc g bạn tính được (m/s²):</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="Ví dụ: 9.81"
                  value={userReportG}
                  onChange={e => setUserReportG(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs"
                />
              </div>

              <button
                onClick={handleSubmitMeasurementReport}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-extrabold text-xs shadow-md transition active:scale-95 cursor-pointer"
              >
                Nộp Phiếu Báo Cáo Thực Hành
              </button>

              {reportResult && (
                <div
                  className={`p-3.5 rounded-2xl border text-xs flex flex-col gap-1 ${
                    reportResult.pass
                      ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-200'
                      : 'bg-rose-950/60 border-rose-500/40 text-rose-200'
                  }`}
                >
                  <span className="font-bold text-sm">
                    {reportResult.pass ? '🎉 ĐẠT CHUẨN BÀI THỰC HÀNH' : '❌ SAI SỐ BÁO CÁO CÓ LỖI'}
                  </span>
                  <p>Gia tốc chuẩn g: {gravityPreset} m/s² | Điểm: {reportResult.score}/10</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: GRAPH MODE */}
          {activeTab === 'graph' && (
            <div className="bg-[#0A0E17] border border-blue-500/30 rounded-3xl p-5 shadow-xl flex flex-col gap-4">
              <h3 className="text-sm font-extrabold text-white uppercase tracking-wider border-b border-slate-800 pb-3 flex items-center gap-2">
                <span>📊 Đồ Thị Tuyến Tính T² Theo L</span>
              </h3>

              <div className="bg-black border border-slate-800 rounded-2xl p-4 flex flex-col items-center justify-center gap-2">
                <div className="w-full h-40 border-l-2 border-b-2 border-slate-600 relative flex items-end p-2 justify-around">
                  {[0.4, 0.8, 1.2, 1.6, 2.0].map(lVal => {
                    const tSq = Math.pow(2 * Math.PI * Math.sqrt(lVal / gravityPreset), 2);
                    const hPx = Math.min(130, tSq * 12);

                    return (
                      <div key={lVal} className="flex flex-col items-center gap-1 group">
                        <div
                          style={{ height: `${hPx}px` }}
                          className="w-3 bg-cyan-500 rounded-t group-hover:bg-cyan-400 transition"
                        />
                        <span className="text-[9px] text-slate-400">{lVal}m</span>
                      </div>
                    );
                  })}
                </div>
                <span className="text-xs text-cyan-300 font-bold">Mối quan hệ tuyến tính T² = (4π²/g) * L</span>
              </div>
            </div>
          )}

          {/* TAB 6: CHALLENGE MODE */}
          {activeTab === 'challenge' && (
            <div className="bg-[#0A0E17] border border-rose-500/30 rounded-3xl p-5 shadow-xl flex flex-col gap-4">
              <h3 className="text-sm font-extrabold text-white uppercase tracking-wider border-b border-slate-800 pb-3 flex items-center gap-2">
                <span>🎯 Thử Thách Kỹ Năng Vật Lý</span>
              </h3>
              <p className="text-xs text-slate-200 font-semibold">
                Thử thách: <strong>"Hãy điều chỉnh Chiều Dài Dây L để tạo ra con lắc có Chu kỳ đúng T = 2.00 giây!"</strong>
              </p>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-300 font-bold">Chu kỳ hiện tại của bạn:</span>
                <span className="text-base font-extrabold text-cyan-400 font-mono">
                  {(2 * Math.PI * Math.sqrt(lengthA / gravityPreset)).toFixed(2)} s
                </span>
              </div>

              <button
                onClick={() => {
                  const currT = 2 * Math.PI * Math.sqrt(lengthA / gravityPreset);
                  const isPass = Math.abs(currT - 2.0) <= 0.05;
                  setTargetChallengeScore(isPass);
                }}
                className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs shadow-md transition cursor-pointer"
              >
                Kiểm Tra Thử Thách
              </button>

              {targetChallengeScore !== null && (
                <div
                  className={`p-3.5 rounded-2xl border text-xs font-bold ${
                    targetChallengeScore
                      ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-200'
                      : 'bg-rose-950/60 border-rose-500/40 text-rose-200'
                  }`}
                >
                  {targetChallengeScore
                    ? '🎉 XUẤT SẮC! BẠN ĐÃ TẠO ĐƯỢC CON LẮC T = 2.00s (L ≈ 0.99m)'
                    : '❌ CHƯA ĐẠT CHUẨN T = 2.00s. THỬ ĐIỀU CHỈNH L GẦN 1.0M!'}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
