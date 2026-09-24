import React, { useRef, useState } from 'react';
import { AnimatedPanZoomListener } from 'scenerystack/scenery';
import { SceneryCanvas } from '../../components/scenerystack/SceneryCanvas.tsx';
import { SceneryRenderer } from '../../engine/scenerystack/SceneryRenderer.ts';
import {
  PowerSupplyApparatus,
  MultimeterApparatus,
  RheostatApparatus,
  SwitchApparatus,
} from '../../engine/scenerystack/apparatus/concrete/CircuitApparatuses.ts';

export const DcCircuitLab: React.FC = () => {
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const [resistance, setResistance] = useState(10); // Ohm
  const [supplyVoltage, setSupplyVoltage] = useState(6.0); // V
  const [dataLogs, setDataLogs] = useState<Array<{ trial: number; U: number; R: number; I: number; calculatedR: number }>>([]);

  const ammeterRef = useRef<MultimeterApparatus | null>(null);
  const voltmeterRef = useRef<MultimeterApparatus | null>(null);
  const switchRef = useRef<SwitchApparatus | null>(null);

  const handleRendererReady = React.useCallback((renderer: SceneryRenderer) => {
    const power = new PowerSupplyApparatus('power-dc', supplyVoltage, 0.05);
    const ammeter = new MultimeterApparatus('ammeter-dc', 'AMMETER');
    const voltmeter = new MultimeterApparatus('voltmeter-dc', 'VOLTMETER');
    const rheostat = new RheostatApparatus('resistor-dc', 50);
    const switchComp = new SwitchApparatus('switch-dc');

    ammeterRef.current = ammeter;
    voltmeterRef.current = voltmeter;
    switchRef.current = switchComp;

    power.viewNode.x = 220;
    power.viewNode.y = 140;

    switchComp.viewNode.x = 360;
    switchComp.viewNode.y = 140;

    rheostat.viewNode.x = 360;
    rheostat.viewNode.y = 260;

    ammeter.viewNode.x = 200;
    ammeter.viewNode.y = 260;

    voltmeter.viewNode.x = 360;
    voltmeter.viewNode.y = 380;

    renderer.getRootNode().addChild(power.viewNode);
    renderer.getRootNode().addChild(switchComp.viewNode);
    renderer.getRootNode().addChild(rheostat.viewNode);
    renderer.getRootNode().addChild(ammeter.viewNode);
    renderer.getRootNode().addChild(voltmeter.viewNode);

    const panZoomListener = new AnimatedPanZoomListener(renderer.getRootNode());
    renderer.getDisplay().addInputListener(panZoomListener);

    rheostat.setResistance(resistance);
  }, [resistance, supplyVoltage]);

  const updateCircuit = (closed: boolean, u: number, r: number) => {
    if (!closed) {
      ammeterRef.current?.setValue(0);
      voltmeterRef.current?.setValue(0);
      return;
    }
    const I = u / r; // A
    ammeterRef.current?.setValue(I * 1000); // mA
    voltmeterRef.current?.setValue(u); // V
  };

  const handleToggleSwitch = () => {
    if (!switchRef.current) return;
    const newState = switchRef.current.toggle();
    setIsSwitchOn(newState);
    updateCircuit(newState, supplyVoltage, resistance);
  };

  const handleVoltageChange = (newU: number) => {
    setSupplyVoltage(newU);
    if (isSwitchOn) {
      updateCircuit(true, newU, resistance);
    }
  };

  const handleResistanceChange = (newR: number) => {
    setResistance(newR);
    if (isSwitchOn) {
      updateCircuit(true, supplyVoltage, newR);
    }
  };

  const handleRecord = () => {
    if (!isSwitchOn) return;
    const I = supplyVoltage / resistance;
    setDataLogs((prev) => [
      ...prev,
      {
        trial: prev.length + 1,
        U: supplyVoltage,
        R: resistance,
        I: Number((I * 1000).toFixed(1)),
        calculatedR: Number((supplyVoltage / I).toFixed(2)),
      },
    ]);
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
              handleToggleSwitch();
            }}
            className={`px-4 py-2 rounded-lg shadow font-semibold cursor-pointer pointer-events-auto transition-colors ${
              isSwitchOn ? 'bg-rose-600 text-white hover:bg-rose-700' : 'bg-emerald-600 text-white hover:bg-emerald-700'
            }`}
          >
            {isSwitchOn ? '⏹️ Ngắt Khóa K' : '▶️ Đóng Khóa K'}
          </button>
          <button
            type="button"
            onPointerDown={(e) => {
              e.stopPropagation();
              handleRecord();
            }}
            disabled={!isSwitchOn}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow font-semibold hover:bg-blue-700 disabled:opacity-50 cursor-pointer pointer-events-auto"
          >
            📝 Ghi Số Liệu
          </button>
        </div>

        {/* Sliders */}
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur p-4 rounded-xl shadow-lg border border-slate-200 z-10 w-72 flex flex-col gap-3 text-xs">
          <div>
            <div className="flex justify-between font-bold text-slate-800 mb-1">
              <span>Hiệu điện thế U:</span>
              <span className="text-blue-600 font-mono">{supplyVoltage} V</span>
            </div>
            <input
              type="range"
              min="1.5"
              max="12"
              step="1.5"
              value={supplyVoltage}
              onChange={(e) => handleVoltageChange(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>
          <div>
            <div className="flex justify-between font-bold text-slate-800 mb-1">
              <span>Điện trở R:</span>
              <span className="text-emerald-600 font-mono">{resistance} Ω</span>
            </div>
            <input
              type="range"
              min="5"
              max="50"
              step="5"
              value={resistance}
              onChange={(e) => handleResistanceChange(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
          </div>
        </div>

        {/* Instructions */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur p-4 rounded-xl shadow-lg border border-slate-200 pointer-events-none z-10 w-80">
          <h4 className="font-bold text-sm text-slate-800 mb-2">Định luật Ohm cho đoạn mạch</h4>
          <ul className="text-xs text-slate-600 space-y-1">
            <li className="flex items-center gap-2"><span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">1</span> Đóng Khóa K và thay đổi U hoặc R.</li>
            <li className="flex items-center gap-2"><span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">2</span> Đọc Ampe kế I (mA) và Vôn kế U (V).</li>
            <li className="flex items-center gap-2"><span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">3</span> Kiểm chứng công thức I = U / R.</li>
          </ul>
        </div>
      </div>

      {/* Right Table */}
      <div className="w-80 h-full flex flex-col bg-white border border-slate-200 rounded-xl p-4 shadow-sm select-none">
        <h3 className="font-bold text-sm text-slate-800 mb-1">Bảng Định Luật Ohm</h3>
        <p className="text-xs text-slate-500 mb-3">I = U / R ➔ R_đo = U / I</p>

        <div className="flex-1 overflow-y-auto border border-slate-100 rounded-lg">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-2">Lần</th>
                <th className="p-2">U (V)</th>
                <th className="p-2">I (mA)</th>
                <th className="p-2">R (Ω)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {dataLogs.map((row) => (
                <tr key={row.trial} className="hover:bg-slate-50">
                  <td className="p-2 font-bold text-slate-700">{row.trial}</td>
                  <td className="p-2 font-mono text-blue-600">{row.U}</td>
                  <td className="p-2 font-mono text-amber-600">{row.I}</td>
                  <td className="p-2 font-mono font-bold text-emerald-600">{row.calculatedR}</td>
                </tr>
              ))}
              {dataLogs.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-slate-400 italic">
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
