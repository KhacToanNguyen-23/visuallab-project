import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface MeasurementRow {
  step: number;
  angleI: string; // Góc tới i
  angleR: string; // Góc khúc xạ r
}

export const PhetRefractionLab: React.FC = () => {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // PhET Refraction Component States
  const [n1] = useState<number>(1.00); // Air (n1)
  const [n2, setN2] = useState<number>(1.50); // Glass / Water (n2)
  const [incidentAngle, setIncidentAngle] = useState<number>(45); // i (degrees)
  const [laserOn, setLaserOn] = useState<boolean>(true);
  const [showProtractor, setShowProtractor] = useState<boolean>(true);
  const [showNormalLine] = useState<boolean>(true);

  // Lab Step Workflow
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [rows, setRows] = useState<MeasurementRow[]>([
    { step: 1, angleI: '30', angleR: '' },
    { step: 2, angleI: '45', angleR: '' },
    { step: 3, angleI: '60', angleR: '' },
  ]);

  const [userN2, setUserN2] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [scoreResult, setScoreResult] = useState<{ pass: boolean; score: number; exactN2: number } | null>(null);

  // Calculate Refraction Angle r using Snell's Law: n1 * sin(i) = n2 * sin(r)
  const sinI = Math.sin((incidentAngle * Math.PI) / 180);
  const sinRRatio = (n1 * sinI) / n2;
  const isTotalInternalReflection = sinRRatio > 1.0;
  const refractAngle = isTotalInternalReflection ? 0 : (Math.asin(sinRRatio) * 180) / Math.PI;

  // Render PhET Style Refraction Canvas Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;

      const centerX = width / 2;
      const centerY = height / 2;

      // 1. Draw Medium 1 (Top) & Medium 2 (Bottom)
      // Top Medium (Air)
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, width, centerY);

      // Bottom Medium (Water/Glass with refractive tint)
      const alpha = Math.min(0.6, (n2 - 1.0) * 0.8);
      ctx.fillStyle = `rgba(14, 165, 233, ${0.15 + alpha * 0.5})`;
      ctx.fillRect(0, centerY, width, height - centerY);

      // Medium Interface Boundary Line
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(width, centerY);
      ctx.stroke();

      // Medium Labels
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(`Môi trường 1 (n1 = ${n1.toFixed(2)}) - Không khí`, 15, 25);
      ctx.fillStyle = '#38bdf8';
      ctx.fillText(`Môi trường 2 (n2 = ${n2.toFixed(2)}) - ${n2 === 1.33 ? 'Nước' : n2 === 1.50 ? 'Thủy tinh' : 'Khối chiết suất'}`, 15, centerY + 25);

      // 2. Draw Normal Line (Pháp tuyến N - N')
      if (showNormalLine) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 1;
        ctx.setLineDash([6, 6]);
        ctx.beginPath();
        ctx.moveTo(centerX, 20);
        ctx.lineTo(centerX, height - 20);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = '#cbd5e1';
        ctx.fillText('N', centerX + 6, 25);
        ctx.fillText("N'", centerX + 6, height - 15);
      }

      // 3. Draw PhET Interactive Protractor (Thước đo góc 360 độ)
      if (showProtractor) {
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 110, 0, Math.PI * 2);
        ctx.stroke();

        // Protractor Tick Marks & Degrees
        ctx.font = '8px Inter, sans-serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        for (let deg = 0; deg < 360; deg += 10) {
          const rad = (deg * Math.PI) / 180;
          const x1 = centerX + Math.cos(rad) * 105;
          const y1 = centerY + Math.sin(rad) * 105;
          const x2 = centerX + Math.cos(rad) * 115;
          const y2 = centerY + Math.sin(rad) * 115;

          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        }
      }

      // 4. Draw PhET Laser Emitter Component & Light Beams
      if (laserOn) {
        const iRad = (incidentAngle * Math.PI) / 180;
        const beamLength = 220;

        // Incident Beam Start Position (Top Left Quadrant)
        const laserX = centerX - Math.sin(iRad) * beamLength;
        const laserY = centerY - Math.cos(iRad) * beamLength;

        // Draw PhET Red Laser Device Body
        ctx.save();
        ctx.translate(laserX, laserY);
        ctx.rotate(iRad);

        ctx.fillStyle = '#dc2626';
        ctx.strokeStyle = '#fee2e2';
        ctx.lineWidth = 1.5;
        ctx.fillRect(-12, -25, 24, 45);
        ctx.strokeRect(-12, -25, 24, 45);

        // Laser Power Indicator Light
        ctx.fillStyle = '#ef4444';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#ef4444';
        ctx.beginPath();
        ctx.arc(0, 15, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.restore();

        // --- INCIDENT BEAM (Tia Tới) ---
        ctx.shadowBlur = 12;
        ctx.shadowColor = '#ef4444';
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.moveTo(laserX, laserY);
        ctx.lineTo(centerX, centerY);
        ctx.stroke();

        // --- REFLECTED BEAM (Tia Phản Xạ) ---
        const reflectX = centerX + Math.sin(iRad) * 180;
        const reflectY = centerY - Math.cos(iRad) * 180;
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(reflectX, reflectY);
        ctx.stroke();

        // --- REFRACTED BEAM (Tia Khúc Xạ) ---
        if (!isTotalInternalReflection) {
          const rRad = (refractAngle * Math.PI) / 180;
          const refractX = centerX + Math.sin(rRad) * 220;
          const refractY = centerY + Math.cos(rRad) * 220;

          ctx.shadowColor = '#38bdf8';
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 3.5;
          ctx.beginPath();
          ctx.moveTo(centerX, centerY);
          ctx.lineTo(refractX, refractY);
          ctx.stroke();

          // Angle arc labels
          ctx.shadowBlur = 0;
          ctx.font = 'bold 11px Inter, sans-serif';

          // Incident Angle i Text
          ctx.fillStyle = '#fca5a5';
          ctx.fillText(`i = ${incidentAngle}°`, centerX - 45, centerY - 35);

          // Refract Angle r Text
          ctx.fillStyle = '#7dd3fc';
          ctx.fillText(`r = ${refractAngle.toFixed(1)}°`, centerX + 20, centerY + 45);
        } else {
          // Total Internal Reflection Warning Text
          ctx.shadowBlur = 0;
          ctx.font = 'bold 12px Inter, sans-serif';
          ctx.fillStyle = '#f87171';
          ctx.fillText('Phản Xạ Toàn Phần!', centerX + 25, centerY + 35);
        }

        ctx.shadowBlur = 0;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [n1, n2, incidentAngle, laserOn, showProtractor, showNormalLine, refractAngle, isTotalInternalReflection]);

  // Handle Table Input Change
  const handleRowChange = (index: number, val: string) => {
    const updated = [...rows];
    updated[index].angleR = val;
    setRows(updated);
  };

  // Submit Final Lab Report
  const handleSubmitReport = () => {
    const parsedUserN2 = parseFloat(userN2);
    if (isNaN(parsedUserN2)) return;

    const errorMargin = Math.abs(parsedUserN2 - n2) / n2;
    let score = 10;

    if (errorMargin > 0.15) score = 5;
    else if (errorMargin > 0.05) score = 8;

    setScoreResult({
      pass: score >= 7,
      score,
      exactN2: n2,
    });
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen w-screen bg-[#05070C] text-slate-100 p-4 md:p-6 flex flex-col items-center font-sans">
      {/* Navigation Header */}
      <div className="w-full max-w-[1600px] flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 rounded-full bg-slate-900 border border-slate-700/60 text-slate-300 hover:text-white text-xs font-bold transition cursor-pointer flex items-center gap-2"
          >
            ← Về Dashboard
          </button>
          <div>
            <h1 className="text-lg font-extrabold text-white tracking-tight flex items-center gap-3">
              <span>Thực Hành Khúc Xạ Ánh Sáng & Định Luật Snell</span>
              <span className="text-[10px] uppercase font-bold tracking-widest bg-cyan-950 text-cyan-400 border border-cyan-700/50 px-3 py-1 rounded-full">
                Linh Kiện PhET Native Engine
              </span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Tái sử dụng Đèn Laser, Khối Khúc Xạ & Thước Đo Góc PhET cho bài lab SGK Vật Lý 11
            </p>
          </div>
        </div>

        {/* Step Indicators */}
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map(stepNum => (
            <button
              key={stepNum}
              onClick={() => setCurrentStep(stepNum)}
              className={`w-8 h-8 rounded-full text-xs font-extrabold flex items-center justify-center transition cursor-pointer ${
                currentStep === stepNum
                  ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/30 scale-110'
                  : currentStep > stepNum
                  ? 'bg-slate-800 text-emerald-400 border border-emerald-500/40'
                  : 'bg-slate-900 text-slate-500 border border-slate-800'
              }`}
            >
              {stepNum}
            </button>
          ))}
        </div>
      </div>

      {/* Main Workbench Grid */}
      <div className="w-full max-w-[1600px] grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1">
        {/* Left Side: PhET Native Component Workbench Canvas */}
        <div className="lg:col-span-7 bg-[#0A0E17] border border-slate-800 rounded-3xl p-4 shadow-2xl flex flex-col justify-between relative overflow-hidden">
          {/* Controls Bar */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 mb-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setLaserOn(!laserOn)}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold border transition ${
                  laserOn
                    ? 'bg-rose-950 text-rose-300 border-rose-700/60 shadow-md shadow-rose-900/30'
                    : 'bg-slate-950 text-slate-400 border-slate-800'
                }`}
              >
                {laserOn ? '🔴 Đèn Laser PhET: Đang Bật' : '⚪ Đèn Laser PhET: Đang Tắt'}
              </button>

              <button
                onClick={() => setShowProtractor(!showProtractor)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                  showProtractor
                    ? 'bg-cyan-950 text-cyan-300 border-cyan-700/60'
                    : 'bg-slate-950 text-slate-400 border-slate-800'
                }`}
              >
                📏 Thước Đo Góc PhET
              </button>
            </div>

            {/* Medium Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-semibold">Môi trường 2:</span>
              <select
                value={n2}
                onChange={e => setN2(Number(e.target.value))}
                className="bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1 text-xs text-cyan-300 font-bold focus:outline-none"
              >
                <option value={1.33}>Nước (n = 1.33)</option>
                <option value={1.50}>Thủy Tinh (n = 1.50)</option>
                <option value={2.42}>Kim Cương (n = 2.42)</option>
              </select>
            </div>
          </div>

          {/* Interactive Refraction Canvas */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-800/80 bg-black flex items-center justify-center">
            <canvas
              ref={canvasRef}
              width={700}
              height={440}
              className="w-full h-auto"
            />
          </div>

          {/* Slider Angle i Control */}
          <div className="mt-3 p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1 max-w-md">
              <span className="text-xs font-semibold text-slate-300">Xoay Đèn Laser (Góc tới i):</span>
              <input
                type="range"
                min={0}
                max={85}
                value={incidentAngle}
                onChange={e => setIncidentAngle(Number(e.target.value))}
                className="w-full accent-rose-500 cursor-pointer"
              />
            </div>
            <span className="text-xs font-extrabold text-rose-400 bg-rose-950 px-3 py-1 rounded-full border border-rose-800/50">
              i = {incidentAngle}°
            </span>
          </div>
        </div>

        {/* Right Side: Vietnam Practical Lab Workflow & Worksheet */}
        <div className="lg:col-span-5 flex flex-col gap-4 overflow-y-auto max-h-[85vh] pr-1">
          {/* Step Guide */}
          <div className="bg-[#0A0E17] border border-cyan-500/30 rounded-3xl p-5 shadow-xl flex flex-col gap-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400 bg-cyan-950 px-2.5 py-0.5 rounded-full border border-cyan-800/40 w-fit">
              Bước {currentStep} / 5
            </span>

            <h2 className="text-base font-extrabold text-white">
              {currentStep === 1 && '1. Khảo Sát Linh Kiện PhET & Chọn Môi Trường'}
              {currentStep === 2 && '2. Đặt Thước Đo Góc PhET Trùng Với Pháp Tuyến'}
              {currentStep === 3 && '3. Bật Đèn Laser PhET & Thay Đổi Góc Tới i'}
              {currentStep === 4 && '4. Điền Bảng Số Liệu sin(i) & sin(r)'}
              {currentStep === 5 && '5. Tính Chiết Suất n2 & Nộp Báo Cáo'}
            </h2>

            <p className="text-xs text-slate-300 leading-relaxed">
              Xoay Đèn Laser PhET để thay đổi góc tới i, đọc góc khúc xạ r trên Thước Đo Góc PhET và tính chiết suất n2 theo công thức n2 = n1 * (sin i / sin r).
            </p>
          </div>

          {/* Student Report Worksheet */}
          <div className="bg-[#0A0E17] border border-cyan-500/30 rounded-3xl p-5 shadow-2xl flex flex-col gap-4">
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center justify-between border-b border-slate-800 pb-3">
              <span>📋 Phiếu Báo Cáo Khúc Xạ Ánh Sáng</span>
              <span className="text-[10px] font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded-full">
                GDPT 2018
              </span>
            </h3>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-slate-300 border-b border-slate-800">
                    <th className="p-2">Lần đo</th>
                    <th className="p-2">Góc tới i (°)</th>
                    <th className="p-2">Góc khúc xạ r (°)</th>
                    <th className="p-2">Tỉ số sin(i)/sin(r)</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, idx) => {
                    const rVal = parseFloat(row.angleR);
                    const iVal = parseFloat(row.angleI);
                    const ratio = !isNaN(rVal) && !isNaN(iVal) && rVal > 0 
                      ? (Math.sin((iVal * Math.PI) / 180) / Math.sin((rVal * Math.PI) / 180)).toFixed(2)
                      : '-';

                    return (
                      <tr key={row.step} className="border-b border-slate-800/60">
                        <td className="p-2 font-bold text-cyan-400">Lần {row.step}</td>
                        <td className="p-2 font-bold text-rose-400">{row.angleI}°</td>
                        <td className="p-2">
                          <input
                            type="number"
                            step="0.1"
                            placeholder="Nhập r°"
                            value={row.angleR}
                            onChange={e => handleRowChange(idx, e.target.value)}
                            className="w-20 px-2 py-1 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
                          />
                        </td>
                        <td className="p-2 font-bold text-emerald-400">{ratio}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Final Calculation Input */}
            <div className="flex flex-col gap-1.5 pt-2">
              <label className="text-xs text-slate-400 font-semibold">
                Nhập chiết suất n2 bạn xác định được:
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="Ví dụ: 1.50"
                value={userN2}
                onChange={e => setUserN2(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>

            <button
              onClick={handleSubmitReport}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:opacity-95 text-white font-extrabold text-xs shadow-lg shadow-cyan-500/20 transition active:scale-95 cursor-pointer"
            >
              Nộp Báo Cáo Khúc Xạ Ánh Sáng
            </button>

            {submitted && scoreResult && (
              <div
                className={`p-3.5 rounded-2xl border text-xs flex flex-col gap-1.5 ${
                  scoreResult.pass
                    ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-200'
                    : 'bg-rose-950/60 border-rose-500/40 text-rose-200'
                }`}
              >
                <div className="flex items-center justify-between font-bold">
                  <span>{scoreResult.pass ? '🎉 ĐẠT CHUẨN BÀI THỰC HÀNH' : '❌ SAI SỐ CHIẾT SUẤT CÓ LỖI'}</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-black/40 border border-current">
                    {scoreResult.score} / 10 ĐIỂM
                  </span>
                </div>
                <p>Chiết suất chuẩn n2 của môi trường: <strong>{scoreResult.exactN2}</strong></p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
