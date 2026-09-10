import React, { useState } from 'react';

export interface ClassFormData {
  name: string;
  gradeLevel: string;
  description?: string;
}

interface CreateClassDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ClassFormData) => void;
}

export const CreateClassDrawer: React.FC<CreateClassDrawerProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [name, setName] = useState('');
  const [gradeLevel, setGradeLevel] = useState('Vật lý 12');
  const [description, setDescription] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Vui lòng nhập tên lớp học!');
      return;
    }
    onSubmit({
      name: name.trim(),
      gradeLevel,
      description: description.trim(),
    });
    setName('');
    setDescription('');
    setErrorMsg('');
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
          className="w-screen max-w-md border-l shadow-2xl flex flex-col transition-transform animate-in slide-in-from-right duration-250"
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
                FORM TẠO LỚP HỌC
              </span>
              <h3 className="text-base font-bold tracking-tight mt-1">Tạo Lớp Học Thực Hành Mới</h3>
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

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
            {errorMsg && (
              <div className="p-3 rounded-lg border border-rose-500/20 bg-rose-500/10 text-rose-600 font-semibold">
                {errorMsg}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="font-bold opacity-80 block">Tên Lớp Học (*)</label>
              <input
                type="text"
                autoFocus
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="VD: Vật lý 12 - Lớp 12A1 Chuyên Lý"
                className="w-full p-2.5 rounded-lg border font-medium focus:outline-none transition-colors"
                style={{
                  backgroundColor: 'var(--bg-main)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-main)',
                }}
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold opacity-80 block">Khối Lớp</label>
              <select
                value={gradeLevel}
                onChange={e => setGradeLevel(e.target.value)}
                className="w-full p-2.5 rounded-lg border font-semibold focus:outline-none transition-colors cursor-pointer"
                style={{
                  backgroundColor: 'var(--bg-main)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-main)',
                }}
              >
                <option value="Vật lý 10">Vật lý 10 (Cơ học & Panme)</option>
                <option value="Vật lý 11">Vật lý 11 (Điện học & Quang học)</option>
                <option value="Vật lý 12">Vật lý 12 (Sóng, Nhiệt & Hạt nhân)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold opacity-80 block">Ghi Chú / Hướng Dẫn Ban Đầu</label>
              <textarea
                rows={4}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Nhập nội dung ghi chú cho lớp học (vd: Nhóm thực hành 60fps)..."
                className="w-full p-2.5 rounded-lg border font-medium focus:outline-none transition-colors"
                style={{
                  backgroundColor: 'var(--bg-main)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-main)',
                }}
              />
            </div>

            <div
              className="p-3 rounded-lg border text-[11px] opacity-75 space-y-1"
              style={{
                backgroundColor: 'var(--bg-main)',
                borderColor: 'var(--border-color)',
              }}
            >
              <p className="font-bold text-xs" style={{ color: 'var(--accent-primary)' }}>
                Tự động sinh mã mời (Join Code)
              </p>
              <p>Hệ thống sẽ tạo 1 mã mời ngẫu nhiên 6 ký tự (VD: X7K9P2) để học sinh tham gia lớp.</p>
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
                + Tạo Lớp Học
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
