import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTableAndGraph, type MeasurementRecord } from '../workflow/DataTableAndGraph';

interface Measurement {
  trial: number;
  waterMass: number; // kg
  iceMass: number; // kg
  initialWaterTemp: number; // °C
  equilibriumTemp: number; // °C
  calculatedLambda: number; // J/kg
}

export const LatentHeatLab: React.FC = () => {
  const navigate = useNavigate();

  const [waterMass] = useState(0.25); // 250g warm water
  const [iceMass, setIceMass] = useState(0.04); // 40g ice at 0°C
  const [initialWaterTemp, setInitialWaterTemp] = useState(40.0); // 40°C
  const [isMelting, setIsMelting] = useState(false);
  const [currentTemp, setCurrentTemp] = useState(40.0);
  const [measurements, setMeasurements] = useState<Measurement[]>([]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cWater = 4180;
  const theoreticalLambda = 3.34e5; // 334,000 J/kg

  const handleStartMelting = () => {
    if (isMelting) return;
    setIsMelting(true);

    const tCb = (waterMass * cWater * initialWaterTemp - iceMass * theoreticalLambda) / ((waterMass + iceMass) * cWater);

    const startTime = performance.now();
    const duration = 2500;

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      const temp = initialWaterTemp - (initialWaterTemp - tCb) * progress;
      setCurrentTemp(parseFloat(temp.toFixed(1)));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsMelting(false);
      }
    };

    requestAnimationFrame(animate);
  };

  const handleReset = () => {
    setIsMelting(false);
    setCurrentTemp(initialWaterTemp);
  };

  const handleRecord = () => {
    if (currentTemp >= initialWaterTemp) return;
    const heatFromWater = waterMass * cWater * (initialWaterTemp - currentTemp);
    const heatToWarmMeltedIce = iceMass * cWater * currentTemp;
    const calcLambda = (heatFromWater - heatToWarmMeltedIce) / iceMass;

    setMeasurements(prev => [
      ...prev,
      {
        trial: prev.length + 1,
        waterMass,
        iceMass,
        initialWaterTemp,
        equilibriumTemp: currentTemp,
        calculatedLambda: parseFloat(calcLambda.toFixed(0)),
      },
    ]);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Lab Desk
    ctx.fillStyle = '#334155';
    ctx.fillRect(80, 380, 600, 20);

    // Calorimeter
    ctx.fillStyle = '#475569';
    ctx.fillRect(260, 160, 240, 220);
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 3;
    ctx.strokeRect(260, 160, 240, 220);

    // Water Body
    ctx.fillStyle = 'rgba(56, 189, 248, 0.5)';
    ctx.fillRect(270, 210, 220, 160);

    // Floating Ice Cubes
    if (currentTemp > 0) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1;

      const iceSize = isMelting ? 14 : 24;
      ctx.fillRect(320, 215, iceSize, iceSize);
      ctx.strokeRect(320, 215, iceSize, iceSize);

      ctx.fillRect(380, 220, iceSize, iceSize);
      ctx.strokeRect(380, 220, iceSize, iceSize);
    }

    // Thermometer
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(400, 50, 90, 45);
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.strokeRect(400, 50, 90, 45);

    ctx.fillStyle = '#38bdf8';
    ctx.font = '14px monospace';
    ctx.fillText(`${currentTemp.toFixed(1)}°C`, 412, 78);
  }, [currentTemp, isMelting]);

  const records: MeasurementRecord[] = measurements.map(m => ({
    index: m.trial,
    paramX: m.iceMass * 1000,
    paramY: m.calculatedLambda / 1000,
  }));

  const avgLambda =
    measurements.length > 0
      ? (measurements.reduce((acc, m) => acc + m.calculatedLambda, 0) / measurements.length).toFixed(0)
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
              Bài 4 (SGK T19): Đo Nhiệt Nóng Chảy Nước Đá
            </h1>
            <p className="text-xs text-slate-400">Vật lý 12 • Vật Lý Nhiệt</p>
          </div>
        </div>
        <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-full text-xs font-semibold">
          🎛️ THAM SỐ & NƯỚC ĐÁ NÓNG CHẢY
        </span>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-7/12 flex flex-col border-r border-slate-800 p-4 space-y-4">
          <div className="flex-1 bg-slate-900 rounded-2xl border border-slate-800 relative flex items-center justify-center overflow-hidden">
            <canvas ref={canvasRef} width={760} height={460} className="w-full h-full" />

            <div className="absolute top-4 right-4 bg-slate-950/90 border border-cyan-500/40 rounded-xl p-4 text-center backdrop-blur-md shadow-2xl space-y-1">
              <span className="text-[10px] text-cyan-400 uppercase font-mono tracking-wider">
                Nhiệt Độ Cân Bằng T_cb (°C)
              </span>
              <div className="text-3xl font-mono font-bold text-cyan-400">{currentTemp.toFixed(1)} °C</div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-6 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Khối lượng đá: {(iceMass * 1000).toFixed(0)}g</label>
                <input
                  type="range"
                  min="0.02"
                  max="0.08"
                  step="0.01"
                  value={iceMass}
                  onChange={e => setIceMass(parseFloat(e.target.value))}
                  disabled={isMelting}
                  className="w-28 accent-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Nhiệt độ nước ban đầu: {initialWaterTemp}°C</label>
                <input
                  type="range"
                  min="30"
                  max="60"
                  step="2"
                  value={initialWaterTemp}
                  onChange={e => {
                    const t = parseFloat(e.target.value);
                    setInitialWaterTemp(t);
                    setCurrentTemp(t);
                  }}
                  disabled={isMelting}
                  className="w-28 accent-cyan-500"
                />
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleStartMelting}
                disabled={isMelting}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white rounded-lg text-sm font-semibold transition"
              >
                ▶ Thả Đá Nóng Chảy
              </button>

              <button
                onClick={handleReset}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm transition"
              >
                ↺ Đặt Lại
              </button>

              <button
                onClick={handleRecord}
                disabled={currentTemp >= initialWaterTemp}
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
            xLabel="Khối lượng đá m_ice (g)"
            yLabel="Nhiệt nóng chảy λ (kJ/kg)"
            calculatedResult={`Nhiệt nóng chảy trung bình λ = ${avgLambda} J/kg`}
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
                  <th className="p-2">m_đá (kg)</th>
                  <th className="p-2">T_cb (°C)</th>
                  <th className="p-2 text-cyan-400">λ (J/kg)</th>
                </tr>
              </thead>
              <tbody>
                {measurements.map(m => (
                  <tr key={m.trial} className="border-b border-slate-800">
                    <td className="p-2 font-mono">{m.trial}</td>
                    <td className="p-2 font-mono">{m.iceMass}</td>
                    <td className="p-2 font-mono text-emerald-400">{m.equilibriumTemp}</td>
                    <td className="p-2 font-mono font-bold text-cyan-400">{m.calculatedLambda}</td>
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
