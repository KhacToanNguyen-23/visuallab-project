import React, { useState, useMemo } from 'react';
import {
  evaluateSpecificHeatReport,
  DEFAULT_SPECIFIC_HEAT_MISSIONS,
  LIQUID_PRESETS,
  type SpecificHeatGradingResult,
  type SpecificHeatTrial,
} from './specificHeatEngine';

export interface SpecificHeatSubmissionDetails {
  trials: SpecificHeatTrial[];
  studentObservation?: string;
  quizAnswers: { q1: string; q2: string; q3: string };
  gradeResult: SpecificHeatGradingResult;
}

export interface RawSpecificHeatTrial {
  liquidId: string;
  massKg: number;
  powerW: number;
  timeSec: number;
  tempInitialC: number;
  tempFinalC: number;
  missionId?: number;
}

interface SpecificHeatLabWizardWorksheetProps {
  currentLiquidId: string;
  currentMassKg: number;
  currentPowerW: number;
  trials: RawSpecificHeatTrial[];
  assignmentId?: string;
  onAddTrialForMission: (missionId: number) => void;
  onRemoveTrial: (index: number) => void;
  onClearTrials: () => void;
  onGraded?: (result: SpecificHeatGradingResult, details?: SpecificHeatSubmissionDetails) => void;
  onOpenSubmissionDrawer?: () => void;
}

