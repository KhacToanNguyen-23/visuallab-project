import React, { useState } from 'react';
import { StepWorkflowContainer } from '../components/workflow/StepWorkflowContainer';
import { EquipmentTray } from '../components/workflow/EquipmentTray';
import type { EquipmentItem } from '../components/workflow/EquipmentTray';
import { FreeFallCanvas } from '../components/simulations/FreeFallCanvas';
import { DataTableAndGraph } from '../components/workflow/DataTableAndGraph';
import type { MeasurementRecord } from '../components/workflow/DataTableAndGraph';
import { exportReportToPDF } from '../utils/pdfExport';
import { useAuth } from '../context/AuthContext';

const FREE_FALL_EQUIPMENT: EquipmentItem[] = [
  { id: 'eq-1', name: 'Giá đỡ thẳng đứng 1m', category: 'Cơ học', icon: '📏', isCorrect: true, spec: 'Độ chia nhỏ nhất 1mm' },
  { id: 'eq-2', name: 'Nam châm điện ngắt ngắt', category: 'Điện học', icon: '🧲', isCorrect: true, spec: 'Điện áp 12V DC' },
  { id: 'eq-3', name: 'Bi sắt đường kính 20mm', category: 'Cơ học', icon: '⚪', isCorrect: true, spec: 'Khối lượng 20g' },
  { id: 'eq-4', name: '2 Cổng quang điện (E1, E2)', category: 'Cơ học', icon: '🚨', isCorrect: true, spec: 'Cảm biến hồng ngoại' },
  { id: 'eq-5', name: 'Đồng hồ MC-964', category: 'Đo lường', icon: '⏱️', isCorrect: true, spec: 'Độ chính xác 0.0001s' },
  { id: 'eq-6', name: 'Nhiệt lượng kế cách nhiệt', category: 'Nhiệt học', icon: '🧪', isCorrect: false, spec: 'Dùng cho nhiệt học' },
];

export const SRSWorkflowPage: React.FC = () => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [maxUnlockedStep, setMaxUnlockedStep] = useState(1);
  const [records, setRecords] = useState<MeasurementRecord[]>([]);
  const [conclusionText, setConclusionText] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleRecordMeasurement = (s: number, t: number) => {
    setRecords(prev => [
      ...prev,
      { index: prev.length + 1, paramX: s, paramY: t },
    ]);
    setMaxUnlockedStep(prev => Math.max(prev, 4));
    showToast(`Đã ghi nhận số liệu lần đo #${records.length + 1}: s = ${s}m, t = ${t}s`);
  };

  const handleExportPDF = () => {
    exportReportToPDF(
      'Đo gia tốc rơi tự do g (Lớp 10)',
      user?.fullName || 'Học sinh EduLab',
      user?.school || 'THPT Chuyên Hà Nội - Amsterdam',
      conclusionText
    );
    showToast('Đã xuất file PDF bản tường trình A4 thành công!');
  };

  return (
    <StepWorkflowContainer
      currentStep={currentStep}
      onStepChange={setCurrentStep}
      maxUnlockedStep={maxUnlockedStep}
      experimentTitle="Bài 1: Đo Gia Tốc Rơi Tự Do (g)"
      gradeLabel="Vật lí Lớp 10 — Bộ sách Kết nối tri thức"
    >
      {/* Step 1: Theory */}
      {currentStep === 1 && (
        <div className="h-full w-full p-8 bg-slate-950 text-slate-100 flex flex-col gap-6 overflow-y-auto">
          <div>
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
              Bước 1: Mục Tiêu & Tóm Tắt Lý Thuyết
            </span>
            <h3 className="text-2xl font-bold text-white mt-1">
              Đo Gia Tốc Rơi Tự Do (Mã YCCĐ: VL10.DH.TH.01)
            </h3>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col gap-4">
            <h4 className="font-bold text-sm text-blue-400">1. Mục tiêu thực hành:</h4>
            <ul className="list-disc list-inside text-xs text-slate-300 flex flex-col gap-1.5 leading-relaxed">
              <li>Xác định được gia tốc rơi tự do gia tốc g của vật tại phòng thí nghiệm.</li>
              <li>Sử dụng thành thạo đồng hồ hiện số MC-964 và cổng quang điện.</li>
              <li>Biết cách ghi bảng số liệu, tự động tính sai số trung bình và vẽ đồ thị s - t².</li>
            </ul>

            <h4 className="font-bold text-sm text-cyan-400 mt-2">2. Công thức liên quan:</h4>
            <p className="text-xs text-slate-300 font-mono bg-slate-950 p-4 rounded-xl border border-slate-800">
              Công thức rơi tự do:  s = 1/2 * g * t^2  ==&gt;  g = (2 * s) / (t^2)
            </p>
          </div>

          <button
            onClick={() => {
              setMaxUnlockedStep(prev => Math.max(prev, 2));
              setCurrentStep(2);
            }}
            className="w-fit self-end px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl shadow-lg transition"
          >
            Đã Hiểu Lý Thuyết $\rightarrow$ Chuyển Sang Bước 2
          </button>
        </div>
      )}

      {/* Step 2: Equipment Tray */}
      {currentStep === 2 && (
        <EquipmentTray
          availableItems={FREE_FALL_EQUIPMENT}
          onCompleteEquipmentSelection={() => {
            setMaxUnlockedStep(prev => Math.max(prev, 3));
            setCurrentStep(3);
          }}
        />
      )}

      {/* Step 3: Interactive Canvas */}
      {currentStep === 3 && (
        <FreeFallCanvas onRecordMeasurement={handleRecordMeasurement} />
      )}

      {/* Step 4: Data Table & Graphing */}
      {currentStep === 4 && (
        <DataTableAndGraph
          records={records}
          xLabel="Quãng đường s (m)"
          yLabel="Thời gian t (s)"
          calculatedResult="g = 9.80 ± 0.05 m/s²"
        />
      )}

      {/* Step 5: Report & Conclusion */}
      {currentStep === 5 && (
        <div className="h-full w-full p-8 bg-slate-950 text-slate-100 flex flex-col gap-6 overflow-y-auto">
          <div>
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              Bước 5: Kết Luận & Xuất Báo Cáo A4
            </span>
            <h3 className="text-2xl font-bold text-white mt-1">Hoàn Thành Bài Thực Hành</h3>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col gap-4">
            <label className="text-xs font-bold text-slate-300">Viết Kết Luận & Đánh Giá Bài Làm:</label>
            <textarea
              rows={5}
              value={conclusionText}
              onChange={e => setConclusionText(e.target.value)}
              placeholder="Nhập nhận xét về kết quả đo gia tốc rơi tự do g và nguyên nhân gây ra sai số..."
              className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-blue-500"
            />

            <button
              onClick={handleExportPDF}
              className="w-fit px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg transition cursor-pointer"
            >
              📄 Xuất File Báo Cáo Tường Trình A4
            </button>
          </div>
        </div>
      )}

      {toastMsg && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-full text-xs font-semibold shadow-2xl border border-blue-400 animate-bounce z-50">
          ✨ {toastMsg}
        </div>
      )}
    </StepWorkflowContainer>
  );
};
