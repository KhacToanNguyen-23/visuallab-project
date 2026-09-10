import React, { useEffect, useRef, useState } from 'react';

export const ParameterConceptStudioEngine: React.FC = () => {
  const [lambda, setLambda] = useState<number>(650); // nm (wavelength)
  const [frequency, setFrequency] = useState<number>(500); // Hz
  const [amplitude, setAmplitude] = useState<number>(25); // px
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const timeRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastTime = performance.now();

    const render = (now: number) => {
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;

      if (isPlaying) {
        timeRef.current += dt * (frequency / 100);
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw Wave Spectrum Canvas 60fps
      const w = canvas.width;
      const h = canvas.height;

      // Grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }

      // Center Line
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.beginPath();
      ctx.moveTo(0, h / 2);
      ctx.lineTo(w, h / 2);
      ctx.stroke();

      // Wave curve
      ctx.beginPath();
      ctx.lineWidth = 3;
      // Convert wavelength (nm) to visual frequency
      const k = (2 * Math.PI) / (lambda / 5);

      for (let x = 0; x < w; x++) {
        const y = h / 2 + amplitude * Math.sin(k * x - timeRef.current);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      // Color based on wavelength
      if (lambda < 450) ctx.strokeStyle = '#8b5cf6'; // Violet
      else if (lambda < 520) ctx.strokeStyle = '#3b82f6'; // Blue
      else if (lambda < 590) ctx.strokeStyle = '#10b981'; // Green
      else if (lambda < 620) ctx.strokeStyle = '#f59e0b'; // Yellow
      else ctx.strokeStyle = '#ef4444'; // Red

      ctx.stroke();

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [lambda, frequency, amplitude, isPlaying]);

  return (
    <div className="border rounded-xl p-5 space-y-4" style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}>
      <div className="flex justify-between items-center border-b pb-3" style={{ borderColor: 'var(--border-color)' }}>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded border uppercase" style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)', color: 'var(--accent-primary)' }}>
            [ENGINE 2: PARAMETER CONCEPT STUDIO]
          </span>
          <h3 className="font-bold text-sm">Trực Quan Hóa Khái Niệm Sóng & Quang Học</h3>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono">
          <span>Bước sóng (λ): <strong className="text-purple-600">{lambda} nm</strong></span>
          <span>Tần số (f): <strong className="text-cyan-600">{frequency} Hz</strong></span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Real-time Dynamic Visual Field (8 cols) */}
        <div className="md:col-span-8 flex flex-col gap-2">
          <div className="bg-slate-950 border border-[var(--border)] rounded-lg p-3 relative h-64 flex flex-col justify-between overflow-hidden">
            <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 z-10">
              <span>Khung Mô Phỏng Sóng Điện Từ / Ánh Sáng (Canvas 60 FPS)</span>
              <span>v = λ * f = {((lambda * frequency) / 1000).toFixed(1)} km/s</span>
            </div>

            <canvas ref={canvasRef} width={600} height={200} className="w-full h-44 block rounded" />

            <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 z-10">
              <span>Biên độ A: {amplitude} px</span>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="px-2.5 py-0.5 bg-slate-800 text-slate-200 font-bold rounded border border-slate-700 cursor-pointer"
              >
                {isPlaying ? '[TẠM DỪNG]' : '[TIẾP TỤC]'}
              </button>
            </div>
          </div>
        </div>

        {/* Control Sliders Panel (4 cols) */}
        <div className="md:col-span-4 border rounded-lg p-4 space-y-4" style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)' }}>
          <h4 className="font-bold text-xs uppercase tracking-wider opacity-70 border-b pb-2" style={{ borderColor: 'var(--border-color)' }}>
            Bảng Điều Khiển Tham Số
          </h4>

          <div className="space-y-1 text-xs">
            <div className="flex justify-between font-semibold">
              <span>Bước Sóng (λ):</span>
              <span className="font-mono text-purple-600">{lambda} nm</span>
            </div>
            <input
              type="range"
              min="380"
              max="750"
              step="5"
              value={lambda}
              onChange={e => setLambda(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="space-y-1 text-xs">
            <div className="flex justify-between font-semibold">
              <span>Tần Số Sóng (f):</span>
              <span className="font-mono text-cyan-600">{frequency} Hz</span>
            </div>
            <input
              type="range"
              min="100"
              max="1000"
              step="50"
              value={frequency}
              onChange={e => setFrequency(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="space-y-1 text-xs">
            <div className="flex justify-between font-semibold">
              <span>Biên Độ Dao Động (A):</span>
              <span className="font-mono text-emerald-600">{amplitude} px</span>
            </div>
            <input
              type="range"
              min="5"
              max="50"
              step="1"
              value={amplitude}
              onChange={e => setAmplitude(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="pt-2">
            <div className="p-3 rounded border text-[11px] space-y-1 font-mono" style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)' }}>
              <div>Công thức: <strong>v = λ * f</strong></div>
              <div>Trực quan: <strong>Giao thoa / Khúc xạ</strong></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
