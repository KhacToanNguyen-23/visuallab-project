import React, { useState } from 'react';
import { classService } from '../../services/classService';
import type { ClassEnrollment } from '../../types/class';

interface JoinClassModalProps {
  studentId: string;
  studentName: string;
  studentEmail: string;
  onClose: () => void;
  onJoined: (enrollment: ClassEnrollment) => void;
}

export const JoinClassModal: React.FC<JoinClassModalProps> = ({ studentId, studentName, studentEmail, onClose, onJoined }) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isDuplicate, setIsDuplicate] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setLoading(true);
    setError(null);
    setIsDuplicate(false);
    try {
      const enrollment = await classService.joinClass(code.trim(), studentId, studentName, studentEmail);
      onJoined(enrollment);
      onClose();
    } catch (err: any) {
      if (err.isDuplicate) {
        setIsDuplicate(true);
        setError('Bạn đã tham gia lớp học này từ trước!');
      } else {
        setError(err.message || 'Mã lớp không chính xác!');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 text-white shadow-2xl animate-fade-in">
        <h2 className="text-xl font-bold text-cyan-400 mb-2 flex items-center gap-2">
          <span>🎓</span> Tham Gia Lớp Học
        </h2>
        <p className="text-xs text-slate-400 mb-4">Nhập mã Class Code (6 ký tự) do giáo viên cung cấp để gia nhập lớp.</p>

        {error && (
          <div className={`mb-4 p-3 rounded-lg text-sm border ${
            isDuplicate 
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' 
              : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
          }`}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Mã Lớp Học (Class Code) *
            </label>
            <input
              type="text"
              required
              maxLength={6}
              value={code}
              onChange={e => setCode(e.target.value.toUpperCase())}
              placeholder="Ví dụ: LAB892"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-center text-2xl font-mono tracking-widest text-cyan-400 uppercase placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-semibold transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading || code.length < 6}
              className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-cyan-900/30 transition-all disabled:opacity-50"
            >
              {loading ? 'Đang xác nhận...' : 'Gia Nhập Lớp'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
