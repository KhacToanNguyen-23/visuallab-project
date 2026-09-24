import React, { useRef, useState } from 'react';
import { AnimatedPanZoomListener } from 'scenerystack/scenery';
import { SceneryCanvas } from '../../components/scenerystack/SceneryCanvas.tsx';
import { SceneryRenderer } from '../../engine/scenerystack/SceneryRenderer.ts';
import {
  LaserApparatus,
  YoungSlitApparatus,
  FringeScreenApparatus,
} from '../../engine/scenerystack/apparatus/concrete/OpticsApparatuses.ts';

export const YoungInterferenceLab: React.FC = () => {
  const [wavelengthNm, setWavelengthNm] = useState(650); // nm (Đỏ)
  const [slitDistanceMm, setSlitDistanceMm] = useState(0.5); // mm
  const [screenDistanceM, setScreenDistanceM] = useState(1.0); // m
  const [caliperPosMm, setCaliperPosMm] = useState(0); // mm
  const [dataLogs, setDataLogs] = useState<Array<{ trial: number; lambda: number; a: number; D: number; iMeasured: number; lambdaCalc: number }>>([]);

  const laserRef = useRef<LaserApparatus | null>(null);
  const slitRef = useRef<YoungSlitApparatus | null>(null);
  const screenRef = useRef<FringeScreenApparatus | null>(null);

  const handleRendererReady = React.useCallback((renderer: SceneryRenderer) => {
    const laser = new LaserApparatus('laser-1', wavelengthNm);
    const slit = new YoungSlitApparatus('slit-1', slitDistanceMm);
    const screen = new FringeScreenApparatus('screen-1');

    laserRef.current = laser;
    slitRef.current = slit;
    screenRef.current = screen;

    laser.viewNode.x = 140;
    laser.viewNode.y = 260;

    slit.viewNode.x = 280;
    slit.viewNode.y = 260;

    screen.viewNode.x = 450;
    screen.viewNode.y = 260;

    renderer.getRootNode().addChild(laser.viewNode);
    renderer.getRootNode().addChild(slit.viewNode);
    renderer.getRootNode().addChild(screen.viewNode);

    const panZoomListener = new AnimatedPanZoomListener(renderer.getRootNode());
    renderer.getDisplay().addInputListener(panZoomListener);

    screen.viewNode.renderFringes(wavelengthNm, slitDistanceMm, screenDistanceM);
  }, [screenDistanceM, slitDistanceMm, wavelengthNm]);

  const updateInterference = (lambda: number, a: number, d: number) => {
    screenRef.current?.viewNode.renderFringes(lambda, a, d);
  };

  const handleWavelengthChange = (val: number) => {
    setWavelengthNm(val);
    laserRef.current?.setWavelength(val);
    updateInterference(val, slitDistanceMm, screenDistanceM);
  };

  const handleSlitDistChange = (val: number) => {
    setSlitDistanceMm(val);
    slitRef.current?.setSlitDistance(val);
    updateInterference(wavelengthNm, val, screenDistanceM);
  };

  const handleScreenDistChange = (val: number) => {
    setScreenDistanceM(val);
    updateInterference(wavelengthNm, slitDistanceMm, val);
  };

  const handleCaliperChange = (val: number) => {
    setCaliperPosMm(val);
    screenRef.current?.setCaliperPosition(val);
  };

  const handleRecord = () => {
    // Khoảng vân lý thuyết i = lambda * D / a
    const i_theory = (wavelengthNm * 1e-6 * screenDistanceM * 1000) / slitDistanceMm;
    const lambda_calc = (slitDistanceMm * i_theory) / screenDistanceM; // 1e6 -> nm

    setDataLogs((prev) => [
      ...prev,
      {
        trial: prev.length + 1,
        lambda: wavelengthNm,
        a: slitDistanceMm,
        D: screenDistanceM,
        iMeasured: Number(i_theory.toFixed(3)),
        lambdaCalc: Number((lambda_calc).toFixed(0)),
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
              handleRecord();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow font-semibold hover:bg-blue-700 cursor-pointer pointer-events-auto"
          >
            📝 Ghi Khoảng Vân i
          </button>
        </div>

        {/* Optical Parameters Slider */}
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur p-4 rounded-xl shadow-lg border border-slate-200 z-10 w-72 flex flex-col gap-3 text-xs">
          <div>
            <div className="flex justify-between font-bold text-slate-800 mb-1">
              <span>Bước sóng Laser λ:</span>
              <span className="font-mono text-blue-600">{wavelengthNm} nm</span>
            </div>
            <div className="flex gap-1.5">
              {[
                { label: 'Đỏ', val: 650, color: 'bg-red-500' },
                { label: 'Lục', val: 532, color: 'bg-emerald-500' },
                { label: 'Lam', val: 450, color: 'bg-blue-500' },
              ].map((b) => (
                <button
                  key={b.val}
                  type="button"
                  onPointerDown={(e) => {
                    e.stopPropagation();
                    handleWavelengthChange(b.val);
                  }}
                  className={`flex-1 py-1 rounded text-white text-[11px] font-bold ${b.color} ${
                    wavelengthNm === b.val ? 'ring-2 ring-slate-900 ring-offset-1' : 'opacity-80 hover:opacity-100'
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between font-bold text-slate-800 mb-1">
              <span>Khoảng cách 2 khe a:</span>
              <span className="font-mono text-emerald-600">{slitDistanceMm} mm</span>
            </div>
            <input
              type="range"
              min="0.2"
              max="1.0"
              step="0.1"
              value={slitDistanceMm}
              onChange={(e) => handleSlitDistChange(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between font-bold text-slate-800 mb-1">
              <span>Khoảng cách đến màn D:</span>
              <span className="font-mono text-purple-600">{screenDistanceM} m</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.1"
              value={screenDistanceM}
              onChange={(e) => handleScreenDistChange(Number(e.target.value))}
              className="w-full accent-purple-600 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between font-bold text-slate-800 mb-1">
              <span>Thước kẹp đo vi sai:</span>
              <span className="font-mono text-amber-600">{caliperPosMm.toFixed(2)} mm</span>
            </div>
            <input
              type="range"
              min="-6"
              max="6"
              step="0.1"
              value={caliperPosMm}
              onChange={(e) => handleCaliperChange(Number(e.target.value))}
              className="w-full accent-amber-600 cursor-pointer"
            />
          </div>
        </div>

        {/* Instructions */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur p-4 rounded-xl shadow-lg border border-slate-200 pointer-events-none z-10 w-80">
          <h4 className="font-bold text-sm text-slate-800 mb-2">Bài 12: Đo bước sóng ánh sáng (Khe Y-âng)</h4>
          <ul className="text-xs text-slate-600 space-y-1">
            <li className="flex items-center gap-2"><span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">1</span> Chọn bước sóng Laser (Đỏ, Lục, Lam).</li>
            <li className="flex items-center gap-2"><span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">2</span> Dùng thước kẹp vàng đo khoảng vân i giữa các vân sáng.</li>
            <li className="flex items-center gap-2"><span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">3</span> Tính bước sóng: λ = (a · i) / D.</li>
          </ul>
        </div>
      </div>

      {/* Right Data Table */}
      <div className="w-80 h-full flex flex-col bg-white border border-slate-200 rounded-xl p-4 shadow-sm select-none">
        <h3 className="font-bold text-sm text-slate-800 mb-1">Bảng Giao Thoa Sóng</h3>
        <p className="text-xs text-slate-500 mb-3">λ = (a · i) / D</p>

        <div className="flex-1 overflow-y-auto border border-slate-100 rounded-lg">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-2">Lần</th>
                <th className="p-2">a (mm)</th>
                <th className="p-2">D (m)</th>
                <th className="p-2">i (mm)</th>
                <th className="p-2">λ (nm)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {dataLogs.map((row) => (
                <tr key={row.trial} className="hover:bg-slate-50">
                  <td className="p-2 font-bold text-slate-700">{row.trial}</td>
                  <td className="p-2">{row.a}</td>
                  <td className="p-2">{row.D}</td>
                  <td className="p-2 font-mono text-blue-600">{row.iMeasured}</td>
                  <td className="p-2 font-mono font-bold text-emerald-600">{row.lambdaCalc}</td>
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
