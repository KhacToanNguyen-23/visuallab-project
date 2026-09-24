import React, { useRef, useState } from 'react';
import { AnimatedPanZoomListener } from 'scenerystack/scenery';
import { SceneryCanvas } from '../../components/scenerystack/SceneryCanvas.tsx';
import { SceneryRenderer } from '../../engine/scenerystack/SceneryRenderer.ts';
import { ResonanceTubeApparatus } from '../../engine/scenerystack/apparatus/concrete/OpticsApparatuses.ts';

export const SoundResonanceLab: React.FC = () => {
  const [frequencyHz, setFrequencyHz] = useState(500); // Hz
  const [airLengthCm, setAirLengthCm] = useState(17.0); // L1 = lambda / 4 = 340 / (4 * 500) = 0.17m = 17cm
  const [dataLogs, setDataLogs] = useState<Array<{ trial: number; f: number; L1: number; L2: number; lambda: number; vSound: number }>>([]);

  const tubeRef = useRef<ResonanceTubeApparatus | null>(null);

  const handleRendererReady = React.useCallback((renderer: SceneryRenderer) => {
    const tube = new ResonanceTubeApparatus('tube-1');
    tubeRef.current = tube;

    tube.viewNode.x = 340;
    tube.viewNode.y = 260;

    renderer.getRootNode().addChild(tube.viewNode);

    const panZoomListener = new AnimatedPanZoomListener(renderer.getRootNode());
    renderer.getDisplay().addInputListener(panZoomListener);

    tube.setAirLength(airLengthCm);
  }, [airLengthCm]);

  const handleAirLengthChange = (l: number) => {
    setAirLengthCm(l);
    tubeRef.current?.setAirLength(l);
  };

  const handleRecord = () => {
    // Tốc độ âm chuẩn v ≈ 340 m/s
    const vReal = 340.0;
    const lambda_m = vReal / frequencyHz;
    const L1_cm = (lambda_m / 4) * 100;
    const L2_cm = (3 * lambda_m / 4) * 100;
    const lambda_calc = 2 * (L2_cm - L1_cm) / 100; // m
    const v_calc = lambda_calc * frequencyHz;

    setDataLogs((prev) => [
      ...prev,
      {
        trial: prev.length + 1,
        f: frequencyHz,
        L1: Number(L1_cm.toFixed(1)),
        L2: Number(L2_cm.toFixed(1)),
        lambda: Number(lambda_calc.toFixed(3)),
        vSound: Number(v_calc.toFixed(1)),
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
            📝 Ghi Điểm Cộng Hưởng
          </button>
        </div>

        {/* Frequency and Tube Control */}
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur p-4 rounded-xl shadow-lg border border-slate-200 z-10 w-72 flex flex-col gap-3 text-xs">
          <div>
            <div className="flex justify-between font-bold text-slate-800 mb-1">
              <span>Tần số máy phát âm f:</span>
              <span className="font-mono text-blue-600">{frequencyHz} Hz</span>
            </div>
            <select
              value={frequencyHz}
              onChange={(e) => setFrequencyHz(Number(e.target.value))}
              className="w-full px-2 py-1.5 bg-slate-100 border border-slate-200 rounded outline-none"
            >
              <option value={250}>250 Hz</option>
              <option value={500}>500 Hz</option>
              <option value={1000}>1000 Hz</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between font-bold text-slate-800 mb-1">
              <span>Chiều dài cột khí L:</span>
              <span className="font-mono text-emerald-600">{airLengthCm.toFixed(1)} cm</span>
            </div>
            <input
              type="range"
              min="5"
              max="80"
              step="0.5"
              value={airLengthCm}
              onChange={(e) => handleAirLengthChange(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
          </div>
        </div>

        {/* Instructions */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur p-4 rounded-xl shadow-lg border border-slate-200 pointer-events-none z-10 w-80">
          <h4 className="font-bold text-sm text-slate-800 mb-2">Bài 5: Đo tốc độ truyền âm (Ống cộng hưởng)</h4>
          <ul className="text-xs text-slate-600 space-y-1">
            <li className="flex items-center gap-2"><span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">1</span> Hạ cột nước để lắng nghe âm to nhất lần 1 (L1) và lần 2 (L2).</li>
            <li className="flex items-center gap-2"><span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">2</span> Tính bước sóng âm: λ = 2(L2 - L1).</li>
            <li className="flex items-center gap-2"><span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">3</span> Tính tốc độ truyền âm: v = λ · f ≈ 340 m/s.</li>
          </ul>
        </div>
      </div>

      {/* Right Data Table */}
      <div className="w-80 h-full flex flex-col bg-white border border-slate-200 rounded-xl p-4 shadow-sm select-none">
        <h3 className="font-bold text-sm text-slate-800 mb-1">Bảng Sóng Âm & Tốc Độ v</h3>
        <p className="text-xs text-slate-500 mb-3">v = λ · f = 2(L2 - L1) · f</p>

        <div className="flex-1 overflow-y-auto border border-slate-100 rounded-lg">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-2">Lần</th>
                <th className="p-2">f (Hz)</th>
                <th className="p-2">L1 (cm)</th>
                <th className="p-2">L2 (cm)</th>
                <th className="p-2">v (m/s)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {dataLogs.map((row) => (
                <tr key={row.trial} className="hover:bg-slate-50">
                  <td className="p-2 font-bold text-slate-700">{row.trial}</td>
                  <td className="p-2">{row.f}</td>
                  <td className="p-2 font-mono text-blue-600">{row.L1}</td>
                  <td className="p-2 font-mono text-purple-600">{row.L2}</td>
                  <td className="p-2 font-mono font-bold text-emerald-600">{row.vSound}</td>
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
