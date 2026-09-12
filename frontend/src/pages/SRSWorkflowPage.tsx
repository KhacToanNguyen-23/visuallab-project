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
  { id: 'eq-1', name: 'Giá đỡ thẳng đứng 1m', category: 'Cơ học', icon: 'SPEC', isCorrect: true, spec: 'Độ chia nhỏ nhất 1mm' },
  { id: 'eq-2', name: 'Nam châm điện ngắt ngắt', category: 'Điện học', icon: 'SPEC', isCorrect: true, spec: 'Điện áp 12V DC' },
  { id: 'eq-3', name: 'Bi sắt đường kính 20mm', category: 'Cơ học', icon: 'SPEC', isCorrect: true, spec: 'Khối lượng 20g' },
  { id: 'eq-4', name: '2 Cổng quang điện (E1, E2)', category: 'Cơ học', icon: 'SPEC', isCorrect: true, spec: 'Cảm biến hồng ngoại' },
  { id: 'eq-5', name: 'Đồng hồ MC-964', category: 'Đo lường', icon: 'SPEC', isCorrect: true, spec: 'Độ chính xác 0.0001s' },
  { id: 'eq-6', name: 'Nhiệt lượng kế cách nhiệt', category: 'Nhiệt học', icon: 'SPEC', isCorrect: false, spec: 'Dùng cho nhiệt học' },
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
    setRecords((prev) => [
      ...prev,
      { index: prev.length + 1, paramX: s, paramY: t },
    ]);
    setMaxUnlockedStep((prev) => Math.max(prev, 4));
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
      experimentTitle="Bài 14 (Trang 57 SGK Vật lý 10): Đo Gia Tốc Rơi Tự Do (g)"
      gradeLabel="Vật lí Lớp 10 — Chương III: Động lực học (Bộ Kết nối tri thức)"
    >
      {/* Step 1: Theory */}
      {currentStep === 1 && (
        <div
          className="h-full w-full p-8 flex flex-col gap-6 overflow-y-auto font-sans"
          style={{ backgroundColor: 'var(--bg-main)', color: 'var(--text-main)' }}
        >
          <div>
            <span className="text-xs font-bold text-blue-500 uppercase tracking-wider">
              Bước 1: Mục Tiêu & Tóm Tắt Lý Thuyết
            </span>
            <h3 className="text-2xl font-black tracking-tight mt-1">
              Đo Gia Tốc Rơi Tự Do g (YCCĐ: VL10.DH.TH.01)
            </h3>
          </div>

          <div
            className="border rounded-2xl p-6 flex flex-col gap-4 shadow-xs"
            style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)' }}
          >
            <h4 className="font-bold text-sm text-blue-500">1. Mục tiêu thực hành:</h4>
            <ul className="list-disc list-inside text-xs opacity-80 flex flex-col gap-2 leading-relaxed">
              <li>Xác định gia tốc rơi tự do g của vật rơi tại phòng thí nghiệm.</li>
              <li>Sử dụng thành thạo cổng quang điện hồng ngoại và đồng hồ đo thời gian hiện số MC-964.</li>
              <li>Biết cách ghi bảng số liệu, tự động tính giá trị trung bình g và sai số thực nghiệm.</li>
            </ul>

            <h4 className="font-bold text-sm text-blue-500 mt-2">2. Công thức vật lý liên quan:</h4>
            <div
              className="text-xs font-mono p-4 rounded-xl border leading-relaxed"
              style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)' }}
            >
              <div>Công thức chuyển động rơi tự do (v0 = 0):  s = (1/2) * g * t²</div>
              <div className="font-bold text-blue-500 mt-1">==&gt; Gia tốc rơi tự do:  g = (2 * s) / (t²)</div>
            </div>
          </div>

          <button
            onClick={() => {
              setMaxUnlockedStep((prev) => Math.max(prev, 2));
              setCurrentStep(2);
            }}
            className="w-fit self-end px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
          >
            Đã Hiểu Lý Thuyết ➔ Chuyển Sang Bước 2
          </button>
        </div>
      )}

      {/* Step 2: Equipment Tray */}
      {currentStep === 2 && (
        <EquipmentTray
          availableItems={FREE_FALL_EQUIPMENT}
          onCompleteEquipmentSelection={() => {
            setMaxUnlockedStep((prev) => Math.max(prev, 3));
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
          calculatedResult="g = 9.81 ± 0.15 m/s²"
        />
      )}

      {/* Step 5: Report & Conclusion */}
      {currentStep === 5 && (
        <div
          className="h-full w-full p-8 flex flex-col gap-6 overflow-y-auto font-sans"
          style={{ backgroundColor: 'var(--bg-main)', color: 'var(--text-main)' }}
        >
          <div>
            <span className="text-xs font-bold text-emerald-500 uppercase tracking-wider">
              Bước 5: Kết Luận & Xuất Báo Cáo A4
            </span>
            <h3 className="text-2xl font-black tracking-tight mt-1">Hoàn Thành Bài Thực Hành</h3>
          </div>

          <div
            className="border rounded-2xl p-6 flex flex-col gap-4 shadow-xs"
            style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)' }}
          >
            <label className="text-xs font-bold opacity-90">Viết Kết Luận & Đánh Giá Bài Làm:</label>
            <textarea
              rows={5}
              value={conclusionText}
              onChange={(e) => setConclusionText(e.target.value)}
              placeholder="Nhập nhận xét về kết quả đo gia tốc rơi tự do g và nguyên nhân gây ra sai số..."
              className="border rounded-xl p-3 text-xs focus:outline-none transition-colors"
              style={{
                backgroundColor: 'var(--bg-main)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-main)',
              }}
            />

            <button
              onClick={handleExportPDF}
              className="w-fit px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
            >
              Xuất File Báo Cáo Tường Trình A4 ➔
            </button>
          </div>
        </div>
      )}

      {toastMsg && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-full text-xs font-bold shadow-xl border border-blue-400 z-50">
          {toastMsg}
        </div>
      )}
    </StepWorkflowContainer>
  );
};

export default SRSWorkflowPage;
