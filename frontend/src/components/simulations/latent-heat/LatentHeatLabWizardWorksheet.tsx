import React, { useState, useMemo } from 'react';
import {
  evaluateLatentHeatTrials,
  DEFAULT_LATENT_HEAT_MISSIONS,
  computeLatentHeatLambda,
  type LatentHeatGradingResult,
  type LatentHeatTrial,
} from './latentHeatLabEngine';

export interface LatentHeatSubmissionDetails {
  trials: LatentHeatTrial[];
  studentAvgLambda: number;
  studentDeltaLambda: number;
  studentObservation?: string;
  quizAnswers: { q1: string; q2: string; q3: string };
  gradeResult: LatentHeatGradingResult;
}

interface LatentHeatLabWizardWorksheetProps {
  waterMassKg: number;
  iceMassKg: number;
  initialWaterTemp: number;
  equilibriumTemp: number;
  trials: Array<{
    waterMassKg: number;
    iceMassKg: number;
    initialWaterTemp: number;
    equilibriumTemp: number;
    missionId?: number;
  }>;
  assignmentId?: string;
  onAddTrialForMission: (missionId: number, targetIceMassG: number) => void;
  onRemoveTrial: (index: number) => void;
  onClearTrials: () => void;
  onGraded?: (result: LatentHeatGradingResult, details?: LatentHeatSubmissionDetails) => void;
  onOpenSubmissionDrawer?: () => void;
}