export const SpecificHeatLabWizardWorksheet: React.FC<SpecificHeatLabWizardWorksheetProps> = ({
  currentLiquidId: _currentLiquidId,
  currentMassKg: _currentMassKg,
  currentPowerW: _currentPowerW,
  trials,
  assignmentId,
  onAddTrialForMission,
  onRemoveTrial,
  onClearTrials,
  onGraded,
  onOpenSubmissionDrawer,
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [gradingResultState, setGradingResultState] = useState<SpecificHeatGradingResult | null>(null);

  // Student notes
  const [studentObservation, setStudentObservation] = useState<string>('');

  // Quiz answers
  const [quizAnswers, setQuizAnswers] = useState<{ q1: string; q2: string; q3: string }>({
    q1: '',
    q2: '',
    q3: '',
  });

  // Calculate mission completion status
  const missionsWithStatus = useMemo(() => {
    return DEFAULT_SPECIFIC_HEAT_MISSIONS.map(m => {
      const isRecorded = trials.some(t => t.missionId === m.id);
      return {
        ...m,
        isCompleted: isRecorded,
      };
    });
  }, [trials]);

  // Processed trials for display
  const { result: currentEvaluation, processedTrials } = useMemo(() => {
    return evaluateSpecificHeatReport(trials, quizAnswers);
  }, [trials, quizAnswers]);

  // Submit and grade
  const handleGradeAndSubmit = () => {
    const { result, processedTrials: evaluatedTrials } = evaluateSpecificHeatReport(trials, quizAnswers);
    setGradingResultState(result);
    setIsSubmitted(true);

    const submissionDetails: SpecificHeatSubmissionDetails = {
      trials: evaluatedTrials,
      studentObservation,
      quizAnswers,
      gradeResult: result,
    };

    try {
      localStorage.setItem(
        'edulab_specific_heat_grade_result',
        JSON.stringify({
          assignmentId,
          result,
          details: {
            rows: evaluatedTrials,
            studentObservation,
            quizAnswers,
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
              <span>📋</span> Báo Cáo Đo Nhiệt Dung Riêng
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              SGK Vật lý 12
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">Khảo sát công thức Q = m • c • ΔT qua 3 nhiệm vụ thực nghiệm</p>
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
              {trials.length}
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
                  <h3 className="text-xs font-bold text-amber-300">3 Nhiệm Vụ Khảo Sát Nhiệt Dung Riêng</h3>
                  <p className="text-[11px] text-slate-400">
                    Đun chất lỏng trong bình nhiệt lượng kế, ghi nhận độ tăng nhiệt độ và tính nhiệt dung riêng c.
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
                const liquid = LIQUID_PRESETS.find(l => l.id === mission.liquidId);
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
                              {mission.isCompleted ? 'Đã hoàn thành' : 'Chưa ghi'}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                            {mission.description}
                          </p>

                          <div className="flex items-center gap-3 mt-2.5 text-[11px] text-slate-400 font-mono">
                            <span>Chất lỏng: {liquid ? liquid.name : 'Cồn Ethanol / Dầu Ăn'}</span>
                            <span>•</span>
                            <span>m: {(mission.minMassKg * 1000).toFixed(0)}g - {(mission.maxMassKg * 1000).toFixed(0)}g</span>
                            <span>•</span>
                            <span>P: {mission.minPowerW}W - {mission.maxPowerW}W</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => onAddTrialForMission(mission.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                          mission.isCompleted
                            ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                            : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                        }`}
                      >
                        <span>{mission.isCompleted ? '🔄 Cập Nhật Lại' : '📥 Ghi Nhận Số Liệu'}</span>
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
                <span>Xem Bảng Số Liệu</span>
                <span>➔</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: DATA TABLE & GRAPH */}
        {currentStep === 2 && (
          <div className="space-y-4">
            {/* Header Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-[11px] font-semibold text-slate-400">Số Lần Đo</span>
                <p className="text-xl font-black text-amber-400 font-mono mt-0.5">{processedTrials.length}</p>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-[11px] font-semibold text-slate-400">Sai Số TB (δc)</span>
                <p className="text-xl font-black text-sky-400 font-mono mt-0.5">
                  {currentEvaluation.meanErrorPercent.toFixed(2)}%
                </p>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-[11px] font-semibold text-slate-400">Hoàn Thành Nhiệm Vụ</span>
                <p className="text-xl font-black text-emerald-400 font-mono mt-0.5">
                  {completedMissionsCount}/3
                </p>
              </div>
            </div>

            {/* Table */}
            <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden shadow-inner">
              <div className="px-4 py-2.5 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">Bảng Số Liệu Đo Nhiệt Dung Riêng</span>
                {trials.length > 0 && (
                  <button
                    onClick={onClearTrials}
                    className="text-[11px] text-rose-400 hover:text-rose-300 transition-colors"
                  >
                    Xóa tất cả
                  </button>
                )}
              </div>

              {processedTrials.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500">
                  Chưa có dữ liệu nào. Vui lòng sang tab <strong>1. Nhiệm Vụ</strong> hoặc bật đun và bấm <strong>+ Ghi Số Liệu</strong>.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-slate-900/50 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                      <tr>
                        <th className="py-2.5 px-3">Lần</th>
                        <th className="py-2.5 px-3">Chất Lỏng</th>
                        <th className="py-2.5 px-3">m (kg)</th>
                        <th className="py-2.5 px-3">P (W)</th>
                        <th className="py-2.5 px-3">t (s)</th>
                        <th className="py-2.5 px-3">ΔT (°C)</th>
                        <th className="py-2.5 px-3">c (đo)</th>
                        <th className="py-2.5 px-3">c (chuẩn)</th>
                        <th className="py-2.5 px-3">Sai số (%)</th>
                        <th className="py-2.5 px-3 text-right">Xóa</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-300">
                      {processedTrials.map((t, idx) => (
                        <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                          <td className="py-2.5 px-3 font-bold text-amber-400">#{t.trial}</td>
                          <td className="py-2.5 px-3 font-sans">{t.liquidName}</td>
                          <td className="py-2.5 px-3">{t.massKg.toFixed(2)}</td>
                          <td className="py-2.5 px-3 text-purple-400">{t.powerW}</td>
                          <td className="py-2.5 px-3 text-sky-400">{t.timeSec}s</td>
                          <td className="py-2.5 px-3 text-amber-400 font-bold">{t.deltaTempC.toFixed(1)}°</td>
                          <td className="py-2.5 px-3 text-emerald-400 font-bold">{t.calculatedC}</td>
                          <td className="py-2.5 px-3 text-slate-400">{t.standardC}</td>
                          <td className="py-2.5 px-3">
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                t.relativeErrorPercent < 6
                                  ? 'bg-emerald-500/20 text-emerald-300'
                                  : t.relativeErrorPercent < 15
                                  ? 'bg-amber-500/20 text-amber-300'
                                  : 'bg-rose-500/20 text-rose-300'
                              }`}
                            >
                              {t.relativeErrorPercent.toFixed(1)}%
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <button
                              onClick={() => onRemoveTrial(idx)}
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

            {/* Specific Heat Comparison Chart */}
            {processedTrials.length > 0 && (
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
                  <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <span>📈</span> Đồ Thị Thực Nghiệm: Nhiệt Dung Riêng Đo Được c (J/kg•K)
                  </span>
                  <span className="text-[10px] text-amber-400 font-mono">Công thức: c = (P • t) / (m • ΔT)</span>
                </div>
                <div className="h-44 w-full flex items-end gap-3 px-4 pt-3 pb-2 bg-slate-900/60 rounded-xl border border-slate-800/80 relative">
                  {/* Background Grid Lines */}
                  <div className="absolute inset-0 px-3 py-3 flex flex-col justify-between pointer-events-none opacity-25">
                    <div className="border-b border-dashed border-slate-500 w-full flex justify-end">
                      <span className="text-[9px] text-slate-400 -mt-2">4500 J/kg•K</span>
                    </div>
                    <div className="border-b border-dashed border-slate-500 w-full flex justify-end">
                      <span className="text-[9px] text-slate-400 -mt-2">2500 J/kg•K</span>
                    </div>
                    <div className="border-b border-slate-600 w-full flex justify-end">
                      <span className="text-[9px] text-slate-400 -mt-2">0</span>
                    </div>
                  </div>

                  {processedTrials.map((t, i) => {
                    const heightPercent = Math.min(100, Math.max(10, (t.calculatedC / 4500) * 100));
                    return (
                      <div key={i} className="flex-1 h-full flex flex-col justify-end items-center gap-1.5 z-10">
                        <span className="text-[11px] font-mono text-emerald-300 font-bold">
                          {t.calculatedC}
                        </span>
                        <div className="w-full max-w-[36px] h-24 flex items-end justify-center bg-slate-950/50 rounded-t-lg p-0.5 border border-slate-800/60">
                          <div
                            style={{ height: `${heightPercent}%` }}
                            className="w-full bg-gradient-to-t from-emerald-600 via-teal-500 to-cyan-400 rounded-t-md shadow-lg shadow-emerald-500/20 transition-all"
                          />
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="text-[10px] font-mono text-amber-400 font-semibold">
                            ΔT={t.deltaTempC}°C
                          </span>
                          <span className="text-[9px] text-slate-400 truncate max-w-[65px] font-sans">
                            {t.liquidName}
                          </span>
                        </div>
                      </div>
                    );
                  })}
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
                  1. Nhiệt dung riêng của một chất là gì?
                </p>
                <div className="space-y-1.5 pl-2">
                  {[
                    { val: 'A', text: 'Nhiệt lượng cần truyền cho 1 kg chất đó để tăng thêm 1 K (hoặc 1 °C)' },
                    { val: 'B', text: 'Tổng nhiệt lượng mà vật thu vào khi nóng chảy hoàn toàn' },
                    { val: 'C', text: 'Nhiệt lượng cần thiết để làm bay hơi hoàn toàn 1 kg chất lỏng ở nhiệt độ sôi' },
                    { val: 'D', text: 'Năng lượng nhiệt tỏa ra khi đốt cháy hoàn toàn 1 kg nhiên liệu' },
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
                  2. Nước có nhiệt dung riêng rất lớn (c ≈ 4180 J/kg•K) so với hầu hết các chất lỏng khác. Ý nghĩa thực tiễn của điều này là gì?
                </p>
                <div className="space-y-1.5 pl-2">
                  {[
                    { val: 'A', text: 'Làm nước sôi ở nhiệt độ thấp hơn cồn và dầu' },
                    { val: 'B', text: 'Làm cho nước bay hơi rất nhanh khi có ánh nắng mặt trời' },
                    { val: 'C', text: 'Giúp các đại dương hấp thụ và tỏa nhiệt lượng lớn, điều hòa khí hậu Trái Đất' },
                    { val: 'D', text: 'Làm cho nước dẫn điện tốt hơn các chất lỏng khác' },
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
                  3. Tại sao trong thí nghiệm đo nhiệt dung riêng với bình nhiệt lượng kế, ta cần phải bật que khuấy nhẹ chất lỏng?
                </p>
                <div className="space-y-1.5 pl-2">
                  {[
                    { val: 'A', text: 'Để tạo thêm ma sát làm nước nóng nhanh hơn' },
                    { val: 'B', text: 'Để nhiệt lượng tỏa ra từ dây mayso phân bố đều khắp khối chất lỏng' },
                    { val: 'C', text: 'Để ngăn cản chất lỏng bốc hơi qua nắp bình' },
                    { val: 'D', text: 'Để giảm bớt điện trở của dây nung' },
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
                placeholder="Ví dụ: Nước tinh khiết có nhiệt dung riêng lớn hơn cồn và dầu nhiều lần nên cần nhiều thời gian và nhiệt lượng hơn để tăng cùng một độ nhiệt..."
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
