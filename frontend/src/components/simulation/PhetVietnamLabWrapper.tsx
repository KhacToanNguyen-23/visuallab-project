import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { VietnameseLabWorksheet } from './VietnameseLabWorksheet';

interface LabStepInfo {
  stepNumber: number;
  title: string;
  detail: string;
  hint: string;
}

const VIETNAM_LAB_STEPS: LabStepInfo[] = [
  {
    stepNumber: 1,
    title: 'Đọc Mục Tiêu & Chuẩn Bị Dụng Cụ',
    detail: 'Mục tiêu: Đo điện trở R của một vật dẫn bằng phương pháp Vôn-Ampe theo định luật Ohm (Vật Lý 11 SGK GDPT 2018). Dụng cụ: Nguồn pin, điện trở R, Ampe kế, Vôn kế, Công tắc.',
    hint: 'Quan sát các bộ phận trên công cụ PhET bên phải.',
  },
  {
    stepNumber: 2,
    title: 'Lắp Mạch Điện Thí Nghiệm',
    detail: 'Mắc nối tiếp Ampe kế với điện trở R và nguồn pin. Mắc song song Vôn kế với hai đầu điện trở R. Đóng công tắc điện.',
    hint: 'Ampe kế đo dòng điện I qua R, Vôn kế đo hiệu điện thế U giữa 2 đầu R.',
  },
  {
    stepNumber: 3,
    title: 'Thu Thập Số Liệu 3 Lần Đo',
    detail: 'Thay đổi hiệu điện thế nguồn Pin (U). Đọc chỉ số U (Vôn) và I (Ampe) tương ứng rồi điền vào Phiếu Báo Cáo.',
    hint: 'Nên chọn 3 mức U khác nhau (ví dụ: 3V, 6V, 9V) để số liệu chính xác.',
  },
  {
    stepNumber: 4,
    title: 'Xử Lý Số Liệu & Tính Sai Số',
    detail: 'Tính điện trở R = U/I cho từng lần đo. Tính giá trị trung bình R_tb và sai số tuyệt đối Delta R.',
    hint: 'R_tb = (R1 + R2 + R3) / 3.',
  },
  {
    stepNumber: 5,
    title: 'Hoàn Thành & Nộp Báo Cáo',
    detail: 'Kiểm tra lại kết quả và bấm "Nộp Phiếu Báo Cáo Thực Hành" để hệ thống chấm điểm bài làm.',
    hint: 'Bài làm đạt yêu cầu khi sai số so với thực tế <= 15%.',
  },
];

export const PhetVietnamLabWrapper: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [completedScore, setCompletedScore] = useState<number | null>(null);

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
              <span>Bài Thực Hành SGK: Đo Điện Trở R (Định Luật Ohm)</span>
              <span className="text-[10px] uppercase font-bold tracking-widest bg-emerald-950 text-emerald-400 border border-emerald-700/50 px-3 py-1 rounded-full">
                Học Liệu Thực Hành Việt Nam
              </span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Kết hợp công cụ thí nghiệm linh kiện PhET HTML5 & Khung 5 Bước thực hành GDPT 2018
            </p>
          </div>
        </div>

        {/* Step indicators */}
        <div className="flex items-center gap-2">
          {VIETNAM_LAB_STEPS.map(s => (
            <button
              key={s.stepNumber}
              onClick={() => setCurrentStep(s.stepNumber)}
              className={`w-8 h-8 rounded-full text-xs font-extrabold flex items-center justify-center transition cursor-pointer ${
                currentStep === s.stepNumber
                  ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/30 scale-110'
                  : currentStep > s.stepNumber
                  ? 'bg-slate-800 text-emerald-400 border border-emerald-500/40'
                  : 'bg-slate-900 text-slate-500 border border-slate-800'
              }`}
            >
              {s.stepNumber}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Left Vietnam Lab Shell Guide & Report | Right PhET Interactive Engine */}
      <div className="w-full max-w-[1600px] grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1">
        {/* Left Side: Step Guide & Report Sheet */}
        <div className="lg:col-span-5 flex flex-col gap-4 overflow-y-auto max-h-[85vh] pr-1">
          {/* Step Guidance Card */}
          <div className="bg-[#0A0E17] border border-cyan-500/30 rounded-3xl p-5 shadow-xl flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400 bg-cyan-950 px-2.5 py-0.5 rounded-full border border-cyan-800/40">
                Bước {currentStep} / 5
              </span>
              {completedScore !== null && (
                <span className="text-xs font-extrabold text-emerald-400 bg-emerald-950 px-3 py-1 rounded-full border border-emerald-500/40">
                  Điểm: {completedScore}/10
                </span>
              )}
            </div>

            <h2 className="text-base font-extrabold text-white">
              {VIETNAM_LAB_STEPS[currentStep - 1].title}
            </h2>

            <p className="text-xs text-slate-300 leading-relaxed">
              {VIETNAM_LAB_STEPS[currentStep - 1].detail}
            </p>

            <div className="p-3 rounded-2xl bg-cyan-950/40 border border-cyan-800/30 text-xs text-cyan-200 flex items-center gap-2">
              <span>💡</span>
              <span><strong>Hướng dẫn:</strong> {VIETNAM_LAB_STEPS[currentStep - 1].hint}</span>
            </div>

            {currentStep < 5 && (
              <button
                onClick={() => setCurrentStep(prev => Math.min(5, prev + 1))}
                className="mt-1 w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs shadow-md transition cursor-pointer"
              >
                Chuyển Sang Bước Tiếp Theo →
              </button>
            )}
          </div>

          {/* Student Report Sheet */}
          <VietnameseLabWorksheet
            onComplete={(score) => {
              setCompletedScore(score);
              setCurrentStep(5);
            }}
          />
        </div>

        {/* Right Side: Inherited Native PhET HTML5 Simulation Apparatus */}
        <div className="lg:col-span-7 bg-[#0A0E17] border border-slate-800 rounded-3xl p-2 shadow-2xl flex flex-col h-[85vh] overflow-hidden">
          <div className="px-4 py-2 bg-[#07090E] rounded-t-2xl border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Bộ Dụng Cụ Thí Nghiệm Linh Kiện PhET (Kế Thừa)
              </span>
            </div>
            <a
              href="/simulations/ohms-law_vi.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-cyan-400 hover:underline font-semibold"
            >
              Mở cửa sổ full ↗
            </a>
          </div>

          <div className="flex-1 bg-black rounded-b-2xl overflow-hidden relative">
            <iframe
              src="/simulations/ohms-law_vi.html"
              title="PhET Ohm's Law Apparatus"
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </div>
  );
};
