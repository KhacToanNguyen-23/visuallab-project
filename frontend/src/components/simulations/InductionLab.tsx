import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTableAndGraph, type MeasurementRecord } from '../workflow/DataTableAndGraph';

interface Measurement {
  trial: number;
  direction: string;
  speedLevel: number;
  currentIc: number; // mA
}

export const InductionLab: React.FC = () => {
  const navigate = useNavigate();

  const [magnetX, setMagnetX] = useState(100);
  const [speed, setSpeed] = useState(2); // 1 = slow, 3 = fast
  const [pole, setPole] = useState<'N-S' | 'S-N'>('N-S');
  const [isMoving, setIsMoving] = useState(false);
  const [currentIc, setCurrentIc] = useState(0);
  const [measurements, setMeasurements] = useState<Measurement[]>([]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const coilX = 350;

  const handleMoveIn = () => {
    if (isMoving) return;
    setIsMoving(true);

    const targetX = coilX - 20;
    const directionSign = pole === 'N-S' ? 1 : -1;
    const peakIc = 15 * speed * directionSign;
    setCurrentIc(peakIc);

    const startTime = performance.now();
    const duration = 1200 / speed;

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      setMagnetX(100 + (targetX - 100) * progress);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsMoving(false);
        setCurrentIc(0);
      }
    };

    requestAnimationFrame(animate);
  };

  const handleMoveOut = () => {
    if (isMoving) return;
    setIsMoving(true);

    const directionSign = pole === 'N-S' ? -1 : 1;
    const peakIc = 15 * speed * directionSign;
    setCurrentIc(peakIc);

    const startTime = performance.now();
    const duration = 1200 / speed;
    const startX = magnetX;

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      setMagnetX(startX - (startX - 100) * progress);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsMoving(false);
        setCurrentIc(0);
      }
    };

    requestAnimationFrame(animate);
  };

  const handleReset = () => {
    setIsMoving(false);
    setMagnetX(100);
    setCurrentIc(0);
  };

  const handleRecord = () => {
    setMeasurements(prev => [
      ...prev,
      {
        trial: prev.length + 1,
        direction: pole,
        speedLevel: speed,
        currentIc,
      },
    ]);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Bench Base
    ctx.fillStyle = '#334155';
    ctx.fillRect(50, 360, 680, 20);

    // Induction Coil
    ctx.fillStyle = '#78350f';
    ctx.fillRect(coilX, 220, 140, 120);
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 3;
    for (let x = coilX + 10; x <= coilX + 130; x += 8) {
      ctx.beginPath();
      ctx.moveTo(x, 220);
      ctx.lineTo(x, 340);
      ctx.stroke();
    }
    ctx.fillStyle = '#fef3c7';
    ctx.font = '11px sans-serif';
    ctx.fillText('Cuộn Dây Cảm Ứng', coilX + 15, 210);

    // Bar Magnet
    const magnetWidth = 140;
    const magnetHeight = 40;
    const magnetY = 260;

    if (pole === 'N-S') {
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(magnetX, magnetY, magnetWidth / 2, magnetHeight);
      ctx.fillStyle = '#2563eb';
      ctx.fillRect(magnetX + magnetWidth / 2, magnetY, magnetWidth / 2, magnetHeight);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px sans-serif';
      ctx.fillText('N', magnetX + 25, magnetY + 25);
      ctx.fillText('S', magnetX + 95, magnetY + 25);
    } else {
      ctx.fillStyle = '#2563eb';
      ctx.fillRect(magnetX, magnetY, magnetWidth / 2, magnetHeight);
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(magnetX + magnetWidth / 2, magnetY, magnetWidth / 2, magnetHeight);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px sans-serif';
      ctx.fillText('S', magnetX + 25, magnetY + 25);
      ctx.fillText('N', magnetX + 95, magnetY + 25);
    }

    // Galvanometer G
    const galvX = coilX + 70;
    const galvY = 110;
    const galvR = 45;

    ctx.beginPath();
    ctx.arc(galvX, galvY, galvR, 0, Math.PI * 2);
    ctx.fillStyle = '#0f172a';
    ctx.fill();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Zero mark in center
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px monospace';
    ctx.fillText('0', galvX - 3, galvY - 25);
    ctx.fillText('-G', galvX - 35, galvY - 10);
    ctx.fillText('+G', galvX + 20, galvY - 10);

    // Needle
    const needleAngle = -Math.PI / 2 + (currentIc / 50.0) * (Math.PI / 3);
    const needleEndX = galvX + Math.cos(needleAngle) * 32;
    const needleEndY = galvY + Math.sin(needleAngle) * 32;

    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(galvX, galvY);
    ctx.lineTo(needleEndX, needleEndY);
    ctx.stroke();

    // Wire connecting Coil to Galvanometer
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(coilX + 20, 220);
    ctx.lineTo(galvX - 25, galvY + 30);
    ctx.moveTo(coilX + 120, 220);
    ctx.lineTo(galvX + 25, galvY + 30);
    ctx.stroke();
  }, [magnetX, pole, currentIc]);

  const records: MeasurementRecord[] = measurements.map(m => ({
    index: m.trial,
    paramX: m.trial,
    paramY: m.currentIc,
  }));

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
              Bài 12 (SGK T52): Khảo Sát Hiện Tượng Cảm Ứng Điện Từ
            </h1>
            <p className="text-xs text-slate-400">Vật lý 12 • Từ Trường & Điện Từ</p>
          </div>
        </div>
        <span className="px-3 py-1 bg-violet-500/20 text-violet-400 border border-violet-500/30 rounded-full text-xs font-semibold">
          🎯 KÉO THẢ NAM CHÂM & ĐIỆN KẾ G
        </span>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-7/12 flex flex-col border-r border-slate-800 p-4 space-y-4">
          <div className="flex-1 bg-slate-900 rounded-2xl border border-slate-800 relative flex items-center justify-center overflow-hidden">
            <canvas ref={canvasRef} width={760} height={460} className="w-full h-full" />

            <div className="absolute top-4 right-4 bg-slate-950/90 border border-violet-500/40 rounded-xl p-4 text-center backdrop-blur-md shadow-2xl space-y-1">
              <span className="text-[10px] text-violet-400 uppercase font-mono tracking-wider">
                Dòng Cảm Ứng i_c (mA)
              </span>
              <div className="text-3xl font-mono font-bold text-violet-400">{currentIc.toFixed(1)} mA</div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-6 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Tốc độ dịch chuyển</label>
                <input
                  type="range"
                  min="1"
                  max="3"
                  step="1"
                  value={speed}
                  onChange={e => setSpeed(parseInt(e.target.value))}
                  disabled={isMoving}
                  className="w-28 accent-violet-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Cực nam châm</label>
                <button
                  onClick={() => setPole(prev => (prev === 'N-S' ? 'S-N' : 'N-S'))}
                  disabled={isMoving}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded text-violet-400 font-bold border border-slate-700"
                >
                  {pole}
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleMoveIn}
                disabled={isMoving}
                className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg text-sm font-semibold transition"
              >
                ▶ Đẩy Vào
              </button>

              <button
                onClick={handleMoveOut}
                disabled={isMoving}
                className="px-3 py-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white rounded-lg text-sm font-semibold transition"
              >
                ◀ Rút Ra
              </button>

              <button
                onClick={handleReset}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm transition"
              >
                ↺ Đặt Lại
              </button>

              <button
                onClick={handleRecord}
                className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg text-sm font-semibold transition"
              >
                + Ghi Số Liệu
              </button>
            </div>
          </div>
        </div>

        <div className="w-5/12 p-4 overflow-y-auto space-y-4 bg-slate-950">
          <DataTableAndGraph
            records={records}
            xLabel="Lần đo"
            yLabel="Cường độ i_c (mA)"
            calculatedResult="Định luật cảm ứng điện từ Faraday: e_c = -dΦ/dt"
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
                  <th className="p-2">Cực NC</th>
                  <th className="p-2">Tốc độ</th>
                  <th className="p-2 text-violet-400">i_c (mA)</th>
                </tr>
              </thead>
              <tbody>
                {measurements.map(m => (
                  <tr key={m.trial} className="border-b border-slate-800">
                    <td className="p-2 font-mono">{m.trial}</td>
                    <td className="p-2 font-mono text-amber-400">{m.direction}</td>
                    <td className="p-2 font-mono">{m.speedLevel}</td>
                    <td className="p-2 font-mono font-bold text-violet-400">{m.currentIc}</td>
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
