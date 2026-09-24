import React, { useRef, useState } from 'react';
import { AnimatedPanZoomListener } from 'scenerystack/scenery';
import { SceneryCanvas } from '../../components/scenerystack/SceneryCanvas.tsx';
import { SceneryRenderer } from '../../engine/scenerystack/SceneryRenderer.ts';
import {
  GasPistonApparatus,
  PressureGaugeApparatus,
} from '../../engine/scenerystack/apparatus/concrete/ThermalApparatuses.ts';

export const BoyleMariotteLab: React.FC = () => {
  const [volumeCm3, setVolumeCm3] = useState(60.0);
  const [dataLogs, setDataLogs] = useState<Array<{ trial: number; V: number; P: number; pV: number }>>([]);

  const pistonRef = useRef<GasPistonApparatus | null>(null);
  const gaugeRef = useRef<PressureGaugeApparatus | null>(null);

  const CONST_PV = 60.0; // bar * cm3 (ở V=60cm3 thì P=1.0bar)

  const handleRendererReady = React.useCallback((renderer: SceneryRenderer) => {
    const piston = new GasPistonApparatus('piston-1', volumeCm3);
    const gauge = new PressureGaugeApparatus('gauge-1');

    pistonRef.current = piston;
    gaugeRef.current = gauge;

    piston.viewNode.x = 280;
    piston.viewNode.y = 260;

    gauge.viewNode.x = 440;
    gauge.viewNode.y = 260;

    renderer.getRootNode().addChild(piston.viewNode);
    renderer.getRootNode().addChild(gauge.viewNode);

    const panZoomListener = new AnimatedPanZoomListener(renderer.getRootNode());
    renderer.getDisplay().addInputListener(panZoomListener);

    piston.setVolume(volumeCm3);
    gauge.setPressure(CONST_PV / volumeCm3);
  }, [volumeCm3]);

  const handleVolumeChange = (v: number) => {
    setVolumeCm3(v);
    pistonRef.current?.setVolume(v);
    const p = CONST_PV / v;
    gaugeRef.current?.setPressure(p);
  };

  const handleRecord = () => {
    const p = CONST_PV / volumeCm3;
    const pV = p * volumeCm3;
    setDataLogs((prev) => [
      ...prev,
      {
        trial: prev.length + 1,
        V: volumeCm3,
        P: Number(p.toFixed(2)),
        pV: Number(pV.toFixed(1)),
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
              handleRecord();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow font-semibold hover:bg-blue-700 cursor-pointer pointer-events-auto"
          >
            📝 Ghi Trạng Thái (P, V)
          </button>
        </div>

        {/* Piston Volume Slider */}
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur p-4 rounded-xl shadow-lg border border-slate-200 z-10 w-72 flex flex-col gap-2 text-xs">
          <div className="flex justify-between font-bold text-slate-800">
            <span>Thể tích khí V:</span>
            <span className="text-blue-600 font-mono text-sm">{volumeCm3.toFixed(1)} cm³</span>
          </div>
          <input
            type="range"
            min="20"
            max="100"
            step="5"
            value={volumeCm3}
            onChange={(e) => handleVolumeChange(Number(e.target.value))}
            className="w-full accent-blue-600 cursor-pointer"
          />
        </div>

        {/* Instructions */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur p-4 rounded-xl shadow-lg border border-slate-200 pointer-events-none z-10 w-80">
          <h4 className="font-bold text-sm text-slate-800 mb-2">Bài 7: Quá trình đẳng nhiệt (Boyle - Mariotte)</h4>
          <ul className="text-xs text-slate-600 space-y-1">
            <li className="flex items-center gap-2"><span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">1</span> Kéo cần nén piston để giảm thể tích V.</li>
            <li className="flex items-center gap-2"><span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">2</span> Đọc áp kế P tăng tương ứng.</li>
            <li className="flex items-center gap-2"><span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">3</span> Kiểm chứng định luật: P · V = const.</li>
          </ul>
        </div>
      </div>

      {/* Right Data Table */}
      <div className="w-80 h-full flex flex-col bg-white border border-slate-200 rounded-xl p-4 shadow-sm select-none">
        <h3 className="font-bold text-sm text-slate-800 mb-1">Bảng Đẳng Nhiệt</h3>
        <p className="text-xs text-slate-500 mb-3">P · V = hằng số</p>

        <div className="flex-1 overflow-y-auto border border-slate-100 rounded-lg">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-2">Lần</th>
                <th className="p-2">V (cm³)</th>
                <th className="p-2">P (bar)</th>
                <th className="p-2">P·V</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {dataLogs.map((row) => (
                <tr key={row.trial} className="hover:bg-slate-50">
                  <td className="p-2 font-bold text-slate-700">{row.trial}</td>
                  <td className="p-2">{row.V}</td>
                  <td className="p-2 font-mono text-rose-600">{row.P}</td>
                  <td className="p-2 font-mono font-bold text-emerald-600">{row.pV}</td>
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
