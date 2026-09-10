import React, { useState } from 'react';
import { assignmentService } from '../../services/assignmentService';
import type { Assignment } from '../../types/assignment';

interface CreateAssignmentModalProps {
  classId: string;
  teacherId: string;
  onClose: () => void;
  onCreated: (newAssignment: Assignment) => void;
}

export const CreateAssignmentModal: React.FC<CreateAssignmentModalProps> = ({ classId, teacherId, onClose, onCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [labType, setLabType] = useState('PENDULUM');
  const [lengthMin, setLengthMin] = useState(0.5);
  const [lengthMax, setLengthMax] = useState(2.0);
  const [angleMin, setAngleMin] = useState(5);
  const [angleMax, setAngleMax] = useState(30);
  const [tolerancePercent, setTolerancePercent] = useState(3.0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    setError(null);

    const paramBoundsJson = JSON.stringify({
      lengthMin,
      lengthMax,
      angleMin,
      angleMax,
    });

    try {
      const created = await assignmentService.createAssignment({
        classId,
        title,
        description,
        labType,
        paramBoundsJson,
        targetFormula: 'T = 2 * PI * sqrt(L / g)',
        tolerancePercent,
        teacherId,
      });
      onCreated(created);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Lỗi tạo bài tập');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 text-white shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold text-cyan-400 mb-4 flex items-center gap-2">
          <span>🧪</span> Tạo Bài Tập Lab Cá Nhân Hóa
        </h2>

        {error && (
          <div className="mb-4 bg-rose-500/10 border border-rose-500/30 text-rose-300 p-3 rounded-lg text-sm">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Tiêu Đề Bài Tập *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Ví dụ: Thí nghiệm xác định chu kỳ con lắc đơn T"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Bài Lab Thí Nghiệm
            </label>
            <select
              value={labType}
              onChange={e => setLabType(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500 transition-colors"
            >
              <option value="PENDULUM">PhET Con Lắc Đơn (Pendulum Lab)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Yêu cầu / Đề bài chi tiết
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Hãy tiến hành đo chu kỳ T theo chiều dài L và góc lệch được giao, tính gia tốc g và nộp nhận xét..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
              🎲 Miền biến thiên tham số ngẫu nhiên (Cho mỗi Học Sinh)
            </h3>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Chiều dài L min (m)</label>
                <input
                  type="number"
                  step="0.1"
                  value={lengthMin}
                  onChange={e => setLengthMin(parseFloat(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-white"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Chiều dài L max (m)</label>
                <input
                  type="number"
                  step="0.1"
                  value={lengthMax}
                  onChange={e => setLengthMax(parseFloat(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-white"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Góc lệch θ min (°)</label>
                <input
                  type="number"
                  value={angleMin}
                  onChange={e => setAngleMin(parseFloat(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-white"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Góc lệch θ max (°)</label>
                <input
                  type="number"
                  value={angleMax}
                  onChange={e => setAngleMax(parseFloat(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Sai số chấp nhận đo đạc (%)</label>
              <input
                type="number"
                step="0.5"
                value={tolerancePercent}
                onChange={e => setTolerancePercent(parseFloat(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-white"
              />
            </div>
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
              disabled={loading}
              className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-cyan-900/30 transition-all disabled:opacity-50"
            >
              {loading ? 'Đang giao...' : 'Giao Bài Tập'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
