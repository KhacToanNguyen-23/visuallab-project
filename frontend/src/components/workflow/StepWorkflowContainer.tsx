import React from 'react';

export interface StepInfo {
  number: number;
  title: string;
  subtitle: string;
}

const STEPS: StepInfo[] = [
  { number: 1, title: 'Mục tiêu & Lý thuyết', subtitle: 'YCCĐ & Công thức vật lý' },
  { number: 2, title: 'Chuẩn bị dụng cụ', subtitle: 'Chọn thiết bị từ khay' },
  { number: 3, title: 'Tiến hành thí nghiệm', subtitle: 'Thao tác Canvas mô phỏng' },
  { number: 4, title: 'Ghi & Xử lý số liệu', subtitle: 'Bảng số liệu & Đồ thị' },
  { number: 5, title: 'Báo cáo & Kết luận', subtitle: 'Xuất PDF tường trình A4' },
];

interface Props {
  currentStep: number;
  onStepChange: (stepNumber: number) => void;
  maxUnlockedStep: number;
  children: React.ReactNode;
  experimentTitle: string;
  gradeLabel: string;
}

export const StepWorkflowContainer: React.FC<Props> = ({
  currentStep,
  onStepChange,
  maxUnlockedStep,
  children,
  experimentTitle,
  gradeLabel,
}) => {
  return (
    <div className="flex flex-col h-full w-full bg-slate-950 text-white font-sans overflow-hidden">
      {/* Workflow Top Header Bar */}
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-3 flex justify-between items-center shrink-0">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400 bg-blue-950/60 px-2.5 py-0.5 rounded border border-blue-800/40">
            {gradeLabel}
          </span>
          <h2 className="text-base font-bold text-slate-100 mt-0.5">{experimentTitle}</h2>
        </div>

        {/* Navigation Step Buttons */}
        <div className="flex items-center gap-2">
          <button
            disabled={currentStep <= 1}
            onClick={() => onStepChange(currentStep - 1)}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-xs font-semibold rounded-lg transition"
          >
            ← Bước Trước
          </button>
          <button
            disabled={currentStep >= 5 || currentStep >= maxUnlockedStep}
            onClick={() => onStepChange(currentStep + 1)}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-30 text-white text-xs font-semibold rounded-lg transition shadow-md"
          >
            Bước Tiếp Theo →
          </button>
        </div>
      </div>

      {/* 5-Step Stepper Bar */}
      <div className="bg-slate-900/60 border-b border-slate-800/80 px-6 py-2 flex justify-between items-center shrink-0 overflow-x-auto">
        {STEPS.map(step => {
          const isActive = currentStep === step.number;
          const isUnlocked = step.number <= maxUnlockedStep;
          const isCompleted = step.number < currentStep;

          return (
            <button
              key={step.number}
              disabled={!isUnlocked}
              onClick={() => onStepChange(step.number)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition text-left cursor-pointer ${
                isActive
                  ? 'bg-blue-600/20 border border-blue-500/40 text-blue-300'
                  : isCompleted
                  ? 'text-emerald-400 hover:bg-slate-800/50'
                  : isUnlocked
                  ? 'text-slate-300 hover:bg-slate-800/50'
                  : 'text-slate-600 cursor-not-allowed opacity-50'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : isCompleted
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {isCompleted ? '✓' : step.number}
              </div>
              <div className="hidden md:flex flex-col">
                <span className="text-xs font-semibold leading-tight">{step.title}</span>
                <span className="text-[10px] text-slate-400 leading-tight">{step.subtitle}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden relative">{children}</div>
    </div>
  );
};
