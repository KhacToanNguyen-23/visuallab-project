import React from 'react';
import { PHYSICS_DOMAINS } from '../../config/domainsConfig';

interface PhETFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedSubject: string;
  onSelectSubject: (subject: string) => void;
  selectedGrade?: number | null;
  onSelectGrade?: (grade: number | null) => void;
}

export const PhETFilterBar: React.FC<PhETFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedSubject,
  onSelectSubject,
  selectedGrade = null,
  onSelectGrade,
}) => {
  return (
    <div 
      className="border rounded-xl p-3 shadow-xs transition-colors flex flex-col md:flex-row items-center gap-3"
      style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
    >
      {/* Search Bar Input */}
      <div className="relative flex-1 w-full">
        <input
          type="text"
          value={searchQuery}
          onChange={e => onSearchChange(e.target.value)}
          placeholder="Tìm kiếm bài thí nghiệm (VD: Định luật Ohm, Gia tốc g, Nhiệt dung, Thấu kính...)"
          className="w-full border rounded-lg px-3.5 py-2 text-xs font-medium focus:outline-none transition-colors"
          style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs opacity-60 hover:opacity-100 cursor-pointer"
          >
            ✕
          </button>
        )}
      </div>

      {/* Grade Level Dropdown Select */}
      {onSelectGrade && (
        <select
          value={selectedGrade === null ? '' : String(selectedGrade)}
          onChange={e => onSelectGrade(e.target.value === '' ? null : Number(e.target.value))}
          className="w-full md:w-48 border rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none cursor-pointer shrink-0"
          style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
        >
          <option value="">Tất Cả Các Khối Lớp</option>
          <option value="10">[LỚP 10] Khối Lớp 10</option>
          <option value="11">[LỚP 11] Khối Lớp 11</option>
          <option value="12">[LỚP 12] Khối Lớp 12</option>
        </select>
      )}

      {/* Physics Domain Dropdown Select */}
      <select
        value={selectedSubject}
        onChange={e => onSelectSubject(e.target.value)}
        className="w-full md:w-56 border rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none cursor-pointer shrink-0"
        style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
      >
        <option value="ALL">Tất Cả Mạch Kiến Thức</option>
        {PHYSICS_DOMAINS.map(d => (
          <option key={d.id} value={d.name}>
            {d.code} {d.name}
          </option>
        ))}
      </select>
    </div>
  );
};


