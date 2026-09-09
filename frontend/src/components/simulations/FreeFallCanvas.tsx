import React, { useEffect, useRef, useState } from 'react';
import { calculateFreeFallTime } from '../../engine/simulations/FreeFallSimulation';

interface Props {
  onRecordMeasurement: (s: number, t: number) => void;
}

export const FreeFallCanvas: React.FC<Props> = ({ onRecordMeasurement }) => {
  const [distanceS, setDistanceS] = useState(0.5); // 0.5m
  const [isFalling, setIsFalling] = useState(false);
  const [ballY, setBallY] = useState(100);
  const [measuredT, setMeasuredT] = useState<number | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleStartFall = () => {
    if (isFalling) return;
    setIsFalling(true);

    const startY = 100;
    const targetY = 100 + distanceS * 400; // 400px per meter
    const t = calculateFreeFallTime(distanceS);
    setMeasuredT(t);

    const startTime = performance.now();
    const duration = t * 1000; // milliseconds

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      const currentY = startY + (targetY - startY) * Math.pow(progress, 2);
      setBallY(currentY);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsFalling(false);
        onRecordMeasurement(distanceS, t);
      }
    };

    requestAnimationFrame(animate);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Stand & Scale
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(200, 50);
    ctx.lineTo(200, 550);
    ctx.stroke();

    // Electromagnet at top
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(170, 70, 60, 30);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 10px Inter';
    ctx.fillText('Nam Châm', 175, 88);

    // Photogate 1 (E1)
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(160, 100, 80, 15);
    ctx.fillText('Cổng E1 (0m)', 165, 112);

    // Photogate 2 (E2)
    const e2Y = 100 + distanceS * 400;
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(160, e2Y, 80, 15);
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`Cổng E2 (${distanceS}m)`, 165, e2Y + 12);

    // Digital Timer MC-964 box
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(350, 150, 200, 120);
    ctx.strokeStyle = '#38bdf8';
    ctx.strokeRect(350, 150, 200, 120);
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 14px Inter';
    ctx.fillText('ĐỒNG HỒ MC-964', 380, 175);
    ctx.font = 'bold 24px monospace';
    ctx.fillStyle = '#4ade80';
    ctx.fillText(measuredT !== null ? `${measuredT.toFixed(4)} s` : '0.0000 s', 390, 220);

    // Steel ball
    ctx.fillStyle = '#94a3b8';
    ctx.beginPath();
    ctx.arc(200, ballY, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#334155';
    ctx.stroke();
  }, [ballY, distanceS, measuredT]);

  return (
    <div className="h-full w-full flex bg-slate-950 p-4 gap-4">
      <div className="flex-1 bg-slate-900 rounded-2xl border border-slate-800 flex items-center justify-center p-4">
        <canvas ref={canvasRef} width={650} height={580} className="bg-slate-950 rounded-xl border border-slate-800" />
      </div>

      {/* Control Sidebar */}
      <div className="w-80 bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col gap-6 text-slate-100">
        <h3 className="font-bold text-base text-white">Đo Gia Tốc Rơi Tự Do (g)</h3>

        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Khoảng cách s (m):</span>
            <span className="font-mono text-cyan-400 font-bold">{distanceS} m</span>
          </div>
          <input
            type="range"
            min="0.2"
            max="0.8"
            step="0.05"
            disabled={isFalling}
            value={distanceS}
            onChange={e => setDistanceS(parseFloat(e.target.value))}
            className="accent-cyan-500 cursor-pointer"
          />
        </div>

        <button
          onClick={handleStartFall}
          disabled={isFalling}
          className="py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs rounded-xl shadow-lg transition cursor-pointer"
        >
          {isFalling ? 'Đang thả bi sắt...' : '🔴 Ngắt Điện Nam Châm & Thả Bi'}
        </button>
      </div>
    </div>
  );
};
