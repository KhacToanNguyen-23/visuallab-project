import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export interface LabItem {
  id: string;
  title: string;
  domain: string;
  gradeLevel: string;
  route: string;
  isVisible: boolean;
  runCount: number;
}

const INITIAL_LABS: LabItem[] = [
  { id: 'lab-1', title: 'Mạch Điện Đơn Giản & Định Luật Ohm', domain: 'Điện Học', gradeLevel: 'Lớp 11-12', route: '/simulation', isVisible: true, runCount: 5420 },
  { id: 'lab-2', title: 'Đo Gia Tốc Rơi Tự Do g', domain: 'Cơ Học', gradeLevel: 'Lớp 10', route: '/srs-lab', isVisible: true, runCount: 3210 },
  { id: 'lab-3', title: 'Đo Suất Điện Động E & Điện Trở Trong r', domain: 'Điện Học', gradeLevel: 'Lớp 11', route: '/simulation', isVisible: true, runCount: 1890 },
  { id: 'lab-4', title: 'Đo Nhiệt Dung Riêng c Của Nước', domain: 'Sóng & Nhiệt', gradeLevel: 'Lớp 12', route: '/srs-lab', isVisible: true, runCount: 1450 },
  { id: 'lab-5', title: 'Khúc Xạ Ánh Sáng & Thấu Kính Hội Tụ', domain: 'Quang Học', gradeLevel: 'Lớp 11', route: '/simulation', isVisible: true, runCount: 980 },
  { id: 'lab-6', title: 'Con Lắc Đơn & Dao Động Điều Hòa', domain: 'Cơ Học', gradeLevel: 'Lớp 12', route: '/simulation', isVisible: false, runCount: 0 },
];

export const AdminLabsPage: React.FC = () => {
  const navigate = useNavigate();
  const [labs, setLabs] = useState<LabItem[]>(INITIAL_LABS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('ALL');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleToggleVisibility = (labId: string) => {
    setLabs(prev =>
      prev.map(lab => {
        if (lab.id !== labId) return lab;
        const nextState = !lab.isVisible;
        showToast(
          nextState
            ? `Đã bật hiển thị cho bài lab "${lab.title}"`
            : `Đã chuyển bài lab "${lab.title}" sang trạng thái Bản nháp / Ẩn`
        );
        return { ...lab, isVisible: nextState };
      })
    );
  };

  const filteredLabs = labs.filter(lab => {
    const matchesSearch =
      !searchQuery ||
      lab.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lab.domain.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDomain = selectedDomain === 'ALL' || lab.domain === selectedDomain;
    return matchesSearch && matchesDomain;
  });

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
            Kho Lab Hệ Thống GDPT 2018
          </h2>
          <p className="text-xs opacity-75 mt-0.5" style={{ color: 'var(--text-muted)' }}>
            Quản lý trạng thái hiển thị, theo dõi lượt chạy bài thí nghiệm mô phỏng
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div
        className="p-4 rounded-xl border flex flex-col sm:flex-row gap-3 items-center justify-between"
        style={{
          backgroundColor: 'var(--bg-panel)',
          borderColor: 'var(--border-color)',
        }}
      >
        <div className="flex-1 w-full flex items-center gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm bài thí nghiệm mô phỏng..."
            className="w-full bg-transparent text-xs font-medium focus:outline-none"
            style={{ color: 'var(--text-main)' }}
          />
        </div>

        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
          <span className="text-xs opacity-60 font-semibold">Chuyên đề:</span>
          <select
            value={selectedDomain}
            onChange={e => setSelectedDomain(e.target.value)}
            className="p-1.5 px-2.5 rounded-lg border text-xs font-semibold focus:outline-none cursor-pointer"
            style={{
              backgroundColor: 'var(--bg-main)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-main)',
            }}
          >
            <option value="ALL">Tất cả chuyên đề</option>
            <option value="Điện Học">Điện Học</option>
            <option value="Cơ Học">Cơ Học</option>
            <option value="Quang Học">Quang Học</option>
            <option value="Sóng & Nhiệt">Sóng & Nhiệt</option>
          </select>
        </div>
      </div>

      {/* Full-width Labs Table */}
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
              <th className="p-3.5 pl-4">Chuyên Đề</th>
              <th className="p-3.5">Tên Bài Thí Nghiệm</th>
              <th className="p-3.5">Khối Lớp</th>
              <th className="p-3.5">Lượt Chạy</th>
              <th className="p-3.5">Trạng Thái Hiển Thị</th>
              <th className="p-3.5 text-right pr-4">Thao Tác Admin</th>
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: 'var(--border-color)' }}>
            {filteredLabs.map(lab => (
              <tr
                key={lab.id}
                className="hover:bg-slate-500/5 transition-colors"
                style={{ backgroundColor: 'var(--bg-main)' }}
              >
                <td className="p-3.5 pl-4">
                  <span
                    className="text-[10px] font-bold px-2.5 py-0.5 rounded-full border"
                    style={{
                      backgroundColor: 'var(--bg-panel)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--accent-primary)',
                    }}
                  >
                    [{lab.domain.toUpperCase()}]
                  </span>
                </td>

                <td className="p-3.5 font-bold text-xs" style={{ color: 'var(--text-main)' }}>
                  {lab.title}
                </td>

                <td className="p-3.5 opacity-75 font-medium">{lab.gradeLevel}</td>

                <td className="p-3.5 font-mono font-bold text-xs">
                  {lab.runCount.toLocaleString()}
                </td>

                <td className="p-3.5">
                  {lab.isVisible ? (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 inline-flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>Hiển Thị</span>
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20 inline-flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      <span>Bản Nháp / Ẩn</span>
                    </span>
                  )}
                </td>

                <td className="p-3.5 text-right pr-4 whitespace-nowrap space-x-2">
                  <button
                    onClick={() => handleToggleVisibility(lab.id)}
                    className="px-3 py-1 text-xs font-semibold hover:underline cursor-pointer"
                    style={{ color: 'var(--accent-primary)' }}
                  >
                    {lab.isVisible ? '[Tắt Hiển Thị]' : '[Bật Hiển Thị]'}
                  </button>

                  <button
                    onClick={() => navigate(lab.route)}
                    className="px-3 py-1 text-xs font-semibold rounded-md border cursor-pointer"
                    style={{
                      borderColor: 'var(--border-color)',
                      backgroundColor: 'var(--bg-panel)',
                    }}
                  >
                    Xem Thử →
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
