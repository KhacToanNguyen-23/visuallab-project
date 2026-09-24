import React, { useRef, useState } from 'react';
import { AnimatedPanZoomListener } from 'scenerystack/scenery';
import { SceneryCanvas } from '../../components/scenerystack/SceneryCanvas.tsx';
import { SceneryRenderer } from '../../engine/scenerystack/SceneryRenderer.ts';
import {
  BarMagnetView,
  InductionCoilView,
  MeterView,
} from '../../engine/scenerystack/apparatus/circuits/CircuitViews.ts';

export const ElectromagneticInductionLab: React.FC = () => {
  const [magnetSpeed, setMagnetSpeed] = useState<'SLOW' | 'FAST'>('FAST');
  const [dataLogs, setDataLogs] = useState<Array<{ trial: number; action: string; inducedCurrent: number; direction: string }>>([]);

  const magnetViewRef = useRef<BarMagnetView | null>(null);
  const galvanometerViewRef = useRef<MeterView | null>(null);
  const animIntervalRef = useRef<number | null>(null);

  const handleRendererReady = React.useCallback((renderer: SceneryRenderer) => {
    const coil = new InductionCoilView();
    const magnet = new BarMagnetView();
    const galvo = new MeterView('GALVANOMETER');

    magnetViewRef.current = magnet;
    galvanometerViewRef.current = galvo;

    coil.x = 350;
    coil.y = 260;

    magnet.x = 180;
    magnet.y = 260;

    galvo.x = 350;
    galvo.y = 390;

    renderer.getRootNode().addChild(coil);
    renderer.getRootNode().addChild(magnet);
    renderer.getRootNode().addChild(galvo);

    const panZoomListener = new AnimatedPanZoomListener(renderer.getRootNode());
    renderer.getDisplay().addInputListener(panZoomListener);
  }, []);

  const moveMagnet = (direction: 'INTO' | 'OUT') => {
    if (animIntervalRef.current) clearInterval(animIntervalRef.current);
    const speedFactor = magnetSpeed === 'FAST' ? 2 : 1;
    const currentVal = direction === 'INTO' ? 25.0 * speedFactor : -25.0 * speedFactor;

    galvanometerViewRef.current?.setValue(currentVal, 'μA');

    let step = 0;
    animIntervalRef.current = window.setInterval(() => {
      step++;
      if (magnetViewRef.current) {
        magnetViewRef.current.x += direction === 'INTO' ? 4 * speedFactor : -4 * speedFactor;
      }
      if (step > 25 / speedFactor) {
        if (animIntervalRef.current) clearInterval(animIntervalRef.current);
        galvanometerViewRef.current?.setValue(0, 'μA');
        setDataLogs((prev) => [
          ...prev,
          {
            trial: prev.length + 1,
            action: direction === 'INTO' ? 'Đâm nam châm vào cuộn dây' : 'Rút nam châm ra xa',
            inducedCurrent: currentVal,
            direction: direction === 'INTO' ? 'Thuận chiều (+)' : 'Ngược chiều (-)',
          },
        ]);
      }
    }, 30);
  };

  const handleReset = () => {
    if (animIntervalRef.current) clearInterval(animIntervalRef.current);
    if (magnetViewRef.current) {
      magnetViewRef.current.x = 180;
      galvanometerViewRef.current?.setValue(0, 'μA');
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
              moveMagnet('INTO');
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow font-semibold hover:bg-blue-700 cursor-pointer pointer-events-auto"
          >
            ➡️ Đâm Nam Châm Vào
          </button>
          <button
            type="button"
            onPointerDown={(e) => {
              e.stopPropagation();
              moveMagnet('OUT');
            }}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow font-semibold hover:bg-indigo-700 cursor-pointer pointer-events-auto"
          >
            ⬅️ Rút Nam Châm Ra
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

        {/* Speed Option */}
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur p-3 rounded-xl shadow-lg border border-slate-200 z-10 flex gap-2 items-center text-xs font-semibold">
          <span>Tốc độ chuyển động:</span>
          <button
            type="button"
            onPointerDown={(e) => {
              e.stopPropagation();
              setMagnetSpeed('SLOW');
            }}
            className={`px-3 py-1 rounded border ${
              magnetSpeed === 'SLOW' ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 text-slate-700'
            }`}
          >
            Chậm
          </button>
          <button
            type="button"
            onPointerDown={(e) => {
              e.stopPropagation();
              setMagnetSpeed('FAST');
            }}
            className={`px-3 py-1 rounded border ${
              magnetSpeed === 'FAST' ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 text-slate-700'
            }`}
          >
            Nhanh
          </button>
        </div>

        {/* Instructions */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur p-4 rounded-xl shadow-lg border border-slate-200 pointer-events-none z-10 w-80">
          <h4 className="font-bold text-sm text-slate-800 mb-2">Bài 12: Khảo sát Hiện tượng Cảm ứng điện từ</h4>
          <ul className="text-xs text-slate-600 space-y-1">
            <li className="flex items-center gap-2"><span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">1</span> Đâm nam châm vào cuộn dây ➔ Kim điện kế G lệch sang phải.</li>
            <li className="flex items-center gap-2"><span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">2</span> Giữ nam châm đứng yên ➔ Dòng điện cảm ứng i = 0.</li>
            <li className="flex items-center gap-2"><span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">3</span> Rút nam châm ra ➔ Kim điện kế G lệch sang trái.</li>
          </ul>
        </div>
      </div>

      {/* Right Data Table */}
      <div className="w-80 h-full flex flex-col bg-white border border-slate-200 rounded-xl p-4 shadow-sm select-none">
        <h3 className="font-bold text-sm text-slate-800 mb-1">Bảng Dòng Cảm Ứng</h3>
        <p className="text-xs text-slate-500 mb-3">Định luật Faraday: e_c = - dΦ/dt</p>

        <div className="flex-1 overflow-y-auto border border-slate-100 rounded-lg">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-2">Lần</th>
                <th className="p-2">Thao tác</th>
                <th className="p-2">i (μA)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {dataLogs.map((row) => (
                <tr key={row.trial} className="hover:bg-slate-50">
                  <td className="p-2 font-bold text-slate-700">{row.trial}</td>
                  <td className="p-2">{row.action}</td>
                  <td className={`p-2 font-mono font-bold ${row.inducedCurrent > 0 ? 'text-blue-600' : 'text-rose-600'}`}>
                    {row.inducedCurrent > 0 ? `+${row.inducedCurrent}` : row.inducedCurrent}
                  </td>
                </tr>
              ))}
              {dataLogs.length === 0 && (
                <tr>
                  <td colSpan={3} className="p-4 text-center text-slate-400 italic">
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
