import React, { useRef, useState } from 'react';
import { AnimatedPanZoomListener } from 'scenerystack/scenery';
import { SceneryCanvas } from '../../components/scenerystack/SceneryCanvas.tsx';
import { SceneryRenderer } from '../../engine/scenerystack/SceneryRenderer.ts';
import { AirTrackApparatus } from '../../engine/scenerystack/apparatus/concrete/AirTrackApparatus.ts';
import { GliderView } from '../../engine/scenerystack/apparatus/mechanics/GliderView.ts';
import { LabDeviceModel } from '../../engine/scenerystack/core/models/LabDeviceModel.ts';

export const MomentumCollisionLab: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [m1, setM1] = useState(0.2); // kg
  const [m2, setM2] = useState(0.2); // kg
  const [v1Init] = useState(0.8); // m/s
  const [collisionType, setCollisionType] = useState<'ELASTIC' | 'INELASTIC'>('ELASTIC');
  const [dataLogs, setDataLogs] = useState<Array<{ trial: number; pBefore: number; pAfter: number; errorPercent: number }>>([]);

  const glider1ModelRef = useRef<LabDeviceModel>(new LabDeviceModel());
  const glider2ModelRef = useRef<LabDeviceModel>(new LabDeviceModel());
  const glider1ViewRef = useRef<GliderView | null>(null);
  const glider2ViewRef = useRef<GliderView | null>(null);

  const stateRef = useRef<{ x1: number; x2: number; v1: number; v2: number }>({
    x1: 200,
    x2: 400,
    v1: 0,
    v2: 0,
  });

  const handleRendererReady = React.useCallback((renderer: SceneryRenderer) => {
    const track = new AirTrackApparatus('air-track-1');
    track.viewNode.x = 350;
    track.viewNode.y = 280;

    const g1View = new GliderView(glider1ModelRef.current, 'Xe 1', '#3B82F6');
    const g2View = new GliderView(glider2ModelRef.current, 'Xe 2', '#EF4444');
    glider1ViewRef.current = g1View;
    glider2ViewRef.current = g2View;

    g1View.x = stateRef.current.x1;
    g1View.y = 256;
    g2View.x = stateRef.current.x2;
    g2View.y = 256;

    renderer.getRootNode().addChild(track.viewNode);
    renderer.getRootNode().addChild(g1View);
    renderer.getRootNode().addChild(g2View);

    const panZoomListener = new AnimatedPanZoomListener(renderer.getRootNode());
    renderer.getDisplay().addInputListener(panZoomListener);

    renderer.addUpdateListener((dt) => {
      const s = stateRef.current;
      if (s.v1 !== 0 || s.v2 !== 0) {
        s.x1 += s.v1 * dt * 200;
        s.x2 += s.v2 * dt * 200;

        // Check collision between Glider 1 & 2 (distance = 70px)
        if (s.x2 - s.x1 <= 70 && s.v1 > s.v2) {
          if (collisionType === 'ELASTIC') {
            const v1New = ((m1 - m2) * s.v1 + 2 * m2 * s.v2) / (m1 + m2);
            const v2New = (2 * m1 * s.v1 + (m2 - m1) * s.v2) / (m1 + m2);
            s.v1 = v1New;
            s.v2 = v2New;
          } else {
            const vCommon = (m1 * s.v1 + m2 * s.v2) / (m1 + m2);
            s.v1 = vCommon;
            s.v2 = vCommon;
          }
        }

        // Boundary check
        if (s.x2 > 620 || s.x1 < 80) {
          s.v1 = 0;
          s.v2 = 0;
          setIsRunning(false);
        }

        if (glider1ViewRef.current && glider2ViewRef.current) {
          glider1ViewRef.current.x = s.x1;
          glider2ViewRef.current.x = s.x2;
        }
      }
    });
  }, [collisionType, m1, m2]);

  const handleLaunch = () => {
    if (isRunning) return;
    setIsRunning(true);
    stateRef.current = {
      x1: 150,
      x2: 380,
      v1: v1Init,
      v2: 0,
    };

    const pBefore = m1 * v1Init;
    let pAfter = 0;
    if (collisionType === 'ELASTIC') {
      const v1New = ((m1 - m2) * v1Init) / (m1 + m2);
      const v2New = (2 * m1 * v1Init) / (m1 + m2);
      pAfter = m1 * v1New + m2 * v2New;
    } else {
      const vCommon = (m1 * v1Init) / (m1 + m2);
      pAfter = (m1 + m2) * vCommon;
    }

    const err = Math.abs(pAfter - pBefore) / pBefore * 100;
    setDataLogs((prev) => [
      ...prev,
      {
        trial: prev.length + 1,
        pBefore: Number(pBefore.toFixed(3)),
        pAfter: Number(pAfter.toFixed(3)),
        errorPercent: Number(err.toFixed(1)),
      },
    ]);
  };

  const handleReset = () => {
    setIsRunning(false);
    stateRef.current = { x1: 200, x2: 400, v1: 0, v2: 0 };
    if (glider1ViewRef.current && glider2ViewRef.current) {
      glider1ViewRef.current.x = 200;
      glider2ViewRef.current.x = 400;
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
              handleLaunch();
            }}
            disabled={isRunning}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow font-semibold hover:bg-blue-700 disabled:opacity-50 cursor-pointer pointer-events-auto"
          >
            {isRunning ? 'Đang Chuyển Động...' : '▶️ Bắn Xe 1'}
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

        {/* Parameters Panel */}
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur p-3 rounded-xl shadow-lg border border-slate-200 z-10 flex flex-col gap-2 text-xs font-semibold w-64">
          <div className="flex justify-between items-center">
            <span>Loại va chạm:</span>
            <select
              value={collisionType}
              onChange={(e) => setCollisionType(e.target.value as 'ELASTIC' | 'INELASTIC')}
              className="px-2 py-1 bg-slate-100 border border-slate-200 rounded outline-none"
            >
              <option value="ELASTIC">Đàn hồi (Lò xo lá)</option>
              <option value="INELASTIC">Mềm (Dính nhau)</option>
            </select>
          </div>
          <div className="flex justify-between items-center">
            <span>Khối lượng m1:</span>
            <select
              value={m1}
              onChange={(e) => setM1(Number(e.target.value))}
              className="px-2 py-1 bg-slate-100 border border-slate-200 rounded outline-none"
            >
              <option value={0.2}>200g</option>
              <option value={0.4}>400g</option>
            </select>
          </div>
          <div className="flex justify-between items-center">
            <span>Khối lượng m2:</span>
            <select
              value={m2}
              onChange={(e) => setM2(Number(e.target.value))}
              className="px-2 py-1 bg-slate-100 border border-slate-200 rounded outline-none"
            >
              <option value={0.2}>200g</option>
              <option value={0.4}>400g</option>
            </select>
          </div>
        </div>

        {/* Instructions */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur p-4 rounded-xl shadow-lg border border-slate-200 pointer-events-none z-10 w-80">
          <h4 className="font-bold text-sm text-slate-800 mb-2">Bài 30: Khảo sát Động lượng & Va chạm</h4>
          <ul className="text-xs text-slate-600 space-y-1">
            <li className="flex items-center gap-2"><span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">1</span> Chọn loại va chạm và khối lượng 2 xe.</li>
            <li className="flex items-center gap-2"><span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">2</span> Bắn xe 1 chuyển động va chạm vào xe 2.</li>
            <li className="flex items-center gap-2"><span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">3</span> Kiểm tra định luật bảo toàn động lượng: p_trước = p_sau.</li>
          </ul>
        </div>
      </div>

      {/* Right Data Table */}
      <div className="w-80 h-full flex flex-col bg-white border border-slate-200 rounded-xl p-4 shadow-sm select-none">
        <h3 className="font-bold text-sm text-slate-800 mb-1">Bảng Động Lượng</h3>
        <p className="text-xs text-slate-500 mb-3">Kiểm chứng bảo toàn động lượng</p>

        <div className="flex-1 overflow-y-auto border border-slate-100 rounded-lg">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-2">Lần</th>
                <th className="p-2">p Trước (kg·m/s)</th>
                <th className="p-2">p Sau (kg·m/s)</th>
                <th className="p-2">Sai số</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {dataLogs.map((row) => (
                <tr key={row.trial} className="hover:bg-slate-50">
                  <td className="p-2 font-bold text-slate-700">{row.trial}</td>
                  <td className="p-2 font-mono">{row.pBefore}</td>
                  <td className="p-2 font-mono text-blue-600">{row.pAfter}</td>
                  <td className="p-2 font-mono font-bold text-emerald-600">{row.errorPercent}%</td>
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
