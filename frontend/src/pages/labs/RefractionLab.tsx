import React, { useRef, useState } from 'react';
import { AnimatedPanZoomListener } from 'scenerystack/scenery';
import { SceneryCanvas } from '../../components/scenerystack/SceneryCanvas.tsx';
import { SceneryRenderer } from '../../engine/scenerystack/SceneryRenderer.ts';
import { GlassRefractorApparatus } from '../../engine/scenerystack/apparatus/concrete/OpticsApparatuses.ts';

export const RefractionLab: React.FC = () => {
  const [incidentAngleDeg, setIncidentAngleDeg] = useState(30);
  const [dataLogs, setDataLogs] = useState<Array<{ trial: number; angleI: number; angleR: number; sinI: number; sinR: number; nCalculated: number }>>([]);

  const refractorRef = useRef<GlassRefractorApparatus | null>(null);

  const handleRendererReady = React.useCallback((renderer: SceneryRenderer) => {
    const refractor = new GlassRefractorApparatus('refractor-1', 1.5);
    refractorRef.current = refractor;

    refractor.viewNode.x = 340;
    refractor.viewNode.y = 260;

    renderer.getRootNode().addChild(refractor.viewNode);

    const panZoomListener = new AnimatedPanZoomListener(renderer.getRootNode());
    renderer.getDisplay().addInputListener(panZoomListener);

    refractor.setAngle(incidentAngleDeg);
  }, [incidentAngleDeg]);

  const handleAngleChange = (angle: number) => {
    setIncidentAngleDeg(angle);
    refractorRef.current?.setAngle(angle);
  };

  const handleRecord = () => {
    const nMedium = 1.5;
    const radI = (incidentAngleDeg * Math.PI) / 180;
    const sinI = Math.sin(radI);
    const sinR = sinI / nMedium;
    const radR = Math.asin(sinR);
    const degR = (radR * 180) / Math.PI;

    setDataLogs((prev) => [
      ...prev,
      {
        trial: prev.length + 1,
        angleI: incidentAngleDeg,
        angleR: Number(degR.toFixed(1)),
        sinI: Number(sinI.toFixed(3)),
        sinR: Number(sinR.toFixed(3)),
        nCalculated: Number((sinI / sinR).toFixed(3)),
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
            📝 Ghi Góc Khúc Xạ
          </button>
        </div>

        {/* Angle Slider */}
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur p-4 rounded-xl shadow-lg border border-slate-200 z-10 w-72 flex flex-col gap-2 text-xs">
          <div className="flex justify-between font-bold text-slate-800">
            <span>Góc tới i (°):</span>
            <span className="text-blue-600 font-mono text-sm">{incidentAngleDeg}°</span>
          </div>
          <input
            type="range"
            min="0"
            max="80"
            step="5"
            value={incidentAngleDeg}
            onChange={(e) => handleAngleChange(Number(e.target.value))}
            className="w-full accent-blue-600 cursor-pointer"
          />
        </div>

        {/* Instructions */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur p-4 rounded-xl shadow-lg border border-slate-200 pointer-events-none z-10 w-80">
          <h4 className="font-bold text-sm text-slate-800 mb-2">Bài 21: Đo chiết suất của nước & Khúc xạ</h4>
          <ul className="text-xs text-slate-600 space-y-1">
            <li className="flex items-center gap-2"><span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">1</span> Xoay góc tới i trên đĩa chia độ tròn.</li>
            <li className="flex items-center gap-2"><span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">2</span> Đọc góc khúc xạ r của tia ló.</li>
            <li className="flex items-center gap-2"><span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">3</span> Tính chiết suất: n = sin(i) / sin(r).</li>
          </ul>
        </div>
      </div>

      {/* Right Data Table */}
      <div className="w-80 h-full flex flex-col bg-white border border-slate-200 rounded-xl p-4 shadow-sm select-none">
        <h3 className="font-bold text-sm text-slate-800 mb-1">Bảng Khúc Xạ Ánh Sáng</h3>
        <p className="text-xs text-slate-500 mb-3">n = sin(i) / sin(r)</p>

        <div className="flex-1 overflow-y-auto border border-slate-100 rounded-lg">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-2">Lần</th>
                <th className="p-2">i (°)</th>
                <th className="p-2">r (°)</th>
                <th className="p-2">sin i / sin r</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {dataLogs.map((row) => (
                <tr key={row.trial} className="hover:bg-slate-50">
                  <td className="p-2 font-bold text-slate-700">{row.trial}</td>
                  <td className="p-2">{row.angleI}°</td>
                  <td className="p-2 font-mono text-blue-600">{row.angleR}°</td>
                  <td className="p-2 font-mono font-bold text-emerald-600">{row.nCalculated}</td>
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
