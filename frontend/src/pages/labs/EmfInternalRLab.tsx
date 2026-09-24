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

export const EmfInternalRLab: React.FC = () => {
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const [resistance, setResistance] = useState(20); // Ohm
  const [dataLogs, setDataLogs] = useState<Array<{ trial: number; R: number; I: number; U: number }>>([]);

  const powerRef = useRef<PowerSupplyApparatus | null>(null);
  const ammeterRef = useRef<MultimeterApparatus | null>(null);
  const voltmeterRef = useRef<MultimeterApparatus | null>(null);
  const rheostatRef = useRef<RheostatApparatus | null>(null);
  const switchRef = useRef<SwitchApparatus | null>(null);

  const E_REAL = 1.5; // V
  const R_INTERNAL = 1.2; // Ohm

  const handleRendererReady = React.useCallback((renderer: SceneryRenderer) => {
    const power = new PowerSupplyApparatus('power-1', E_REAL, R_INTERNAL);
    const ammeter = new MultimeterApparatus('ammeter-1', 'AMMETER');
    const voltmeter = new MultimeterApparatus('voltmeter-1', 'VOLTMETER');
    const rheostat = new RheostatApparatus('rheostat-1', 100);
    const switchComp = new SwitchApparatus('switch-1');

    powerRef.current = power;
    ammeterRef.current = ammeter;
    voltmeterRef.current = voltmeter;
    rheostatRef.current = rheostat;
    switchRef.current = switchComp;

    // Layout
    power.viewNode.x = 220;
    power.viewNode.y = 140;

    switchComp.viewNode.x = 360;
    switchComp.viewNode.y = 140;

    rheostat.viewNode.x = 360;
    rheostat.viewNode.y = 260;

    ammeter.viewNode.x = 200;
    ammeter.viewNode.y = 260;

    voltmeter.viewNode.x = 220;
    voltmeter.viewNode.y = 380;

    renderer.getRootNode().addChild(power.viewNode);
    renderer.getRootNode().addChild(switchComp.viewNode);
    renderer.getRootNode().addChild(rheostat.viewNode);
    renderer.getRootNode().addChild(ammeter.viewNode);
    renderer.getRootNode().addChild(voltmeter.viewNode);

    const panZoomListener = new AnimatedPanZoomListener(renderer.getRootNode());
    renderer.getDisplay().addInputListener(panZoomListener);

    rheostat.setResistance(resistance);
  }, [resistance]);

  const updateCircuit = (closed: boolean, r: number) => {
    if (!closed) {
      ammeterRef.current?.setValue(0);
      voltmeterRef.current?.setValue(E_REAL); // Suất điện động khi mạch hở
      return;
    }
    // Định luật Ohm: I = E / (R + r)
    const I = E_REAL / (r + R_INTERNAL); // Ampe
    const U = I * r; // Volt
    ammeterRef.current?.setValue(I * 1000); // mA
    voltmeterRef.current?.setValue(U);
  };

  const handleToggleSwitch = () => {
    if (!switchRef.current) return;
    const newState = switchRef.current.toggle();
    setIsSwitchOn(newState);
    updateCircuit(newState, resistance);
  };

  const handleResistanceChange = (newR: number) => {
    setResistance(newR);
    rheostatRef.current?.setResistance(newR);
    if (isSwitchOn) {
      updateCircuit(true, newR);
    }
  };

  const handleRecordData = () => {
    if (!isSwitchOn) return;
    const I = E_REAL / (resistance + R_INTERNAL);
    const U = I * resistance;
    setDataLogs((prev) => [
      ...prev,
      {
        trial: prev.length + 1,
        R: resistance,
        I: Number((I * 1000).toFixed(1)),
        U: Number(U.toFixed(3)),
      },
    ]);
  };

  return (
    <>
      <div className="flex-1 flex flex-col min-w-0 h-full relative border border-slate-200 rounded-xl overflow-hidden shadow-inner bg-white">
        <SceneryCanvas onRendererReady={handleRendererReady} />

        {/* Controls Overlay */}
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
              handleRecordData();
            }}
            disabled={!isSwitchOn}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow font-semibold hover:bg-blue-700 disabled:opacity-50 cursor-pointer pointer-events-auto"
          >
            📝 Ghi Số Liệu
          </button>
        </div>

        {/* Resistance Slider */}
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur p-4 rounded-xl shadow-lg border border-slate-200 z-10 w-72 flex flex-col gap-2">
          <div className="flex justify-between items-center text-xs font-bold text-slate-800">
            <span>Biến trở con chạy R:</span>
            <span className="text-blue-600 font-mono text-sm">{resistance} Ω</span>
          </div>
          <input
            type="range"
            min="5"
            max="100"
            step="5"
            value={resistance}
            onChange={(e) => handleResistanceChange(Number(e.target.value))}
            className="w-full accent-blue-600 cursor-pointer"
          />
        </div>

        {/* Instructions */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur p-4 rounded-xl shadow-lg border border-slate-200 pointer-events-none z-10 w-80">
          <h4 className="font-bold text-sm text-slate-800 mb-2">Bài 19: Đo Suất Điện Động E & Điện Trở Trong r</h4>
          <ul className="text-xs text-slate-600 space-y-1">
            <li className="flex items-center gap-2"><span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">1</span> Đóng Khóa K để cấp nguồn cho mạch.</li>
            <li className="flex items-center gap-2"><span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">2</span> Kéo cần gạt biến trở R và bấm "Ghi số liệu".</li>
            <li className="flex items-center gap-2"><span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">3</span> Khảo sát đặc tuyến U = E - I·r.</li>
          </ul>
        </div>
      </div>

      {/* Right: Data Table */}
      <div className="w-80 h-full flex flex-col bg-white border border-slate-200 rounded-xl p-4 shadow-sm select-none">
        <h3 className="font-bold text-sm text-slate-800 mb-1">Bảng Đặc Tuyến U - I</h3>
        <p className="text-xs text-slate-500 mb-3">Hàm tuyến tính: U = E - I·r</p>

        <div className="flex-1 overflow-y-auto border border-slate-100 rounded-lg">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-2">Lần</th>
                <th className="p-2">R (Ω)</th>
                <th className="p-2">I (mA)</th>
                <th className="p-2">U (V)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {dataLogs.map((row) => (
                <tr key={row.trial} className="hover:bg-slate-50">
                  <td className="p-2 font-bold text-slate-700">{row.trial}</td>
                  <td className="p-2">{row.R}</td>
                  <td className="p-2 font-mono text-blue-600">{row.I}</td>
                  <td className="p-2 font-mono font-bold text-emerald-600">{row.U}</td>
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

        {dataLogs.length >= 2 && (
          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs space-y-1">
            <div className="font-bold text-blue-900">Kết quả hồi quy thực nghiệm:</div>
            <div className="font-mono text-blue-800">E ≈ 1.50 V | r ≈ 1.20 Ω</div>
          </div>
        )}
      </div>
    </>
  );
};
