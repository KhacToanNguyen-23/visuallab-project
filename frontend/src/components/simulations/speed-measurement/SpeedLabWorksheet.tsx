import React, { useState } from 'react';
import type { AutoGradeResult } from './speedLabEngine';
import { evaluateStudentSubmission } from './speedLabEngine';

interface SpeedLabWorksheetProps {
  mode: 'AVERAGE_SPEED' | 'INSTANTANEOUS_SPEED';
  trackAngleDeg: number;
  gateEPosCm: number;
  gateFPosCm: number;
  ballDiameterCm: number;
  isCorrectAssembly: boolean;
  totalTrialsCount: number;
  onGraded?: (result: AutoGradeResult) => void;
}

export const SpeedLabWorksheet: React.FC<SpeedLabWorksheetProps> = ({
  mode,
  trackAngleDeg,
  gateEPosCm,
  gateFPosCm,
  ballDiameterCm,
  isCorrectAssembly,
  totalTrialsCount,
  onGraded,
}) => {
  const currentDistanceCm =
    mode === 'AVERAGE_SPEED'
      ? Math.abs(gateFPosCm - gateEPosCm)
      : ballDiameterCm;

  // 5 rows data
  const [rows, setRows] = useState<{ id: number; distCm: number; timeSec: string }[]>([
    { id: 1, distCm: currentDistanceCm, timeSec: '' },
    { id: 2, distCm: currentDistanceCm, timeSec: '' },
    { id: 3, distCm: currentDistanceCm, timeSec: '' },
    { id: 4, distCm: currentDistanceCm, timeSec: '' },
    { id: 5, distCm: currentDistanceCm, timeSec: '' },
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
    setRows(updated);
  };

  const handleGradeSubmission = () => {
    const validTrials: { distanceCm: number; timeSec: number }[] = [];
    rows.forEach(r => {
      const parsedTime = parseFloat(r.timeSec.replace(',', '.'));
      if (!isNaN(parsedTime) && parsedTime > 0) {
        validTrials.push({ distanceCm: r.distCm, timeSec: parsedTime });
      }
    });

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
    <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-5 shadow-xl space-y-6 text-slate-100">
      {/* Title & Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-3 gap-2">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="font-bold text-sm text-white uppercase tracking-wider">
            Báo Cáo Thực Hành Đo Tốc Độ
          </h3>
        </div>
        <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
          SGK GDPT 2018 - Vật Lý 10 Bài 6
        </span>
      </div>

      {/* Part 1: Data Measurement Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
          <span>1. Bảng số liệu thực nghiệm (Thực hiện tối thiểu 3 lần đo):</span>
          <span className="text-[10px] text-slate-500 font-mono">s (m), t (s), v (m/s)</span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-950/80 text-slate-400 font-mono text-[11px] uppercase border-b border-slate-800">
              <tr>
                <th className="p-2.5 text-center">Lần đo</th>
                <th className="p-2.5">{mode === 'AVERAGE_SPEED' ? 'Quãng đường s (cm)' : 'Đường kính d (cm)'}</th>
                <th className="p-2.5">Thời gian Δt (s)</th>
                <th className="p-2.5">Tốc độ v (m/s)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {rows.map((row, idx) => {
                const parsedTime = parseFloat(row.timeSec.replace(',', '.'));
                const computedV =
                  !isNaN(parsedTime) && parsedTime > 0
                    ? ((row.distCm / 100) / parsedTime).toFixed(3)
                    : '-';

                return (
                  <tr key={row.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-2.5 text-center font-bold text-slate-400">{row.id}</td>
                    <td className="p-2.5 text-slate-300">{row.distCm.toFixed(1)} cm</td>
                    <td className="p-2.5">
                      <input
                        type="text"
                        placeholder="Nhập Δt (s)..."
                        value={row.timeSec}
                        onChange={e => handleTimeChange(idx, e.target.value)}
                        className="bg-slate-950 border border-slate-700/80 rounded px-2.5 py-1 text-emerald-400 font-mono w-28 focus:outline-none focus:border-cyan-500"
                      />
                    </td>
                    <td className="p-2.5 text-cyan-400 font-bold">{computedV}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Part 2: Calculation & Error Analysis */}
      <div className="space-y-3 bg-slate-950/50 p-4 rounded-xl border border-slate-800/80">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
          <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          <span>2. Xử lý số liệu & Tính sai số phép đo:</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block text-[11px] text-slate-400 mb-1">Thời gian trung bình t̄ (s):</label>
            <input
              type="text"
              placeholder="VD: 0.612"
              value={studentAvgT}
              onChange={e => setStudentAvgT(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-[11px] text-slate-400 mb-1">Tốc độ trung bình v̄ (m/s):</label>
            <input
              type="text"
              placeholder="VD: 0.815"
              value={studentAvgV}
              onChange={e => setStudentAvgV(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-cyan-300 font-mono focus:outline-none focus:border-cyan-500 font-bold"
            />
          </div>

          <div>
            <label className="block text-[11px] text-slate-400 mb-1">Sai số tuyệt đối Δv (m/s):</label>
            <input
              type="text"
              placeholder="VD: 0.020"
              value={studentDeltaV}
              onChange={e => setStudentDeltaV(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>
      </div>

      {/* Part 3: Post-lab Understanding Quiz */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
          <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>3. Câu hỏi củng cố lý thuyết thu hoạch (30% điểm):</span>
        </div>

        {/* Question 1 */}
        <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-3.5 space-y-2 text-xs">
          <p className="font-semibold text-slate-200">
            Câu 1: Việc thực hiện lặp lại phép đo thời gian viên bi lăn ít nhất 3 đến 5 lần có ý nghĩa gì?
          </p>
          <div className="space-y-1.5 pl-1">
            {[
              { key: 'A', text: 'Để triệt tiêu hoàn toàn sai số dụng cụ đo.' },
              { key: 'B', text: 'Để giảm thiểu ảnh hưởng của sai số ngẫu nhiên.' },
              { key: 'C', text: 'Để làm tăng gia tốc của viên bi lăn trên máng.' },
            ].map(opt => (
              <label
                key={opt.key}
                className={`flex items-center gap-2.5 p-2 rounded-lg cursor-pointer transition-colors border ${
                  quizAnswers.q1 === opt.key
                    ? 'bg-cyan-950/40 border-cyan-500/50 text-cyan-200'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <input
                  type="radio"
                  name="quiz_q1"
                  value={opt.key}
                  checked={quizAnswers.q1 === opt.key}
                  onChange={() => setQuizAnswers(prev => ({ ...prev, q1: opt.key }))}
                  className="accent-cyan-500 cursor-pointer"
                />
                <span><strong>{opt.key}.</strong> {opt.text}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Question 2 */}
        <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-3.5 space-y-2 text-xs">
          <p className="font-semibold text-slate-200">
            Câu 2: Công thức xác định tốc độ trung bình của viên bi giữa hai cổng quang E và F là gì?
          </p>
          <div className="space-y-1.5 pl-1">
            {[
              { key: 'A', text: 'v = s / Δt (với s là khoảng cách giữa 2 cổng quang)' },
              { key: 'B', text: 'v = s × Δt' },
              { key: 'C', text: 'v = 2s / (Δt)²' },
            ].map(opt => (
              <label
                key={opt.key}
                className={`flex items-center gap-2.5 p-2 rounded-lg cursor-pointer transition-colors border ${
                  quizAnswers.q2 === opt.key
                    ? 'bg-cyan-950/40 border-cyan-500/50 text-cyan-200'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <input
                  type="radio"
                  name="quiz_q2"
                  value={opt.key}
                  checked={quizAnswers.q2 === opt.key}
                  onChange={() => setQuizAnswers(prev => ({ ...prev, q2: opt.key }))}
                  className="accent-cyan-500 cursor-pointer"
                />
                <span><strong>{opt.key}.</strong> {opt.text}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Question 3 */}
        <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-3.5 space-y-2 text-xs">
          <p className="font-semibold text-slate-200">
            Câu 3: Trong thí nghiệm đo tốc độ tức thời tại cổng E bằng đường kính d, vì sao tỉ số v = d / Δt_E biểu diễn xấp xỉ tốc độ tức thời?
          </p>
          <div className="space-y-1.5 pl-1">
            {[
              { key: 'A', text: 'Vì viên bi chuyển động thẳng đều trên toàn bộ máng nghiêng.' },
              { key: 'B', text: 'Vì đồng hồ hiện số không có sai số.' },
              { key: 'C', text: 'Vì đường kính d rất nhỏ, trong khoảng thời gian rất ngắn Δt_E chuyển động được coi là gần như đều.' },
            ].map(opt => (
              <label
                key={opt.key}
                className={`flex items-center gap-2.5 p-2 rounded-lg cursor-pointer transition-colors border ${
                  quizAnswers.q3 === opt.key
                    ? 'bg-cyan-950/40 border-cyan-500/50 text-cyan-200'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <input
                  type="radio"
                  name="quiz_q3"
                  value={opt.key}
                  checked={quizAnswers.q3 === opt.key}
                  onChange={() => setQuizAnswers(prev => ({ ...prev, q3: opt.key }))}
                  className="accent-cyan-500 cursor-pointer"
                />
                <span><strong>{opt.key}.</strong> {opt.text}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Submit Grade Button */}
      <button
        onClick={handleGradeSubmission}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all active:scale-[0.99] cursor-pointer"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Nộp Báo Cáo & Chấm Điểm Tự Động</span>
      </button>

      {/* Auto-Grading Result Banner */}
      {gradeResult && (
        <div
          className={`p-5 rounded-2xl border ${
            gradeResult.isPass
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
              : 'bg-amber-950/40 border-amber-500/40 text-amber-200'
          } space-y-4`}
        >
          <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
            <div className="flex items-center gap-2">
              {gradeResult.isPass ? (
                <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              <div>
                <h4 className="font-extrabold text-base">
                  {gradeResult.isPass ? 'ĐẠT YÊU CẦU BÀI THỰC HÀNH' : 'CẦN HOÀN THIỆN LẠI'}
                </h4>
                <p className="text-xs opacity-80">Tổng Điểm Đánh Giá: {gradeResult.totalScore} / 10.0</p>
              </div>
            </div>

            <div className="text-right">
              <span className="font-mono text-3xl font-black text-emerald-400">
                {gradeResult.totalScore}
              </span>
              <span className="text-xs text-slate-400 block font-mono">/ 10 Điểm</span>
            </div>
          </div>

          {/* 3-Tier Score Breakdown */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
              <span className="block text-[10px] text-slate-400 uppercase">Thao Tác (30%)</span>
              <span className="font-mono font-bold text-cyan-400 text-sm">{gradeResult.operationScore} / 3.0</span>
            </div>
            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
              <span className="block text-[10px] text-slate-400 uppercase">Sai Số & Tính (40%)</span>
              <span className="font-mono font-bold text-emerald-400 text-sm">{gradeResult.accuracyScore} / 4.0</span>
              <span className="block text-[9px] text-slate-500 font-mono">Sai số: {gradeResult.errorPercentage}%</span>
            </div>
            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
              <span className="block text-[10px] text-slate-400 uppercase">Trắc Nghiệm (30%)</span>
              <span className="font-mono font-bold text-amber-400 text-sm">{gradeResult.quizScore} / 3.0</span>
            </div>
          </div>

          {/* Pedagogical Feedback list */}
          {gradeResult.feedback.length > 0 && (
            <div className="space-y-1 text-xs pt-1">
              <span className="font-semibold block text-slate-300">Nhận xét & Hướng dẫn:</span>
              <ul className="list-disc list-inside space-y-0.5 text-[11px] opacity-90">
                {gradeResult.feedback.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
