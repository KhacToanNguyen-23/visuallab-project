import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export interface StudentAssignmentItem {
  id: string;
  labTitle: string;
  className: string;
  teacherName: string;
  dueDate: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'SUBMITTED';
  route: string;
  instructions?: string;
}

interface SubmitAssignmentDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  assignment: StudentAssignmentItem | null;
  onSubmitReport: (id: string) => void;
}

export const SubmitAssignmentDrawer: React.FC<SubmitAssignmentDrawerProps> = ({
  isOpen,
  onClose,
  assignment,
  onSubmitReport,
}) => {
  const navigate = useNavigate();
  const [reportNote, setReportNote] = useState('');

  if (!isOpen || !assignment) return null;

  const handleLaunchLab = () => {
    onClose();
    navigate(assignment.route);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitReport(assignment.id);
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
          className="w-screen max-w-lg border-l shadow-2xl flex flex-col transition-transform animate-in slide-in-from-right duration-250"
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
                CHI TIẾT BÀI TẬP
              </span>
              <h3 className="text-base font-bold tracking-tight mt-1">{assignment.labTitle}</h3>
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

          {/* Body */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
            <div
              className="p-4 rounded-xl border space-y-2"
              style={{
                backgroundColor: 'var(--bg-main)',
                borderColor: 'var(--border-color)',
              }}
            >
              <div className="flex justify-between items-center text-xs">
                <span className="opacity-60">Lớp học:</span>
                <span className="font-bold">{assignment.className}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="opacity-60">Giáo viên phụ trách:</span>
                <span className="font-bold">{assignment.teacherName}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="opacity-60">Hạn nộp (Deadline):</span>
                <span className="font-mono font-bold text-rose-500">{assignment.dueDate}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold opacity-80 block">Hướng Dẫn Của Giáo Viên</label>
              <div
                className="p-3 rounded-lg border text-xs opacity-90 leading-relaxed"
                style={{
                  backgroundColor: 'var(--bg-main)',
                  borderColor: 'var(--border-color)',
                }}
              >
                {assignment.instructions ||
                  'Tiến hành lắp mạch thí nghiệm mô phỏng, thay đổi thông số và ghi nhận kết quả đo đạc chính xác trước khi gửi báo cáo.'}
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-bold opacity-80 block">Thực Hành Phòng Lab</label>
              <button
                type="button"
                onClick={handleLaunchLab}
                className="w-full py-3 rounded-lg text-xs font-bold text-white transition-opacity hover:opacity-90 cursor-pointer shadow-sm text-center"
                style={{ backgroundColor: 'var(--accent-primary)' }}
              >
                Khởi Chạy Phòng Lab Thực Hành →
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold opacity-80 block">Ghi Chú Kết Quả Thí Nghiệm Của Học Sinh</label>
              <textarea
                rows={4}
                value={reportNote}
                onChange={e => setReportNote(e.target.value)}
                placeholder="Nhập nhận xét hoặc kết quả đo đạc rút ra từ bài thí nghiệm..."
                className="w-full p-2.5 rounded-lg border font-medium focus:outline-none"
                style={{
                  backgroundColor: 'var(--bg-main)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-main)',
                }}
              />
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
                Đóng
              </button>

              <button
                type="submit"
                className="px-5 py-2 rounded-lg font-bold text-white transition-opacity hover:opacity-90 cursor-pointer shadow-sm"
                style={{ backgroundColor: '#10B981' }}
              >
                Gửi Báo Cáo Cho Giáo Viên
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
