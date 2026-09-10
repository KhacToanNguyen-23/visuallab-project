import React, { useState } from 'react';

interface JoinClassDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onJoinSuccess: (code: string) => void;
}

export const JoinClassDrawer: React.FC<JoinClassDrawerProps> = ({
  isOpen,
  onClose,
  onJoinSuccess,
}) => {
  const [code, setCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode || cleanCode.length < 4) {
      setErrorMsg('Vui lòng nhập mã tham gia lớp học hợp lệ (6 ký tự)!');
      return;
    }
    onJoinSuccess(cleanCode);
    setCode('');
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
                THAM GIA LỚP HỌC
              </span>
              <h3 className="text-base font-bold tracking-tight mt-1">Nhập Mã Lớp Giáo Viên Cấp</h3>
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
              <label className="font-bold opacity-80 block">Mã Mời Lớp Học (*)</label>
              <input
                type="text"
                autoFocus
                maxLength={8}
                value={code}
                onChange={e => setCode(e.target.value)}
                placeholder="VD: X7K9P2"
                className="w-full p-3 rounded-lg border font-mono font-bold text-sm tracking-widest uppercase focus:outline-none transition-colors"
                style={{
                  backgroundColor: 'var(--bg-main)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-main)',
                }}
              />
              <p className="text-[10px] opacity-60" style={{ color: 'var(--text-muted)' }}>
                Học sinh xin mã gồm 6 ký tự chữ/số từ Giáo viên dạy Vật lý của bạn.
              </p>
            </div>

            <div
              className="p-3.5 rounded-xl border text-[11px] space-y-1.5 opacity-80"
              style={{
                backgroundColor: 'var(--bg-main)',
                borderColor: 'var(--border-color)',
              }}
            >
              <div className="font-bold" style={{ color: 'var(--accent-primary)' }}>
                Sau khi tham gia lớp thành công:
              </div>
              <p>• Bạn sẽ nhận được các bài tập mô phỏng thí nghiệm do Giáo viên giao.</p>
              <p>• Báo cáo thực hành của bạn sẽ được gửi thẳng đến sổ điểm của Giáo viên.</p>
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
                Tham Gia Lớp
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