export const LatentHeatLabWizardWorksheet: React.FC<LatentHeatLabWizardWorksheetProps> = ({
  waterMassKg: _waterMassKg,
  iceMassKg,
  initialWaterTemp: _initialWaterTemp,
  equilibriumTemp: _equilibriumTemp,
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
  const [gradingResultState, setGradingResultState] = useState<LatentHeatGradingResult | null>(null);

  // Student manual inputs
  const [studentAvgLambda, setStudentAvgLambda] = useState<string>('');
  const [studentDeltaLambda, setStudentDeltaLambda] = useState<string>('');
  const [studentObservation, setStudentObservation] = useState<string>('');

  // Quiz answers
  const [quizAnswers, setQuizAnswers] = useState<{ q1: string; q2: string; q3: string }>({
    q1: '',
    q2: '',
    q3: '',
  });

  // Calculate trials table
  const computedTrials: LatentHeatTrial[] = useMemo(() => {
    const rawLambdas = trials.map(t =>
      computeLatentHeatLambda(t.waterMassKg, t.iceMassKg, t.initialWaterTemp, t.equilibriumTemp)
    );
    const avg = rawLambdas.length > 0 ? rawLambdas.reduce((a, b) => a + b, 0) / rawLambdas.length : 0;

    return trials.map((t, idx) => {
      const lam = computeLatentHeatLambda(t.waterMassKg, t.iceMassKg, t.initialWaterTemp, t.equilibriumTemp);
      const diff = Math.round(Math.abs(lam - avg));
      const relErr = avg > 0 ? parseFloat(((diff / avg) * 100).toFixed(1)) : 0;
      return {
        trial: idx + 1,
        missionId: t.missionId,
        waterMassKg: t.waterMassKg,
        iceMassKg: t.iceMassKg,
        initialWaterTemp: t.initialWaterTemp,
        equilibriumTemp: t.equilibriumTemp,
        calculatedLambda: lam,
        diffFromAvg: diff,
        relativeError: relErr,
      };
    });
  }, [trials]);

  // Check completion status for 3 missions
  const missionStatuses = useMemo(() => {
    return DEFAULT_LATENT_HEAT_MISSIONS.map(m => {
      const matched = trials.find(t => Math.abs(t.iceMassKg * 1000 - m.targetIceMassG) <= m.toleranceG);
      return {
        ...m,
        isCompleted: !!matched,
        recordedIceMassG: matched ? Math.round(matched.iceMassKg * 1000) : undefined,
        recordedTempCb: matched?.equilibriumTemp,
      };
    });
  }, [trials]);

  const completedMissionsCount = missionStatuses.filter(m => m.isCompleted).length;

  const handleAutoFillCalculation = () => {
    if (trials.length > 0) {
      const rawLambdas = trials.map(t =>
        computeLatentHeatLambda(t.waterMassKg, t.iceMassKg, t.initialWaterTemp, t.equilibriumTemp)
      );
      const avg = Math.round(rawLambdas.reduce((a, b) => a + b, 0) / trials.length);
      const diffs = rawLambdas.map(l => Math.abs(l - avg));
      const meanErr = Math.round(diffs.reduce((a, b) => a + b, 0) / trials.length);
      setStudentAvgLambda(avg.toString());
      setStudentDeltaLambda(meanErr.toString());
    }
  };

  // Submit and evaluate scores
  const handleSubmitAndGrade = () => {
    const evaluated = evaluateLatentHeatTrials(trials, quizAnswers);
    setGradingResultState(evaluated);
    setIsSubmitted(true);

    const details: LatentHeatSubmissionDetails = {
      trials: computedTrials,
      studentAvgLambda: parseFloat(studentAvgLambda) || evaluated.avgLambda,
      studentDeltaLambda: parseFloat(studentDeltaLambda) || evaluated.meanAbsoluteError,
      studentObservation,
      quizAnswers,
      gradeResult: evaluated,
    };
    try {
      localStorage.setItem(
        'edulab_latent_heat_grade_result',
        JSON.stringify({
          assignmentId,
          result: evaluated,
          details,
        })
      );
    } catch (_) {}

    if (onGraded) onGraded(evaluated, details);

    if (onOpenSubmissionDrawer) {
      onOpenSubmissionDrawer();
    }
  };

  const handleResetGrading = () => {
    setIsSubmitted(false);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      {/* Wizard Header Steps */}
      <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Báo Cáo: Nhiệt Nóng Chảy Riêng Nước Đá
          </h2>
        </div>

        {/* 3 Steps Navigation */}
        <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
          {[
            { step: 1, label: '1. Đề Bài & Nhiệm Vụ' },
            { step: 2, label: '2. Bảng Đo & Sai Số' },
            { step: 3, label: '3. Đồ Thị & Nộp Bài' },
          ].map(s => (
            <button
              key={s.step}
              onClick={() => setCurrentStep(s.step as 1 | 2 | 3)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                currentStep === s.step
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Wizard Content Body */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {/* STEP 1: Tasks & Missions */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div className="bg-slate-950/80 border border-emerald-500/20 rounded-xl p-4 space-y-2">
              <h3 className="text-xs font-bold uppercase font-mono tracking-wider text-emerald-400">
                🎯 Đề Bài Yêu Cầu Thực Hành (Tối thiểu 3 lần đo với m_đá khác nhau)
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Học sinh điều chỉnh khối lượng nước đá theo 3 nhiệm vụ đề bài dưới đây, bấm thả đá hòa tan và ghi lại nhiệt độ cân bằng t_cb.
              </p>
            </div>

            {/* 3 Mission Cards */}
            <div className="space-y-2.5">
              {missionStatuses.map(m => {
                const isMatchingCurrent = Math.abs(iceMassKg * 1000 - m.targetIceMassG) <= m.toleranceG;
                return (
                  <div
                    key={m.id}
                    className={`p-3.5 rounded-xl border transition ${
                      m.isCompleted
                        ? 'bg-emerald-950/30 border-emerald-500/50'
                        : isMatchingCurrent
                        ? 'bg-sky-950/40 border-sky-400 shadow-md shadow-sky-900/20'
                        : 'bg-slate-950/60 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                            m.isCompleted
                              ? 'bg-emerald-500 text-slate-950'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {m.isCompleted ? '✓' : m.id}
                        </span>
                        <span className="text-xs font-bold text-slate-200">{m.title}</span>
                      </div>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                          m.isCompleted
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {m.isCompleted
                          ? `Đã đo: m_đá = ${m.recordedIceMassG}g • t_cb = ${m.recordedTempCb}°C`
                          : `Mục tiêu: m_đá = ${m.targetIceMassG}g`}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400 mb-2.5">{m.description}</p>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
                      <div className="text-[10px] text-slate-400">
                        Khối lượng đá hiện tại: <strong className="text-emerald-400">{Math.round(iceMassKg * 1000)} g</strong>
                      </div>
                      <button
                        onClick={() => onAddTrialForMission(m.id, m.targetIceMassG)}
                        disabled={!isMatchingCurrent}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center space-x-1 ${
                          isMatchingCurrent
                            ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md'
                            : 'bg-slate-800/80 text-slate-500 cursor-not-allowed'
                        }`}
                      >
                        <span>{m.isCompleted ? '↻ Ghi Lại Số Liệu' : '+ Ghi Số Liệu Đề Bài'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 flex justify-between items-center">
              <span className="text-xs text-slate-400">
                Tiến độ: <strong className="text-emerald-400">{completedMissionsCount}/3 đề bài</strong>
              </span>
              <button
                onClick={() => setCurrentStep(2)}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg transition flex items-center space-x-1 cursor-pointer"
              >
                <span>Chuyển Sang Bảng Số Liệu & Sai Số</span>
                <span>➔</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Data Table & Error Processing */}
        {currentStep === 2 && (
          <div className="space-y-4">
            {/* Trials Table */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl overflow-hidden">
              <div className="px-3 py-2 bg-slate-800/60 border-b border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200">
                  Bảng Thu Thập Số Liệu ({computedTrials.length} lần đo)
                </span>
                {computedTrials.length > 0 && (
                  <button
                    onClick={onClearTrials}
                    className="text-[10px] text-rose-400 hover:underline cursor-pointer"
                  >
                    Xóa tất cả
                  </button>
                )}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left text-slate-300">
                  <thead className="bg-slate-800/40 uppercase text-[10px] text-slate-400 font-mono">
                    <tr>
                      <th className="p-2">Lần</th>
                      <th className="p-2">m_n (kg)</th>
                      <th className="p-2">m_đá (kg)</th>
                      <th className="p-2">t₁ (°C)</th>
                      <th className="p-2 text-rose-400">t_cb (°C)</th>
                      <th className="p-2 text-emerald-400">λ (J/kg)</th>
                      <th className="p-2 text-center">Xóa</th>
                    </tr>
                  </thead>
                  <tbody>
                    {computedTrials.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-4 text-center text-slate-500 text-xs">
                          Chưa có số liệu. Vui lòng quay lại Bước 1 và điều chỉnh theo 3 đề bài.
                        </td>
                      </tr>
                    ) : (
                      computedTrials.map((t, idx) => (
                        <tr key={idx} className="border-b border-slate-800/60 hover:bg-slate-800/30">
                          <td className="p-2 font-mono font-bold text-slate-400">Đề bài {t.missionId || idx + 1}</td>
                          <td className="p-2 font-mono">{t.waterMassKg}</td>
                          <td className="p-2 font-mono text-sky-300">{t.iceMassKg}</td>
                          <td className="p-2 font-mono">{t.initialWaterTemp}</td>
                          <td className="p-2 font-mono font-bold text-rose-400">{t.equilibriumTemp}</td>
                          <td className="p-2 font-mono font-bold text-emerald-400">{t.calculatedLambda.toLocaleString()}</td>
                          <td className="p-2 text-center">
                            <button
                              onClick={() => onRemoveTrial(idx)}
                              className="text-rose-400 hover:text-rose-300 p-1 font-bold cursor-pointer"
                            >
                              ✕
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Error Calculation Fields */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-200">Xử Lý Số Liệu & Tính Nhiệt Nóng Chảy Riêng:</span>
                <button
                  onClick={handleAutoFillCalculation}
                  className="text-[10px] text-emerald-400 underline hover:text-emerald-300 cursor-pointer"
                >
                  ⚡ Điền tự động kết quả
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">
                    Giá trị trung bình λ̄ (J/kg):
                  </label>
                  <input
                    type="number"
                    placeholder="VD: 334000"
                    value={studentAvgLambda}
                    onChange={e => setStudentAvgLambda(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 font-mono text-emerald-300 font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">
                    Sai số tuyệt đối Δλ (J/kg):
                  </label>
                  <input
                    type="number"
                    placeholder="VD: 8500"
                    value={studentDeltaLambda}
                    onChange={e => setStudentDeltaLambda(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 font-mono text-sky-300 font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Student Observations */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-200">📝 Nhận Xét Của Học Sinh Về Hiện Tượng:</span>
              </div>
              <textarea
                rows={3}
                placeholder="Nhận xét về sự giảm nhiệt độ của nước khi đá tan, quá trình truyền nhiệt và độ chênh lệch so với lý thuyết 3.34×10⁵ J/kg..."
                value={studentObservation}
                onChange={e => setStudentObservation(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-sans"
              />
              <div className="flex flex-wrap gap-1.5 pt-1">
                <button
                  type="button"
                  onClick={() =>
                    setStudentObservation(
                      prev =>
                        (prev ? prev + ' ' : '') +
                        'Khi khối lượng đá m_đá càng lớn thì nhiệt độ cân bằng t_cb hạ càng sâu do cần nhiều nhiệt lượng hơn để làm nóng chảy đá.'
                    )
                  }
                  className="px-2 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded text-[10px] text-emerald-300 cursor-pointer"
                >
                  + Mẫu: m_đá và nhiệt độ cân bằng
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setStudentObservation(
                      prev =>
                        (prev ? prev + ' ' : '') +
                        'Kết quả đo nhiệt nóng chảy riêng xấp xỉ giá trị chuẩn 3.34×10⁵ J/kg, sai số nhỏ do bình nhiệt lượng kế cách nhiệt tốt.'
                    )
                  }
                  className="px-2 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded text-[10px] text-sky-300 cursor-pointer"
                >
                  + Mẫu: Đối chiếu giá trị lý thuyết
                </button>
              </div>
            </div>

            <div className="pt-2 flex justify-between items-center">
              <button
                onClick={() => setCurrentStep(1)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs transition cursor-pointer"
              >
                ⬅ Quay Lại Bước 1
              </button>
              <button
                onClick={() => setCurrentStep(3)}
                disabled={computedTrials.length < 3}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-lg transition cursor-pointer"
              >
                Xem Đồ Thị & Nộp Bài ➔
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Graphs, Quiz & Submission */}
        {currentStep === 3 && (
          <div className="space-y-4">
            {/* Equilibrium Temperature Curve Chart */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <div className="text-[11px] font-bold text-emerald-400 mb-1">
                Đồ Thị Giảm Nhiệt Độ Cân Bằng T(t) Theo Khối Lượng Nước Đá
              </div>
              <div className="h-32 bg-slate-900/90 rounded-lg relative flex items-end p-2 border border-slate-800/80">
                <svg className="w-full h-full" viewBox="0 0 200 120">
                  <line x1="20" y1="10" x2="20" y2="105" stroke="#475569" strokeWidth="1.5" />
                  <line x1="20" y1="105" x2="190" y2="105" stroke="#475569" strokeWidth="1.5" />
                  <text x="5" y="15" fill="#94a3b8" fontSize="8">T(°C)</text>
                  <text x="180" y="115" fill="#94a3b8" fontSize="8">m_đá</text>

                  {/* Curve connecting trials */}
                  <path
                    d="M 30,30 Q 90,65 180,95"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2"
                    strokeDasharray="3 2"
                  />

                  {computedTrials.map((t, idx) => {
                    const px = 30 + ((t.iceMassKg * 1000 - 15) / 45) * 150;
                    const py = 105 - ((t.equilibriumTemp - 5) / 40) * 85;
                    return (
                      <circle
                        key={idx}
                        cx={Math.max(25, Math.min(185, px))}
                        cy={Math.max(15, Math.min(100, py))}
                        r="3.5"
                        fill="#38bdf8"
                        stroke="#ffffff"
                        strokeWidth="1"
                      />
                    );
                  })}
                </svg>
              </div>
            </div>

            {/* 3 GDPT 2018 Multiple Choice Questions */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 space-y-3">
              <h4 className="text-xs font-bold text-amber-400 uppercase font-mono">
                📝 Trắc Nghiệm Hiểu Bài SGK GDPT 2018 (3 Câu)
              </h4>

              {/* Q1 */}
              <div className="space-y-1 text-xs">
                <p className="text-slate-200 font-medium">
                  <strong>Câu 1:</strong> Nhiệt nóng chảy riêng của một chất là nhiệt lượng cần cung cấp để:
                </p>
                <div className="grid grid-cols-2 gap-1 text-[11px]">
                  {[
                    { id: 'A', text: 'A. 1 kg chất đó tăng thêm 1°C' },
                    { id: 'B', text: 'B. 1 kg chất đó nóng chảy hoàn toàn ở nhiệt độ nóng chảy' },
                    { id: 'C', text: 'C. 1 kg chất đó hóa hơi hoàn toàn' },
                    { id: 'D', text: 'D. Làm tăng thể tích chất đó lên 2 lần' },
                  ].map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => setQuizAnswers(prev => ({ ...prev, q1: opt.id }))}
                      className={`px-2 py-1.5 rounded text-left transition cursor-pointer ${
                        quizAnswers.q1 === opt.id
                          ? 'bg-emerald-600 text-white font-bold'
                          : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      {opt.text}
                    </button>
                  ))}
                </div>
              </div>

              {/* Q2 */}
              <div className="space-y-1 text-xs">
                <p className="text-slate-200 font-medium">
                  <strong>Câu 2:</strong> Đơn vị của nhiệt nóng chảy riêng trong hệ SI là:
                </p>
                <div className="grid grid-cols-2 gap-1 text-[11px]">
                  {[
                    { id: 'A', text: 'A. J/(kg·K)' },
                    { id: 'B', text: 'B. J/kg' },
                    { id: 'C', text: 'C. Cal/g·°C' },
                    { id: 'D', text: 'D. W/m·K' },
                  ].map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => setQuizAnswers(prev => ({ ...prev, q2: opt.id }))}
                      className={`px-2 py-1.5 rounded text-left transition cursor-pointer ${
                        quizAnswers.q2 === opt.id
                          ? 'bg-emerald-600 text-white font-bold'
                          : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      {opt.text}
                    </button>
                  ))}
                </div>
              </div>

              {/* Q3 */}
              <div className="space-y-1 text-xs">
                <p className="text-slate-200 font-medium">
                  <strong>Câu 3:</strong> Trong quá trình nước đá nóng chảy ở 0°C, nhiệt độ của hỗn hợp nước và đá:
                </p>
                <div className="grid grid-cols-2 gap-1 text-[11px]">
                  {[
                    { id: 'A', text: 'A. Tăng dần đều' },
                    { id: 'B', text: 'B. Không đổi (vẫn ở 0°C)' },
                    { id: 'C', text: 'C. Giảm xuống dưới 0°C' },
                    { id: 'D', text: 'D. Dao động liên tục' },
                  ].map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => setQuizAnswers(prev => ({ ...prev, q3: opt.id }))}
                      className={`px-2 py-1.5 rounded text-left transition cursor-pointer ${
                        quizAnswers.q3 === opt.id
                          ? 'bg-emerald-600 text-white font-bold'
                          : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      {opt.text}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* PRE-SUBMISSION / POST-SUBMISSION BLOCK */}
            {!isSubmitted ? (
              <div className="bg-slate-950 border border-emerald-500/30 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200 uppercase font-mono">
                    📋 Kiểm Tra Tiến Độ & Sẵn Sàng Nộp Bài
                  </span>
                  <span className="text-[10px] text-amber-400">Chưa nộp bài</span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-300">
                  <div className="flex items-center space-x-2">
                    <span className={computedTrials.length >= 3 ? 'text-emerald-400' : 'text-slate-500'}>
                      {computedTrials.length >= 3 ? '✓' : '○'}
                    </span>
                    <span>Đã thu thập {computedTrials.length}/3 lần đo theo đề bài.</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={quizAnswers.q1 && quizAnswers.q2 && quizAnswers.q3 ? 'text-emerald-400' : 'text-slate-500'}>
                      {quizAnswers.q1 && quizAnswers.q2 && quizAnswers.q3 ? '✓' : '○'}
                    </span>
                    <span>Đã trả lời câu hỏi trắc nghiệm SGK.</span>
                  </div>
                </div>

                <button
                  onClick={handleSubmitAndGrade}
                  disabled={computedTrials.length < 3}
                  className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-xl shadow-emerald-950/50 transition transform active:scale-98 cursor-pointer flex items-center justify-center space-x-2"
                >
                  <span>📝 Nộp Bài & Tính Điểm Thí Nghiệm</span>
                </button>
              </div>
            ) : (
              <div className="bg-slate-950 border border-emerald-500/40 rounded-xl p-4 space-y-3 animate-fade-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-base">🏆</span>
                    <h4 className="text-xs font-bold text-emerald-400 uppercase font-mono">
                      Kết Quả Chấm Điểm Thí Nghiệm
                    </h4>
                  </div>
                  <div className="text-2xl font-mono font-black text-emerald-300">
                    {gradingResultState?.totalScore.toFixed(1)} / 10.0
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                    <div className="text-[10px] text-slate-400">Thao tác (30%)</div>
                    <div className="font-mono font-bold text-sky-300">{gradingResultState?.operationScore} / 3.0</div>
                  </div>
                  <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                    <div className="text-[10px] text-slate-400">Sai số (40%)</div>
                    <div className="font-mono font-bold text-emerald-300">{gradingResultState?.accuracyScore} / 4.0</div>
                  </div>
                  <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                    <div className="text-[10px] text-slate-400">Trắc nghiệm (30%)</div>
                    <div className="font-mono font-bold text-amber-300">{gradingResultState?.quizScore} / 3.0</div>
                  </div>
                </div>

                {gradingResultState?.feedback && gradingResultState.feedback.length > 0 && (
                  <div className="text-[11px] text-slate-300 space-y-1 pt-1 border-t border-slate-800/80">
                    {gradingResultState.feedback.map((f, i) => (
                      <div key={i} className="flex items-center space-x-1.5">
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
                  <button
                    onClick={handleResetGrading}
                    className="w-full sm:w-auto px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs transition cursor-pointer"
                  >
                    ↺ Làm Lại / Đo Tiếp
                  </button>

                  {onOpenSubmissionDrawer && (
                    <button
                      onClick={onOpenSubmissionDrawer}
                      className="w-full sm:flex-1 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-900/40 transition transform active:scale-98 cursor-pointer flex items-center justify-center space-x-2"
                    >
                      <span>🚀 Nộp Bài Vào Bài Tập Được Giao</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            <div className="pt-2 flex justify-start">
              <button
                onClick={() => setCurrentStep(2)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs transition cursor-pointer"
              >
                ⬅ Quay Lại Bảng Số Liệu
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
