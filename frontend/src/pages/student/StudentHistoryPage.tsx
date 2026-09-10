import React, { useState } from 'react';

export interface StudentHistoryItem {
  id: string;
  labTitle: string;
  className: string;
  submittedDate: string;
  score: string;
  teacherFeedback: string;
}

const INITIAL_HISTORY: StudentHistoryItem[] = [
  {
    id: 'hist-1',
    labTitle: 'Mạch Điện Đơn Giản & Định Luật Ohm',
    className: 'Lớp 12-A1 Chuyên Lý',
    submittedDate: '09/09/2026 14:30',
    score: '9.5 / 10',
    teacherFeedback: 'Lắp mạch chuẩn, tính sai số R cực kỳ chính xác!',
  },
  {
    id: 'hist-2',
    labTitle: 'Con Lắc Đơn & Dao Động Điều Hòa',
    className: 'Lớp 12-A1 Chuyên Lý',
    submittedDate: '05/09/2026 10:15',
    score: '9.0 / 10',
    teacherFeedback: 'Đồ thị T2-L vẽ đẹp, đo chu kỳ chính xác.',
  },
  {
    id: 'hist-3',
    labTitle: 'Khúc Xạ Ánh Sáng & Thấu Kính Hội Tụ',
    className: 'Lớp 11-A3',
    submittedDate: '01/09/2026 16:40',
    score: '9.2 / 10',
    teacherFeedback: 'Xác định góc khúc xạ n1, n2 rất tốt.',
  },
];

export const StudentHistoryPage: React.FC = () => {
  const [history] = useState<StudentHistoryItem[]>(INITIAL_HISTORY);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredHistory = history.filter(item =>
    !searchQuery ||
    item.labTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.className.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-black tracking-tight" style={{ color: 'var(--text-main)' }}>
          Lịch Sử Thực Hành & Kết Quả Điểm Số
        </h2>
        <p className="text-xs opacity-75 mt-0.5" style={{ color: 'var(--text-muted)' }}>
          Theo dõi kết quả điểm số và nhận xét chi tiết của Giáo viên dành cho bạn
        </p>
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
          placeholder="Tìm kiếm lịch sử bài thí nghiệm..."
          className="w-full bg-transparent text-xs font-medium focus:outline-none"
          style={{ color: 'var(--text-main)' }}
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} className="text-xs opacity-60 hover:opacity-100">
            ✕
          </button>
        )}
      </div>

      {/* Full-width History Table */}
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
              <th className="p-3.5 pl-4">Bài Thí Nghiệm</th>
              <th className="p-3.5">Lớp Học</th>
              <th className="p-3.5">Thời Gian Nộp</th>
              <th className="p-3.5">Điểm Số</th>
              <th className="p-3.5 pr-4">Nhận Xét Của Giáo Viên</th>
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: 'var(--border-color)' }}>
            {filteredHistory.length > 0 ? (
              filteredHistory.map(item => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-500/5 transition-colors"
                  style={{ backgroundColor: 'var(--bg-main)' }}
                >
                  <td className="p-3.5 pl-4 font-bold text-xs" style={{ color: 'var(--text-main)' }}>
                    {item.labTitle}
                  </td>
                  <td className="p-3.5 font-medium opacity-80">{item.className}</td>
                  <td className="p-3.5 font-mono text-[11px] opacity-75">{item.submittedDate}</td>
                  <td className="p-3.5 font-mono font-black text-xs text-emerald-500">
                    {item.score}
                  </td>
                  <td className="p-3.5 pr-4 font-medium opacity-90">{item.teacherFeedback}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-10 text-center opacity-60">
                  Chưa có lịch sử kết quả thực hành.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
