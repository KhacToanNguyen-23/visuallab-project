import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTableAndGraph, type MeasurementRecord } from '../workflow/DataTableAndGraph';

interface Measurement {
  trial: number;
  normalForce: number; // N (Newton)
  frictionForce: number; // F_ms (Newton)
  mu: number; // μ
}

export const SlidingFrictionLab: React.FC = () => {
  const navigate = useNavigate();

  const [addedMass, setAddedMass] = useState(0.1); // 100g = 0.1kg added
  const [blockMass] = useState(0.2); // 200g base wooden block
  const [surfaceMu] = useState(0.25); // Actual coefficient of friction
  const [isPulling, setIsPulling] = useState(false);
  const [blockX, setBlockX] = useState(150);
  const [currentForce, setCurrentForce] = useState(0);
  const [measurements, setMeasurements] = useState<Measurement[]>([]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const totalMass = blockMass + addedMass;
  const normalForce = totalMass * 9.81;

  const handlePull = () => {
    if (isPulling) return;
    setIsPulling(true);

    const fMs = normalForce * surfaceMu;
    setCurrentForce(parseFloat(fMs.toFixed(2)));

    const startTime = performance.now();
    const duration = 2000;

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      setBlockX(150 + progress * 350);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsPulling(false);
      }
    };

    requestAnimationFrame(animate);
  };

  const handleReset = () => {
    setIsPulling(false);
    setBlockX(150);
    setCurrentForce(0);
  };

  const handleRecord = () => {
    if (currentForce <= 0) return;
    const calcMu = currentForce / normalForce;
    setMeasurements(prev => [
      ...prev,
      {
        trial: prev.length + 1,
        normalForce: parseFloat(normalForce.toFixed(2)),
        frictionForce: currentForce,
        mu: parseFloat(calcMu.toFixed(3)),
      },
    ]);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Table Surface
    ctx.fillStyle = '#475569';
    ctx.fillRect(50, 360, 680, 20);

    // Table Legs
    ctx.fillRect(80, 380, 16, 80);
    ctx.fillRect(680, 380, 16, 80);

    // Wooden Block
    const blockWidth = 140;
    const blockHeight = 60;
    const blockY = 360 - blockHeight;

    ctx.fillStyle = '#b45309';
    ctx.fillRect(blockX, blockY, blockWidth, blockHeight);
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 2;
    ctx.strokeRect(blockX, blockY, blockWidth, blockHeight);

    // Wood Grain Detail
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(blockX + 10, blockY + 20);
    ctx.lineTo(blockX + 130, blockY + 20);
    ctx.moveTo(blockX + 20, blockY + 40);
    ctx.lineTo(blockX + 120, blockY + 40);
    ctx.stroke();

    ctx.fillStyle = '#fef3c7';
    ctx.font = '12px sans-serif';
    ctx.fillText(`Khối Gỗ (${(blockMass * 1000).toFixed(0)}g)`, blockX + 15, blockY + 35);

    // Added Mass Weights
    if (addedMass > 0) {
      ctx.fillStyle = '#64748b';
      const weightX = blockX + 45;
      const weightY = blockY - 25;
      ctx.fillRect(weightX, weightY, 50, 25);
      ctx.strokeStyle = '#334155';
      ctx.strokeRect(weightX, weightY, 50, 25);
      ctx.fillStyle = '#ffffff';
      ctx.font = '10px sans-serif';
      ctx.fillText(`+${(addedMass * 1000).toFixed(0)}g`, weightX + 10, weightY + 16);
    }

    // Spring Balance
    const springStartX = blockX + blockWidth;
    const springY = blockY + blockHeight / 2;

    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(springStartX, springY);
    ctx.lineTo(springStartX + 160, springY);
    ctx.stroke();

    // Force Gauge Body
    ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
    ctx.fillRect(springStartX + 40, springY - 14, 120, 28);
    ctx.strokeStyle = '#38bdf8';
    ctx.strokeRect(springStartX + 40, springY - 14, 120, 28);

    // Indicator Needle
    ctx.fillStyle = '#ef4444';
    const needleX = springStartX + 40 + (currentForce / 3.0) * 110;
    ctx.fillRect(needleX, springY - 12, 3, 24);

    ctx.fillStyle = '#38bdf8';
    ctx.font = '11px monospace';
    ctx.fillText(`${currentForce.toFixed(2)}N`, springStartX + 75, springY + 4);
  }, [blockX, addedMass, blockMass, currentForce]);

  const records: MeasurementRecord[] = measurements.map(m => ({
    index: m.trial,
    paramX: m.normalForce,
    paramY: m.frictionForce,
  }));

  const avgMu =
    measurements.length > 0
      ? (measurements.reduce((acc, m) => acc + m.mu, 0) / measurements.length).toFixed(3)
      : '0.000';

  return (
    <div className="w-screen h-screen flex flex-col bg-slate-950 text-white font-sans overflow-hidden">
      <div className="h-14 bg-slate-900 border-b border-slate-800 px-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/thu-vien')}
            className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div>
            <h1 className="text-base font-bold text-slate-100">
              Bài 21 (SGK T83): Đo Hệ Số Ma Sát Trượt
            </h1>
            <p className="text-xs text-slate-400">Vật lý 10 • Năng Lượng & Ma Sát</p>
          </div>
        </div>
        <span className="px-3 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full text-xs font-semibold">
          🎯 KÉO THẢ & LỰC KẾ LÒ XO
        </span>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-7/12 flex flex-col border-r border-slate-800 p-4 space-y-4">
          <div className="flex-1 bg-slate-900 rounded-2xl border border-slate-800 relative flex items-center justify-center overflow-hidden">
            <canvas ref={canvasRef} width={760} height={460} className="w-full h-full" />

            <div className="absolute top-4 right-4 bg-slate-950/90 border border-amber-500/40 rounded-xl p-4 text-center backdrop-blur-md shadow-2xl">
              <span className="text-[10px] text-amber-400 uppercase font-mono tracking-wider">
                Lực Ma Sát F_ms (N)
              </span>
              <div className="text-3xl font-mono font-bold text-amber-400 my-1">
                {currentForce.toFixed(2)} N
              </div>
              <span className="text-[10px] text-slate-400">Áp lực N = {normalForce.toFixed(2)}N</span>
            </div>
          </div>

          <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div>
                <label className="text-xs text-slate-400 block mb-1">
                  Quả cân gia tải: <strong className="text-white">{(addedMass * 1000).toFixed(0)}g</strong>
                </label>
                <input
                  type="range"
                  min="0"
                  max="0.4"
                  step="0.05"
                  value={addedMass}
                  onChange={e => setAddedMass(parseFloat(e.target.value))}
                  disabled={isPulling}
                  className="w-48 accent-amber-500"
                />
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handlePull}
                disabled={isPulling}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white rounded-lg text-sm font-semibold transition"
              >
                ▶ Kéo Khối Gỗ
              </button>

              <button
                onClick={handleReset}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm transition"
              >
                ↺ Đặt Lại
              </button>

              <button
                onClick={handleRecord}
                disabled={currentForce <= 0}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg text-sm font-semibold transition"
              >
                + Ghi Số Liệu
              </button>
            </div>
          </div>
        </div>

        <div className="w-5/12 p-4 overflow-y-auto space-y-4 bg-slate-950">
          <DataTableAndGraph
            records={records}
            xLabel="Áp lực N (Newton)"
            yLabel="Lực ma sát F_ms (Newton)"
            calculatedResult={`Hệ số ma sát trượt trung bình μ = ${avgMu}`}
          />

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <h3 className="text-sm font-bold text-slate-200 mb-3 flex items-center justify-between">
              <span>Bảng Thu Thập Số Liệu Thí Nghiệm</span>
              <span className="text-xs text-slate-400 font-normal">{measurements.length} lần đo</span>
            </h3>

            <table className="w-full text-xs text-left text-slate-300">
              <thead className="bg-slate-800/60 uppercase text-slate-400 font-mono">
                <tr>
                  <th className="p-2">Lần đo</th>
                  <th className="p-2">Áp lực N (N)</th>
                  <th className="p-2">Lực F_ms (N)</th>
                  <th className="p-2 text-amber-400">Hệ số μ</th>
                </tr>
              </thead>
              <tbody>
                {measurements.map(m => (
                  <tr key={m.trial} className="border-b border-slate-800">
                    <td className="p-2 font-mono">{m.trial}</td>
                    <td className="p-2 font-mono">{m.normalForce}</td>
                    <td className="p-2 font-mono text-emerald-400">{m.frictionForce}</td>
                    <td className="p-2 font-mono font-bold text-amber-400">{m.mu}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
