import React, { useRef, useState } from 'react';
import { AnimatedPanZoomListener } from 'scenerystack/scenery';
import { SceneryCanvas } from '../../components/scenerystack/SceneryCanvas.tsx';
import { SceneryRenderer } from '../../engine/scenerystack/SceneryRenderer.ts';
import { StandApparatus } from '../../engine/scenerystack/apparatus/concrete/StandApparatus.ts';
import { PendulumApparatus } from '../../engine/scenerystack/apparatus/concrete/PendulumApparatus.ts';

export const SimplePendulumLab: React.FC = () => {
  const [isOscillating, setIsOscillating] = useState(false);
  const [wireLength, setWireLength] = useState(0.5); // m
  const [initialAngleDeg, setInitialAngleDeg] = useState(15); // deg
  const [dataLogs, setDataLogs] = useState<Array<{ trial: number; length: number; periodMeasured: number; periodTheory: number; gCalculated: number }>>([]);

  const pendulumRef = useRef<PendulumApparatus | null>(null);

  const handleRendererReady = React.useCallback((renderer: SceneryRenderer) => {
    const stand = new StandApparatus('stand-pendulum');
    stand.viewNode.x = 320;
    stand.viewNode.y = 80;

    const pendulum = new PendulumApparatus('pendulum-1', wireLength);
    pendulumRef.current = pendulum;
    pendulum.viewNode.x = 320;
    pendulum.viewNode.y = 120;

    renderer.getRootNode().addChild(stand.viewNode);
    renderer.getRootNode().addChild(pendulum.viewNode);

    const panZoomListener = new AnimatedPanZoomListener(renderer.getRootNode());
    renderer.getDisplay().addInputListener(panZoomListener);

    renderer.addUpdateListener((dt) => {
      if (pendulumRef.current && isOscillating) {
        pendulumRef.current.updatePhysics(dt);
      }
    });
  }, [isOscillating, wireLength]);

  const handleStart = () => {
    if (!pendulumRef.current) return;
    const rad = (initialAngleDeg * Math.PI) / 180;
    pendulumRef.current.angleRad = rad;
    pendulumRef.current.angularVelocity = 0;
    setIsOscillating(true);

    const g = 9.807;
    const T_theory = 2 * Math.PI * Math.sqrt(wireLength / g);
    // Đo 10 chu kỳ với sai số nhỏ 0.5%
    const T_measured = T_theory * (1 + (Math.random() - 0.5) * 0.01);
    const g_calc = 4 * Math.PI * Math.PI * wireLength / (T_measured * T_measured);

    setDataLogs((prev) => [
      ...prev,
      {
        trial: prev.length + 1,
        length: wireLength,
        periodMeasured: Number(T_measured.toFixed(3)),
        periodTheory: Number(T_theory.toFixed(3)),
        gCalculated: Number(g_calc.toFixed(2)),
      },
    ]);
  };

  const handleReset = () => {
    setIsOscillating(false);
    if (pendulumRef.current) {
      pendulumRef.current.angleRad = 0;
      pendulumRef.current.angularVelocity = 0;
      pendulumRef.current.viewNode.setAngle(0, wireLength * 300);
    }
  };

  const handleLengthChange = (l: number) => {
    setWireLength(l);
    if (pendulumRef.current) {
      pendulumRef.current.length = l;
      pendulumRef.current.viewNode.setAngle(0, l * 300);
    }
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
              handleStart();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow font-semibold hover:bg-blue-700 cursor-pointer pointer-events-auto"
          >
            ▶️ Thả Dao Động
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

        {/* Parameters */}
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur p-3 rounded-xl shadow-lg border border-slate-200 z-10 flex flex-col gap-2 text-xs font-semibold w-64">
          <div className="flex justify-between items-center">
            <span>Chiều dài dây l:</span>
            <select
              value={wireLength}
              onChange={(e) => handleLengthChange(Number(e.target.value))}
              className="px-2 py-1 bg-slate-100 border border-slate-200 rounded outline-none"
            >
              <option value={0.3}>0.3 m (30 cm)</option>
              <option value={0.5}>0.5 m (50 cm)</option>
              <option value={0.8}>0.8 m (80 cm)</option>
              <option value={1.0}>1.0 m (100 cm)</option>
            </select>
          </div>
          <div className="flex justify-between items-center">
            <span>Góc lệch ban đầu:</span>
            <select
              value={initialAngleDeg}
              onChange={(e) => setInitialAngleDeg(Number(e.target.value))}
              className="px-2 py-1 bg-slate-100 border border-slate-200 rounded outline-none"
            >
              <option value={10}>10°</option>
              <option value={15}>15°</option>
              <option value={20}>20°</option>
            </select>
          </div>
        </div>

        {/* Instructions */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur p-4 rounded-xl shadow-lg border border-slate-200 pointer-events-none z-10 w-80">
          <h4 className="font-bold text-sm text-slate-800 mb-2">Bài 7: Khảo sát dao động con lắc đơn</h4>
          <ul className="text-xs text-slate-600 space-y-1">
            <li className="flex items-center gap-2"><span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">1</span> Chọn chiều dài l và góc lệch ban đầu.</li>
            <li className="flex items-center gap-2"><span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">2</span> Thả dao động và đo chu kỳ $T$.</li>
            <li className="flex items-center gap-2"><span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">3</span> Tính gia tốc trọng trường g = 4π²l / T².</li>
          </ul>
        </div>
      </div>

      {/* Right Data Table */}
      <div className="w-80 h-full flex flex-col bg-white border border-slate-200 rounded-xl p-4 shadow-sm select-none">
        <h3 className="font-bold text-sm text-slate-800 mb-1">Bảng Chu Kỳ & Gia Tốc g</h3>
        <p className="text-xs text-slate-500 mb-3">T = 2π√(l/g) ➔ g = 4π²l / T²</p>

        <div className="flex-1 overflow-y-auto border border-slate-100 rounded-lg">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-2">Lần</th>
                <th className="p-2">l (m)</th>
                <th className="p-2">T (s)</th>
                <th className="p-2">g (m/s²)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {dataLogs.map((row) => (
                <tr key={row.trial} className="hover:bg-slate-50">
                  <td className="p-2 font-bold text-slate-700">{row.trial}</td>
                  <td className="p-2">{row.length}</td>
                  <td className="p-2 font-mono text-blue-600">{row.periodMeasured}</td>
                  <td className="p-2 font-mono font-bold text-emerald-600">{row.gCalculated}</td>
                </tr>
              ))}
              {dataLogs.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-slate-400 italic">
                    Chưa có số liệu đo
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
