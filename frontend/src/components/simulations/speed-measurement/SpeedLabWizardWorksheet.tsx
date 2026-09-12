import React, { useState } from 'react';
import type { AutoGradeResult } from './speedLabEngine';
import { evaluateStudentSubmission } from './speedLabEngine';

interface SpeedLabWizardWorksheetProps {
  mode: 'AVERAGE_SPEED' | 'INSTANTANEOUS_SPEED';
  trackAngleDeg: number;
  gateEPosCm: number;
  gateFPosCm: number;
  ballDiameterCm: number;
  isCorrectAssembly: boolean;
  totalTrialsCount: number;
  currentTimerReading: number | null;
  onGraded?: (result: AutoGradeResult) => void;
}

interface MeasurementRowData {
  id: number;
  distCm: number | null;
  angleDeg: number | null;
  timeSec: string;
}

export const SpeedLabWizardWorksheet: React.FC<SpeedLabWizardWorksheetProps> = ({
  mode,
  trackAngleDeg,
  gateEPosCm,
  gateFPosCm,
  ballDiameterCm,
  isCorrectAssembly,
  totalTrialsCount,
  currentTimerReading,
  onGraded,
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  const currentDistanceCm =
    mode === 'AVERAGE_SPEED'
      ? Math.abs(gateFPosCm - gateEPosCm)
      : ballDiameterCm;

  // 5 rows data
  const [rows, setRows] = useState<MeasurementRowData[]>([
    { id: 1, distCm: null, angleDeg: null, timeSec: '' },
    { id: 2, distCm: null, angleDeg: null, timeSec: '' },
    { id: 3, distCm: null, angleDeg: null, timeSec: '' },
    { id: 4, distCm: null, angleDeg: null, timeSec: '' },
    { id: 5, distCm: null, angleDeg: null, timeSec: '' },
  ]);

  // Student manual calculation inputs
  const [studentAvgT, setStudentAvgT] = useState<string>('');
  const [studentAvgV, setStudentAvgV] = useState<string>('');
  const [studentDeltaV, setStudentDeltaV] = useState<string>('');

  // Post-lab quiz answers
  const [quizAnswers, setQuizAnswers] = useState<{ q1: string; q2: string; q3: string }>({
    q1: '',
    q2: '',
    q3: '',
  });

  // Evaluation state
  const [gradeResult, setGradeResult] = useState<AutoGradeResult | null>(null);

  const handleTimeChange = (index: number, val: string) => {
    const updated = [...rows];
    updated[index].timeSec = val;
    // When student types or edits, snapshot their currently adjusted angle and distance
    if (updated[index].distCm === null) updated[index].distCm = currentDistanceCm;
    if (updated[index].angleDeg === null) updated[index].angleDeg = trackAngleDeg;
    setRows(updated);
  };

  // Auto-fill latest timer reading along with CURRENT distance & angle adjusted by student
  const handleAutoFillFromTimer = () => {
    if (currentTimerReading === null || currentTimerReading <= 0) return;
    const firstEmptyIndex = rows.findIndex(r => !r.timeSec || parseFloat(r.timeSec.replace(',', '.')) <= 0);
    const targetIdx = firstEmptyIndex !== -1 ? firstEmptyIndex : 0;

    const updated = [...rows];
    updated[targetIdx] = {
      id: targetIdx + 1,
      distCm: currentDistanceCm,
      angleDeg: trackAngleDeg,
      timeSec: currentTimerReading.toFixed(3),
    };
    setRows(updated);
  };

  // Reset a specific row to re-measure
  const handleClearRow = (index: number) => {
    const updated = [...rows];
    updated[index] = {
      id: index + 1,
      distCm: null,
      angleDeg: null,
      timeSec: '',
    };
    setRows(updated);
  };

  // Quick auto-calculate helper for Step 2
  const handleAutoComputeHelper = () => {
    const validRows = rows.filter(r => {
      const p = parseFloat(r.timeSec.replace(',', '.'));
      return !isNaN(p) && p > 0;
    });

    if (validRows.length === 0) return;

    const times = validRows.map(r => parseFloat(r.timeSec.replace(',', '.')));
    const avgT = times.reduce((a, b) => a + b, 0) / times.length;
    
    // Average distance across recorded trials
    const avgDistM = validRows.reduce((a, b) => a + (b.distCm ?? currentDistanceCm), 0) / validRows.length / 100;
    const avgV = avgDistM / avgT;

    // Mean absolute deviation
    const avgDeltaT = times.map(t => Math.abs(t - avgT)).reduce((a, b) => a + b, 0) / times.length;
    const deltaV = avgV * (avgDeltaT / avgT);

    setStudentAvgT(avgT.toFixed(3));
    setStudentAvgV(avgV.toFixed(3));
    setStudentDeltaV(deltaV.toFixed(3));
  };

  // Count valid measurements
  const validTrialCount = rows.filter(r => {
    const p = parseFloat(r.timeSec.replace(',', '.'));
    return !isNaN(p) && p > 0;
  }).length;

  const handleGradeSubmission = () => {
    const validTrials = rows
      .map(r => ({ distanceCm: r.distCm ?? currentDistanceCm, timeSec: parseFloat(r.timeSec.replace(',', '.')) }))
      .filter(r => !isNaN(r.timeSec) && r.timeSec > 0);

    const parsedAvgV = parseFloat(studentAvgV.replace(',', '.'));

    const result = evaluateStudentSubmission(
      mode,
      trackAngleDeg,
      gateEPosCm,
      gateFPosCm,
      ballDiameterCm,
      isCorrectAssembly && totalTrialsCount >= 3,
      validTrials,
      isNaN(parsedAvgV) ? 0 : parsedAvgV,
      quizAnswers
    );

    setGradeResult(result);
    if (onGraded) onGraded(result);
  };

  return (
    <div className="bg-slate-900/95 backdrop-blur-md border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xl flex flex-col justify-between space-y-3.5 text-slate-100 min-h-[500px]">
      {/* Wizard Progress Header */}
      <div className="border-b border-slate-800 pb-2.5 space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-xs uppercase tracking-wider text-white flex items-center gap-1.5">
            <span className="text-cyan-400">📋</span> Báo Cáo Thực Hành Đo Tốc Độ
          </h3>
          <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/30">
            {mode === 'AVERAGE_SPEED' ? 'Tốc độ trung bình' : 'Tốc độ tức thời'}
          </span>
        </div>

        {/* 3 Steps Navigation Pills */}
        <div className="grid grid-cols-3 gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800/80 text-[11px] font-medium">
          <button
            onClick={() => setCurrentStep(1)}
            className={`py-1.5 px-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              currentStep === 1
                ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                : validTrialCount >= 3
                ? 'text-emerald-400 hover:bg-slate-900'
                : 'text-slate-400 hover:bg-slate-900'
            }`}
          >
            <span>1. Số liệu ({validTrialCount}/3)</span>
          </button>

          <button
            onClick={() => setCurrentStep(2)}
            className={`py-1.5 px-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              currentStep === 2
                ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                : studentAvgV
                ? 'text-emerald-400 hover:bg-slate-900'
                : 'text-slate-400 hover:bg-slate-900'
            }`}
          >
            <span>2. Tính sai số</span>
          </button>

          <button
            onClick={() => setCurrentStep(3)}
            className={`py-1.5 px-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              currentStep === 3
                ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                : gradeResult
                ? 'text-emerald-400 hover:bg-slate-900'
                : 'text-slate-400 hover:bg-slate-900'
            }`}
          >
            <span>3. Trắc nghiệm</span>
          </button>
        </div>
      </div>

      {/* Step 1: Data Collection & Experimental Parameters */}
      {currentStep === 1 && (
        <div className="space-y-3 flex-1 flex flex-col justify-between">
          <div className="space-y-2.5">
            {/* Real-time Experimental Condition Pill */}
            <div className="bg-slate-950/70 border border-slate-800 p-2.5 rounded-xl text-[10px] font-mono grid grid-cols-2 gap-2 text-slate-300">
              <div>
                <span className="text-slate-500 block">Góc đang điều chỉnh:</span>
                <span className="text-cyan-400 font-bold">Góc nghiêng α = {trackAngleDeg}°</span>
              </div>
              <div>
                <span className="text-slate-500 block">
                  {mode === 'AVERAGE_SPEED' ? 'Quãng đường đang chỉnh:' : 'Đường kính chắn tia d:'}
                </span>
                <span className="text-emerald-400 font-bold">
                  {mode === 'AVERAGE_SPEED' ? `${currentDistanceCm.toFixed(1)} cm (± 0.1cm)` : '2.0 cm (± 0.1cm)'}
                </span>
              </div>
            </div>

            {/* Action Bar for Recording */}
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-200">
                Thả bi và bấm ghi số liệu:
              </span>
              {currentTimerReading !== null && currentTimerReading > 0 && (
                <button
                  onClick={handleAutoFillFromTimer}
                  className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-mono text-[11px] font-bold hover:from-cyan-500 hover:to-blue-500 shadow-md shadow-cyan-500/20 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                  title="Ghi nhận góc, quãng đường và thời gian của lần đo này"
                >
                  <span>+ Ghi số ({currentTimerReading.toFixed(3)}s)</span>
                </button>
              )}
            </div>

            {/* Measurement Data Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-xs text-left font-mono">
                <thead className="bg-slate-950/90 text-slate-400 text-[10px] uppercase border-b border-slate-800">
                  <tr>
                    <th className="p-2 text-center">Lần</th>
                    <th className="p-2">Góc α</th>
                    <th className="p-2">{mode === 'AVERAGE_SPEED' ? 'Quãng đường s' : 'Đường kính d'}</th>
                    <th className="p-2">Thời gian Δt</th>
                    <th className="p-2">Tốc độ v</th>
                    <th className="p-2 text-center"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-xs">
                  {rows.slice(0, 4).map((row, idx) => {
                    const parsedTime = parseFloat(row.timeSec.replace(',', '.'));
                    const isRecorded = !isNaN(parsedTime) && parsedTime > 0;
                    
                    // Display either the frozen recorded value or the live adjusted value
                    const displayAngle = row.angleDeg !== null ? row.angleDeg : trackAngleDeg;
                    const displayDist = row.distCm !== null ? row.distCm : currentDistanceCm;
                    
                    const computedV =
                      isRecorded
                        ? ((displayDist / 100) / parsedTime).toFixed(3) + ' m/s'
                        : '-';

                    return (
                      <tr key={row.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="p-2 text-center font-bold text-slate-400">{row.id}</td>
                        <td className="p-2">
                          <span className={isRecorded ? 'text-cyan-300 font-bold' : 'text-slate-500 italic'}>
                            {displayAngle}° {!isRecorded && <span className="text-[9px] opacity-70">(chỉnh)</span>}
                          </span>
                        </td>
                        <td className="p-2">
                          <span className={isRecorded ? 'text-slate-200' : 'text-slate-500 italic'}>
                            {displayDist.toFixed(1)} cm
                          </span>
                        </td>
                        <td className="p-2">
                          <input
                            type="text"
                            placeholder="Nhập..."
                            value={row.timeSec}
                            onChange={e => handleTimeChange(idx, e.target.value)}
                            className="bg-slate-950 border border-slate-700/80 rounded px-2 py-0.5 text-emerald-400 font-mono w-20 focus:outline-none focus:border-cyan-500 text-xs font-bold"
                          />
                        </td>
                        <td className="p-2 text-cyan-400 font-bold">{computedV}</td>
                        <td className="p-2 text-center">
                          {isRecorded && (
                            <button
                              onClick={() => handleClearRow(idx)}
                              className="text-slate-500 hover:text-rose-400 text-[10px] cursor-pointer"
                              title="Xóa để đo lại lần này"
                            >
                              ✕
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Next Step Action */}
          <div className="pt-2 flex justify-between items-center border-t border-slate-800/80">
            <span className="text-[11px] text-slate-400">
              {validTrialCount >= 3 ? (
                <span className="text-emerald-400 font-medium">✓ Đã đủ {validTrialCount} lần đo</span>
              ) : (
                <span className="text-amber-400">Cần thực hiện thêm {3 - validTrialCount} lần đo nữa</span>
              )}
            </span>
            <button
              onClick={() => setCurrentStep(2)}
              disabled={validTrialCount < 3}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                validTrialCount >= 3
                  ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <span>Tiếp Tục: Tính Sai Số ➔</span>
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Formulas & Error Analysis */}
      {currentStep === 2 && (
        <div className="space-y-3 flex-1 flex flex-col justify-between">
          <div className="space-y-2.5">
            {/* Visual Math Formula Card */}
            <div className="bg-slate-950/80 border border-cyan-500/30 rounded-xl p-3 space-y-1.5 text-xs font-mono">
              <div className="text-cyan-300 font-bold text-[11px] uppercase flex items-center justify-between">
                <span>📖 Công Thức SGK Trang 29:</span>
                <button
                  onClick={handleAutoComputeHelper}
                  className="text-[10px] text-cyan-400 underline hover:text-cyan-200 cursor-pointer"
                  title="Hỗ trợ tính tự động để tham khảo"
                >
                  ⚡ Tính nhanh mẫu
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300 pt-1">
                <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">1. Thời gian TB:</span>
                  <span className="text-emerald-400 font-bold">t̄ = (t₁ + t₂ + ... + tₙ) / n</span>
                </div>
                <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">2. Tốc độ TB:</span>
                  <span className="text-cyan-400 font-bold">v̄ = s̄ / t̄</span>
                </div>
              </div>
            </div>

            {/* Input fields */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                <label className="block text-[10px] text-slate-400 mb-1">Thời gian TB t̄ (s):</label>
                <input
                  type="text"
                  placeholder="VD: 0.612"
                  value={studentAvgT}
                  onChange={e => setStudentAvgT(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200 font-mono text-xs focus:outline-none focus:border-cyan-500 font-bold"
                />
              </div>

              <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                <label className="block text-[10px] text-slate-400 mb-1">Tốc độ TB v̄ (m/s):</label>
                <input
                  type="text"
                  placeholder="VD: 0.815"
                  value={studentAvgV}
                  onChange={e => setStudentAvgV(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-cyan-300 font-mono font-bold text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                <label className="block text-[10px] text-slate-400 mb-1">Sai số tuyệt đối Δv:</label>
                <input
                  type="text"
                  placeholder="VD: 0.020"
                  value={studentDeltaV}
                  onChange={e => setStudentDeltaV(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200 font-mono text-xs focus:outline-none focus:border-cyan-500 font-bold"
                />
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-between items-center border-t border-slate-800/80">
            <button
              onClick={() => setCurrentStep(1)}
              className="px-3 py-1.5 rounded-xl text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
            >
              ← Quay lại Số liệu
            </button>
            <button
              onClick={() => setCurrentStep(3)}
              disabled={!studentAvgV}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                studentAvgV
                  ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <span>Tiếp Tục: Làm Trắc Nghiệm ➔</span>
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Comprehension Quiz & Auto-Grading */}
      {currentStep === 3 && (
        <div className="space-y-3 flex-1 flex flex-col justify-between">
          <div className="space-y-2">
            {/* Question 1 */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-2.5 space-y-1.5 text-xs">
              <p className="font-semibold text-slate-200 text-[11px]">
                1. Đo thời gian lặp lại 3 đến 5 lần có ý nghĩa gì?
              </p>
              <div className="grid grid-cols-2 gap-1 text-[10px]">
                {[
                  { key: 'A', text: 'Triệt tiêu sai số dụng cụ' },
                  { key: 'B', text: 'Giảm sai số ngẫu nhiên' },
                ].map(opt => (
                  <button
                    key={opt.key}
                    onClick={() => setQuizAnswers(prev => ({ ...prev, q1: opt.key }))}
                    className={`p-1.5 rounded-lg border text-left cursor-pointer transition-all ${
                      quizAnswers.q1 === opt.key
                        ? 'bg-cyan-950/60 border-cyan-500 text-cyan-200 font-bold'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <strong>{opt.key}.</strong> {opt.text}
                  </button>
                ))}
              </div>
            </div>

            {/* Question 2 */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-2.5 space-y-1.5 text-xs">
              <p className="font-semibold text-slate-200 text-[11px]">
                2. Công thức tính tốc độ trung bình v_tb giữa 2 cổng quang?
              </p>
              <div className="grid grid-cols-2 gap-1 text-[10px]">
                {[
                  { key: 'A', text: 'v = s / Δt' },
                  { key: 'B', text: 'v = s × Δt' },
                ].map(opt => (
                  <button
                    key={opt.key}
                    onClick={() => setQuizAnswers(prev => ({ ...prev, q2: opt.key }))}
                    className={`p-1.5 rounded-lg border text-left cursor-pointer transition-all ${
                      quizAnswers.q2 === opt.key
                        ? 'bg-cyan-950/60 border-cyan-500 text-cyan-200 font-bold'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <strong>{opt.key}.</strong> {opt.text}
                  </button>
                ))}
              </div>
            </div>

            {/* Question 3 */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-2.5 space-y-1.5 text-xs">
              <p className="font-semibold text-slate-200 text-[11px]">
                3. Khi đường kính d rất nhỏ, tỉ số v = d / Δt_E xấp xỉ tốc độ gì?
              </p>
              <div className="grid grid-cols-1 gap-1 text-[10px]">
                {[
                  { key: 'C', text: 'Tốc độ tức thời tại cổng E' },
                  { key: 'D', text: 'Gia tốc trọng trường g' },
                ].map(opt => (
                  <button
                    key={opt.key}
                    onClick={() => setQuizAnswers(prev => ({ ...prev, q3: opt.key }))}
                    className={`p-1.5 rounded-lg border text-left cursor-pointer transition-all ${
                      quizAnswers.q3 === opt.key
                        ? 'bg-cyan-950/60 border-cyan-500 text-cyan-200 font-bold'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <strong>{opt.key}.</strong> {opt.text}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Submit Grade & Result */}
          <div className="space-y-2 pt-1 border-t border-slate-800/80">
            <button
              onClick={handleGradeSubmission}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer"
            >
              <span>🏆 Nộp Báo Cáo & Chấm Điểm</span>
            </button>

            {gradeResult && (
              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-xs text-emerald-200 space-y-1.5 animate-in fade-in">
                <div className="flex justify-between items-center font-bold">
                  <span>{gradeResult.isPass ? '✓ ĐẠT YÊU CẦU' : 'CẦN KIỂM TRA LẠI'}</span>
                  <span className="font-mono text-lg text-emerald-400">{gradeResult.totalScore}/10</span>
                </div>
                <div className="grid grid-cols-3 gap-1 text-center font-mono text-[10px] text-slate-300">
                  <div className="bg-slate-950/60 p-1 rounded">Thao tác: {gradeResult.operationScore}/3</div>
                  <div className="bg-slate-950/60 p-1 rounded">Sai số: {gradeResult.accuracyScore}/4</div>
                  <div className="bg-slate-950/60 p-1 rounded">Trắc nghiệm: {gradeResult.quizScore}/3</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
