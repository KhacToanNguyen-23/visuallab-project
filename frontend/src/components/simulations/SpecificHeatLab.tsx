import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTableAndGraph, type MeasurementRecord } from '../workflow/DataTableAndGraph';

interface Measurement {
  trial: number;
  mass: number; // kg
  power: number; // W
  timeSec: number; // s
  tempInitial: number; // °C
  tempFinal: number; // °C
  calculatedC: number; // J/(kg·K)
}

export const SpecificHeatLab: React.FC = () => {
  const navigate = useNavigate();

  const [waterMass, setWaterMass] = useState(0.2); // 200g water
  const [power, setPower] = useState(30); // 30W heating coil
  const [isHeating, setIsHeating] = useState(false);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [currentTemp, setCurrentTemp] = useState(25.0); // 25°C room temp
  const [measurements, setMeasurements] = useState<Measurement[]>([]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const theoreticalC = 4180; // J/(kg·K)

  const handleStartHeating = () => {
    if (isHeating) return;
    setIsHeating(true);

    const initT = currentTemp;

    const interval = setInterval(() => {
      setElapsedSec(prev => {
        const nextSec = prev + 1;
        const deltaT = (power * nextSec) / (waterMass * theoreticalC);
        setCurrentTemp(parseFloat((initT + deltaT).toFixed(1)));
        return nextSec;
      });
    }, 1000);

    (window as any).__heatingInterval = interval;
  };

  const handleStopHeating = () => {
    setIsHeating(false);
    if ((window as any).__heatingInterval) {
      clearInterval((window as any).__heatingInterval);
    }
  };

  const handleReset = () => {
    handleStopHeating();
    setElapsedSec(0);
    setCurrentTemp(25.0);
  };

  const handleRecord = () => {
    if (elapsedSec <= 0) return;
    const deltaT = currentTemp - 25.0;
    if (deltaT <= 0) return;

    const calcC = (power * elapsedSec) / (waterMass * deltaT);
    setMeasurements(prev => [
      ...prev,
      {
        trial: prev.length + 1,
        mass: waterMass,
        power,
        timeSec: elapsedSec,
        tempInitial: 25.0,
        tempFinal: currentTemp,
        calculatedC: parseFloat(calcC.toFixed(0)),
      },
    ]);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Laboratory Desk Surface
    ctx.fillStyle = '#334155';
    ctx.fillRect(80, 380, 600, 20);

    // Calorimeter Outer Cup
    ctx.fillStyle = '#64748b';
    ctx.fillRect(260, 160, 240, 220);
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 3;
    ctx.strokeRect(260, 160, 240, 220);

    // Insulating Lid
    ctx.fillStyle = '#475569';
    ctx.fillRect(240, 140, 280, 20);

    // Water Liquid Inside
    const waterHeight = (waterMass / 0.3) * 160;
    const waterY = 370 - waterHeight;
    ctx.fillStyle = 'rgba(56, 189, 248, 0.4)';
    ctx.fillRect(270, waterY, 220, waterHeight);

    // Heating Coil
    ctx.strokeStyle = isHeating ? '#ef4444' : '#64748b';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(320, 150);
    ctx.lineTo(320, 320);
    for (let y = 320; y <= 350; y += 6) {
      ctx.lineTo(y % 12 === 0 ? 335 : 305, y);
    }
    ctx.lineTo(350, 150);
    ctx.stroke();

    if (isHeating) {
      ctx.fillStyle = 'rgba(239, 68, 68, 0.6)';
      for (let i = 0; i < 6; i++) {
        const bx = 300 + Math.random() * 60;
        const by = 260 + Math.random() * 80;
        ctx.beginPath();
        ctx.arc(bx, by, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Digital Thermometer Probe
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(430, 100);
    ctx.lineTo(430, 340);
    ctx.stroke();

    // Thermometer Screen Box
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(400, 50, 90, 45);
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.strokeRect(400, 50, 90, 45);

    ctx.fillStyle = '#38bdf8';
    ctx.font = '14px monospace';
    ctx.fillText(`${currentTemp.toFixed(1)}°C`, 412, 78);
  }, [currentTemp, isHeating, waterMass]);

  const records: MeasurementRecord[] = measurements.map(m => ({
    index: m.trial,
    paramX: m.timeSec,
    paramY: m.tempFinal,
  }));

  const avgC =
    measurements.length > 0
      ? (measurements.reduce((acc, m) => acc + m.calculatedC, 0) / measurements.length).toFixed(0)
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
              Bài 3 (SGK T15): Đo Nhiệt Dung Riêng Của Nước
            </h1>
            <p className="text-xs text-slate-400">Vật lý 12 • Vật Lý Nhiệt</p>
          </div>
        </div>
        <span className="px-3 py-1 bg-red-500/20 text-red-400 border border-red-500/30 rounded-full text-xs font-semibold">
          🎛️ THAM SỐ & BÌNH NHIỆT LƯỢNG KẾ
        </span>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-7/12 flex flex-col border-r border-slate-800 p-4 space-y-4">
          <div className="flex-1 bg-slate-900 rounded-2xl border border-slate-800 relative flex items-center justify-center overflow-hidden">
            <canvas ref={canvasRef} width={760} height={460} className="w-full h-full" />

            <div className="absolute top-4 right-4 bg-slate-950/90 border border-red-500/40 rounded-xl p-4 text-center backdrop-blur-md shadow-2xl space-y-1">
              <span className="text-[10px] text-red-400 uppercase font-mono tracking-wider">
                Nhiệt Độ T (°C) & Thời Gian (s)
              </span>
              <div className="text-3xl font-mono font-bold text-red-400">{currentTemp.toFixed(1)} °C</div>
              <div className="text-xs font-mono text-slate-300">
                Thời gian đun: <strong className="text-amber-400">{elapsedSec}s</strong>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-6 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Khối lượng nước m: {(waterMass * 1000).toFixed(0)}g</label>
                <input
                  type="range"
                  min="0.1"
                  max="0.3"
                  step="0.05"
                  value={waterMass}
                  onChange={e => setWaterMass(parseFloat(e.target.value))}
                  disabled={isHeating}
                  className="w-28 accent-red-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Công suất P: {power}W</label>
                <input
                  type="range"
                  min="10"
                  max="50"
                  step="5"
                  value={power}
                  onChange={e => setPower(parseInt(e.target.value))}
                  disabled={isHeating}
                  className="w-28 accent-red-500"
                />
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {!isHeating ? (
                <button
                  onClick={handleStartHeating}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm font-semibold transition"
                >
                  ▶ Bật Đun
                </button>
              ) : (
                <button
                  onClick={handleStopHeating}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-sm font-semibold transition"
                >
                  ⏹ Tắt Đun
                </button>
              )}

              <button
                onClick={handleReset}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm transition"
              >
                ↺ Đặt Lại
              </button>

              <button
                onClick={handleRecord}
                disabled={elapsedSec <= 0}
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
            xLabel="Thời gian đun τ (giây)"
            yLabel="Nhiệt độ T (°C)"
            calculatedResult={`Nhiệt dung riêng c_tb = ${avgC} J/(kg·K)`}
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
                  <th className="p-2">m (kg)</th>
                  <th className="p-2">P (W)</th>
                  <th className="p-2">τ (s)</th>
                  <th className="p-2 text-red-400">c (J/kg·K)</th>
                </tr>
              </thead>
              <tbody>
                {measurements.map(m => (
                  <tr key={m.trial} className="border-b border-slate-800">
                    <td className="p-2 font-mono">{m.trial}</td>
                    <td className="p-2 font-mono">{m.mass}</td>
                    <td className="p-2 font-mono">{m.power}</td>
                    <td className="p-2 font-mono text-amber-400">{m.timeSec}</td>
                    <td className="p-2 font-mono font-bold text-red-400">{m.calculatedC}</td>
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
