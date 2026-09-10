import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EMFEngine } from '../../engine/physics/emf-engine';

type LabTabMode = 'explore' | 'compare' | 'predict' | 'measure' | 'graph' | 'challenge';

interface MeasurementPair {
  step: number;
  rheostatR: number; // Ohm
  currentI: number; // A
  voltageU: number; // V
}

export const PhetEmfLab: React.FC = () => {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const graphCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Tab & Learning Mode State
  const [activeTab, setActiveTab] = useState<LabTabMode>('explore');

  // Physics Engine
  const engineRef = useRef<EMFEngine>(
    new EMFEngine({ emf: 6.0, internalR: 1.5, rheostatR: 20, switchOpen: false })
  );

  // Parameters
  const [emf, setEmf] = useState<number>(6.0); // E (V)
  const [internalR, setInternalR] = useState<number>(1.5); // r (Ohm)
  const [rheostatR, setRheostatR] = useState<number>(20); // R (Ohm)
  const [switchOpen, setSwitchOpen] = useState<boolean>(false);

  // Measurement Records & Toast
  const [records, setRecords] = useState<MeasurementPair[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Update engine config
  useEffect(() => {
    engineRef.current.updateConfig({ emf, internalR, rheostatR, switchOpen });
  }, [emf, internalR, rheostatR, switchOpen]);

  // Main Render Loop
  useEffect(() => {
    renderCircuitCanvas();
    renderGraphCanvas();
  }, [emf, internalR, rheostatR, switchOpen, records]);

  const renderCircuitCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    // Background Grid
    ctx.strokeStyle = '#1E293B';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    const state = engineRef.current.solve();

    // Circuit Layout Coordinates
    const sourceX = 140;
    const sourceY = 220;

    const switchX = 360;
    const switchY = 100;

    const meterX = 580;
    const meterY = 220;

    const rheostatX = 360;
    const rheostatY = 350;

    // Draw Connecting Wires
    ctx.strokeStyle = switchOpen ? '#64748B' : '#38BDF8';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.moveTo(sourceX, sourceY - 40);
    ctx.lineTo(sourceX, switchY);
    ctx.lineTo(switchX - 30, switchY);

    ctx.moveTo(switchX + 30, switchY);
    ctx.lineTo(meterX, switchY);
    ctx.lineTo(meterX, meterY - 40);

    ctx.moveTo(meterX, meterY + 40);
    ctx.lineTo(meterX, rheostatY);
    ctx.lineTo(rheostatX + 60, rheostatY);

    ctx.moveTo(rheostatX - 60, rheostatY);
    ctx.lineTo(sourceX, rheostatY);
    ctx.lineTo(sourceX, sourceY + 40);
    ctx.stroke();

    // Voltmeter Parallel Wires
    ctx.strokeStyle = '#F43F5E';
    ctx.setLineDash([4, 4]);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(sourceX - 25, sourceY - 30);
    ctx.lineTo(sourceX - 70, sourceY - 30);
    ctx.lineTo(sourceX - 70, sourceY + 30);
    ctx.lineTo(sourceX - 25, sourceY + 30);
    ctx.stroke();
    ctx.setLineDash([]);

    // 1. Draw DC Power Source E & r
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(sourceX - 30, sourceY - 40, 60, 80);
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 3;
    ctx.strokeRect(sourceX - 30, sourceY - 40, 60, 80);

    ctx.fillStyle = '#FACC15';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`Pin (E, r)`, sourceX, sourceY - 15);
    ctx.font = 'mono bold 11px sans-serif';
    ctx.fillText(`E = ${emf}V`, sourceX, sourceY + 5);
    ctx.fillText(`r = ${internalR}Ω`, sourceX, sourceY + 22);

    // 2. Draw Knife Switch K
    ctx.fillStyle = '#1E293B';
    ctx.fillRect(switchX - 35, switchY - 20, 70, 40);
    ctx.strokeStyle = '#64748B';
    ctx.strokeRect(switchX - 35, switchY - 20, 70, 40);

    ctx.beginPath();
    ctx.arc(switchX - 20, switchY, 5, 0, Math.PI * 2);
    ctx.arc(switchX + 20, switchY, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#EF4444';
    ctx.fill();

    // Switch Blade
    ctx.strokeStyle = switchOpen ? '#EF4444' : '#10B981';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(switchX - 20, switchY);
    if (switchOpen) {
      ctx.lineTo(switchX + 15, switchY - 25);
    } else {
      ctx.lineTo(switchX + 20, switchY);
    }
    ctx.stroke();

    ctx.fillStyle = switchOpen ? '#EF4444' : '#10B981';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText(switchOpen ? 'Công Tắc K [MỞ]' : 'Công Tắc K [ĐÓNG]', switchX, switchY + 30);

    // 3. Draw Ammeter Gauges
    ctx.fillStyle = '#0F172A';
    ctx.beginPath();
    ctx.arc(meterX, meterY, 35, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = '#38BDF8';
    ctx.font = 'bold 13px sans-serif';
    ctx.fillText('A', meterX, meterY - 10);
    ctx.font = 'mono bold 12px sans-serif';
    ctx.fillText(`${state.currentI.toFixed(3)} A`, meterX, meterY + 12);

    // 4. Draw Voltmeter Gauge (Side)
    const voltX = sourceX - 70;
    const voltY = sourceY;
    ctx.fillStyle = '#0F172A';
    ctx.beginPath();
    ctx.arc(voltX, voltY, 30, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#F43F5E';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = '#F43F5E';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText('V', voltX, voltY - 8);
    ctx.font = 'mono bold 11px sans-serif';
    ctx.fillText(`${state.voltageU.toFixed(2)} V`, voltX, voltY + 10);

    // 5. Draw Variable Rheostat R
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(rheostatX - 60, rheostatY - 20, 120, 40);
    ctx.strokeStyle = '#10B981';
    ctx.lineWidth = 3;
    ctx.strokeRect(rheostatX - 60, rheostatY - 20, 120, 40);

    // Slider Knob
    const knobX = rheostatX - 50 + (rheostatR / 100) * 100;
    ctx.fillStyle = '#34D399';
    ctx.fillRect(knobX - 6, rheostatY - 28, 12, 16);

    ctx.fillStyle = '#10B981';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText(`Biến trở R = ${rheostatR} Ω`, rheostatX, rheostatY + 35);
  };

  const renderGraphCanvas = () => {
    const canvas = graphCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = '#090D16';
    ctx.fillRect(0, 0, width, height);

    // Axes
    const padding = 35;
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, 15);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - 15, height - padding);
    ctx.stroke();

    ctx.fillStyle = '#94A3B8';
    ctx.font = '10px sans-serif';
    ctx.fillText('U (V)', padding + 5, 20);
    ctx.fillText('I (A)', width - 25, height - padding + 15);

    // Plot Theoretical Line U = E - I*r
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    const maxI = 3.0; // 3A
    const maxU = 12.0; // 12V

    const x1 = padding;
    const y1 = height - padding - (emf / maxU) * (height - 2 * padding);
    const x2 = padding + ((emf / internalR) / maxI) * (width - 2 * padding);
    const y2 = height - padding;

    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    // Plot Measured Data Points
    records.forEach(r => {
      const px = padding + (r.currentI / maxI) * (width - 2 * padding);
      const py = height - padding - (r.voltageU / maxU) * (height - 2 * padding);

      ctx.fillStyle = '#F43F5E';
      ctx.beginPath();
      ctx.arc(px, py, 5, 0, Math.PI * 2);
      ctx.fill();
    });
  };

  const handleRecordData = () => {
    const state = engineRef.current.solve();
    const newPair: MeasurementPair = {
      step: records.length + 1,
      rheostatR,
      currentI: parseFloat(state.currentI.toFixed(3)),
      voltageU: parseFloat(state.voltageU.toFixed(2)),
    };
    setRecords(prev => [...prev, newPair]);
    setToastMessage(`Đã ghi nhận lần đo #${newPair.step}: I = ${newPair.currentI}A, U = ${newPair.voltageU}V`);
    setTimeout(() => setToastMessage(null), 2500);
  };

  return (
    <div className="w-full h-full min-h-screen bg-slate-950 text-white font-sans flex flex-col select-none overflow-x-hidden">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-2xl border border-emerald-400 font-bold text-xs animate-bounce flex items-center gap-2">
          <span>✨ {toastMessage}</span>
        </div>
      )}

      {/* Top Pedagogy Navigation Tabs */}
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-3 flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/student')}
            className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-300 text-xs font-bold transition cursor-pointer"
          >
            ← Về Bài Tập
          </button>
          <h1 className="text-base font-black text-amber-400 tracking-tight flex items-center gap-2">
            <span>⚡ Thí Nghiệm Đo Suất Điện Động E & Điện Trở Trong r Của Pin</span>
          </h1>
        </div>

        <div className="flex gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
          {(['explore', 'compare', 'predict', 'measure', 'graph', 'challenge'] as LabTabMode[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-extrabold uppercase transition cursor-pointer ${
                activeTab === tab
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab === 'explore' && '🔍 Khám Phá'}
              {tab === 'compare' && '⚖️ So Sánh'}
              {tab === 'predict' && '💡 Dự Đoán'}
              {tab === 'measure' && '📏 Đo Đạc'}
              {tab === 'graph' && '📊 Đồ Thị U(I)'}
              {tab === 'challenge' && '🏆 AI Thử Thách'}
            </button>
          ))}
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 p-4">
        {/* Left Interactive Canvas Area (8 cols) */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between relative shadow-xl">
          <div className="flex justify-between items-center mb-2 bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div className="flex items-center gap-4 text-xs font-mono font-bold">
              <span className="text-amber-400">Công thức đồ thị: $U = E - I \cdot r$</span>
              <span className="text-cyan-400">
                Hiệu điện thế $U$: {engineRef.current.solve().voltageU.toFixed(2)} V
              </span>
              <span className="text-emerald-400">
                Dòng điện $I$: {engineRef.current.solve().currentI.toFixed(3)} A
              </span>
            </div>

            <button
              onClick={() => setSwitchOpen(!switchOpen)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                switchOpen
                  ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
              }`}
            >
              {switchOpen ? '🔌 Đóng Khóa K (ON)' : '🔴 Ngắt Khóa K (OFF)'}
            </button>
          </div>

          <div className="flex-1 flex justify-center items-center bg-slate-950 rounded-xl relative overflow-hidden border border-slate-800">
            <canvas ref={canvasRef} width={750} height={450} className="w-full h-[450px]" />
          </div>

          {/* Action Bar */}
          <div className="mt-3 flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-400">
              💡 Thay đổi điện trở biến trở R rồi bấm nút bên phải để ghi cặp số liệu (I, U) vẽ đồ thị:
            </span>

            <button
              onClick={handleRecordData}
              disabled={switchOpen}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg shadow-md transition cursor-pointer disabled:opacity-50"
            >
              📥 Ghi Cặp Số Liệu (I, U)
            </button>
          </div>
        </div>

        {/* Right Persistent Parameters Panel ⚙️ (4 cols) */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col gap-4 shadow-xl">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-amber-400 flex items-center gap-2 pb-2 border-b border-slate-800">
            <span>⚙️ Thông Số Nguồn Pin & Mạch Điện</span>
          </h2>

          <div className="space-y-4 text-xs">
            {/* EMF E Slider */}
            <div>
              <div className="flex justify-between font-bold mb-1">
                <span className="text-slate-300">Suất điện động Pin (E):</span>
                <span className="text-amber-400 font-mono">{emf.toFixed(1)} V</span>
              </div>
              <input
                type="range"
                min={1.5}
                max={12.0}
                step={0.5}
                value={emf}
                onChange={e => setEmf(parseFloat(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            {/* Internal R r Slider */}
            <div>
              <div className="flex justify-between font-bold mb-1">
                <span className="text-slate-300">Điện trở trong của Pin (r):</span>
                <span className="text-rose-400 font-mono">{internalR.toFixed(1)} Ω</span>
              </div>
              <input
                type="range"
                min={0.5}
                max={5.0}
                step={0.1}
                value={internalR}
                onChange={e => setInternalR(parseFloat(e.target.value))}
                className="w-full accent-rose-500 cursor-pointer"
              />
            </div>

            {/* Variable Rheostat R Slider */}
            <div>
              <div className="flex justify-between font-bold mb-1">
                <span className="text-slate-300">Gạt biến trở con chạy (R):</span>
                <span className="text-emerald-400 font-mono">{rheostatR} Ω</span>
              </div>
              <input
                type="range"
                min={1}
                max={100}
                step={1}
                value={rheostatR}
                onChange={e => setRheostatR(parseInt(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            {/* Realtime Graph U(I) Preview Box */}
            <div className="pt-2 border-t border-slate-800">
              <label className="font-bold text-slate-300 block mb-1">📉 Đồ thị tuyến tính U = E - I·r:</label>
              <canvas ref={graphCanvasRef} width={320} height={140} className="w-full h-[140px] rounded-lg border border-slate-800" />
            </div>
          </div>

          {/* Measurements Table Data */}
          <div className="mt-auto pt-2 border-t border-slate-800">
            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              📋 Bảng Cặp Số Liệu (I, U) ({records.length} điểm)
            </h3>
            <div className="max-h-36 overflow-y-auto border border-slate-800 rounded-lg">
              <table className="w-full text-left text-[11px]">
                <thead className="bg-slate-950 text-slate-400 sticky top-0">
                  <tr>
                    <th className="p-1.5">Lần</th>
                    <th className="p-1.5">R (Ω)</th>
                    <th className="p-1.5">I (A)</th>
                    <th className="p-1.5">U (V)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {records.map(r => (
                    <tr key={r.step} className="hover:bg-slate-800/50">
                      <td className="p-1.5 font-bold">#{r.step}</td>
                      <td className="p-1.5 font-mono">{r.rheostatR}</td>
                      <td className="p-1.5 font-mono text-emerald-400">{r.currentI}</td>
                      <td className="p-1.5 font-mono text-amber-400">{r.voltageU}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
