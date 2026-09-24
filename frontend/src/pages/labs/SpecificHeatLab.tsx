import React, { useRef, useState } from 'react';
import { AnimatedPanZoomListener } from 'scenerystack/scenery';
import { SceneryCanvas } from '../../components/scenerystack/SceneryCanvas.tsx';
import { SceneryRenderer } from '../../engine/scenerystack/SceneryRenderer.ts';
import { CalorimeterApparatus } from '../../engine/scenerystack/apparatus/concrete/ThermalApparatuses.ts';

export const SpecificHeatLab: React.FC = () => {
  const [isHeating, setIsHeating] = useState(false);
  const [powerW, setPowerW] = useState(30); // Watt
  const [massKg, setMassKg] = useState(0.2); // 200g nước
  const [tempC, setTempC] = useState(25.0);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [dataLogs, setDataLogs] = useState<Array<{ trial: number; mass: number; P: number; t: number; deltaT: number; cCalculated: number }>>([]);

  const caloRef = useRef<CalorimeterApparatus | null>(null);
  const heatIntervalRef = useRef<number | null>(null);

  const handleRendererReady = React.useCallback((renderer: SceneryRenderer) => {
    const calo = new CalorimeterApparatus('calo-1', tempC);
    caloRef.current = calo;

    calo.viewNode.x = 340;
    calo.viewNode.y = 260;

    renderer.getRootNode().addChild(calo.viewNode);

    const panZoomListener = new AnimatedPanZoomListener(renderer.getRootNode());
    renderer.getDisplay().addInputListener(panZoomListener);
  }, [tempC]);

  const handleStartHeating = () => {
    if (isHeating) return;
    setIsHeating(true);

    const cWater = 4180; // J/(kg.K)
    let currentT = tempC;
    let sec = elapsedSec;

    heatIntervalRef.current = window.setInterval(() => {
      sec += 2;
      // Q = P * dt = m * c * dT -> dT = P * dt / (m * c)
      const dT = (powerW * 2) / (massKg * cWater);
      currentT += dT;

      setTempC(currentT);
      setElapsedSec(sec);
      caloRef.current?.setTemperature(currentT);

      if (sec >= 40) {
        if (heatIntervalRef.current) clearInterval(heatIntervalRef.current);
        setIsHeating(false);

        const deltaTotal = currentT - 25.0;
        const c_calc = (powerW * sec) / (massKg * deltaTotal);

        setDataLogs((prev) => [
          ...prev,
          {
            trial: prev.length + 1,
            mass: massKg * 1000,
            P: powerW,
            t: sec,
            deltaT: Number(deltaTotal.toFixed(1)),
            cCalculated: Number(c_calc.toFixed(0)),
          },
        ]);
      }
    }, 200);
  };

  const handleReset = () => {
    if (heatIntervalRef.current) clearInterval(heatIntervalRef.current);
    setIsHeating(false);
    setTempC(25.0);
    setElapsedSec(0);
    caloRef.current?.setTemperature(25.0);
  };

  return (
    <>
      <div className="flex-1 flex flex-col min-w-0 h-full relative border border-slate-200 rounded-xl overflow-hidden shadow-inner bg-white">
        <SceneryCanvas onRendererReady={handleRendererReady} />

        {/* Controls */}
        <div className="absolute top-4 left-4 flex gap-2 z-10">
          <button
            type="button"
            onPointerDown={(e) => {
              e.stopPropagation();
              handleStartHeating();
            }}
            disabled={isHeating}
            className="px-4 py-2 bg-rose-600 text-white rounded-lg shadow font-semibold hover:bg-rose-700 disabled:opacity-50 cursor-pointer pointer-events-auto"
          >
            {isHeating ? `Đang đun nóng... (${elapsedSec}s)` : '🔥 Bật Dây Đun'}
          </button>
          <button
            type="button"
            onPointerDown={(e) => {
              e.stopPropagation();
              handleReset();
            }}
            className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg shadow font-semibold hover:bg-slate-300 cursor-pointer pointer-events-auto"
          >
            🔄 Đặt Lại
          </button>
        </div>

        {/* Sliders */}
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur p-4 rounded-xl shadow-lg border border-slate-200 z-10 w-72 flex flex-col gap-3 text-xs">
          <div>
            <div className="flex justify-between font-bold text-slate-800 mb-1">
              <span>Công suất đun P:</span>
              <span className="font-mono text-rose-600">{powerW} W</span>
            </div>
            <select
              value={powerW}
              onChange={(e) => setPowerW(Number(e.target.value))}
              className="w-full px-2 py-1.5 bg-slate-100 border border-slate-200 rounded outline-none"
            >
              <option value={20}>20 W</option>
              <option value={30}>30 W</option>
              <option value={50}>50 W</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between font-bold text-slate-800 mb-1">
              <span>Khối lượng nước m:</span>
              <span className="font-mono text-blue-600">{massKg * 1000} g</span>
            </div>
            <select
              value={massKg}
              onChange={(e) => setMassKg(Number(e.target.value))}
              className="w-full px-2 py-1.5 bg-slate-100 border border-slate-200 rounded outline-none"
            >
              <option value={0.1}>100 g</option>
              <option value={0.2}>200 g</option>
              <option value={0.3}>300 g</option>
            </select>
          </div>
        </div>

        {/* Instructions */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur p-4 rounded-xl shadow-lg border border-slate-200 pointer-events-none z-10 w-80">
          <h4 className="font-bold text-sm text-slate-800 mb-2">Bài 3: Đo nhiệt dung riêng của nước</h4>
          <ul className="text-xs text-slate-600 space-y-1">
            <li className="flex items-center gap-2"><span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">1</span> Bật công tắc đun nước trong bình nhiệt lượng kế.</li>
            <li className="flex items-center gap-2"><span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">2</span> Đọc nhiệt độ tăng ΔT sau thời gian τ.</li>
            <li className="flex items-center gap-2"><span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">3</span> Tính nhiệt dung riêng: c = (P · τ) / (m · ΔT).</li>
          </ul>
        </div>
      </div>

      {/* Right Data Table */}
      <div className="w-80 h-full flex flex-col bg-white border border-slate-200 rounded-xl p-4 shadow-sm select-none">
        <h3 className="font-bold text-sm text-slate-800 mb-1">Bảng Nhiệt Dung Riêng</h3>
        <p className="text-xs text-slate-500 mb-3">c = (P · τ) / (m · ΔT)</p>

        <div className="flex-1 overflow-y-auto border border-slate-100 rounded-lg">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-2">Lần</th>
                <th className="p-2">m (g)</th>
                <th className="p-2">P (W)</th>
                <th className="p-2">ΔT (°C)</th>
                <th className="p-2">c (J/kg·K)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {dataLogs.map((row) => (
                <tr key={row.trial} className="hover:bg-slate-50">
                  <td className="p-2 font-bold text-slate-700">{row.trial}</td>
                  <td className="p-2">{row.mass}</td>
                  <td className="p-2 font-mono text-rose-600">{row.P}</td>
                  <td className="p-2 font-mono text-blue-600">{row.deltaT}</td>
                  <td className="p-2 font-mono font-bold text-emerald-600">{row.cCalculated}</td>
                </tr>
              ))}
              {dataLogs.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-slate-400 italic">
                    Chưa có số liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};
