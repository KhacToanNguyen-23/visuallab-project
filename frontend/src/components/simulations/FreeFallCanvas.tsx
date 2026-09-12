import React, { useEffect, useRef, useState } from 'react';
import { calculateFreeFallTime, calculateExperimentalG } from '../../engine/simulations/FreeFallSimulation';

interface Props {
  onRecordMeasurement: (s: number, t: number) => void;
}

export const FreeFallCanvas: React.FC<Props> = ({ onRecordMeasurement }) => {
  const [distanceS, setDistanceS] = useState(0.5); // 0.5m default
  const [isFalling, setIsFalling] = useState(false);
  const [ballY, setBallY] = useState(100); // 100px = top position at E1
  const [measuredT, setMeasuredT] = useState<number | null>(null);
  const [calculatedG, setCalculatedG] = useState<number | null>(null);
  const [isVacuum, setIsVacuum] = useState(true);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleStartFall = () => {
    if (isFalling) return;
    setIsFalling(true);

    const startY = 100; // Top position E1
    const targetY = 100 + distanceS * 400; // 400px per meter
    const t = calculateFreeFallTime(distanceS, isVacuum ? 9.807 : 9.5);
    setMeasuredT(t);
    const expG = calculateExperimentalG(distanceS, t);
    setCalculatedG(expG);

    const startTime = performance.now();
    const duration = t * 1000;

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      const currentY = startY + (targetY - startY) * Math.pow(progress, 2);
      setBallY(currentY);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsFalling(false);
      }
    };

    requestAnimationFrame(animate);
  };

  const handleRecord = () => {
    if (measuredT !== null) {
      onRecordMeasurement(distanceS, measuredT);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background Grid
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.1)';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Vertical Stand Base
    ctx.fillStyle = '#475569';
    ctx.fillRect(120, 520, 160, 16);

    // Main Vertical Rod (Giá đỡ)
    ctx.fillStyle = '#64748b';
    ctx.fillRect(196, 40, 8, 480);

    // Ruler Scale Markings (Thước chia độ)
    ctx.strokeStyle = '#94a3b8';
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px monospace';
    ctx.textAlign = 'right';

    for (let m = 0; m <= 1.0; m += 0.1) {
      const y = 100 + m * 400;
      ctx.beginPath();
      ctx.moveTo(196, y);
      ctx.lineTo(184, y);
      ctx.stroke();
      ctx.fillText(`${m.toFixed(1)}m`, 180, y + 3);
    }

    // Electromagnet at top (Nam châm điện)
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(180, 70, 40, 30);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 9px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('NAM CHÂM', 200, 88);

    // Photogate E1 (Start - Cổng quang E1 tại 0m)
    ctx.fillStyle = '#2563eb';
    ctx.fillRect(160, 95, 80, 10);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 9px sans-serif';
    ctx.fillText('CỔNG E1 (0.0m)', 200, 92);

    // Photogate E2 (Stop - Cổng quang E2 tại h)
    const e2Y = 100 + distanceS * 400;
    ctx.fillStyle = '#2563eb';
    ctx.fillRect(160, e2Y, 80, 10);
    ctx.fillText(`CỔNG E2 (${distanceS}m)`, 200, e2Y + 22);

    // Dotted height indicator line
    ctx.strokeStyle = '#38bdf8';
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(250, 100);
    ctx.lineTo(250, e2Y);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`h = ${distanceS} m`, 260, (100 + e2Y) / 2);

    // Steel Ball (Bi thép)
    const renderY = isFalling ? ballY : 100;
    ctx.fillStyle = '#cbd5e1';
    ctx.beginPath();
    ctx.arc(200, renderY, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 2;
    ctx.stroke();
  }, [ballY, distanceS, isFalling]);

  return (
    <div className="w-full h-full flex flex-col lg:flex-row gap-6 p-6 overflow-y-auto" style={{ backgroundColor: 'var(--bg-main)', color: 'var(--text-main)' }}>
      {/* 2D Canvas Workspace */}
      <div className="flex-1 flex flex-col items-center justify-center border rounded-2xl p-4 relative" style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)' }}>
        <div className="absolute top-4 left-4 text-xs font-bold uppercase tracking-wider opacity-70">
          Mô hình Giá Đỡ & Cổng Quang Điện 2D
        </div>

        <canvas
          ref={canvasRef}
          width={400}
          height={550}
          className="rounded-xl border shadow-inner max-w-full"
          style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)' }}
        />
      </div>

      {/* Physics Control & Digital Readout Panel */}
      <div className="w-full lg:w-96 flex flex-col gap-5 border rounded-2xl p-6 shadow-xs" style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)' }}>
        <div className="border-b pb-3" style={{ borderColor: 'var(--border-color)' }}>
          <h3 className="font-bold text-sm uppercase tracking-wider">Bảng Điều Khiển & Số Liệu</h3>
          <p className="text-xs opacity-70 mt-0.5">Thực hành đo gia tốc rơi tự do g</p>
        </div>

        {/* Height s Selection */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-bold">
            <span>Khoảng cách cổng quang (h):</span>
            <span className="text-blue-500 font-mono text-sm">{distanceS.toFixed(2)} m</span>
          </div>
          <input
            type="range"
            min={0.2}
            max={0.8}
            step={0.1}
            value={distanceS}
            disabled={isFalling}
            onChange={(e) => {
              setDistanceS(parseFloat(e.target.value));
              setMeasuredT(null);
              setCalculatedG(null);
              setBallY(100);
            }}
            className="w-full h-2 rounded-lg bg-slate-200 dark:bg-slate-700 appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-[10px] opacity-60 font-mono">
            <span>0.20m</span>
            <span>0.50m</span>
            <span>0.80m</span>
          </div>
        </div>

        {/* Vacuum Switch */}
        <div className="flex items-center justify-between p-3 rounded-xl border" style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)' }}>
          <span className="text-xs font-semibold">Môi trường chân không:</span>
          <button
            onClick={() => setIsVacuum(!isVacuum)}
            className={`px-3 py-1 text-xs font-bold rounded-lg border transition-colors cursor-pointer ${
              isVacuum ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            {isVacuum ? 'BẬT (Không lực cản)' : 'TẮT (Có lực cản)'}
          </button>
        </div>

        {/* Start Release Action */}
        <button
          onClick={handleStartFall}
          disabled={isFalling}
          className="w-full py-3 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-xs cursor-pointer disabled:opacity-50"
        >
          {isFalling ? 'Đang rơi...' : 'Ngắt Nam Châm ➔ Thả Bi Thép'}
        </button>

        {/* Digital Timer Readout MC-964 */}
        <div className="p-4 rounded-xl border space-y-3" style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)' }}>
          <div className="text-[11px] font-bold uppercase tracking-wider text-blue-500 border-b pb-2" style={{ borderColor: 'var(--border-color)' }}>
            Đồng Hồ Hiện Số MC-964
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="opacity-70">Thời gian rơi (t):</span>
            <span className="font-mono text-base font-bold text-emerald-500">
              {measuredT !== null ? `${measuredT.toFixed(4)} s` : '0.0000 s'}
            </span>
          </div>

          <div className="flex justify-between items-center text-xs pt-2 border-t" style={{ borderColor: 'var(--border-color)' }}>
            <span className="opacity-70">Gia tốc g tính toán:</span>
            <span className="font-mono text-base font-bold text-blue-500">
              {calculatedG !== null ? `${calculatedG.toFixed(2)} m/s²` : '0.00 m/s²'}
            </span>
          </div>
        </div>

        {/* Record to Data Table Button */}
        <button
          onClick={handleRecord}
          disabled={measuredT === null || isFalling}
          className="w-full py-2.5 rounded-xl font-semibold text-xs border transition-colors cursor-pointer disabled:opacity-40"
          style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-main)' }}
        >
          Lưu Số Liệu Vào Bảng Lần Đo ➔
        </button>
      </div>
    </div>
  );
};

export default FreeFallCanvas;
