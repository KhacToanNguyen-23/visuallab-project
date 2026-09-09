import React from 'react';

interface RoleSelectorProps {
  selectedRole: 'STUDENT' | 'TEACHER' | 'ADMIN';
  onSelectRole: (role: 'STUDENT' | 'TEACHER' | 'ADMIN') => void;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({ selectedRole, onSelectRole }) => {
  return (
    <div className="space-y-2 my-3">
      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
        Chọn vai trò của bạn
      </label>
      <div className="grid grid-cols-3 gap-2">
        {/* Student Card */}
        <button
          type="button"
          onClick={() => onSelectRole('STUDENT')}
          className={`p-2.5 rounded-xl border flex flex-col items-center justify-center space-y-1 transition-all duration-200 cursor-pointer ${
            selectedRole === 'STUDENT'
              ? 'bg-blue-600/20 border-blue-500 text-blue-400 shadow-lg shadow-blue-500/10 ring-2 ring-blue-500/50'
              : 'bg-slate-800/40 border-slate-700 text-slate-400 hover:bg-slate-800 hover:border-slate-600'
          }`}
        >
          <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-lg">
            🎓
          </div>
          <div className="text-center">
            <div className="font-semibold text-xs">Học sinh</div>
            <div className="text-[9px] opacity-75">Thí nghiệm</div>
          </div>
        </button>

        {/* Teacher Card */}
        <button
          type="button"
          onClick={() => onSelectRole('TEACHER')}
          className={`p-2.5 rounded-xl border flex flex-col items-center justify-center space-y-1 transition-all duration-200 cursor-pointer ${
            selectedRole === 'TEACHER'
              ? 'bg-purple-600/20 border-purple-500 text-purple-400 shadow-lg shadow-purple-500/10 ring-2 ring-purple-500/50'
              : 'bg-slate-800/40 border-slate-700 text-slate-400 hover:bg-slate-800 hover:border-slate-600'
          }`}
        >
          <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-lg">
            👨‍🏫
          </div>
          <div className="text-center">
            <div className="font-semibold text-xs">Giáo viên</div>
            <div className="text-[9px] opacity-75">Giao bài học</div>
          </div>
        </button>

        {/* Admin Card */}
        <button
          type="button"
          onClick={() => onSelectRole('ADMIN')}
          className={`p-2.5 rounded-xl border flex flex-col items-center justify-center space-y-1 transition-all duration-200 cursor-pointer ${
            selectedRole === 'ADMIN'
              ? 'bg-rose-600/20 border-rose-500 text-rose-400 shadow-lg shadow-rose-500/10 ring-2 ring-rose-500/50'
              : 'bg-slate-800/40 border-slate-700 text-slate-400 hover:bg-slate-800 hover:border-slate-600'
          }`}
        >
          <div className="w-8 h-8 rounded-full bg-rose-500/20 flex items-center justify-center text-lg">
            🛡️
          </div>
          <div className="text-center">
            <div className="font-semibold text-xs">Quản trị</div>
            <div className="text-[9px] opacity-75">Quản lý web</div>
          </div>
        </button>
      </div>
    </div>
  );
};
