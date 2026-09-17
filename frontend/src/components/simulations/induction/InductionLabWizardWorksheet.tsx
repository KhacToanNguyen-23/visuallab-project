import React, { useState, useMemo } from 'react';
import {
  evaluateInductionTrials,
  DEFAULT_INDUCTION_MISSIONS,
  type InductionGradingResult,
  type InductionTrial,
} from './inductionLabEngine';

export interface InductionSubmissionDetails {
  trials: InductionTrial[];
  studentObservation?: string;
  quizAnswers: { q1: string; q2: string; q3: string };
  gradeResult: InductionGradingResult;
}

export interface RawInductionTrial {
  pole: 'N-S' | 'S-N';
  direction: 'IN' | 'OUT';
  speedMps: number;
  turnCountN: number;
  peakEmfMv: number;
  missionId?: number;
}

interface InductionLabWizardWorksheetProps {
  turnCountN: number;
  pole: 'N-S' | 'S-N';
  instantEmfMv: number;
  instantCurrentMa: number;
  trials: RawInductionTrial[];
  onAddTrialForMission: (missionId: number) => void;
  onRemoveTrial: (index: number) => void;
  onClearTrials: () => void;
  onGraded?: (result: InductionGradingResult, details?: InductionSubmissionDetails) => void;
  onOpenSubmissionDrawer?: () => void;
}

