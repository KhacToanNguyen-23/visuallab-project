import React from 'react';

interface PhETFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedGrade: string;
  onSelectGrade: (grade: string) => void;
  selectedSubject: string;
  onSelectSubject: (subject: string) => void;
}

export const PhETFilterBar: React.FC<PhETFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedGrade,
  onSelectGrade,
  selectedSubject,
  onSelectSubject,
}) => {
  const grades = [
    { id: 'ALL', label: 'Tất Cả Các Lớp' },
    { id: 'Lớp 10', label: 'Vật Lý 10' },
    { id: 'Lớp 11', label: 'Vật Lý 11' },
    { id: 'Lớp 12', label: 'Vật Lý 12' },
    { id: 'THCS', label: 'Khối THCS (6-9)' },
  ];

  const subjects = [
    { id: 'ALL', label: 'Tất Cả Phân Môn', icon: '⚛️' },
    { id: 'Điện Học', label: 'Điện Học & Mạch DC', icon: '⚡' },
    { id: 'Cơ Học', label: 'Cơ Học & Dao Động', icon: '⏱️' },
    { id: 'Quang Học', label: 'Quang Học & Thấu Kính', icon: '🔍' },
    { id: 'Nhiệt Học', label: 'Nhiệt Học & Nhiệt Dung', icon: '🔥' },
  ];

  return (
    <div className="p-1.5 rounded-[2.25rem] bg-white/[0.03] border border-white/10 ring-1 ring-black/40 shadow-2xl backdrop-blur-2xl">
      <div className="bg-[#0A0E17]/90 p-6 md:p-8 rounded-[calc(2.25rem-0.375rem)] flex flex-col gap-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]">
        {/* Search Bar with Doppelrand Inner Shadow */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative flex-1 w-full">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
              🔍
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={e => onSearchChange(e.target.value)}
              placeholder="Tìm kiếm bài thí nghiệm (VD: Định luật Ohm, Gia tốc g, Nhiệt dung, Thấu kính...)"
              className="w-full bg-[#05070C] border border-white/10 rounded-full pl-11 pr-10 py-3.5 text-xs font-medium text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300 shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-sm cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-[10px] font-bold uppercase tracking-[0.2em] flex-shrink-0">
            <span>✨ PhET Simulation Filter</span>
          </div>
        </div>

        {/* Grade Level Tabs Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mr-2 flex-shrink-0">
            Khối Lớp:
          </span>
          {grades.map(g => (
            <button
              key={g.id}
              onClick={() => onSelectGrade(g.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-300 whitespace-nowrap cursor-pointer ${
                selectedGrade === g.id
                  ? 'bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 text-white shadow-lg shadow-cyan-500/20 font-bold scale-[1.03]'
                  : 'bg-white/[0.04] border border-white/10 text-slate-400 hover:bg-white/[0.08] hover:text-white'
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>

        {/* Subject Area Chips */}
        <div className="flex flex-wrap gap-2.5 pt-3 border-t border-white/10">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mr-2 my-auto">
            Chủ Đề:
          </span>
          {subjects.map(s => (
            <button
              key={s.id}
              onClick={() => onSelectSubject(s.id)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-300 cursor-pointer ${
                selectedSubject === s.id
                  ? 'bg-cyan-950/80 border border-cyan-400 text-cyan-200 shadow-md shadow-cyan-950/80 ring-2 ring-cyan-500/30 font-bold scale-[1.03]'
                  : 'bg-white/[0.03] border border-white/10 text-slate-400 hover:bg-white/[0.08] hover:text-slate-200'
              }`}
            >
              <span className="text-sm">{s.icon}</span>
              <span>{s.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
