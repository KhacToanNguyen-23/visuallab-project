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

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl p-6 text-white shadow-2xl animate-fade-in space-y-6 max-h-[90vh] overflow-y-auto">
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
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-semibold transition-colors"
          >
            ✕ Đóng
          </button>
        </div>

        {/* Score Cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center">
            <span className="text-xs text-slate-400 font-semibold block mb-1">Độ chính xác Toán</span>
            <span className="text-2xl font-extrabold text-cyan-400 font-mono">{submission.mathScore}</span>
            <span className="text-xs text-slate-500 font-semibold block">/ 100</span>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center">
            <span className="text-xs text-slate-400 font-semibold block mb-1">Lập luận Groq AI</span>
            <span className="text-2xl font-extrabold text-indigo-400 font-mono">{submission.aiReasoningScore}</span>
            <span className="text-xs text-slate-500 font-semibold block">/ 100</span>
          </div>

          <div className="bg-emerald-950/40 p-4 rounded-2xl border border-emerald-500/40 text-center">
            <span className="text-xs text-emerald-300 font-bold block mb-1">Điểm Tổng Kết</span>
            <span className="text-3xl font-black text-emerald-400 font-mono">{submission.totalScore}</span>
            <span className="text-xs text-emerald-500 font-semibold block">/ 100</span>
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
