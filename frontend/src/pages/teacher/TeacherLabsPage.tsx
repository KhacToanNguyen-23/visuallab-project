import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export interface PresetLabItem {
  id: string;
  title: string;
  domain: string;
  description: string;
  route: string;
  badge: string;
}

const PRESET_LABS: PresetLabItem[] = [
  { id: 'sim-dc-circuit', title: 'Mạch Điện Đơn Giản & Định Luật Ohm', domain: 'Điện Học', description: 'Mô phỏng lắp mạch Pin, Điện trở, Ampe kế, Vôn kế.', route: '/simulation', badge: 'ĐIỆN HỌC' },
  { id: 'sim-emf-internal-r', title: 'Đo Suất Điện Động E & Điện Trở Trong r', domain: 'Điện Học', description: 'Khảo sát đồ thị U-I của nguồn pin bằng biến trở con chạy.', route: '/simulation', badge: 'ĐIỆN HỌC' },
  { id: 'sim-free-fall', title: 'Đo Gia Tốc Rơi Tự Do g', domain: 'Cơ Học', description: 'Bi sắt rơi qua cổng quang điện, đo t và tự động tính gia tốc g.', route: '/srs-lab', badge: 'CƠ HỌC' },
  { id: 'sim-simple-pendulum', title: 'Con Lắc Đơn & Dao Động Điều Hòa', domain: 'Cơ Học', description: 'Khảo sát chu kỳ dao động T = 2pi*sqrt(l/g) của con lắc đơn.', route: '/simulation', badge: 'CƠ HỌC' },
  { id: 'sim-specific-heat', title: 'Đo Nhiệt Dung Riêng c Của Nước', domain: 'Sóng - Nhiệt', description: 'Đo công suất Q = P*t và độ tăng nhiệt độ delta T.', route: '/srs-lab', badge: 'SÓNG - NHIỆT' },
  { id: 'sim-refraction', title: 'Khúc Xạ Ánh Sáng & Thấu Kính Hội Tụ', domain: 'Quang Học', description: 'Chiếu laser qua môi trường n1, n2 và xác định góc khúc xạ.', route: '/simulation', badge: 'QUANG HỌC' },
];

export const TeacherLabsPage: React.FC = () => {
  const navigate = useNavigate();
  const [labs] = useState<PresetLabItem[]>(PRESET_LABS);
  const [selectedDomain, setSelectedDomain] = useState('ALL');

  const filteredLabs = labs.filter(lab => {
    if (selectedDomain === 'ALL') return true;
    return lab.domain === selectedDomain;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black tracking-tight" style={{ color: 'var(--text-main)' }}>
            Kho Lab Mẫu GDPT 2018
          </h2>
          <p className="text-xs opacity-75 mt-0.5" style={{ color: 'var(--text-muted)' }}>
            Danh sách bài thí nghiệm mô phỏng tương tác dành cho Giáo viên giao bài
          </p>
        </div>

        <button
          onClick={() => navigate('/teacher/assign')}
          className="px-4 py-2.5 rounded-lg text-xs font-bold text-white shadow-md transition-opacity hover:opacity-90 cursor-pointer shrink-0"
          style={{ backgroundColor: 'var(--accent-primary)' }}
        >
          Giao Bài Tập Ngay
        </button>
      </div>

      {/* Domain Chips */}
      <div className="flex flex-wrap gap-2 pb-3 border-b" style={{ borderColor: 'var(--border-color)' }}>
        <button
          onClick={() => setSelectedDomain('ALL')}
          className={`px-3 py-1.5 rounded-md text-xs font-semibold border cursor-pointer ${
            selectedDomain === 'ALL' ? 'font-bold text-white' : 'opacity-70'
          }`}
          style={{
            borderColor: 'var(--border-color)',
            backgroundColor: selectedDomain === 'ALL' ? 'var(--accent-primary)' : 'var(--bg-main)',
            color: selectedDomain === 'ALL' ? '#FFFFFF' : 'var(--text-main)',
          }}
        >
          Tất Cả Mạch Kiến Thức
        </button>
        {['Điện Học', 'Cơ Học', 'Quang Học', 'Sóng - Nhiệt'].map(domain => (
          <button
            key={domain}
            onClick={() => setSelectedDomain(domain)}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold border cursor-pointer ${
              selectedDomain === domain ? 'font-bold text-white' : 'opacity-70'
            }`}
            style={{
              borderColor: 'var(--border-color)',
              backgroundColor: selectedDomain === domain ? 'var(--accent-primary)' : 'var(--bg-main)',
              color: selectedDomain === domain ? '#FFFFFF' : 'var(--text-main)',
            }}
          >
            {domain}
          </button>
        ))}
      </div>

      {/* Full Width Labs Table */}
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
              <th className="p-3.5">Mô Tả GDPT 2018</th>
              <th className="p-3.5 text-right pr-4">Thao Tác</th>
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
                    [{lab.badge}]
                  </span>
                </td>
                <td className="p-3.5 font-bold text-xs" style={{ color: 'var(--text-main)' }}>
                  {lab.title}
                </td>
                <td className="p-3.5 opacity-75 max-w-md">{lab.description}</td>
                <td className="p-3.5 text-right pr-4 whitespace-nowrap space-x-2">
                  <button
                    onClick={() => navigate(lab.route)}
                    className="px-3 py-1 text-xs font-semibold hover:underline cursor-pointer"
                    style={{ color: 'var(--accent-primary)' }}
                  >
                    Xem Thử →
                  </button>
                  <button
                    onClick={() => navigate('/teacher/assign')}
                    className="px-3 py-1 text-xs font-semibold rounded-md border cursor-pointer"
                    style={{
                      borderColor: 'var(--border-color)',
                      backgroundColor: 'var(--bg-panel)',
                    }}
                  >
                    Giao Bài Lớp
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
