import React, { useState, useEffect } from 'react';

export interface UserFormData {
  name: string;
  email: string;
  role: 'TEACHER' | 'STUDENT' | 'ADMIN';
  school: string;
  password?: string;
}

interface UserSlideOverDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UserFormData) => void;
  initialData?: UserFormData | null;
  title?: string;
}

export const UserSlideOverDrawer: React.FC<UserSlideOverDrawerProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  title = 'Cấp Tài Khoản Giáo Viên / Người Dùng Mới',
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'TEACHER' | 'STUDENT' | 'ADMIN'>('TEACHER');
  const [school, setSchool] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setEmail(initialData.email || '');
      setRole(initialData.role || 'TEACHER');
      setSchool(initialData.school || '');
      setPassword('');
    } else {
      setName('');
      setEmail('');
      setRole('TEACHER');
      setSchool('THPT Chuyên Hà Nội - Amsterdam');
      setPassword('edulab2026');
    }
    setErrorMsg('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Vui lòng nhập họ và tên!');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Vui lòng nhập định dạng email hợp lệ!');
      return;
    }
    onSubmit({
      name: name.trim(),
      email: email.trim(),
      role,
      school: school.trim() || 'VisualLab Platform',
      password,
    });
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
                ADMIN DRAWER FORM
              </span>
              <h3 className="text-base font-bold tracking-tight mt-1">{title}</h3>
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
              <label className="font-bold opacity-80 block">Họ và Tên (*)</label>
              <input
                type="text"
                autoFocus
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="VD: Nguyễn Văn Thành"
                className="w-full p-2.5 rounded-lg border font-medium focus:outline-none transition-colors"
                style={{
                  backgroundColor: 'var(--bg-main)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-main)',
                }}
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold opacity-80 block">Email Tài Khoản (*)</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="VD: teacher@edulab.vn"
                className="w-full p-2.5 rounded-lg border font-mono font-medium focus:outline-none transition-colors"
                style={{
                  backgroundColor: 'var(--bg-main)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-main)',
                }}
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold opacity-80 block">Vai Trò Hệ Thống</label>
              <select
                value={role}
                onChange={e => setRole(e.target.value as any)}
                className="w-full p-2.5 rounded-lg border font-semibold focus:outline-none transition-colors cursor-pointer"
                style={{
                  backgroundColor: 'var(--bg-main)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-main)',
                }}
              >
                <option value="TEACHER">Giáo Viên (TEACHER)</option>
                <option value="STUDENT">Học Sinh (STUDENT)</option>
                <option value="ADMIN">Quản Trị Viên (ADMIN)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold opacity-80 block">Đơn Vị / Trường Học</label>
              <input
                type="text"
                value={school}
                onChange={e => setSchool(e.target.value)}
                placeholder="VD: THPT Chuyên Hà Nội - Amsterdam"
                className="w-full p-2.5 rounded-lg border font-medium focus:outline-none transition-colors"
                style={{
                  backgroundColor: 'var(--bg-main)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-main)',
                }}
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold opacity-80 block">Mật Khẩu Mặc Định</label>
              <input
                type="text"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Khởi tạo mật khẩu ban đầu..."
                className="w-full p-2.5 rounded-lg border font-mono text-xs focus:outline-none transition-colors"
                style={{
                  backgroundColor: 'var(--bg-main)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-main)',
                }}
              />
              <p className="text-[10px] opacity-60" style={{ color: 'var(--text-muted)' }}>
                Người dùng sẽ được yêu cầu đổi mật khẩu ở lần đăng nhập đầu tiên.
              </p>
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
                {initialData ? 'Lưu Thay Đổi' : '+ Cấp Tài Khoản'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
