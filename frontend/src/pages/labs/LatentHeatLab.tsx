import React, { useRef, useState } from 'react';
import { AnimatedPanZoomListener } from 'scenerystack/scenery';
import { SceneryCanvas } from '../../components/scenerystack/SceneryCanvas.tsx';
import { SceneryRenderer } from '../../engine/scenerystack/SceneryRenderer.ts';
import { CalorimeterApparatus } from '../../engine/scenerystack/apparatus/concrete/ThermalApparatuses.ts';

export const LatentHeatLab: React.FC = () => {
  const [iceMassG, setIceMassG] = useState(50); // 50g nước đá 0°C
  const [waterMassG] = useState(200); // 200g nước 40°C
  const [waterTempInit] = useState(40.0);
  const [finalTemp, setFinalTemp] = useState(18.2);
  const [dataLogs, setDataLogs] = useState<Array<{ trial: number; mIce: number; mWater: number; tInit: number; tFinal: number; lCalculated: number }>>([]);

  const caloRef = useRef<CalorimeterApparatus | null>(null);

  const handleRendererReady = React.useCallback((renderer: SceneryRenderer) => {
    const calo = new CalorimeterApparatus('calo-ice', 40.0);
    caloRef.current = calo;

    calo.viewNode.x = 340;
    calo.viewNode.y = 260;

    renderer.getRootNode().addChild(calo.viewNode);

    const panZoomListener = new AnimatedPanZoomListener(renderer.getRootNode());
    renderer.getDisplay().addInputListener(panZoomListener);
  }, []);

  const handleMeltIce = () => {
    // Q_tỏa = m_nuoc * c * (t_init - t_final)
    // Q_thu = m_da * L + m_da * c * (t_final - 0)
    // L_chuẩn = 3.34 * 10^5 J/kg
    const c = 4180;
    const m_w = waterMassG / 1000;
    const m_ice = iceMassG / 1000;
    const L_real = 334000;

    // t_final = (m_w * c * tInit - m_ice * L_real) / ((m_w + m_ice) * c)
    const t_f = (m_w * c * waterTempInit - m_ice * L_real) / ((m_w + m_ice) * c);
    const clampedTf = Math.max(0, t_f);

    setFinalTemp(Number(clampedTf.toFixed(1)));
    caloRef.current?.setTemperature(clampedTf);

    // Tính ngược lại L từ số liệu
    const Q_toa = m_w * c * (waterTempInit - clampedTf);
    const Q_nuoc_da_tang = m_ice * c * clampedTf;
    const L_calc = (Q_toa - Q_nuoc_da_tang) / m_ice;

    setDataLogs((prev) => [
      ...prev,
      {
        trial: prev.length + 1,
        mIce: iceMassG,
        mWater: waterMassG,
        tInit: waterTempInit,
        tFinal: Number(clampedTf.toFixed(1)),
        lCalculated: Number((L_calc / 1000).toFixed(0)), // kJ/kg
      },
    ]);
  };

  const handleReset = () => {
    setFinalTemp(waterTempInit);
    caloRef.current?.setTemperature(waterTempInit);
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
              handleMeltIce();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow font-semibold hover:bg-blue-700 cursor-pointer pointer-events-auto"
          >
            🧊 Thả Nước Đá Vào Bình
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

        {/* Ice Mass Option */}
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur p-4 rounded-xl shadow-lg border border-slate-200 z-10 w-72 flex flex-col gap-2 text-xs">
          <div className="flex justify-between font-bold text-slate-800">
            <span>Khối lượng đá m_đá:</span>
            <span className="text-blue-600 font-mono">{iceMassG} g (0°C)</span>
          </div>
          <select
            value={iceMassG}
            onChange={(e) => setIceMassG(Number(e.target.value))}
            className="w-full px-2 py-1.5 bg-slate-100 border border-slate-200 rounded outline-none"
          >
            <option value={30}>30 g</option>
            <option value={50}>50 g</option>
            <option value={70}>70 g</option>
          </select>
        </div>

        {/* Instructions */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur p-4 rounded-xl shadow-lg border border-slate-200 pointer-events-none z-10 w-80">
          <h4 className="font-bold text-sm text-slate-800 mb-2">Bài 4: Đo nhiệt nóng chảy của nước đá</h4>
          <ul className="text-xs text-slate-600 space-y-1">
            <li className="flex items-center gap-2"><span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">1</span> Thả nước đá 0°C vào nước ấm 40°C.</li>
            <li className="flex items-center gap-2"><span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">2</span> Đọc nhiệt độ cân bằng cuối cùng T_final = {finalTemp}°C.</li>
            <li className="flex items-center gap-2"><span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">3</span> Tính nhiệt nóng chảy: L ≈ 334 kJ/kg.</li>
          </ul>
        </div>
      </div>

      {/* Right Data Table */}
      <div className="w-80 h-full flex flex-col bg-white border border-slate-200 rounded-xl p-4 shadow-sm select-none">
        <h3 className="font-bold text-sm text-slate-800 mb-1">Bảng Nhiệt Nóng Chảy</h3>
        <p className="text-xs text-slate-500 mb-3">Q_tỏa = Q_thu ➔ L (kJ/kg)</p>

        <div className="flex-1 overflow-y-auto border border-slate-100 rounded-lg">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-2">Lần</th>
                <th className="p-2">m_đá</th>
                <th className="p-2">T_đầu</th>
                <th className="p-2">T_cuối</th>
                <th className="p-2">L (kJ/kg)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {dataLogs.map((row) => (
                <tr key={row.trial} className="hover:bg-slate-50">
                  <td className="p-2 font-bold text-slate-700">{row.trial}</td>
                  <td className="p-2">{row.mIce}g</td>
                  <td className="p-2 font-mono text-rose-600">{row.tInit}°C</td>
                  <td className="p-2 font-mono text-blue-600">{row.tFinal}°C</td>
                  <td className="p-2 font-mono font-bold text-emerald-600">{row.lCalculated}</td>
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
