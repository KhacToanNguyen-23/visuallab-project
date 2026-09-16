import React from 'react';
import type { Assignment, StudentAssignmentInstance } from '../../types/assignment';
import { getDeadlineInfo } from '../../utils/deadlineUtils';

interface AssignmentLabHeaderBannerProps {
  assignment: Assignment;
  studentInstance: StudentAssignmentInstance | null;
  onOpenDrawer: () => void;
  onExit: () => void;
  isDrawerOpen?: boolean;
}

export const AssignmentLabHeaderBanner: React.FC<AssignmentLabHeaderBannerProps> = ({
  assignment,
  studentInstance,
  onOpenDrawer,
  onExit,
  isDrawerOpen = false,
}) => {
  let studentParams: Record<string, any> = {};
  try {
    if (studentInstance?.generatedParamsJson) {
      studentParams = JSON.parse(studentInstance.generatedParamsJson);
    }
  } catch (_) {}

  const deadline = getDeadlineInfo(assignment.dueDate, assignment.createdAt);

  return (
    <header
      className="w-full h-14 px-4 border-b flex items-center justify-between z-40 shrink-0 shadow-xs backdrop-blur-md select-none"
      style={{
        backgroundColor: 'var(--bg-panel)',
        borderColor: 'var(--border-color)',
        color: 'var(--text-main)',
      }}
    >
      {/* Left: Exit button & Assignment Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onExit}
          className="px-2.5 py-1.5 rounded-lg border text-xs font-semibold hover:bg-slate-500/10 transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
          style={{
            borderColor: 'var(--border-color)',
            backgroundColor: 'var(--bg-main)',
          }}
          title="Quay lại danh sách bài tập"
        >
          <span>←</span>
          <span className="hidden sm:inline">Thoát bài làm</span>
        </button>

        <div className="h-4 w-[1px] bg-slate-500/30 hidden sm:block shrink-0" />

        <div className="flex items-center gap-2 min-w-0 truncate">
          <span
            className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border shrink-0"
            style={{
              backgroundColor: 'var(--bg-main)',
              borderColor: 'var(--border-color)',
              color: 'var(--accent-primary)',
            }}
          >
            ĐANG LÀM BÀI
          </span>
          <h1 className="text-xs sm:text-sm font-black tracking-tight truncate max-w-xs sm:max-w-md" title={assignment.title}>
            {assignment.title}
          </h1>
        </div>
      </div>

      {/* Center: Student Personal Parameters Chips (Visible on md+) */}
      <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-lg border text-xs" style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)' }}>
        <span className="text-[11px] font-bold opacity-70">🎯 Đề bài cá nhân:</span>
        {Object.keys(studentParams).length > 0 ? (
          <div className="flex items-center gap-2.5 font-mono text-[11px] font-bold">
            {Object.entries(studentParams).map(([k, v]) => (
              <span key={k} className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-500 border border-blue-500/20">
                {k} = {String(v)}
              </span>
            ))}
          </div>
        ) : (
          <span className="font-mono text-[11px] text-blue-400 font-semibold">{assignment.targetFormula || 'Theo hướng dẫn'}</span>
        )}
      </div>

      {/* Right: Deadline Badge & Open Drawer Button */}
      <div className="flex items-center gap-2.5 shrink-0">
        <div className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono font-bold border ${deadline.bgBadgeClass}`}>
          <span>⏳ {deadline.formattedDateTime}</span>
          <span className="text-[10px] font-sans opacity-90">({deadline.timeRemainingText})</span>
        </div>

        <button
          onClick={onOpenDrawer}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold text-white transition-all shadow-sm flex items-center gap-1.5 cursor-pointer ${
            isDrawerOpen ? 'ring-2 ring-emerald-400' : 'hover:opacity-90'
          }`}
          style={{ backgroundColor: 'var(--accent-primary)' }}
        >
          <span>📝</span>
          <span>Ghi Chép & Nộp Bài</span>
        </button>
      </div>
    </header>
  );
};
