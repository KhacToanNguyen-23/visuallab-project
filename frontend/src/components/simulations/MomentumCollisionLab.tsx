import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTableAndGraph, type MeasurementRecord } from '../workflow/DataTableAndGraph';

interface Measurement {
  trial: number;
  m1: number;
  m2: number;
  v1: number;
  v2: number;
  pBefore: number;
  pAfter: number;
}

export const MomentumCollisionLab: React.FC = () => {
  const navigate = useNavigate();

  const [m1, setM1] = useState(0.2); // 200g
  const [m2, setM2] = useState(0.2); // 200g
  const [initialV1] = useState(1.5); // m/s
  const [collisionType, setCollisionType] = useState<'elastic' | 'inelastic'>('elastic');
  const [isColliding, setIsColliding] = useState(false);

  const [car1X, setCar1X] = useState(100);
  const [car2X, setCar2X] = useState(400);

  const [measuredPBefore, setMeasuredPBefore] = useState<number | null>(null);
  const [measuredPAfter, setMeasuredPAfter] = useState<number | null>(null);
  const [measurements, setMeasurements] = useState<Measurement[]>([]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleStart = () => {
    if (isColliding) return;
    setIsColliding(true);

    const pBefore = m1 * initialV1 + m2 * 0;
    setMeasuredPBefore(parseFloat(pBefore.toFixed(3)));

    let v1Final: number;
    let v2Final: number;

    if (collisionType === 'elastic') {
      v1Final = ((m1 - m2) / (m1 + m2)) * initialV1;
      v2Final = ((2 * m1) / (m1 + m2)) * initialV1;
    } else {
      v1Final = (m1 / (m1 + m2)) * initialV1;
      v2Final = v1Final;
    }

    const pAfter = m1 * v1Final + m2 * v2Final;
    setMeasuredPAfter(parseFloat(pAfter.toFixed(3)));

    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsedSec = (now - startTime) / 1000;

      if (elapsedSec < 1.0) {
        setCar1X(100 + initialV1 * 150 * elapsedSec);
        setCar2X(400);
        requestAnimationFrame(animate);
      } else {
        const dtAfter = elapsedSec - 1.0;
        setCar1X(250 + v1Final * 150 * dtAfter);
        setCar2X(400 + v2Final * 150 * dtAfter);

        if (dtAfter < 1.5) {
          requestAnimationFrame(animate);
        } else {
          setIsColliding(false);
        }
      }
    };

    requestAnimationFrame(animate);
  };

  const handleReset = () => {
    setIsColliding(false);
    setCar1X(100);
    setCar2X(400);
    setMeasuredPBefore(null);
    setMeasuredPAfter(null);
  };

  const handleRecord = () => {
    if (measuredPBefore === null || measuredPAfter === null) return;
    setMeasurements(prev => [
      ...prev,
      {
        trial: prev.length + 1,
        m1,
        m2,
        v1: initialV1,
        v2: 0,
        pBefore: measuredPBefore,
        pAfter: measuredPAfter,
      },
    ]);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Air Track Base
    const baseGrad = ctx.createLinearGradient(0, 360, 0, 400);
    baseGrad.addColorStop(0, '#94a3b8');
    baseGrad.addColorStop(0.5, '#cbd5e1');
    baseGrad.addColorStop(1, '#475569');

    ctx.fillStyle = baseGrad;
    ctx.fillRect(40, 360, 680, 24);

    // Air Holes
    ctx.fillStyle = '#1e293b';
    for (let x = 60; x <= 700; x += 20) {
      ctx.beginPath();
      ctx.arc(x, 368, 2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Photogate E & Photogate F
    ctx.fillStyle = '#2563eb';
    ctx.fillRect(230, 260, 10, 100);
    ctx.fillStyle = '#60a5fa';
    ctx.fillText('Cổng E', 215, 250);

    ctx.fillStyle = '#dc2626';
    ctx.fillRect(480, 260, 10, 100);
    ctx.fillStyle = '#f87171';
    ctx.fillText('Cổng F', 465, 250);

    // Glider Car 1
    ctx.fillStyle = '#1d4ed8';
    ctx.fillRect(car1X, 310, 80, 50);
    ctx.strokeStyle = '#60a5fa';
    ctx.lineWidth = 2;
    ctx.strokeRect(car1X, 310, 80, 50);
    ctx.fillStyle = '#ffffff';
    ctx.font = '11px sans-serif';
    ctx.fillText(`Xe 1 (${(m1 * 1000).toFixed(0)}g)`, car1X + 10, 340);

    // Glider Car 2
    ctx.fillStyle = '#047857';
    ctx.fillRect(car2X, 310, 80, 50);
    ctx.strokeStyle = '#34d399';
    ctx.strokeRect(car2X, 310, 80, 50);
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`Xe 2 (${(m2 * 1000).toFixed(0)}g)`, car2X + 10, 340);
  }, [car1X, car2X, m1, m2]);

  const records: MeasurementRecord[] = measurements.map(m => ({
    index: m.trial,
    paramX: m.pBefore,
    paramY: m.pAfter,
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
              Bài 30 (SGK T117): Khảo Sát Động Lượng & Va Chạm
            </h1>
            <p className="text-xs text-slate-400">Vật lý 10 • Động Lượng & Va Chạm</p>
          </div>
        </div>
        <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-full text-xs font-semibold">
          🎛️ THAM SỐ & ĐỆM KHÔNG KHÍ
        </span>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-7/12 flex flex-col border-r border-slate-800 p-4 space-y-4">
          <div className="flex-1 bg-slate-900 rounded-2xl border border-slate-800 relative flex items-center justify-center overflow-hidden">
            <canvas ref={canvasRef} width={760} height={460} className="w-full h-full" />

            <div className="absolute top-4 right-4 bg-slate-950/90 border border-cyan-500/40 rounded-xl p-4 text-center backdrop-blur-md shadow-2xl space-y-1">
              <span className="text-[10px] text-cyan-400 uppercase font-mono tracking-wider">
                Động Lượng (kg·m/s)
              </span>
              <div className="text-sm font-mono text-slate-300">
                Trước va chạm: <strong className="text-cyan-400">{measuredPBefore ?? '0.000'}</strong>
              </div>
              <div className="text-sm font-mono text-slate-300">
                Sau va chạm: <strong className="text-emerald-400">{measuredPAfter ?? '0.000'}</strong>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-6 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">m1: {(m1 * 1000).toFixed(0)}g</label>
                <input
                  type="range"
                  min="0.1"
                  max="0.4"
                  step="0.05"
                  value={m1}
                  onChange={e => setM1(parseFloat(e.target.value))}
                  disabled={isColliding}
                  className="w-24 accent-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">m2: {(m2 * 1000).toFixed(0)}g</label>
                <input
                  type="range"
                  min="0.1"
                  max="0.4"
                  step="0.05"
                  value={m2}
                  onChange={e => setM2(parseFloat(e.target.value))}
                  disabled={isColliding}
                  className="w-24 accent-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Loại va chạm</label>
                <select
                  value={collisionType}
                  onChange={e => setCollisionType(e.target.value as any)}
                  disabled={isColliding}
                  className="bg-slate-800 text-white rounded px-2 py-1 border border-slate-700"
                >
                  <option value="elastic">Đàn Hồi</option>
                  <option value="inelastic">Mềm (Dính Nối)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleStart}
                disabled={isColliding}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white rounded-lg text-sm font-semibold transition"
              >
                ▶ Bắn Xe
              </button>

              <button
                onClick={handleReset}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm transition"
              >
                ↺ Đặt Lại
              </button>

              <button
                onClick={handleRecord}
                disabled={measuredPBefore === null}
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
            xLabel="Động lượng trước p (kg·m/s)"
            yLabel="Động lượng sau p' (kg·m/s)"
            calculatedResult="Định luật bảo toàn động lượng: p = p'"
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
                  <th className="p-2">m1 (kg)</th>
                  <th className="p-2">m2 (kg)</th>
                  <th className="p-2">p trước</th>
                  <th className="p-2 text-cyan-400">p sau</th>
                </tr>
              </thead>
              <tbody>
                {measurements.map(m => (
                  <tr key={m.trial} className="border-b border-slate-800">
                    <td className="p-2 font-mono">{m.trial}</td>
                    <td className="p-2 font-mono">{m.m1}</td>
                    <td className="p-2 font-mono">{m.m2}</td>
                    <td className="p-2 font-mono text-emerald-400">{m.pBefore}</td>
                    <td className="p-2 font-mono font-bold text-cyan-400">{m.pAfter}</td>
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
