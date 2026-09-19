import React, { useState, useMemo } from 'react';
import {
  type RefractionMeasurementRecord,
  type RefractionGradingResult,
  type RefractionLinearRegression,
  DEFAULT_REFRACTION_MISSIONS,
  REFRACTION_QUIZ_BANK,
  evaluateRefractionReport,
} from './refractionEngine';

export interface RefractionSubmissionDetails {
  records: RefractionMeasurementRecord[];
  studentObservation: string;
  quizAnswers: Record<number, number>;
  regression: RefractionLinearRegression;
  gradeResult: RefractionGradingResult;
}

interface RefractionLabWizardWorksheetProps {
  records: RefractionMeasurementRecord[];
  initialObservation?: string;
  initialQuizAnswers?: Record<number, number>;
  initialGradeResult?: RefractionGradingResult | null;
  onSelectMissionAngle: (missionId: number, targetAngle?: number) => void;
  onClearRecords: () => void;
  onGraded?: (result: RefractionGradingResult, details: RefractionSubmissionDetails) => void;
  onOpenSubmissionDrawer?: () => void;
  onDraftChange?: (updates: { studentObservation?: string; quizAnswers?: Record<number, number>; gradeResult?: any }) => void;
}

const MISSION_RECOMMENDED_ANGLES: Record<number, number[]> = {
  1: [15, 30, 45, 60, 75],
  2: [30, 38, 41.5, 50, 70],
  3: [15, 30, 45, 60, 75],
};

