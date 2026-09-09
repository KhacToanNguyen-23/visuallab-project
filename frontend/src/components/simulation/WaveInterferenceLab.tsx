import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface LabStep {
  stepNumber: number;
  title: string;
  instruction: string;
  hint: string;
}

const LAB_STEPS: LabStep[] = [
  {
    stepNumber: 1,
    title: 'Bật Máy Phát Tần Số & Quan Sát Sợi Dây',
    instruction: 'Bật nguồn bộ phát rung tần số f. Quan sát sợi dây đàn hồi dao động dưới tác dụng của nguồn rung.',
    hint: 'Khi chưa đạt tần số cộng hưởng, trên dây chỉ có các rung động hỗn loạn biên độ nhỏ.',
  },
  {
    stepNumber: 2,
    title: 'Điều Chỉnh Tần Số f Tạo Sóng Dừng',
    instruction: 'Tăng giảm tần số f để xuất hiện các Bó Sóng dừng rõ nét (các điểm bụng và điểm nút cố định).',
    hint: 'Sóng dừng xuất hiện khi chiều dài dây L = k * (\u03BB / 2), với k là số bó sóng nguyên.',
  },
  {
    stepNumber: 3,
    title: 'Xác Định Các Nút Sóng & Bụng Sóng',
    instruction: 'Quan sát các điểm Nút Sóng (điểm đứng yên hoàn toàn) và Bụng Sóng (điểm dao động với biên độ cực đại).',
    hint: 'Khoảng cách giữa 2 nút sóng liên tiếp hoặc 2 bụng sóng liên tiếp luôn bằng đúng nửa bước sóng (\u03BB / 2).',
  },
  {
    stepNumber: 4,
    title: 'Kéo Thước Kẹp Đo Chiều Dài Bó Sóng L',
    instruction: 'Kéo hai vạch thước kẹp ảo trùng với vị trí các nút sóng để đo chính xác chiều dài L của k bó sóng.',
    hint: 'Từ chiều dài L đo được của k bó sóng, suy ra khoảng vân / chiều dài 1 bó d = L / k = \u03BB / 2.',
  },
  {
    stepNumber: 5,
    title: 'Tính Bước Sóng \u03BB & Xác Nhận Báo Cáo',
    instruction: 'Tính bước sóng \u03BB = 2 * (L / k) hoặc \u03BB = v / f và nhập đáp án đo đạc để nộp bài.',
    hint: 'Ví dụ: Chiều dài dây 1.2m có 3 bó sóng \u2192 Chiều dài 1 bó = 0.4m \u2192 Bước sóng \u03BB = 0.8m.',
  },
];

