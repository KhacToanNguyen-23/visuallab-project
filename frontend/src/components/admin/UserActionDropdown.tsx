import React, { useState, useRef, useEffect } from 'react';

interface UserActionDropdownProps {
  userId: string;
  role: 'TEACHER' | 'STUDENT' | 'ADMIN';
  status: 'ACTIVE' | 'SUSPENDED';
  onToggleRole: () => void;
  onToggleStatus: () => void;
  onEdit?: () => void;
  onResetPassword?: () => void;
}

export const UserActionDropdown: React.FC<UserActionDropdownProps> = ({
  role,
  status,
  onToggleRole,
  onToggleStatus,
  onEdit,
  onResetPassword,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="px-2.5 py-1 rounded-md border text-xs font-bold transition-colors cursor-pointer hover:bg-slate-500/10 flex items-center gap-1"
        style={{
          borderColor: 'var(--border-color)',
          backgroundColor: 'var(--bg-main)',
          color: 'var(--text-main)',
        }}
      >
        <span>Thao Tác</span>
        <span className="text-[10px] opacity-60">▼</span>
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-1.5 w-44 rounded-xl border shadow-xl py-1 z-40 text-xs transition-all animate-in fade-in zoom-in-95 duration-100"
          style={{
            backgroundColor: 'var(--bg-panel)',
            borderColor: 'var(--border-color)',
            color: 'var(--text-main)',
          }}
        >
          {onEdit && (
            <button
              onClick={() => {
                setIsOpen(false);
                onEdit();
              }}
              className="w-full text-left px-3 py-2 hover:bg-slate-500/10 font-semibold cursor-pointer flex items-center gap-2"
            >
              <span>Chỉnh Sửa Thông Tin</span>
            </button>
          )}

          <button
            onClick={() => {
              setIsOpen(false);
              onToggleRole();
            }}
            className="w-full text-left px-3 py-2 hover:bg-slate-500/10 font-semibold cursor-pointer flex items-center gap-2"
          >
            <span>Đổi Vai Trò ({role === 'TEACHER' ? 'ADMIN' : role === 'ADMIN' ? 'STUDENT' : 'TEACHER'})</span>
          </button>

          {onResetPassword && (
            <button
              onClick={() => {
                setIsOpen(false);
                onResetPassword();
              }}
              className="w-full text-left px-3 py-2 hover:bg-slate-500/10 font-semibold cursor-pointer flex items-center gap-2"
            >
              <span>Reset Mật Khẩu</span>
            </button>
          )}

          <div className="border-t my-1" style={{ borderColor: 'var(--border-color)' }} />

          <button
            onClick={() => {
              setIsOpen(false);
              onToggleStatus();
            }}
            className={`w-full text-left px-3 py-2 font-bold cursor-pointer flex items-center gap-2 ${
              status === 'ACTIVE' ? 'hover:bg-rose-500/10 text-rose-600' : 'hover:bg-emerald-500/10 text-emerald-600'
            }`}
          >
            <span>{status === 'ACTIVE' ? 'Khóa Tài Khoản' : 'Kích Hoạt Lại'}</span>
          </button>
        </div>
      )}
    </div>
  );
};