export const RefractionLabWizardWorksheet: React.FC<RefractionLabWizardWorksheetProps> = ({
  records,
  initialObservation = '',
  initialQuizAnswers = {},
  initialGradeResult = null,
  onSelectMissionAngle,
  onClearRecords,
  onGraded,
  onOpenSubmissionDrawer,
  onDraftChange,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [studentObservation, setStudentObservation] = useState<string>(initialObservation);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>(initialQuizAnswers);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(Boolean(initialGradeResult));
  const [gradingResultState, setGradingResultState] = useState<RefractionGradingResult | null>(initialGradeResult);

  // Sync state if props change from persistence
  React.useEffect(() => {
    if (initialObservation && !studentObservation) {
      setStudentObservation(initialObservation);
    }
  }, [initialObservation]);

  React.useEffect(() => {
    if (initialQuizAnswers && Object.keys(initialQuizAnswers).length > 0 && Object.keys(quizAnswers).length === 0) {
      setQuizAnswers(initialQuizAnswers);
    }
  }, [initialQuizAnswers]);

  React.useEffect(() => {
    if (initialGradeResult && !gradingResultState) {
      setGradingResultState(initialGradeResult);
      setIsSubmitted(true);
    }
  }, [initialGradeResult]);

  // Missions with live status
  const missionsWithStatus = useMemo(() => {
    return DEFAULT_REFRACTION_MISSIONS.map(m => {
      const matchCount = records.filter(r => r.missionId === m.id).length;
      return {
        ...m,
        isCompleted: matchCount >= m.minPoints,
        recordedPoints: matchCount,
      };
    });
  }, [records]);

  // Current regression
  const { result: _currentEvaluation, regression } = useMemo(() => {
    return evaluateRefractionReport(records, quizAnswers);
  }, [records, quizAnswers]);

  // Submit and grade
  const handleGradeAndSubmit = () => {
    const { result, regression: reg } = evaluateRefractionReport(records, quizAnswers);
    setGradingResultState(result);
    setIsSubmitted(true);

    const submissionDetails: RefractionSubmissionDetails = {
      records,
      studentObservation,
      quizAnswers,
      regression: reg,
      gradeResult: result,
    };

    try {
      localStorage.setItem(
        'edulab_refraction_grade_result',
        JSON.stringify({
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
      // Ignore write error
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
      <div className="bg-slate-950/80 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xs sm:text-sm font-bold text-slate-100 uppercase tracking-wide">
              Báo Cáo Thực Hành Quang Học
            </h2>
            <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[9px] font-bold">
              GDPT 2018
            </span>
          </div>
          <p className="text-[10px] text-slate-400">
            Khảo sát định luật Snell & Góc tới giới hạn i_gh
          </p>
        </div>

        {/* 3 Steps Navigation Tabs */}
        <div className="flex items-center bg-slate-900 p-0.5 rounded-lg border border-slate-800 gap-1">
          <button
            onClick={() => setCurrentStep(1)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
              currentStep === 1
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>1. Nhiệm Vụ</span>
            {completedMissionsCount > 0 && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            )}
          </button>
          <button
            onClick={() => setCurrentStep(2)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
              currentStep === 2
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>2. Số Liệu</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-800 text-[9px] text-slate-300">
              {records.length}
            </span>
          </button>
          <button
            onClick={() => setCurrentStep(3)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
              currentStep === 3
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>3. Nộp Bài</span>
            {isSubmitted && <span className="text-emerald-400 font-bold">✓</span>}
          </button>
        </div>
      </div>

      {/* Tab Content Container */}
      <div className="flex-1 min-h-0 p-3 overflow-y-auto custom-scrollbar">
        {/* TAB 1: MISSIONS */}
        {currentStep === 1 && (
          <div className="space-y-2.5">
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg px-3 py-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm">🎯</span>
                <span className="text-xs font-bold text-amber-300">
                  3 Nhiệm Vụ Khảo Sát (Tự chỉnh góc tới i & bấm "+ Ghi Số Liệu")
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-amber-400">
                {completedMissionsCount}/3 nhiệm vụ hoàn thành
              </span>
            </div>

            <div className="space-y-2">
              {missionsWithStatus.map(mission => {
                const recAngles = MISSION_RECOMMENDED_ANGLES[mission.id] || [15, 30, 45, 60, 75];
                return (
                  <div
                    key={mission.id}
                    className={`p-3 rounded-xl border transition-all ${
                      mission.isCompleted
                        ? 'bg-emerald-950/20 border-emerald-500/40 shadow-sm'
                        : 'bg-slate-950/70 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 ${
                            mission.isCompleted
                              ? 'bg-emerald-500 text-slate-950'
                              : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {mission.isCompleted ? '✓' : mission.id}
                        </span>
                        <h4 className="text-xs font-bold text-slate-200">{mission.title}</h4>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            mission.isCompleted
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}
                        >
                          {mission.isCompleted
                            ? `Đạt (${mission.recordedPoints} lần đo)`
                            : `${mission.recordedPoints}/${mission.minPoints} lần đo`}
                        </span>

                        <button
                          onClick={() => onSelectMissionAngle(mission.id)}
                          className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 transition-all"
                          title="Chuyển môi trường và chế độ phù hợp với nhiệm vụ này"
                        >
                          ⚙️ Kích hoạt
                        </button>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-400 mb-2">
                      {mission.description}
                    </p>

                    {/* Suggested Angle Helpers for Student Reference & Quick Positioning */}
                    <div className="flex items-center justify-between gap-2 flex-wrap bg-slate-900/90 p-2 rounded-lg border border-slate-800/80">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] text-slate-400 font-semibold">Gợi ý góc đo i:</span>
                        {recAngles.map(ang => {
                          const isRecorded = records.some(
                            r => r.missionId === mission.id && Math.abs(r.incidentAngleDeg - ang) < 0.25
                          );
                          return (
                            <button
                              key={ang}
                              onClick={() => onSelectMissionAngle(mission.id, ang)}
                              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-all flex items-center gap-0.5 border ${
                                isRecorded
                                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-300 border-slate-700'
                              }`}
                              title={`Chỉnh tia laser về góc ${ang}° để quan sát và ghi số liệu`}
                            >
                              <span>{ang}°</span>
                              {isRecorded && <span className="text-[9px]">✓</span>}
                            </button>
                          );
                        })}
                      </div>

                      <span className="text-[10px] text-slate-500 italic">
                        (Xoay góc & bấm "+ Ghi Số Liệu" ở bảng trái)
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: DATA TABLE & SIN(I) - SIN(R) PLOT */}
        {currentStep === 2 && (
          <div className="space-y-5">
            {/* Action Bar */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">
                Bảng Thực Nghiệm ({records.length} điểm đo)
              </span>
              {records.length > 0 && (
                <button
                  onClick={onClearRecords}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-semibold text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 transition-all"
                >
                  Xóa Bảng Số Liệu
                </button>
              )}
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-900/80 border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                    <th className="py-2.5 px-3">#</th>
                    <th className="py-2.5 px-3">Môi Trường</th>
                    <th className="py-2.5 px-3">Góc Tới (i)</th>
                    <th className="py-2.5 px-3">Góc Khúc Xạ (r)</th>
                    <th className="py-2.5 px-3">sin(i)</th>
                    <th className="py-2.5 px-3">sin(r)</th>
                    <th className="py-2.5 px-3">Tỉ số n = sin(i)/sin(r)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {records.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-500 font-sans text-xs">
                        Chưa có số liệu. Hãy xoay góc tới i và bấm <strong>"+ Ghi Số Liệu"</strong> ở bảng điều khiển!
                      </td>
                    </tr>
                  ) : (
                    records.map(r => (
                      <tr key={r.step} className="hover:bg-slate-900/50 transition-colors">
                        <td className="py-2 px-3 text-slate-500">{r.step}</td>
                        <td className="py-2 px-3 text-slate-300 font-sans">{r.medium1Name} → {r.medium2Name}</td>
                        <td className="py-2 px-3 text-rose-400 font-bold">{r.incidentAngleDeg.toFixed(1)}°</td>
                        <td className="py-2 px-3 text-sky-400 font-bold">
                          {r.isTIR ? <span className="text-amber-400">Phản xạ TP</span> : `${r.refractionAngleDeg.toFixed(1)}°`}
                        </td>
                        <td className="py-2 px-3 text-slate-300">{r.sinI.toFixed(3)}</td>
                        <td className="py-2 px-3 text-slate-300">{r.isTIR ? '—' : r.sinR.toFixed(3)}</td>
                        <td className="py-2 px-3 text-emerald-400 font-bold">
                          {r.isTIR ? '—' : r.ratioSinISinR.toFixed(3)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Scatter Plot & Regression Summary */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-200">
                    Đồ Thị Tuyến Tính sin(i) Theo sin(r)
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Độ dốc đường thẳng khớp biểu thị chiết suất tỉ đối: sin(i) = n₂₁ · sin(r)
                  </p>
                </div>
                {regression.pointsCount >= 2 && (
                  <div className="flex items-center gap-3 text-xs font-mono">
                    <span className="text-amber-400 font-bold">
                      n₂₁ ước tính ≈ {regression.slope.toFixed(3)}
                    </span>
                    <span className="text-emerald-400">
                      R² = {(regression.rSquared * 100).toFixed(1)}%
                    </span>
                  </div>
                )}
              </div>

              {/* Dynamic SVG Plot */}
              <div className="h-44 w-full bg-slate-900/80 rounded-lg p-2 flex items-center justify-center relative overflow-hidden border border-slate-800/80">
                {records.filter(r => !r.isTIR).length < 2 ? (
                  <span className="text-xs text-slate-500">
                    Cần ít nhất 2 điểm khúc xạ hợp lệ để vẽ đường hồi quy tuyến tính
                  </span>
                ) : (
                  <svg className="w-full h-full" viewBox="0 0 400 160">
                    {/* Grid Lines */}
                    <line x1="40" y1="130" x2="380" y2="130" stroke="#334155" strokeWidth="1.5" />
                    <line x1="40" y1="20" x2="40" y2="130" stroke="#334155" strokeWidth="1.5" />

                    <text x="380" y="145" fill="#94a3b8" fontSize="10" textAnchor="end">sin(r)</text>
                    <text x="25" y="25" fill="#94a3b8" fontSize="10">sin(i)</text>

                    {/* Regression Line: y = m * x => (0,0) to (maxSinR, maxSinR * m) */}
                    <line
                      x1="40"
                      y1="130"
                      x2={40 + 0.8 * 320}
                      y2={130 - Math.min(1.0, 0.8 * regression.slope) * 110}
                      stroke="#f59e0b"
                      strokeWidth="2"
                      strokeDasharray="4 2"
                    />

                    {/* Plotted Data Points */}
                    {records.filter(r => !r.isTIR).map((r, idx) => {
                      const px = 40 + r.sinR * 320;
                      const py = 130 - r.sinI * 110;
                      return (
                        <g key={idx}>
                          <circle cx={px} cy={py} r="4.5" fill="#38bdf8" stroke="#0f172a" strokeWidth="1.5" />
                        </g>
                      );
                    })}
                  </svg>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SUBMISSION & QUIZ */}
        {currentStep === 3 && (
          <div className="space-y-5">
            {/* Student Observation Note */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">
                Ghi Chú & Nhận Xét Hiện Tượng (Góc khúc xạ r, phản xạ toàn phần khi n1 &gt; n2):
              </label>
              <textarea
                value={studentObservation}
                onChange={e => {
                  const val = e.target.value;
                  setStudentObservation(val);
                  onDraftChange?.({ studentObservation: val });
                }}
                rows={2}
                placeholder="Ví dụ: Khi chiếu từ thủy tinh ra không khí, khi góc tới vượt quá 41.1 độ thì tia khúc xạ biến mất hoàn toàn..."
                className="w-full bg-slate-950 text-slate-200 text-xs rounded-xl p-3 border border-slate-800 focus:outline-none focus:border-amber-500 custom-scrollbar"
              />
            </div>

            {/* Quiz Bank */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wide">
                Trắc Nghiệm Kiến Thức GDPT 2018 (3 Câu)
              </h3>
              {REFRACTION_QUIZ_BANK.map(q => (
                <div key={q.id} className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-2">
                  <p className="text-xs font-semibold text-slate-200">
                    Câu {q.id}: {q.question}
                  </p>
                  <div className="space-y-1.5">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = quizAnswers[q.id] === optIdx;
                      return (
                        <button
                          key={optIdx}
                          onClick={() => {
                            const updatedQuiz = { ...quizAnswers, [q.id]: optIdx };
                            setQuizAnswers(updatedQuiz);
                            onDraftChange?.({ quizAnswers: updatedQuiz });
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all flex items-center justify-between ${
                            isSelected
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold'
                              : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 border border-slate-800'
                          }`}
                        >
                          <span>{opt}</span>
                          {isSelected && <span className="text-amber-400 font-bold ml-2">✓</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Score Breakdown when graded */}
            {gradingResultState && (
              <div className="bg-slate-950 p-4 rounded-xl border border-emerald-500/40 space-y-3 shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    Kết Quả Đánh Giá Tự Động (Thang 10)
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-amber-400 font-mono">
                      {gradingResultState.totalScore.toFixed(1)}
                    </span>
                    <span className="text-xs text-slate-400 font-bold">/ 10.0</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                    <span className="text-slate-400 text-[10px]">Thao Tác (30%)</span>
                    <p className="font-bold text-slate-200 mt-0.5">{gradingResultState.operationScore} / 3.0đ</p>
                  </div>
                  <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                    <span className="text-slate-400 text-[10px]">Độ Chính Xác (40%)</span>
                    <p className="font-bold text-slate-200 mt-0.5">{gradingResultState.accuracyScore} / 4.0đ</p>
                  </div>
                  <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                    <span className="text-slate-400 text-[10px]">Trắc Nghiệm (30%)</span>
                    <p className="font-bold text-slate-200 mt-0.5">{gradingResultState.quizScore} / 3.0đ</p>
                  </div>
                </div>

                <div className="space-y-1 text-[11px] text-slate-300">
                  {gradingResultState.feedback.map((fb, idx) => (
                    <p key={idx} className="leading-relaxed">{fb}</p>
                  ))}
                </div>
              </div>
            )}

            {/* Submit Action */}
            <button
              onClick={handleGradeAndSubmit}
              className="w-full py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-xl shadow-amber-500/20 transition-all active:scale-[0.99] flex items-center justify-center gap-2"
            >
              <span>{isSubmitted ? '🔄 Chấm Điểm Lại & Cập Nhật Báo Cáo' : '📝 Chấm Điểm & Nộp Báo Cáo Thí Nghiệm'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