export const WaveInterferenceLab: React.FC = () => {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Physical Parameters for Standing Wave on String
  const [frequency, setFrequency] = useState<number>(50); // Hz
  const [stringLength] = useState<number>(1.2); // meters (L = 1.2m)
  const [tensionForce, setTensionForce] = useState<number>(4.0); // N (Quả cân treo)
  const [linearDensity] = useState<number>(0.001); // kg/m (Mật độ khối lượng dây)

  // Theoretical Wave Speed: v = sqrt(T / mu)
  const waveSpeed = Math.sqrt(tensionForce / linearDensity); // m/s (e.g. sqrt(4/0.001) = 63.25 m/s)
  // Theoretical Lambda: lambda = v / f (m)
  const exactLambda = waveSpeed / frequency;
  // Number of anti-nodes (bó sóng) k = 2L / lambda
  const numNodesExact = (2 * stringLength) / exactLambda;

  // Lab Progress
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [rulerPos, setRulerPos] = useState<{ startX: number; endX: number }>({ startX: 120, endX: 520 });
  const [isDraggingRuler, setIsDraggingRuler] = useState<'start' | 'end' | null>(null);

  // Student Input & Result Validation
  const [userLambda, setUserLambda] = useState<string>('');
  const [labSubmitted, setLabSubmitted] = useState<boolean>(false);
  const [scoreResult, setScoreResult] = useState<{ pass: boolean; exactLambda: number; errorMargin: number } | null>(null);

  // Render Realistic Vibrating String Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const render = () => {
      time += 0.08;
      const width = canvas.width;
      const height = canvas.height;

      // Physics Lab Workbench Background Gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, '#0B0F19');
      bgGrad.addColorStop(1, '#05070C');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Grid Backdrop Lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Equipment Bounds
      const startX = 100;
      const endX = width - 120;
      const stringY = height / 2 - 15;
      const pixelsPerMeter = (endX - startX) / stringLength;

      // 1. Draw Function Generator Box (Left Apparatus)
      ctx.fillStyle = '#1e293b';
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 2;
      ctx.fillRect(15, stringY - 50, 75, 100);
      ctx.strokeRect(15, stringY - 50, 75, 100);

      // Digital Hz Display on Generator
      ctx.fillStyle = '#020617';
      ctx.fillRect(23, stringY - 40, 59, 24);
      ctx.font = 'bold 12px monospace';
      ctx.fillStyle = '#38bdf8';
      ctx.fillText(`${frequency}Hz`, 28, stringY - 24);

      // Vibrator Arm / Strobe
      const vibratorY = stringY + Math.sin(time * 12) * (currentStep >= 2 ? 3 : 6);
      ctx.fillStyle = '#64748b';
      ctx.fillRect(85, vibratorY - 12, 15, 24);
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(100, vibratorY, 5, 0, Math.PI * 2);
      ctx.fill();

      // 2. Draw Pulley & Suspended Weight (Right Apparatus)
      // Pulley wheel
      ctx.beginPath();
      ctx.arc(endX, stringY + 10, 14, 0, Math.PI * 2);
      ctx.fillStyle = '#475569';
      ctx.fill();
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Pulley Support Stand
      ctx.fillStyle = '#334155';
      ctx.fillRect(endX - 4, stringY + 24, 8, 90);

      // Suspended Mass (Quả cân)
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(endX + 14, stringY + 10);
      ctx.lineTo(endX + 14, stringY + 75);
      ctx.stroke();

      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(endX + 2, stringY + 75, 24, 30);
      ctx.font = 'bold 10px Inter, sans-serif';
      ctx.fillStyle = '#0f172a';
      ctx.fillText(`${tensionForce}N`, endX + 6, stringY + 94);

      // 3. Draw Wooden Benchmark Ruler Track (Under String)
      const rulerY = stringY + 45;
      ctx.fillStyle = '#78350f';
      ctx.fillRect(startX, rulerY, endX - startX, 22);
      ctx.strokeStyle = '#b45309';
      ctx.strokeRect(startX, rulerY, endX - startX, 22);

      // Ruler Ticks (cm & mm)
      ctx.strokeStyle = '#fef3c7';
      ctx.lineWidth = 1;
      ctx.font = '9px Inter, sans-serif';
      ctx.fillStyle = '#fef3c7';

      for (let m = 0; m <= stringLength; m += 0.1) {
        const tickX = startX + m * pixelsPerMeter;
        const isMeter = Math.abs(m % 0.5) < 0.01;
        const tickH = isMeter ? 12 : 6;

        ctx.beginPath();
        ctx.moveTo(tickX, rulerY);
        ctx.lineTo(tickX, rulerY + tickH);
        ctx.stroke();

        if (isMeter) {
          ctx.fillText(`${m.toFixed(1)}m`, tickX - 10, rulerY + 20);
        }
      }

      // 4. Render Realistic Vibrating String (Sóng Dừng trên dây)
      const isResonance = Math.abs(numNodesExact - Math.round(numNodesExact)) < 0.15;
      const amplitudeMax = isResonance ? 32 : 8;

      // Multi-layer Glowing String rendering
      ctx.shadowBlur = isResonance ? 18 : 6;
      ctx.shadowColor = isResonance ? '#38bdf8' : '#f59e0b';

      ctx.beginPath();
      ctx.strokeStyle = isResonance ? '#38bdf8' : '#f59e0b';
      ctx.lineWidth = 3;

      const waveK = (Math.PI * numNodesExact) / stringLength;

      for (let xPx = startX; xPx <= endX; xPx += 2) {
        const xPosMeter = (xPx - startX) / pixelsPerMeter;

        // Standing Wave Envelope Equation: Y(x,t) = A * sin(k*x) * cos(w*t)
        const envelope = Math.sin(waveK * xPosMeter);
        const oscillation = Math.cos(2 * Math.PI * 8 * time);
        const yPx = stringY + envelope * amplitudeMax * oscillation;

        if (xPx === startX) ctx.moveTo(xPx, vibratorY);
        else ctx.lineTo(xPx, yPx);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Highlight Nodes (Nút sóng) and Anti-Nodes (Bụng sóng) in Step 3+
      if (currentStep >= 3) {
        const numAntiNodes = Math.round(numNodesExact);
        for (let i = 0; i <= numAntiNodes; i++) {
          const nodeX = startX + (i * stringLength / numAntiNodes) * pixelsPerMeter;

          // Node Marker (Nút)
          ctx.fillStyle = '#ef4444';
          ctx.beginPath();
          ctx.arc(nodeX, stringY, 5, 0, Math.PI * 2);
          ctx.fill();

          ctx.font = 'bold 10px Inter, sans-serif';
          ctx.fillStyle = '#fca5a5';
          ctx.fillText(`Nút ${i}`, nodeX - 12, stringY - 14);

          // Anti-node Marker (Bụng)
          if (i < numAntiNodes) {
            const antiNodeX = startX + ((i + 0.5) * stringLength / numAntiNodes) * pixelsPerMeter;
            ctx.fillStyle = '#38bdf8';
            ctx.beginPath();
            ctx.arc(antiNodeX, stringY, 4, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#93c5fd';
            ctx.fillText(`Bụng ${i + 1}`, antiNodeX - 14, stringY + 28);
          }
        }
      }

      // 5. Interactive Caliper Measurement Tool in Step 4 & 5
      if (currentStep >= 4) {
        ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;

        const calY = stringY - 35;
        const calWidth = Math.abs(rulerPos.endX - rulerPos.startX);

        // Caliper Bar
        ctx.fillRect(Math.min(rulerPos.startX, rulerPos.endX), calY - 15, calWidth, 30);
        ctx.strokeRect(Math.min(rulerPos.startX, rulerPos.endX), calY - 15, calWidth, 30);

        // Handles
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(rulerPos.startX, calY, 7, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(rulerPos.endX, calY, 7, 0, Math.PI * 2);
        ctx.fill();

        // Caliper Measurement Calculation
        const measuredMeters = (calWidth / pixelsPerMeter).toFixed(2);
        ctx.font = 'bold 12px Inter, sans-serif';
        ctx.fillStyle = '#f8fafc';
        ctx.fillText(`Đo L = ${measuredMeters} m`, Math.min(rulerPos.startX, rulerPos.endX) + 15, calY + 4);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [frequency, tensionForce, stringLength, linearDensity, currentStep, rulerPos, numNodesExact]);

  // Caliper Dragging Logic
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (currentStep < 4) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const calY = (canvas.height / 2 - 15) - 35;
    if (Math.abs(y - calY) < 25) {
      if (Math.abs(x - rulerPos.startX) < 20) setIsDraggingRuler('start');
      else if (Math.abs(x - rulerPos.endX) < 20) setIsDraggingRuler('end');
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDraggingRuler) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = Math.max(100, Math.min(canvas.width - 120, e.clientX - rect.left));

    if (isDraggingRuler === 'start') {
      setRulerPos(prev => ({ ...prev, startX: x }));
    } else {
      setRulerPos(prev => ({ ...prev, endX: x }));
    }
  };

  const handleMouseUp = () => setIsDraggingRuler(null);

  // Submit Answer & Calculate Accuracy
  const handleSubmitLab = () => {
    const parsedUserVal = parseFloat(userLambda);
    if (isNaN(parsedUserVal)) return;

    const errMargin = Math.abs(parsedUserVal - exactLambda) / exactLambda;
    const isPass = errMargin <= 0.12; // 12% tolerance

    setScoreResult({
      pass: isPass,
      exactLambda: parseFloat(exactLambda.toFixed(2)),
      errorMargin: parseFloat((errMargin * 100).toFixed(1)),
    });
    setLabSubmitted(true);
  };

  return (
    <div className="min-h-screen w-screen bg-[#05070C] text-slate-100 p-4 md:p-8 flex flex-col items-center">
      {/* Top Header Navigation */}
      <div className="w-full max-w-7xl flex items-center justify-between mb-6 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 rounded-full bg-slate-900 border border-slate-700/60 text-slate-300 hover:text-white text-xs font-bold transition cursor-pointer flex items-center gap-2"
          >
            ← Về Dashboard
          </button>
          <div>
            <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <span>Phòng Thí Nghiệm Sóng Dừng Trên Dây Đàn Hồi</span>
              <span className="text-[10px] uppercase font-bold tracking-widest bg-cyan-950 text-cyan-400 border border-cyan-700/50 px-3 py-1 rounded-full">
                GDPT 2018 Vật Lý 11
              </span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Khảo sát sóng dừng, đo khoảng cách Nút - Bụng và tính Bước Sóng \u03BB
            </p>
          </div>
        </div>

        {/* Step Indicator Badges */}
        <div className="flex items-center gap-2">
          {LAB_STEPS.map(s => (
            <button
              key={s.stepNumber}
              onClick={() => setCurrentStep(s.stepNumber)}
              className={`w-9 h-9 rounded-full text-xs font-extrabold flex items-center justify-center transition cursor-pointer ${
                currentStep === s.stepNumber
                  ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/30 scale-110'
                  : currentStep > s.stepNumber
                  ? 'bg-slate-800 text-emerald-400 border border-emerald-500/40'
                  : 'bg-slate-900 text-slate-500 border border-slate-800'
              }`}
            >
              {currentStep > s.stepNumber ? '✓' : s.stepNumber}
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Grid */}
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Canvas Physics Apparatus Workspace */}
        <div className="lg:col-span-8 bg-[#090D16] border border-slate-800/80 rounded-3xl p-4 flex flex-col justify-between shadow-2xl relative overflow-hidden">
          {/* Step Banner Header */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 mb-4 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400 bg-cyan-950 px-2.5 py-0.5 rounded-full border border-cyan-800/50">
                Bước {currentStep}/5
              </span>
              <h3 className="text-base font-extrabold text-white mt-1">
                {LAB_STEPS[currentStep - 1].title}
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                {LAB_STEPS[currentStep - 1].instruction}
              </p>
            </div>
          </div>

          {/* Interactive Canvas Apparatus */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-800/80 bg-black flex items-center justify-center">
            <canvas
              ref={canvasRef}
              width={760}
              height={380}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              className="cursor-crosshair w-full h-auto"
            />
          </div>

          {/* Interactive Step Guide Footer */}
          <div className="mt-4 p-3 rounded-2xl bg-cyan-950/30 border border-cyan-800/30 flex items-center justify-between text-xs text-cyan-200">
            <div className="flex items-center gap-2">
              <span className="text-base">💡</span>
              <span><strong>Dụng cụ thí nghiệm:</strong> {LAB_STEPS[currentStep - 1].hint}</span>
            </div>
            {currentStep < 5 && (
              <button
                onClick={() => setCurrentStep(prev => Math.min(5, prev + 1))}
                className="px-4 py-1.5 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold shadow-md transition cursor-pointer"
              >
                Bước Tiếp Theo →
              </button>
            )}
          </div>
        </div>

        {/* Experiment Controls & Lab Report Panel */}
        <div className="lg:col-span-4 flex flex-col gap-5">
          {/* Apparatus Controls */}
          <div className="bg-[#090D16] border border-slate-800/80 rounded-3xl p-6 shadow-xl flex flex-col gap-5">
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
              <span>🎛️ Bảng Điều Khiển Dụng Cụ</span>
            </h3>

            {/* Slider 1: Frequency f */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400 font-semibold">Tần số Máy Rung (f):</span>
                <span className="text-cyan-400 font-extrabold">{frequency} Hz</span>
              </div>
              <input
                type="range"
                min={20}
                max={120}
                value={frequency}
                onChange={e => setFrequency(Number(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>

            {/* Slider 2: Tension Force */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400 font-semibold">Lực Căng Dây (T):</span>
                <span className="text-cyan-400 font-extrabold">{tensionForce.toFixed(1)} N</span>
              </div>
              <input
                type="range"
                min={1.0}
                max={10.0}
                step={0.5}
                value={tensionForce}
                onChange={e => setTensionForce(Number(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>

            {/* Theoretical Physics Values */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col gap-2 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Vận tốc truyền sóng v:</span>
                <span className="font-bold text-white">{waveSpeed.toFixed(1)} m/s</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Số bó sóng xuất hiện k:</span>
                <span className="font-bold text-cyan-400">{Math.round(numNodesExact)} bó</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Bước sóng lý thuyết \u03BB:</span>
                <span className="font-bold text-emerald-400">{exactLambda.toFixed(2)} m</span>
              </div>
            </div>
          </div>

          {/* Student Final Lab Report Section */}
          <div className="bg-[#090D16] border border-slate-800/80 rounded-3xl p-6 shadow-xl flex flex-col gap-4">
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
              <span>📝 Báo Cáo Thực Hành Sóng Dừng</span>
            </h3>

            <div className="flex flex-col gap-2">
              <label className="text-xs text-slate-400 font-semibold">
                Nhập kết quả Bước Sóng \u03BB bạn đo tính được (mét):
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="Ví dụ: 1.25"
                value={userLambda}
                onChange={e => setUserLambda(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-500"
              />
            </div>

            <button
              onClick={handleSubmitLab}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:opacity-95 text-white font-extrabold text-xs shadow-lg shadow-cyan-500/20 transition active:scale-95 cursor-pointer"
            >
              Nộp Báo Cáo Thực Hành
            </button>

            {/* Score & Feedback */}
            {labSubmitted && scoreResult && (
              <div
                className={`p-4 rounded-2xl border text-xs flex flex-col gap-2 ${
                  scoreResult.pass
                    ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-200'
                    : 'bg-rose-950/60 border-rose-500/40 text-rose-200'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-sm">
                  <span>{scoreResult.pass ? '🎉 CHÚC MỪNG BẠN ĐÃ ĐẠT CHUẨN LAB!' : '❌ CHƯA ĐẠT CHUẨN SAI SỐ'}</span>
                </div>
                <p>Bước sóng lý thuyết chuẩn: <strong>{scoreResult.exactLambda} m</strong></p>
                <p>Sai số đo đạc: <strong>{scoreResult.errorMargin}%</strong> (Mức cho phép ≤ 12%)</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