export const InductionLabWizardWorksheet: React.FC<InductionLabWizardWorksheetProps> = ({
  turnCountN: _turnCountN,
  pole: _pole,
  instantEmfMv: _instantEmfMv,
  instantCurrentMa: _instantCurrentMa,
  trials,
  onAddTrialForMission,
  onRemoveTrial,
  onClearTrials,
  onGraded,
  onOpenSubmissionDrawer,
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [gradingResultState, setGradingResultState] = useState<InductionGradingResult | null>(null);

  // Student manual inputs
  const [studentObservation, setStudentObservation] = useState<string>('');

  // Quiz answers
  const [quizAnswers, setQuizAnswers] = useState<{ q1: string; q2: string; q3: string }>({
    q1: '',
    q2: '',
    q3: '',
  });

  // Calculate mission completion status
  const missionsWithStatus = useMemo(() => {
    return DEFAULT_INDUCTION_MISSIONS.map(m => {
      const isRecorded = trials.some(t => t.missionId === m.id);
      return {
        ...m,
        isCompleted: isRecorded,
      };
    });
  }, [trials]);

  // Processed trials for display
  const { result: currentEvaluation, processedTrials } = useMemo(() => {
    return evaluateInductionTrials(trials, quizAnswers);
  }, [trials, quizAnswers]);

  // Submit and grade
  const handleGradeAndSubmit = () => {
    const { result, processedTrials: evaluatedTrials } = evaluateInductionTrials(trials, quizAnswers);
    setGradingResultState(result);
    setIsSubmitted(true);

    const submissionDetails: InductionSubmissionDetails = {
      trials: evaluatedTrials,
      studentObservation,
      quizAnswers,
      gradeResult: result,
    };

    // Save to localStorage for drawer sync
    try {
      localStorage.setItem('edulab_induction_grade_result', JSON.stringify({
        result,
        details: {
          rows: evaluatedTrials,
          studentObservation,
          quizAnswers,
          totalScore: result.totalScore,
          operationScore: result.operationScore,
          accuracyScore: result.accuracyScore,
          quizScore: result.quizScore,
          isPass: result.isPass,
          measuredResult: result.totalScore,
        },
      }));
    } catch (_) {}

    if (onGraded) {
      onGraded(result, submissionDetails);
    }
  };

  const handleResetGrading = () => {
    setIsSubmitted(false);
    setGradingResultState(null);
  };

  const observationChips = [
    'Khi tăng vận tốc dịch chuyển nam châm, suất điện động cảm ứng e_c tăng lên tỉ lệ thuận (Định luật Faraday).',
    'Khi đảo cực từ Bắc sang Nam hoặc đổi chiều chuyển động, chiều dòng điện cảm ứng đổi chiều ngược lại (Định luật Lenz).',
    'Khi nam châm đứng yên trong lòng cuộn dây, từ thông không biến thiên nên e_c = 0 và đèn không sáng.',
    'Tăng số vòng dây N của cuộn Solenoid làm tăng độ lớn suất điện động cảm ứng xuất hiện.',
  ];

  return (
    <div className="w-full h-full bg-slate-900 border border-slate-800 rounded-2xl flex flex-col overflow-hidden shadow-2xl">
      {/* Top Header Wizard Stepper */}
      <div className="bg-slate-950/80 px-5 py-3 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
            <span>📋 Báo Cáo Thí Nghiệm Cảm Ứng Điện Từ</span>
            <span className="px-2 py-0.5 bg-sky-500/20 text-sky-400 border border-sky-500/30 rounded text-[10px] font-mono">
              SGK Vật lý 12
            </span>
          </h2>
          <p className="text-[11px] text-slate-400">
            Khảo sát định luật Faraday & Lenz qua 3 nhiệm vụ đề bài
          </p>
        </div>

        {/* Step Indicator Tabs */}
        <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 space-x-1">
          {[
            { id: 1, label: '1. Nhiệm Vụ' },
            { id: 2, label: '2. Số Liệu' },
            { id: 3, label: '3. Nộp Bài' },
          ].map(step => (
            <button
              key={step.id}
              onClick={() => setCurrentStep(step.id as 1 | 2 | 3)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center space-x-1 ${
                currentStep === step.id
                  ? 'bg-sky-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <span>{step.label}</span>
              {step.id === 1 && (
                <span className={`w-2 h-2 rounded-full ${trials.length >= 3 ? 'bg-emerald-400' : 'bg-amber-400'}`} />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Wizard Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* STEP 1: 3 MISSIONS */}
        {currentStep === 1 && (
          <div className="space-y-3">
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
              <div className="text-xs font-bold text-slate-200 mb-1 flex items-center justify-between">
                <span>🎯 3 Nhiệm Vụ Khảo Sát Định Luật</span>
                <span className="text-[11px] text-sky-400 font-mono">
                  Đã ghi: {trials.length}/3 lần đo
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Thực hiện lần lượt 3 nhiệm vụ đề bài để khảo sát sự phụ thuộc của suất điện động vào vận tốc và chiều chuyển động:
              </p>
            </div>

            <div className="space-y-2.5">
              {missionsWithStatus.map((m, idx) => (
                <div
                  key={m.id}
                  className={`p-3.5 rounded-xl border transition ${
                    m.isCompleted
                      ? 'bg-emerald-950/20 border-emerald-500/40 shadow-sm'
                      : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        m.isCompleted ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {m.isCompleted ? '✓' : idx + 1}
                      </span>
                      <h4 className="text-xs font-bold text-slate-200">{m.title}</h4>
                    </div>

                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                      m.isCompleted
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}>
                      {m.isCompleted ? 'Đã hoàn thành' : 'Chưa ghi'}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                    {m.description}
                  </p>

                  <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-800/80">
                    <span className="text-[10px] text-slate-500 font-mono">
                      Yêu cầu: Cực {m.pole} • N={m.turnCountN} vòng • v ≈ {m.targetSpeed} m/s
                    </span>

                    <button
                      onClick={() => onAddTrialForMission(m.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center space-x-1 ${
                        m.isCompleted
                          ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                          : 'bg-sky-600 hover:bg-sky-500 text-white shadow-md'
                      }`}
                    >
                      <span>{m.isCompleted ? '↺ Đo Lại Lần Này' : '⚡ Thực Hiện & Ghi'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {trials.length >= 3 && (
              <div className="pt-2">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="w-full py-2.5 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-bold rounded-xl text-xs transition shadow-lg flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <span>Chuyển Sang Bước 2: Bảng Số Liệu & Nhận Xét ➔</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* STEP 2: DATA TABLE & OBSERVATIONS */}
        {currentStep === 2 && (
          <div className="space-y-4">
            {/* Table of Trials */}
            <div className="bg-slate-950 rounded-xl border border-slate-800 p-3 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200">
                  📊 Bảng Số Liệu Suất Điện Động & Dòng Cảm Ứng
                </span>
                {trials.length > 0 && (
                  <button
                    onClick={onClearTrials}
                    className="text-[11px] text-rose-400 hover:text-rose-300 transition cursor-pointer"
                  >
                    Xóa tất cả
                  </button>
                )}
              </div>

              {trials.length === 0 ? (
                <div className="text-center py-6 text-slate-500 text-xs">
                  Chưa có số liệu đo đạc nào. Vui lòng quay lại Bước 1 để thực hiện các nhiệm vụ.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 font-mono text-[10px]">
                        <th className="pb-1.5">Lần</th>
                        <th className="pb-1.5">Đầu cực</th>
                        <th className="pb-1.5">Chiều</th>
                        <th className="pb-1.5">Vận tốc (m/s)</th>
                        <th className="pb-1.5">Số vòng N</th>
                        <th className="pb-1.5 text-cyan-400">e_c (mV)</th>
                        <th className="pb-1.5 text-amber-400">I_c (mA)</th>
                        <th className="pb-1.5 text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                      {processedTrials.map((t, idx) => (
                        <tr key={t.trial} className="hover:bg-slate-900/60">
                          <td className="py-2 text-slate-400 font-bold">{t.trial}</td>
                          <td className="py-2">
                            <span className={`px-1.5 py-0.5 rounded text-[9px] ${
                              t.pole === 'N-S' ? 'bg-rose-500/20 text-rose-300' : 'bg-blue-500/20 text-blue-300'
                            }`}>
                              {t.pole === 'N-S' ? 'Cực N' : 'Cực S'}
                            </span>
                          </td>
                          <td className="py-2 text-slate-300">{t.direction === 'IN' ? 'Đưa vào' : 'Rút ra'}</td>
                          <td className="py-2 text-slate-300">{t.speedMps.toFixed(1)}</td>
                          <td className="py-2 text-slate-300">{t.turnCountN}</td>
                          <td className={`py-2 font-bold ${t.peakEmfMv > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {t.peakEmfMv > 0 ? `+${t.peakEmfMv}` : t.peakEmfMv}
                          </td>
                          <td className="py-2 text-amber-300">
                            {t.peakCurrentMa > 0 ? `+${t.peakCurrentMa}` : t.peakCurrentMa}
                          </td>
                          <td className="py-2 text-right">
                            <button
                              onClick={() => onRemoveTrial(idx)}
                              className="text-slate-500 hover:text-rose-400 transition"
                              title="Xóa lần đo này"
                            >
                              ✕
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Law Verifications Status Card */}
            <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-slate-300 block">
                ⚖️ Kiểm Chứng Định Luật Vật Lý
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                <div className={`p-2.5 rounded-lg border flex items-center space-x-2 ${
                  currentEvaluation.isFaradayVerified
                    ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}>
                  <span className="text-base">{currentEvaluation.isFaradayVerified ? '✓' : '○'}</span>
                  <div>
                    <div className="font-bold text-[11px]">Định luật Faraday</div>
                    <div className="text-[10px] opacity-80">e_c tỉ lệ với tốc độ biến thiên từ thông</div>
                  </div>
                </div>

                <div className={`p-2.5 rounded-lg border flex items-center space-x-2 ${
                  currentEvaluation.isLenzVerified
                    ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}>
                  <span className="text-base">{currentEvaluation.isLenzVerified ? '✓' : '○'}</span>
                  <div>
                    <div className="font-bold text-[11px]">Định luật Lenz</div>
                    <div className="text-[10px] opacity-80">Dòng cảm ứng đổi chiều chống lại sự biến thiên</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Observation Notes & Suggestions Chips */}
            <div className="bg-slate-950 rounded-xl border border-slate-800 p-3 space-y-2">
              <label className="text-xs font-bold text-slate-200 block">
                ✍️ Nhận Xét & Kết Luận Thực Nghiệm
              </label>
              <textarea
                value={studentObservation}
                onChange={e => setStudentObservation(e.target.value)}
                placeholder="Nhập nhận xét của bạn về sự thay đổi của e_c và chiều dòng điện khi thay đổi tốc độ, cực từ và số vòng dây..."
                rows={3}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 resize-none font-sans"
              />

              <div className="space-y-1 pt-1">
                <span className="text-[10px] font-semibold text-slate-400 block">
                  💡 Gợi ý nhận xét nhanh (nhấn để thêm):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {observationChips.map((chip, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setStudentObservation(prev => (prev ? `${prev}\n${chip}` : chip));
                      }}
                      className="px-2 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 rounded-lg text-[10px] text-left transition cursor-pointer"
                    >
                      + {chip}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => setCurrentStep(3)}
              className="w-full py-2.5 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-bold rounded-xl text-xs transition shadow-lg flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <span>Chuyển Sang Bước 3: Trắc Nghiệm & Nộp Bài ➔</span>
            </button>
          </div>
        )}

        {/* STEP 3: QUIZ & SUBMISSION */}
        {currentStep === 3 && (
          <div className="space-y-4">
            {/* Quiz Questions */}
            <div className="bg-slate-950 rounded-xl border border-slate-800 p-3.5 space-y-3">
              <span className="text-xs font-bold text-slate-200 block border-b border-slate-800 pb-2">
                📝 Trắc Nghiệm Củng Cố Kiến Thức (SGK GDPT 2018)
              </span>

              {/* Q1 */}
              <div className="space-y-1.5 text-xs">
                <p className="font-semibold text-slate-300">
                  Câu 1: Hiện tượng cảm ứng điện từ xuất hiện trong một cuộn dây kín khi nào?
                </p>
                <div className="space-y-1 text-[11px]">
                  {[
                    { id: 'A', text: 'A. Cuộn dây đặt trong một từ trường đều không đổi.' },
                    { id: 'B', text: 'B. Từ thông xuyên qua tiết diện cuộn dây biến thiên theo thời gian.' },
                    { id: 'C', text: 'C. Nam châm đặt cố định trong lòng cuộn dây.' },
                    { id: 'D', text: 'D. Có dòng điện một chiều không đổi chạy qua cuộn dây.' },
                  ].map(opt => (
                    <label
                      key={opt.id}
                      className={`flex items-center space-x-2 p-2 rounded-lg border cursor-pointer transition ${
                        quizAnswers.q1 === opt.id
                          ? 'bg-sky-950/40 border-sky-500/50 text-sky-200'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800/60'
                      }`}
                    >
                      <input
                        type="radio"
                        name="q1"
                        value={opt.id}
                        checked={quizAnswers.q1 === opt.id}
                        onChange={() => setQuizAnswers(prev => ({ ...prev, q1: opt.id }))}
                        className="accent-sky-500"
                      />
                      <span>{opt.text}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Q2 */}
              <div className="space-y-1.5 text-xs pt-2 border-t border-slate-800/80">
                <p className="font-semibold text-slate-300">
                  Câu 2: Theo định luật Lenz, dòng điện cảm ứng xuất hiện trong mạch kín có chiều như thế nào?
                </p>
                <div className="space-y-1 text-[11px]">
                  {[
                    { id: 'A', text: 'A. Có từ trường cảm ứng chống lại sự biến thiên của từ thông sinh ra nó.' },
                    { id: 'B', text: 'B. Cùng chiều với từ trường ban đầu của nam châm.' },
                    { id: 'C', text: 'C. Luôn làm tăng từ thông ban đầu xuyên qua cuộn dây.' },
                    { id: 'D', text: 'D. Không phụ thuộc vào chiều dịch chuyển của nam châm.' },
                  ].map(opt => (
                    <label
                      key={opt.id}
                      className={`flex items-center space-x-2 p-2 rounded-lg border cursor-pointer transition ${
                        quizAnswers.q2 === opt.id
                          ? 'bg-sky-950/40 border-sky-500/50 text-sky-200'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800/60'
                      }`}
                    >
                      <input
                        type="radio"
                        name="q2"
                        value={opt.id}
                        checked={quizAnswers.q2 === opt.id}
                        onChange={() => setQuizAnswers(prev => ({ ...prev, q2: opt.id }))}
                        className="accent-sky-500"
                      />
                      <span>{opt.text}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Q3 */}
              <div className="space-y-1.5 text-xs pt-2 border-t border-slate-800/80">
                <p className="font-semibold text-slate-300">
                  Câu 3: Để làm tăng độ lớn của suất điện động cảm ứng xuất hiện trong cuộn dây, ta có thể:
                </p>
                <div className="space-y-1 text-[11px]">
                  {[
                    { id: 'A', text: 'A. Giảm tốc độ di chuyển của nam châm.' },
                    { id: 'B', text: 'B. Giảm số vòng dây của cuộn Solenoid.' },
                    { id: 'C', text: 'C. Tăng tốc độ dịch chuyển nam châm hoặc tăng số vòng dây N.' },
                    { id: 'D', text: 'D. Đặt nam châm đứng yên thật lâu trong lòng cuộn dây.' },
                  ].map(opt => (
                    <label
                      key={opt.id}
                      className={`flex items-center space-x-2 p-2 rounded-lg border cursor-pointer transition ${
                        quizAnswers.q3 === opt.id
                          ? 'bg-sky-950/40 border-sky-500/50 text-sky-200'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800/60'
                      }`}
                    >
                      <input
                        type="radio"
                        name="q3"
                        value={opt.id}
                        checked={quizAnswers.q3 === opt.id}
                        onChange={() => setQuizAnswers(prev => ({ ...prev, q3: opt.id }))}
                        className="accent-sky-500"
                      />
                      <span>{opt.text}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Grading Results Panel (Rendered only after submission) */}
            {isSubmitted && gradingResultState && (
              <div className={`p-4 rounded-xl border space-y-3 ${
                gradingResultState.isPass
                  ? 'bg-emerald-950/30 border-emerald-500/50'
                  : 'bg-amber-950/30 border-amber-500/50'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                      KẾT QUẢ ĐÁNH GIÁ THÍ NGHIỆM
                    </span>
                    <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                      <span>Điểm Tổng Kết:</span>
                      <span className={`text-2xl font-mono ${
                        gradingResultState.isPass ? 'text-emerald-400' : 'text-amber-400'
                      }`}>
                        {gradingResultState.totalScore.toFixed(1)} / 10.0
                      </span>
                    </h3>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    gradingResultState.isPass
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  }`}>
                    {gradingResultState.isPass ? '✓ ĐẠT YÊU CẦU' : '⚠️ CẦN BỔ SUNG'}
                  </span>
                </div>

                {/* Score Breakdown */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                  <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Thao tác (30%)</span>
                    <b className="text-sky-400">{gradingResultState.operationScore.toFixed(1)}/3.0</b>
                  </div>
                  <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Định luật (40%)</span>
                    <b className="text-emerald-400">{gradingResultState.accuracyScore.toFixed(1)}/4.0</b>
                  </div>
                  <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Lý thuyết (30%)</span>
                    <b className="text-indigo-400">{gradingResultState.quizScore.toFixed(1)}/3.0</b>
                  </div>
                </div>

                {/* Feedback list */}
                <div className="space-y-1 text-xs text-slate-300 pt-1">
                  {gradingResultState.feedback.map((fb, i) => (
                    <div key={i} className="leading-relaxed font-sans">{fb}</div>
                  ))}
                </div>

                {/* Actions when submitted */}
                <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-slate-800/80">
                  <button
                    onClick={handleResetGrading}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition cursor-pointer"
                  >
                    ↺ Làm Lại / Đo Tiếp
                  </button>

                  {onOpenSubmissionDrawer && (
                    <button
                      onClick={onOpenSubmissionDrawer}
                      className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition shadow-lg shadow-emerald-600/25 flex items-center justify-center space-x-1.5 cursor-pointer"
                    >
                      <span>🚀 Nộp Bài Vào Bài Tập Được Giao</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Submission Action Button */}
            {!isSubmitted && (
              <div className="pt-2">
                <button
                  onClick={handleGradeAndSubmit}
                  disabled={trials.length === 0}
                  className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-40 text-white font-bold rounded-xl text-xs transition shadow-lg shadow-emerald-600/25 flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <span>📝 Nộp Bài & Tính Điểm Thí Nghiệm</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
