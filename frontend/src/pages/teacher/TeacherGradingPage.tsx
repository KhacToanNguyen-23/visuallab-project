import React, { useState } from 'react';
import { GradeSubmissionDrawer, type SubmissionData } from '../../components/teacher/GradeSubmissionDrawer';

export const TeacherGradingPage: React.FC = () => {
  const [submissions, setSubmissions] = useState<SubmissionData[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<SubmissionData | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenGradeDrawer = (sub: SubmissionData) => {
    setSelectedSubmission(sub);
    setIsDrawerOpen(true);
  };

  const handleSaveGrade = (id: string, newScore: string, feedback: string) => {
    setSubmissions(prev =>
      prev.map(sub => {
        if (sub.id !== id) return sub;
        return {
          ...sub,
          score: newScore,
          status: 'COMPLETED',
          feedback,
        };
      })
    );
    showToast(`Đã lưu điểm (${newScore}) và nhận xét thành công!`);
  };

  const filteredSubmissions = submissions.filter(sub =>
    !searchQuery ||
    sub.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sub.labTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sub.className.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 font-semibold text-xs animate-bounce flex items-center gap-2">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black tracking-tight" style={{ color: 'var(--text-main)' }}>
            Sổ Điểm Tiến Độ & Chấm Bài Thực Hành
          </h2>
          <p className="text-xs opacity-75 mt-0.5" style={{ color: 'var(--text-muted)' }}>
            Click chọn học sinh để mở Drawer xem báo cáo và nhập điểm trực tiếp tại chỗ
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div
        className="p-4 rounded-xl border flex items-center justify-between gap-3"
        style={{
          backgroundColor: 'var(--bg-panel)',
          borderColor: 'var(--border-color)',
        }}
      >
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Tìm kiếm theo Tên học sinh, Lớp học hoặc Tên bài lab..."
          className="w-full bg-transparent text-xs font-medium focus:outline-none"
          style={{ color: 'var(--text-main)' }}
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} className="text-xs opacity-60 hover:opacity-100">
            ✕
          </button>
        )}
      </div>

      {/* Full-width Submissions Table */}
      <div
        className="border rounded-xl overflow-hidden shadow-xs"
        style={{ borderColor: 'var(--border-color)' }}
      >
        <table className="w-full text-left text-xs">
          <thead
            className="border-b uppercase font-semibold text-[10px] tracking-wider"
            style={{
              backgroundColor: 'var(--bg-panel)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-muted)',
            }}
          >
            <tr>
              <th className="p-3.5 pl-4">Họ và Tên Học Sinh</th>
              <th className="p-3.5">Lớp Học</th>
              <th className="p-3.5">Bài Thí Nghiệm</th>
              <th className="p-3.5">Thời Gian Nộp</th>
              <th className="p-3.5">Trạng Thái</th>
              <th className="p-3.5">Điểm Số</th>
              <th className="p-3.5 text-right pr-4">Thao Tác</th>
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: 'var(--border-color)' }}>
            {filteredSubmissions.length > 0 ? (
              filteredSubmissions.map(sub => (
                <tr
                  key={sub.id}
                  onClick={() => handleOpenGradeDrawer(sub)}
                  className="hover:bg-slate-500/5 transition-colors cursor-pointer"
                  style={{ backgroundColor: 'var(--bg-main)' }}
                >
                  <td className="p-3.5 pl-4 font-bold text-xs" style={{ color: 'var(--text-main)' }}>
                    {sub.studentName}
                  </td>

                  <td className="p-3.5 font-medium opacity-80">{sub.className}</td>

                  <td className="p-3.5 font-semibold text-xs">{sub.labTitle}</td>

                  <td className="p-3.5 font-mono text-[11px] opacity-75">{sub.time}</td>

                  <td className="p-3.5">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        sub.status === 'COMPLETED'
                          ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                          : sub.status === 'IN_PROGRESS'
                          ? 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                          : 'bg-slate-500/10 text-slate-500 border-slate-500/20'
                      }`}
                    >
                      {sub.status === 'COMPLETED'
                        ? 'HOÀN THÀNH'
                        : sub.status === 'IN_PROGRESS'
                        ? 'ĐANG THỰC HIỆN'
                        : 'CHƯA NỘP'}
                    </span>
                  </td>

                  <td className="p-3.5 font-mono font-bold text-xs" style={{ color: 'var(--accent-primary)' }}>
                    {sub.score}
                  </td>

                  <td className="p-3.5 text-right pr-4 whitespace-nowrap">
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        handleOpenGradeDrawer(sub);
                      }}
                      className="px-3 py-1 text-xs font-semibold rounded-md border cursor-pointer"
                      style={{
                        borderColor: 'var(--border-color)',
                        backgroundColor: 'var(--bg-panel)',
                      }}
                    >
                      Xem & Chấm Điểm →
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="p-10 text-center opacity-60">
                  Không tìm thấy bài nộp nào phù hợp.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Slide-over Drawer for In-place Grading */}
      <GradeSubmissionDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        submission={selectedSubmission}
        onSaveGrade={handleSaveGrade}
      />
    </div>
  );
};
