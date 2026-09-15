import React, { useState, useEffect } from 'react';

export interface SubmissionData {
  id: string;
  studentName: string;
  className: string;
  labTitle: string;
  time: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'NOT_STARTED';
  score: string;
  feedback?: string;
  submittedAnswersJson?: string;
  explanation?: string;
  mathScore?: number;
  aiReasoningScore?: number;
  aiFeedbackJson?: string;
}

interface GradeSubmissionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  submission: SubmissionData | null;
  onSaveGrade: (id: string, newScore: string, feedback: string) => void;
}

export const GradeSubmissionDrawer: React.FC<GradeSubmissionDrawerProps> = ({
  isOpen,
  onClose,
  submission,
  onSaveGrade,
}) => {
  const [scoreInput, setScoreInput] = useState('');
  const [feedbackInput, setFeedbackInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (submission) {
      const cleanScore = submission.score.includes('/')
        ? submission.score.split('/')[0].trim()
        : submission.score === 'Chưa làm' || submission.score === 'Đang làm...'
        ? ''
        : submission.score;
      setScoreInput(cleanScore);
      setFeedbackInput(submission.feedback || '');
    } else {
      setScoreInput('');
      setFeedbackInput('');
    }
    setErrorMsg('');
  }, [submission, isOpen]);

  if (!isOpen || !submission) return null;

  let parsedAnswers: Record<string, any> = {};
  if (submission.submittedAnswersJson) {
    try {
      parsedAnswers = JSON.parse(submission.submittedAnswersJson);
    } catch (_) {}
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanStr = String(scoreInput).replace(',', '.').trim();
    const numScore = parseFloat(cleanStr);
    if (isNaN(numScore) || numScore < 0 || numScore > 10) {
      setErrorMsg('Vui lòng nhập thang điểm hợp lệ từ 0 đến 10!');
      return;
    }
    onSaveGrade(submission.id, `${numScore.toFixed(1)} / 10`, feedbackInput.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div
          className="w-screen max-w-lg border-l shadow-2xl flex flex-col transition-transform animate-in slide-in-from-right duration-250"
          style={{
            backgroundColor: 'var(--bg-panel)',
            borderColor: 'var(--border-color)',
            color: 'var(--text-main)',
          }}
        >
          {/* Header */}
          <div
            className="p-6 border-b flex items-center justify-between shrink-0"
            style={{ borderColor: 'var(--border-color)' }}
          >
            <div>
              <span
                className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border"
                style={{
                  backgroundColor: 'var(--bg-main)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--accent-primary)',
                }}
              >
                CHẤM BÀI TRỰC TIẾP
              </span>
              <h3 className="text-base font-bold tracking-tight mt-1">
                Báo Cáo Thí Nghiệm & Sổ Điểm
              </h3>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg border flex items-center justify-center text-sm font-semibold opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
              style={{
                borderColor: 'var(--border-color)',
                backgroundColor: 'var(--bg-main)',
              }}
            >
              ✕
            </button>
          </div>

          {/* Submission Info & Grading Form */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
            {errorMsg && (
              <div className="p-3 rounded-lg border border-rose-500/20 bg-rose-500/10 text-rose-600 font-semibold">
                {errorMsg}
              </div>
            )}

            {/* Student & Lab Meta Card */}
            <div
              className="p-4 rounded-xl border space-y-2"
              style={{
                backgroundColor: 'var(--bg-main)',
                borderColor: 'var(--border-color)',
              }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-extrabold text-sm" style={{ color: 'var(--text-main)' }}>
                    {submission.studentName}
                  </h4>
                  <p className="opacity-70 text-[11px] mt-0.5">{submission.className}</p>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                    submission.status === 'COMPLETED'
                      ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                      : submission.status === 'IN_PROGRESS'
                      ? 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                      : 'bg-slate-500/10 text-slate-500 border-slate-500/20'
                  }`}
                >
                  {submission.status === 'COMPLETED'
                    ? 'ĐÃ HOÀN THÀNH'
                    : submission.status === 'IN_PROGRESS'
                    ? 'ĐANG THỰC HIỆN'
                    : 'CHƯA NỘP BÀI'}
                </span>
              </div>

              <div
                className="pt-2 border-t text-[11px] grid grid-cols-2 gap-2 opacity-80"
                style={{ borderColor: 'var(--border-color)' }}
              >
                <div>
                  <span className="opacity-60 block">Bài thí nghiệm:</span>
                  <span className="font-bold">{submission.labTitle}</span>
                </div>
                <div>
                  <span className="opacity-60 block">Thời gian nộp:</span>
                  <span className="font-mono">{submission.time}</span>
                </div>
              </div>
            </div>

            {/* Lab Output Details */}
            <div
              className="p-4 rounded-xl border space-y-2.5"
              style={{
                backgroundColor: 'var(--bg-main)',
                borderColor: 'var(--border-color)',
              }}
            >
              <h5 className="font-bold text-xs uppercase tracking-wider opacity-70">
                Chi Tiết Báo Cáo Thí Nghiệm Học Sinh
              </h5>
              <div className="font-mono text-[11px] space-y-1.5 p-3 rounded-lg border bg-slate-900 text-slate-100 border-slate-800">
                <div>[Mã bài nộp]: {submission.id}</div>
                {Object.keys(parsedAnswers).length > 0 ? (
                  Object.entries(parsedAnswers).map(([k, v]) => (
                    <div key={k}>
                      <span className="text-cyan-400">[{k}]:</span> {String(v)}
                    </div>
                  ))
                ) : (
                  <div>[Dữ liệu đo]: Đã ghi nhận số liệu thực nghiệm</div>
                )}
                {submission.explanation && (
                  <div className="pt-2 mt-2 border-t border-slate-800 text-slate-300 font-sans text-xs">
                    <span className="font-bold text-slate-400 block mb-1">Lời giải / Giải thích:</span>
                    <p className="leading-relaxed bg-slate-950 p-2 rounded border border-slate-800/80">{submission.explanation}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Grading Form Fields */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="font-bold opacity-80 block">Điểm Số Thang Điểm 10 (*)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  autoFocus
                  value={scoreInput}
                  onChange={e => setScoreInput(e.target.value)}
                  placeholder="Nhập điểm (vd: 9.5)..."
                  className="w-full p-2.5 rounded-lg border font-mono font-bold text-sm focus:outline-none transition-colors"
                  style={{
                    backgroundColor: 'var(--bg-main)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-main)',
                  }}
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold opacity-80 block">Nhận Xét Của Giáo Viên</label>
                <textarea
                  rows={4}
                  value={feedbackInput}
                  onChange={e => setFeedbackInput(e.target.value)}
                  placeholder="Nhập nhận xét chi tiết bài làm cho học sinh..."
                  className="w-full p-2.5 rounded-lg border font-medium focus:outline-none transition-colors"
                  style={{
                    backgroundColor: 'var(--bg-main)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-main)',
                  }}
                />
              </div>
            </div>

            {/* Footer buttons */}
            <div
              className="pt-6 border-t flex items-center justify-end gap-3"
              style={{ borderColor: 'var(--border-color)' }}
            >
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg border font-semibold transition-colors cursor-pointer"
                style={{
                  borderColor: 'var(--border-color)',
                  backgroundColor: 'var(--bg-main)',
                  color: 'var(--text-main)',
                }}
              >
                Hủy Bỏ
              </button>

              <button
                type="submit"
                className="px-5 py-2 rounded-lg font-bold text-white transition-opacity hover:opacity-90 cursor-pointer shadow-sm"
                style={{ backgroundColor: 'var(--accent-primary)' }}
              >
                Lưu Điểm & Nhận Xét
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
