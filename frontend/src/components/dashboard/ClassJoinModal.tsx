import React, { useState } from 'react';

interface ClassJoinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJoinSuccess: (className: string, teacherName: string) => void;
}

export const ClassJoinModal: React.FC<ClassJoinModalProps> = ({ isOpen, onClose, onJoinSuccess }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) {
      setError('Vui lòng nhập Mã lớp!');
      return;
    }

    if (cleanCode.length < 5) {
      setError('Mã lớp học không hợp lệ (cần ít nhất 5-6 ký tự).');
      return;
    }

    onJoinSuccess(`Lớp Chuyên Vật lý 12-A1 (${cleanCode})`, 'Thầy Nguyễn Văn Thành');
    setCode('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div 
        className="w-full max-w-md border rounded-xl p-6 shadow-xl flex flex-col gap-4 transition-colors"
        style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
      >
        <div className="flex justify-between items-center border-b pb-3" style={{ borderColor: 'var(--border-color)' }}>
          <h3 className="text-base font-bold flex items-center gap-2">
            <span>Tham gia Lớp học Mới</span>
          </h3>
          <button 
            onClick={onClose}
            className="text-base font-bold opacity-60 hover:opacity-100 px-2"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            Nhập <b>Mã mời 6 ký tự</b> do Giáo viên cung cấp (ví dụ: <code>PHY12-A1</code> hoặc <code>X7K9P2</code>) hoặc dán đường link mời tham gia.
          </p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-500 text-xs p-2.5 rounded font-medium">
              [LỖI] {error}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold">Mã lớp học / Link mời</label>
            <input 
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="VD: X7K9P2"
              className="w-full border rounded-md p-2.5 text-sm uppercase tracking-wider font-mono focus:outline-none transition-colors"
              style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
            />
          </div>

          <div className="flex justify-end gap-3 pt-2 border-t" style={{ borderColor: 'var(--border-color)' }}>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded border cursor-pointer"
              style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-main)', color: 'var(--text-main)' }}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold text-white rounded transition-opacity hover:opacity-90 cursor-pointer"
              style={{ backgroundColor: 'var(--accent-primary)' }}
            >
              Tham Gia Lớp
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
