import React, { useState, useMemo } from 'react';
import {
  evaluateEmfInternalRReport,
  DEFAULT_EMF_MISSIONS,
  POWER_SOURCE_PRESETS,
  type EmfGradingResult,
  type EmfMeasurementRecord,
  type LinearRegressionResult,
} from './emfInternalREngine';

export interface EmfSubmissionDetails {
  records: EmfMeasurementRecord[];
  studentObservation?: string;
  quizAnswers: { q1: string; q2: string; q3: string };
  regression: LinearRegressionResult;
  gradeResult: EmfGradingResult;
}

interface EmfInternalRLabWizardWorksheetProps {
  currentSourceId: string;
  currentRheostatROhms: number;
  currentIAmps: number;
  currentUVolts: number;
  records: EmfMeasurementRecord[];
  assignmentId?: string;
  onAddRecordForMission: (missionId: number) => void;
  onRemoveRecord: (index: number) => void;
  onClearRecords: () => void;
  onGraded?: (result: EmfGradingResult, details?: EmfSubmissionDetails) => void;
  onOpenSubmissionDrawer?: () => void;
}

export const EmfInternalRLabWizardWorksheet: React.FC<EmfInternalRLabWizardWorksheetProps> = ({
  currentSourceId: _currentSourceId,
  currentRheostatROhms: _currentRheostatROhms,
  currentIAmps: _currentIAmps,
  currentUVolts: _currentUVolts,
  records,
  assignmentId,
  onAddRecordForMission,
  onRemoveRecord,
  onClearRecords,
  onGraded,
  onOpenSubmissionDrawer,
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [gradingResultState, setGradingResultState] = useState<EmfGradingResult | null>(null);

  // Student observation notes
  const [studentObservation, setStudentObservation] = useState<string>('');

  // Quiz answers
  const [quizAnswers, setQuizAnswers] = useState<{ q1: string; q2: string; q3: string }>({
    q1: '',
    q2: '',
    q3: '',
  });

  // Calculate mission completion status
  const missionsWithStatus = useMemo(() => {
    return DEFAULT_EMF_MISSIONS.map(m => {
      const matchCount = records.filter(r => r.sourceId === m.sourceId || r.missionId === m.id).length;
      return {
        ...m,
        isCompleted: matchCount >= m.minPoints,
        recordedPoints: matchCount,
      };
    });
  }, [records]);

  // Current evaluation and regression
  const { result: _currentEvaluation, regression } = useMemo(() => {
    return evaluateEmfInternalRReport(records, quizAnswers);
  }, [records, quizAnswers]);

  // Submit and grade
  const handleGradeAndSubmit = () => {
    const { result, regression: reg } = evaluateEmfInternalRReport(records, quizAnswers);
    setGradingResultState(result);
    setIsSubmitted(true);

    const submissionDetails: EmfSubmissionDetails = {
      records,
      studentObservation,
      quizAnswers,
      regression: reg,
      gradeResult: result,
    };

    try {
      localStorage.setItem(
        'edulab_emf_internal_r_grade_result',
        JSON.stringify({
          assignmentId,
          result,
          details: {
            rows: records,
            studentObservation,
            quizAnswers,
            regression: reg,
          },
        })
      );
    } catch {
      // Ignore localStorage write error
    }

    if (onGraded) {
      onGraded(result, submissionDetails);
    }

    if (onOpenSubmissionDrawer) {
      onOpenSubmissionDrawer();
    }
  };

  const completedMissionsCount = missionsWithStatus.filter(m => m.isCompleted).length;

  return (
    <div className="w-full h-full bg-slate-900/95 backdrop-blur-md rounded-2xl border border-slate-800 shadow-2xl flex flex-col overflow-hidden">
      {/* Header & Tabs */}
      <div className="bg-slate-950/80 px-5 py-4 border-b border-slate-800 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-black text-slate-100 flex items-center gap-2">
              <span>📋</span> Báo Cáo Đo Suất Điện Động & Nội Trở (E, r)
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              SGK Vật lý 11
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">Xác định E và r qua phương pháp ngoại suy đồ thị tuyến tính U = E - I•r</p>
        </div>

        {/* Wizard Step Nav */}
        <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setCurrentStep(1)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              currentStep === 1
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>1. Nhiệm Vụ</span>
            {completedMissionsCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            )}
          </button>
          <button
            onClick={() => setCurrentStep(2)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              currentStep === 2
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>2. Số Liệu</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-800 text-[10px] text-slate-300">
              {records.length}
            </span>
          </button>
          <button
            onClick={() => setCurrentStep(3)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              currentStep === 3
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>3. Nộp Bài</span>
            {isSubmitted && <span className="text-emerald-400 font-bold">✓</span>}
          </button>
        </div>
      </div>

      {/* Tab Content Container */}
      <div className="flex-1 p-5 overflow-y-auto custom-scrollbar">
        {/* TAB 1: MISSIONS */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-lg">🎯</span>
                <div>
                  <h3 className="text-xs font-bold text-amber-300">3 Nhiệm Vụ Khảo Sát Nguồn Điện</h3>
                  <p className="text-[11px] text-slate-400">
                    Đo các cặp giá trị (I, U) ở các nấc biến trở khác nhau để vẽ đồ thị đường thẳng ngoại suy.
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono font-bold text-amber-400">
                  Đã ghi: {completedMissionsCount}/3 nhiệm vụ
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {missionsWithStatus.map(mission => {
                const source = POWER_SOURCE_PRESETS.find(s => s.id === mission.sourceId);
                return (
                  <div
                    key={mission.id}
                    className={`p-4 rounded-xl border transition-all ${
                      mission.isCompleted
                        ? 'bg-emerald-950/20 border-emerald-500/40 shadow-sm'
                        : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs mt-0.5 shrink-0 ${
                            mission.isCompleted
                              ? 'bg-emerald-500 text-slate-950'
                              : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {mission.isCompleted ? '✓' : mission.id}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-xs font-bold text-slate-200">{mission.title}</h4>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                mission.isCompleted
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              }`}
                            >
                              {mission.isCompleted
                                ? `Đã hoàn thành (${mission.recordedPoints} lần đo)`
                                : `Đã ghi ${mission.recordedPoints}/${mission.minPoints} lần đo`}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                            {mission.description}
                          </p>

                          <div className="flex items-center gap-3 mt-2.5 text-[11px] text-slate-400 font-mono">
                            <span>Nguồn: <strong className="text-slate-300">{source ? source.name : 'Bộ Nguồn'}</strong></span>
                            <span>•</span>
                            <span>Suất điện động danh định: <strong className="text-amber-400">{source?.standardEmfV.toFixed(1)}V</strong></span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => onAddRecordForMission(mission.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                          mission.isCompleted
                            ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                            : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                        }`}
                      >
                        <span>{mission.isCompleted ? '🔄 Ghi Thêm Điểm' : '📥 Ghi Nhận Số Liệu'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setCurrentStep(2)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition-all flex items-center gap-1.5"
              >
                <span>Xem Bảng Số Liệu & Đồ Thị U-I</span>
                <span>➔</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: DATA TABLE & U-I REGRESSION GRAPH */}
        {currentStep === 2 && (
          <div className="space-y-4">
            {/* Header Stats */}
            <div className="grid grid-cols-4 gap-2.5">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] font-semibold text-slate-400 uppercase">Số Điểm Đo</span>
                <p className="text-lg font-black text-amber-400 font-mono mt-0.5">{records.length}</p>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] font-semibold text-slate-400 uppercase">E (Ngoại Suy)</span>
                <p className="text-lg font-black text-emerald-400 font-mono mt-0.5">
                  {regression.emfCalculated} <span className="text-xs">V</span>
                </p>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] font-semibold text-slate-400 uppercase">r (Ngoại Suy)</span>
                <p className="text-lg font-black text-sky-400 font-mono mt-0.5">
                  {regression.internalRCalculated} <span className="text-xs">Ω</span>
                </p>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] font-semibold text-slate-400 uppercase">Độ Tương Quan R²</span>
                <p className="text-lg font-black text-purple-400 font-mono mt-0.5">
                  {regression.rSquared}
                </p>
              </div>
            </div>

            {/* Measurements Table */}
            <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden shadow-inner">
              <div className="px-4 py-2.5 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">Bảng Số Liệu Đo Điện Áp & Dòng Điện</span>
                {records.length > 0 && (
                  <button
                    onClick={onClearRecords}
                    className="text-[11px] text-rose-400 hover:text-rose-300 transition-colors"
                  >
                    Xóa tất cả
                  </button>
                )}
              </div>

              {records.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500">
                  Chưa có dữ liệu nào. Vui lòng đóng khóa K, kéo biến trở và bấm <strong>+ Ghi Số Liệu</strong>.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-slate-900/50 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                      <tr>
                        <th className="py-2 px-3">STT</th>
                        <th className="py-2 px-3">Nguồn Điện</th>
                        <th className="py-2 px-3">Biến Trở R (Ω)</th>
                        <th className="py-2 px-3">Dòng Điện I (A)</th>
                        <th className="py-2 px-3">Điện Áp U (V)</th>
                        <th className="py-2 px-3 text-right">Xóa</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-300">
                      {records.map((r, idx) => (
                        <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                          <td className="py-2 px-3 font-bold text-amber-400">#{r.step}</td>
                          <td className="py-2 px-3 font-sans">{r.sourceName}</td>
                          <td className="py-2 px-3 text-emerald-400 font-bold">{r.rheostatROhms} Ω</td>
                          <td className="py-2 px-3 text-sky-400 font-bold">{r.currentIAmps.toFixed(3)} A</td>
                          <td className="py-2 px-3 text-amber-300 font-bold">{r.voltageUVolts.toFixed(2)} V</td>
                          <td className="py-2 px-3 text-right">
                            <button
                              onClick={() => onRemoveRecord(idx)}
                              className="text-slate-500 hover:text-rose-400 transition-colors text-sm"
                            >
                              ×
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* U-I Linear Extrapolation Graph */}
            {records.length >= 2 && (
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <span>📈</span> Đồ Thị Thực Nghiệm: Điện Áp (U) Theo Dòng Điện (I)
                  </span>
                  <span className="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                    U = {regression.emfCalculated} - {regression.internalRCalculated} • I (R² = {regression.rSquared})
                  </span>
                </div>

                <div className="h-44 w-full bg-slate-900/60 rounded-xl border border-slate-800/80 p-3 relative flex flex-col justify-between">
                  {/* Grid Lines */}
                  <div className="absolute inset-0 p-3 flex flex-col justify-between pointer-events-none opacity-20">
                    <div className="border-b border-dashed border-slate-500 w-full" />
                    <div className="border-b border-dashed border-slate-500 w-full" />
                    <div className="border-b border-slate-600 w-full" />
                  </div>

                  {/* SVG Line & Scatter Points */}
                  <svg className="w-full h-full overflow-visible">
                    {/* Linear Regression Trendline */}
                    <line
                      x1="20"
                      y1="20"
                      x2="90%"
                      y2="100"
                      stroke="#10b981"
                      strokeWidth="2.5"
                      strokeDasharray="4 2"
                    />

                    {/* Extrapolated Intercept Point (0, E) */}
                    <circle cx="20" cy="20" r="5" fill="#f59e0b" />
                    <text x="30" y="24" fill="#f59e0b" fontSize="10" fontFamily="monospace" fontWeight="bold">
                      E = {regression.emfCalculated}V (I=0)
                    </text>

                    {/* Measured Points */}
                    {records.map((r, i) => {
                      const maxI = 1.2;
                      const maxU = 3.5;
                      const cx = 20 + (r.currentIAmps / maxI) * 260;
                      const cy = 110 - (r.voltageUVolts / maxU) * 90;
                      return (
                        <g key={i}>
                          <circle cx={cx} cy={cy} r="4.5" fill="#38bdf8" stroke="#0f172a" strokeWidth="1.5" />
                          <text x={cx + 6} y={cy - 4} fill="#94a3b8" fontSize="9" fontFamily="monospace">
                            ({r.currentIAmps.toFixed(2)}A, {r.voltageUVolts.toFixed(1)}V)
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              </div>
            )}

            <div className="flex justify-between pt-2">
              <button
                onClick={() => setCurrentStep(1)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition-all"
              >
                ← Quay lại Nhiệm Vụ
              </button>
              <button
                onClick={() => setCurrentStep(3)}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-xs font-bold text-slate-950 transition-all flex items-center gap-1.5"
              >
                <span>Chuyển Sang Nộp Bài</span>
                <span>➔</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: SUBMIT & QUIZ */}
        {currentStep === 3 && (
          <div className="space-y-4">
            {/* Quiz Section */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
                <span className="text-base">📝</span>
                <h3 className="text-xs font-bold text-slate-200">
                  Câu Hỏi Trắc Nghiệm Củng Cố Kiến Thức (SGK GDPT 2018)
                </h3>
              </div>

              {/* Question 1 */}
              <div className="space-y-2">
                <p className="text-xs text-slate-300 font-semibold">
                  1. Mối liên hệ giữa hiệu điện thế hai cực nguồn điện U và cường độ dòng điện I trong mạch kín là:
                </p>
                <div className="space-y-1.5 pl-2">
                  {[
                    { val: 'A', text: 'U = E + I • r (Điện áp tăng khi dòng điện tăng)' },
                    { val: 'B', text: 'U = I • r (Điện áp chỉ phụ thuộc điện trở trong)' },
                    { val: 'C', text: 'U = E - I • r (Độ giảm thế trên mạch ngoài giảm khi dòng điện tăng)' },
                    { val: 'D', text: 'U = E / (R + r) (Điện áp bằng suất điện động chia tổng trở)' },
                  ].map(opt => (
                    <label
                      key={opt.val}
                      className={`flex items-center gap-2 text-xs p-2 rounded-lg cursor-pointer transition-colors ${
                        quizAnswers.q1 === opt.val
                          ? 'bg-amber-500/20 text-amber-200 border border-amber-500/40'
                          : 'text-slate-400 hover:bg-slate-900'
                      }`}
                    >
                      <input
                        type="radio"
                        name="q1"
                        value={opt.val}
                        checked={quizAnswers.q1 === opt.val}
                        onChange={() => setQuizAnswers(prev => ({ ...prev, q1: opt.val }))}
                        className="text-amber-500 focus:ring-0"
                      />
                      <span>
                        <strong>{opt.val}.</strong> {opt.text}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Question 2 */}
              <div className="space-y-2">
                <p className="text-xs text-slate-300 font-semibold">
                  2. Trên đồ thị U - I, giao điểm của đường thẳng thực nghiệm với trục tung U (khi I = 0) cho biết đại lượng nào?
                </p>
                <div className="space-y-1.5 pl-2">
                  {[
                    { val: 'A', text: 'Suất điện động E của nguồn điện (điện áp mạch hở)' },
                    { val: 'B', text: 'Điện trở trong r của nguồn điện' },
                    { val: 'C', text: 'Dòng điện đoản mạch I_max' },
                    { val: 'D', text: 'Công suất cực đại của nguồn' },
                  ].map(opt => (
                    <label
                      key={opt.val}
                      className={`flex items-center gap-2 text-xs p-2 rounded-lg cursor-pointer transition-colors ${
                        quizAnswers.q2 === opt.val
                          ? 'bg-amber-500/20 text-amber-200 border border-amber-500/40'
                          : 'text-slate-400 hover:bg-slate-900'
                      }`}
                    >
                      <input
                        type="radio"
                        name="q2"
                        value={opt.val}
                        checked={quizAnswers.q2 === opt.val}
                        onChange={() => setQuizAnswers(prev => ({ ...prev, q2: opt.val }))}
                        className="text-amber-500 focus:ring-0"
                      />
                      <span>
                        <strong>{opt.val}.</strong> {opt.text}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Question 3 */}
              <div className="space-y-2">
                <p className="text-xs text-slate-300 font-semibold">
                  3. Độ dốc (hệ số góc |slope|) của đường thẳng thực nghiệm U - I cho biết:
                </p>
                <div className="space-y-1.5 pl-2">
                  {[
                    { val: 'A', text: 'Điện trở của biến trở R' },
                    { val: 'B', text: 'Hiệu suất của nguồn điện H' },
                    { val: 'C', text: 'Năng lượng tiêu thụ toàn mạch' },
                    { val: 'D', text: 'Điện trở trong r của nguồn điện (r = |ΔU / ΔI|)' },
                  ].map(opt => (
                    <label
                      key={opt.val}
                      className={`flex items-center gap-2 text-xs p-2 rounded-lg cursor-pointer transition-colors ${
                        quizAnswers.q3 === opt.val
                          ? 'bg-amber-500/20 text-amber-200 border border-amber-500/40'
                          : 'text-slate-400 hover:bg-slate-900'
                      }`}
                    >
                      <input
                        type="radio"
                        name="q3"
                        value={opt.val}
                        checked={quizAnswers.q3 === opt.val}
                        onChange={() => setQuizAnswers(prev => ({ ...prev, q3: opt.val }))}
                        className="text-amber-500 focus:ring-0"
                      />
                      <span>
                        <strong>{opt.val}.</strong> {opt.text}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Student Observation */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <span>💬</span> Nhận xét và kết luận của học sinh:
              </label>
              <textarea
                value={studentObservation}
                onChange={e => setStudentObservation(e.target.value)}
                placeholder="Ví dụ: Khi giảm biến trở R, dòng điện I tăng lên làm điện áp hai cực nguồn U sụt giảm theo quy luật đường thẳng tuyến tính U = E - I•r..."
                className="w-full h-20 bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500/50"
              />
            </div>

            {/* Scorecard Results */}
            {gradingResultState && (
              <div
                className={`p-4 rounded-xl border ${
                  gradingResultState.isPass
                    ? 'bg-emerald-950/20 border-emerald-500/40'
                    : 'bg-amber-950/20 border-amber-500/40'
                } space-y-3`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200">Kết Quả Đánh Giá Bài Làm</span>
                  <span
                    className={`text-lg font-black font-mono ${
                      gradingResultState.isPass ? 'text-emerald-400' : 'text-amber-400'
                    }`}
                  >
                    {gradingResultState.totalScore}/10.0 Điểm
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-[11px] font-mono">
                  <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800 text-center">
                    <span className="text-slate-400 block">Thao tác</span>
                    <span className="text-amber-400 font-bold">{gradingResultState.operationScore}/3.0</span>
                  </div>
                  <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800 text-center">
                    <span className="text-slate-400 block">Độ chính xác</span>
                    <span className="text-sky-400 font-bold">{gradingResultState.accuracyScore}/4.0</span>
                  </div>
                  <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800 text-center">
                    <span className="text-slate-400 block">Trắc nghiệm</span>
                    <span className="text-emerald-400 font-bold">{gradingResultState.quizScore}/3.0</span>
                  </div>
                </div>

                <div className="space-y-1 text-xs text-slate-300 pt-1">
                  {gradingResultState.feedback.map((fb, idx) => (
                    <p key={idx}>{fb}</p>
                  ))}
                </div>
              </div>
            )}

            {/* Action Submit */}
            <div className="pt-2">
              <button
                onClick={handleGradeAndSubmit}
                className="w-full py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-xl shadow-amber-500/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
              >
                <span>🚀</span>
                <span>Chấm Điểm & Nộp Bài Lên Hệ Thống EduLab</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
