import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTableAndGraph, type MeasurementRecord } from '../workflow/DataTableAndGraph';

interface Measurement {
  trial: number;
  volume: number; // cm³
  pressure: number; // bar
  pVProduct: number; // bar·cm³
}

export const BoyleMariotteLab: React.FC = () => {
  const navigate = useNavigate();

  const [volume, setVolume] = useState(40); // 40 cm³ initial
  const [isCompressing, setIsCompressing] = useState(false);
  const [measurements, setMeasurements] = useState<Measurement[]>([]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const initialV = 40; // cm³
  const initialP = 1.0; // bar (1 atm)
  const currentPressure = (initialP * initialV) / volume;

  const handleCompressStep = () => {
    if (isCompressing || volume <= 10) return;
    setIsCompressing(true);

    const targetV = Math.max(10, volume - 5);
    const startTime = performance.now();
    const duration = 1000;
    const startV = volume;

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      const v = startV - (startV - targetV) * progress;
      setVolume(parseFloat(v.toFixed(1)));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsCompressing(false);
      }
    };

    requestAnimationFrame(animate);
  };

  const handleReset = () => {
    setIsCompressing(false);
    setVolume(40);
  };

  const handleRecord = () => {
    const pV = currentPressure * volume;
    setMeasurements(prev => [
      ...prev,
      {
        trial: prev.length + 1,
        volume,
        pressure: parseFloat(currentPressure.toFixed(2)),
        pVProduct: parseFloat(pV.toFixed(1)),
      },
    ]);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Support Base
    ctx.fillStyle = '#334155';
    ctx.fillRect(80, 360, 600, 20);

    // Gas Cylinder Outer Glass
    const cylinderLeft = 160;
    const cylinderTop = 180;
    const cylinderWidth = 320;
    const cylinderHeight = 140;

    ctx.fillStyle = 'rgba(148, 163, 184, 0.15)';
    ctx.fillRect(cylinderLeft, cylinderTop, cylinderWidth, cylinderHeight);
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 3;
    ctx.strokeRect(cylinderLeft, cylinderTop, cylinderWidth, cylinderHeight);

    // Volume Grid Marks
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '10px sans-serif';
    for (let v = 10; v <= 50; v += 10) {
      const px = cylinderLeft + (v / 50) * cylinderWidth;
      ctx.fillRect(px, cylinderTop, 2, 10);
      ctx.fillText(`${v}`, px - 6, cylinderTop + 25);
    }

    // Piston Head
    const pistonX = cylinderLeft + (volume / 50) * cylinderWidth;
    const pistonGrad = ctx.createLinearGradient(pistonX, cylinderTop, pistonX + 24, cylinderTop);
    pistonGrad.addColorStop(0, '#475569');
    pistonGrad.addColorStop(0.5, '#cbd5e1');
    pistonGrad.addColorStop(1, '#1e293b');

    ctx.fillStyle = pistonGrad;
    ctx.fillRect(pistonX, cylinderTop, 24, cylinderHeight);
    ctx.strokeStyle = '#0f172a';
    ctx.strokeRect(pistonX, cylinderTop, 24, cylinderHeight);

    // Piston Shaft Handle
    ctx.fillStyle = '#64748b';
    ctx.fillRect(pistonX + 24, cylinderTop + 55, 200, 30);

    // Trapped Air Molecules
    ctx.fillStyle = '#38bdf8';
    for (let i = 0; i < 25; i++) {
      const mx = cylinderLeft + Math.random() * (pistonX - cylinderLeft - 10);
      const my = cylinderTop + 10 + Math.random() * (cylinderHeight - 20);
      ctx.beginPath();
      ctx.arc(mx, my, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    // Pressure Gauge Circular Dial
    const gaugeX = cylinderLeft - 60;
    const gaugeY = cylinderTop + 70;
    const gaugeRadius = 45;

    ctx.beginPath();
    ctx.arc(gaugeX, gaugeY, gaugeRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#0f172a';
    ctx.fill();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Gauge Needle
    const angleRad = -Math.PI / 4 + ((currentPressure - 1.0) / 4.0) * (Math.PI * 1.5);
    const needleEndX = gaugeX + Math.cos(angleRad) * 32;
    const needleEndY = gaugeY + Math.sin(angleRad) * 32;

    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(gaugeX, gaugeY);
    ctx.lineTo(needleEndX, needleEndY);
    ctx.stroke();

    ctx.fillStyle = '#38bdf8';
    ctx.font = '11px monospace';
    ctx.fillText(`${currentPressure.toFixed(2)} bar`, gaugeX - 24, gaugeY + 20);
  }, [volume, currentPressure]);

  const records: MeasurementRecord[] = measurements.map(m => ({
    index: m.trial,
    paramX: m.volume,
    paramY: m.pressure,
  }));

  const avgPV =
    measurements.length > 0
      ? (measurements.reduce((acc, m) => acc + m.pVProduct, 0) / measurements.length).toFixed(1)
      : '0';

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
              Bài 7 (SGK T30): Quá Trình Đẳng Nhiệt (Boyle - Mariotte)
            </h1>
            <p className="text-xs text-slate-400">Vật lý 12 • Khí Lý Tưởng</p>
          </div>
        </div>
        <span className="px-3 py-1 bg-sky-500/20 text-sky-400 border border-sky-500/30 rounded-full text-xs font-semibold">
          🎛️ THAM SỐ & XY-LANH PÍT-TÔNG
        </span>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-7/12 flex flex-col border-r border-slate-800 p-4 space-y-4">
          <div className="flex-1 bg-slate-900 rounded-2xl border border-slate-800 relative flex items-center justify-center overflow-hidden">
            <canvas ref={canvasRef} width={760} height={460} className="w-full h-full" />

            <div className="absolute top-4 right-4 bg-slate-950/90 border border-sky-500/40 rounded-xl p-4 text-center backdrop-blur-md shadow-2xl space-y-1">
              <span className="text-[10px] text-sky-400 uppercase font-mono tracking-wider">
                Áp Suất p (bar) & Thể Tích V (cm³)
              </span>
              <div className="text-3xl font-mono font-bold text-sky-400">{currentPressure.toFixed(2)} bar</div>
              <div className="text-xs font-mono text-slate-300">
                Thể tích V: <strong className="text-amber-400">{volume} cm³</strong>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-6 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Thể tích V: {volume} cm³</label>
                <input
                  type="range"
                  min="10"
                  max="45"
                  step="1"
                  value={volume}
                  onChange={e => setVolume(parseFloat(e.target.value))}
                  disabled={isCompressing}
                  className="w-48 accent-sky-500"
                />
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleCompressStep}
                disabled={isCompressing || volume <= 10}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white rounded-lg text-sm font-semibold transition"
              >
                ▶ Nén Pít-tông (-5cm³)
              </button>

              <button
                onClick={handleReset}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm transition"
              >
                ↺ Đặt Lại
              </button>

              <button
                onClick={handleRecord}
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
            xLabel="Thể tích V (cm³)"
            yLabel="Áp suất p (bar)"
            calculatedResult={`Tích p·V trung bình = ${avgPV} bar·cm³ (Hằng số)`}
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
                  <th className="p-2">V (cm³)</th>
                  <th className="p-2">p (bar)</th>
                  <th className="p-2 text-sky-400">p·V (Hằng số)</th>
                </tr>
              </thead>
              <tbody>
                {measurements.map(m => (
                  <tr key={m.trial} className="border-b border-slate-800">
                    <td className="p-2 font-mono">{m.trial}</td>
                    <td className="p-2 font-mono">{m.volume}</td>
                    <td className="p-2 font-mono text-emerald-400">{m.pressure}</td>
                    <td className="p-2 font-mono font-bold text-sky-400">{m.pVProduct}</td>
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
