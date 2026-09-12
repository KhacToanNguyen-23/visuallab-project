import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTableAndGraph, type MeasurementRecord } from '../workflow/DataTableAndGraph';

interface Measurement {
  trial: number;
  distance: number;
  time: number;
  speed: number;
}

export const SpeedMeasurementLab: React.FC = () => {
  const navigate = useNavigate();

  const [distance, setDistance] = useState(0.3); // Distance between E & F (meters)
  const [angle, setAngle] = useState(15); // Inclination angle in degrees
  const [ballX, setBallX] = useState(120); // Canvas X position of steel ball
  const [isRolling, setIsRolling] = useState(false);
  const [timerText, setTimerText] = useState('0.000');
  const [measurements, setMeasurements] = useState<Measurement[]>([]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const startX = 120;
  const trackLengthPx = 500;
  const posE_Px = startX + 50; // Gate E
  const posF_Px = posE_Px + distance * 400; // Gate F (400px = 1m)

  const handleStart = () => {
    if (isRolling) return;
    setIsRolling(true);

    const rad = (angle * Math.PI) / 180;
    const a = 9.81 * Math.sin(rad); // Acceleration down slope
    const targetX = posF_Px + 50;

    const startTime = performance.now();
    let gateETime: number | null = null;
    let gateFTime: number | null = null;

    const animate = (now: number) => {
      const elapsedSec = (now - startTime) / 1000;
      const currentX = startX + 0.5 * a * Math.pow(elapsedSec, 2) * 400;
      setBallX(Math.min(currentX, targetX));

      if (currentX >= posE_Px && gateETime === null) {
        gateETime = elapsedSec;
      }
      if (currentX >= posF_Px && gateFTime === null) {
        gateFTime = elapsedSec;
        const deltaT = gateFTime - gateETime!;
        setTimerText(deltaT.toFixed(3));
      }

      if (currentX < targetX) {
        requestAnimationFrame(animate);
      } else {
        setIsRolling(false);
      }
    };

    requestAnimationFrame(animate);
  };

  const handleReset = () => {
    setIsRolling(false);
    setBallX(startX);
    setTimerText('0.000');
  };

  const handleRecord = () => {
    const t = parseFloat(timerText);
    if (t <= 0) return;
    const v = distance / t;
    const newMeasurement: Measurement = {
      trial: measurements.length + 1,
      distance,
      time: parseFloat(t.toFixed(3)),
      speed: parseFloat(v.toFixed(2)),
    };
    setMeasurements(prev => [...prev, newMeasurement]);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background Grid
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }

    // Base Support
    ctx.fillStyle = '#475569';
    ctx.fillRect(80, 420, 640, 20);

    // Inclined Track
    const rad = (angle * Math.PI) / 180;

    ctx.save();
    ctx.translate(80, 420);
    ctx.rotate(-rad);

    const trackGrad = ctx.createLinearGradient(0, -10, 0, 10);
    trackGrad.addColorStop(0, '#94a3b8');
    trackGrad.addColorStop(0.5, '#cbd5e1');
    trackGrad.addColorStop(1, '#64748b');

    ctx.fillStyle = trackGrad;
    ctx.fillRect(0, -6, trackLengthPx + 80, 12);

    // Ruler ticks
    ctx.fillStyle = '#1e293b';
    ctx.font = '10px sans-serif';
    for (let cm = 0; cm <= 100; cm += 10) {
      const px = (cm / 100) * 400;
      ctx.fillRect(px, -6, 2, 6);
      ctx.fillText(`${cm}cm`, px - 10, 15);
    }

    ctx.restore();

    // Photogate Sensor E
    ctx.fillStyle = '#2563eb';
    ctx.fillRect(posE_Px - 6, 320, 12, 80);
    ctx.fillStyle = '#60a5fa';
    ctx.fillText('Cổng E', posE_Px - 18, 310);

    // Photogate Sensor F
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(posF_Px - 6, 320, 12, 80);
    ctx.fillStyle = '#f87171';
    ctx.fillText('Cổng F', posF_Px - 18, 310);

    // Steel Ball
    const ballY = 420 - (ballX - 80) * Math.tan(rad) - 10;
    const ballGrad = ctx.createRadialGradient(ballX - 3, ballY - 3, 2, ballX, ballY, 10);
    ballGrad.addColorStop(0, '#ffffff');
    ballGrad.addColorStop(0.4, '#94a3b8');
    ballGrad.addColorStop(1, '#334155');

    ctx.beginPath();
    ctx.arc(ballX, ballY, 10, 0, Math.PI * 2);
    ctx.fillStyle = ballGrad;
    ctx.fill();
    ctx.strokeStyle = '#0f172a';
    ctx.stroke();
  }, [ballX, angle, distance, posE_Px, posF_Px]);

  const records: MeasurementRecord[] = measurements.map(m => ({
    index: m.trial,
    paramX: m.time,
    paramY: m.speed,
  }));

  const avgSpeed =
    measurements.length > 0
      ? (measurements.reduce((acc, m) => acc + m.speed, 0) / measurements.length).toFixed(2)
      : '0.00';

  return (
    <div className="w-screen h-screen flex flex-col bg-slate-950 text-white font-sans overflow-hidden">
      {/* Header Bar */}
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
              Bài 6 (SGK T28): Đo Tốc Độ Vật Chuyển Động Thẳng
            </h1>
            <p className="text-xs text-slate-400">Vật lý 10 • Cơ Học & Động Học</p>
          </div>
        </div>
        <span className="px-3 py-1 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded-full text-xs font-semibold">
          🎯 KÉO THẢ & CỔNG QUANG E-F
        </span>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Interactive Canvas & Controls */}
        <div className="w-7/12 flex flex-col border-r border-slate-800 p-4 space-y-4">
          <div className="flex-1 bg-slate-900 rounded-2xl border border-slate-800 relative flex items-center justify-center overflow-hidden">
            <canvas ref={canvasRef} width={760} height={460} className="w-full h-full" />

            <div className="absolute top-4 right-4 bg-slate-950/90 border border-emerald-500/40 rounded-xl p-4 text-center backdrop-blur-md shadow-2xl">
              <span className="text-[10px] text-emerald-400 uppercase font-mono tracking-wider">
                Đồng Hồ Hiện Số Δt (s)
              </span>
              <div className="text-3xl font-mono font-bold text-emerald-400 my-1">{timerText}</div>
              <span className="text-[10px] text-slate-400">Độ chia 0.001s</span>
            </div>
          </div>

          <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div>
                <label className="text-xs text-slate-400 block mb-1">
                  Khoảng cách s (E ➔ F): <strong className="text-white">{distance}m</strong>
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="0.8"
                  step="0.05"
                  value={distance}
                  onChange={e => setDistance(parseFloat(e.target.value))}
                  disabled={isRolling}
                  className="w-36 accent-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">
                  Góc nghiêng máng: <strong className="text-white">{angle}°</strong>
                </label>
                <input
                  type="range"
                  min="5"
                  max="30"
                  step="1"
                  value={angle}
                  onChange={e => setAngle(parseInt(e.target.value))}
                  disabled={isRolling}
                  className="w-36 accent-indigo-500"
                />
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleStart}
                disabled={isRolling}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg text-sm font-semibold transition"
              >
                ▶ Thả Bi
              </button>

              <button
                onClick={handleReset}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm transition"
              >
                ↺ Đặt Lại
              </button>

              <button
                onClick={handleRecord}
                disabled={parseFloat(timerText) <= 0}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg text-sm font-semibold transition"
              >
                + Ghi Số Liệu
              </button>
            </div>
          </div>
        </div>

        {/* Right Data Table & Graph */}
        <div className="w-5/12 p-4 overflow-y-auto space-y-4 bg-slate-950">
          <DataTableAndGraph
            records={records}
            xLabel="Thời gian Δt (s)"
            yLabel="Tốc độ v (m/s)"
            calculatedResult={`Tốc độ trung bình v_tb = ${avgSpeed} m/s`}
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
                  <th className="p-2">Quãng đường s (m)</th>
                  <th className="p-2">Thời gian Δt (s)</th>
                  <th className="p-2 text-indigo-400">Tốc độ v (m/s)</th>
                </tr>
              </thead>
              <tbody>
                {measurements.map(m => (
                  <tr key={m.trial} className="border-b border-slate-800">
                    <td className="p-2 font-mono">{m.trial}</td>
                    <td className="p-2 font-mono">{m.distance}</td>
                    <td className="p-2 font-mono text-emerald-400">{m.time}</td>
                    <td className="p-2 font-mono font-bold text-indigo-400">{m.speed}</td>
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
