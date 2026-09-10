import React from 'react';

interface RoleSelectorProps {
  selectedRole: 'STUDENT' | 'TEACHER' | 'ADMIN';
  onSelectRole: (role: 'STUDENT' | 'TEACHER' | 'ADMIN') => void;
}

const ROLES: { id: 'STUDENT' | 'TEACHER' | 'ADMIN'; label: string; desc: string }[] = [
  { id: 'STUDENT', label: 'Học sinh', desc: 'Thí nghiệm' },
  { id: 'TEACHER', label: 'Giáo viên', desc: 'Giao bài học' },
  { id: 'ADMIN', label: 'Quản trị', desc: 'Quản lý web' },
];

export const RoleSelector: React.FC<RoleSelectorProps> = ({ selectedRole, onSelectRole }) => {
  return (
    <div className="space-y-1.5 my-2">
      <label 
        className="block text-[11px] font-semibold uppercase tracking-wider opacity-75"
        style={{ color: 'var(--text-main)' }}
      >
        Chọn vai trò của bạn
      </label>
      <div 
        className="grid grid-cols-3 gap-1.5 p-1 rounded-xl border"
        style={{ 
          backgroundColor: 'var(--bg-main)', 
          borderColor: 'var(--border-color)' 
        }}
      >
        {ROLES.map((role) => {
          const isSelected = selectedRole === role.id;
          return (
            <button
              key={role.id}
              type="button"
              onClick={() => onSelectRole(role.id)}
              className={`py-2 px-1 rounded-lg text-center transition-all duration-200 cursor-pointer flex flex-col items-center justify-center ${
                isSelected 
                  ? 'shadow-sm font-semibold' 
                  : 'opacity-70 hover:opacity-100'
              }`}
              style={{
                backgroundColor: isSelected ? 'var(--accent-primary)' : 'transparent',
                color: isSelected ? '#FFFFFF' : 'var(--text-main)',
              }}
            >
              <span className="text-xs font-semibold">{role.label}</span>
              <span 
                className="text-[9px] mt-0.5" 
                style={{ color: isSelected ? 'rgba(255,255,255,0.85)' : 'var(--text-muted)' }}
              >
                {role.desc}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
