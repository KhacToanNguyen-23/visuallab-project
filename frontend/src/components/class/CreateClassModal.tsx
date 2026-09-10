import React, { useState } from 'react';
import { classService } from '../../services/classService';
import type { Classroom } from '../../types/class';

interface CreateClassModalProps {
  teacherId: string;
  teacherName: string;
  onClose: () => void;
  onCreated: (newClass: Classroom) => void;
}

export const CreateClassModal: React.FC<CreateClassModalProps> = ({ teacherId, teacherName, onClose, onCreated }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const created = await classService.createClass(name, description, teacherId, teacherName);
      onCreated(created);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Lỗi tạo lớp học');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 text-white shadow-2xl animate-fade-in">
        <h2 className="text-xl font-bold text-emerald-400 mb-4 flex items-center gap-2">
          <span>🏫</span> Tạo Lớp Học Mới
        </h2>

        {error && (
          <div className="mb-4 bg-rose-500/10 border border-rose-500/30 text-rose-300 p-3 rounded-lg text-sm">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Tên Lớp Học *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Ví dụ: Vật Lý 10 - Lớp 10A1"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Mô tả ngắn
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Ví dụ: Lớp thực hành thí nghiệm con lắc đơn và động lực học..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
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
              disabled={loading}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-emerald-900/30 transition-all disabled:opacity-50"
            >
              {loading ? 'Đang tạo...' : 'Tạo Lớp Học'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
