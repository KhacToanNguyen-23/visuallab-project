import React from 'react';
import type { AssignmentSubmission, AiFeedback } from '../../types/assignment';

interface GradeResultViewProps {
  submission: AssignmentSubmission;
  onClose: () => void;
}

export const GradeResultView: React.FC<GradeResultViewProps> = ({ submission, onClose }) => {
  const parseAiFeedback = (jsonStr: string): AiFeedback | null => {
    try {
      return JSON.parse(jsonStr);
    } catch {
      return null;
    }
  };

  const feedback = parseAiFeedback(submission.aiFeedbackJson);

  // 3-Pillar Competency Scores
  const operationScore = Math.min(100, Math.round(submission.totalScore * 0.95)); // 30% Operation
  const errorScore = Math.min(100, submission.mathScore); // 40% Math Error Accuracy
  const theoryScore = Math.min(100, submission.aiReasoningScore); // 30% Theory & Report

  // Radar Chart Calculations (Triangle 3 Axes)
  const size = 160;
  const center = size / 2;
  const radius = 60;

  const getAxisPoint = (angleDegree: number, factor: number) => {
    const rad = ((angleDegree - 90) * Math.PI) / 180;
    return {
      x: center + radius * factor * Math.cos(rad),
      y: center + radius * factor * Math.sin(rad),
    };
  };

  const pOp = getAxisPoint(0, operationScore / 100);
  const pErr = getAxisPoint(120, errorScore / 100);
  const pTh = getAxisPoint(240, theoryScore / 100);

  const maxOp = getAxisPoint(0, 1);
  const maxErr = getAxisPoint(120, 1);
  const maxTh = getAxisPoint(240, 1);

  const radarPolygonPath = `${pOp.x},${pOp.y} ${pErr.x},${pErr.y} ${pTh.x},${pTh.y}`;
  const maxPolygonPath = `${maxOp.x},${maxOp.y} ${maxErr.x},${maxErr.y} ${maxTh.x},${maxTh.y}`;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 font-sans">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl p-6 text-white shadow-2xl animate-fade-in space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              🎉 Kết Quả Chấm Điểm AI & Thực Nghiệm
            </h2>
            <p className="text-xs text-slate-400">Học sinh: {submission.studentName}</p>
          </div>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-semibold transition-colors cursor-pointer"
          >
            ✕ Đóng
          </button>
        </div>

        {/* Competency Radar Chart & Score Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-slate-950 p-4 rounded-2xl border border-slate-800">
          {/* Radar Chart SVG (5 Cols) */}
          <div className="md:col-span-5 flex flex-col items-center justify-center">
            <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider mb-2">
              Biểu Đồ Năng Lực 3 Chiều
            </span>
            <svg width={size} height={size} className="overflow-visible">
              {/* Outer Outer Grid Lines */}
              <polygon points={maxPolygonPath} fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="2 2" />
              <line x1={center} y1={center} x2={maxOp.x} y2={maxOp.y} stroke="#475569" strokeWidth="1" />
              <line x1={center} y1={center} x2={maxErr.x} y2={maxErr.y} stroke="#475569" strokeWidth="1" />
              <line x1={center} y1={center} x2={maxTh.x} y2={maxTh.y} stroke="#475569" strokeWidth="1" />

              {/* Data Polygon Fill */}
              <polygon points={radarPolygonPath} fill="rgba(56, 189, 248, 0.35)" stroke="#38bdf8" strokeWidth="2.5" />

              {/* Axis Labels */}
              <text x={maxOp.x} y={maxOp.y - 8} fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="middle">Thao tác 30%</text>
              <text x={maxErr.x - 10} y={maxErr.y + 14} fill="#4ade80" fontSize="10" fontWeight="bold" textAnchor="end">Sai số 40%</text>
              <text x={maxTh.x + 10} y={maxTh.y + 14} fill="#c084fc" fontSize="10" fontWeight="bold" textAnchor="start">Lý thuyết 30%</text>
            </svg>
          </div>

          {/* Score Cards (7 Cols) */}
          <div className="md:col-span-7 grid grid-cols-2 gap-3">
            <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 text-center">
              <span className="text-[11px] text-slate-400 font-semibold block mb-1">Độ chính xác Toán (40%)</span>
              <span className="text-2xl font-extrabold text-cyan-400 font-mono">{submission.mathScore}</span>
              <span className="text-[10px] text-slate-500 font-semibold block">/ 100</span>
            </div>

            <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 text-center">
              <span className="text-[11px] text-slate-400 font-semibold block mb-1">Lập luận Groq AI (30%)</span>
              <span className="text-2xl font-extrabold text-indigo-400 font-mono">{submission.aiReasoningScore}</span>
              <span className="text-[10px] text-slate-500 font-semibold block">/ 100</span>
            </div>

            <div className="col-span-2 bg-gradient-to-r from-emerald-950/60 to-cyan-950/60 p-4 rounded-xl border border-emerald-500/40 flex justify-between items-center">
              <div>
                <span className="text-xs text-emerald-300 font-bold block">Tổng Điểm Năng Lực</span>
                <span className="text-[10px] text-slate-400 font-medium">Theo công thức SGK GDPT 2018</span>
              </div>
              <div className="text-right">
                <span className="text-3xl font-black text-emerald-400 font-mono">{submission.totalScore}</span>
                <span className="text-xs text-emerald-500 font-semibold block">/ 100</span>
              </div>
            </div>
          </div>
        </div>

        {/* Student Explanation Submitted */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
            📝 Bài làm tự luận / Lời giải đã nộp
          </h3>
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">
            {submission.explanation || '(Không có phần tự luận)'}
          </div>
        </div>

        {/* Groq AI Pedagogical Review */}
        {feedback && (
          <div className="space-y-3">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1 flex items-center gap-1.5">
                <span>🤖</span> Nhận xét sư phạm từ Groq AI
              </h3>
              <div className="bg-emerald-950/30 border border-emerald-800/40 p-4 rounded-xl text-sm text-emerald-200 leading-relaxed shadow-inner">
                {feedback.pedagogicalFeedback}
              </div>
            </div>

            {feedback.suggestions && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-1 flex items-center gap-1.5">
                  <span>💡</span> Gợi ý cải thiện kỹ năng đo đạc
                </h3>
                <div className="bg-cyan-950/30 border border-cyan-800/40 p-4 rounded-xl text-sm text-cyan-200 leading-relaxed shadow-inner">
                  {feedback.suggestions}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
