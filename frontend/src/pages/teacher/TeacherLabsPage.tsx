import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export interface PresetLabItem {
  id: string;
  title: string;
  grade: 'Lớp 10' | 'Lớp 11' | 'Lớp 12';
  domain: 'Cơ Học' | 'Sóng & Âm' | 'Điện & Từ' | 'Quang Học' | 'Nhiệt Học';
  lesson: string;
  formula: string;
  description: string;
  route: string;
  badge: string;
}

const PRESET_LABS: PresetLabItem[] = [
  // LỚP 10
  {
    id: 'sim-speed-measurement',
    title: 'Bài 6: Đo Tốc Độ Vật Chuyển Động Thẳng',
    grade: 'Lớp 10',
    domain: 'Cơ Học',
    lesson: 'Trang 28 SGK',
    formula: 'v = s / t',
    description: 'Đo thời gian bi thép lăn qua 2 cổng quang điện trên máng nghiêng để tính tốc độ v.',
    route: '/lab/speed-measurement',
    badge: 'CƠ HỌC',
  },
  {
    id: 'sim-free-fall',
    title: 'Bài 14: Đo Gia Tốc Rơi Tự Do g',
    grade: 'Lớp 10',
    domain: 'Cơ Học',
    lesson: 'Trang 57 SGK',
    formula: 'g = 2*s / t²',
    description: 'Nam châm điện ngắt điện thả bi thép rơi qua cổng quang điện, tự động tính gia tốc g.',
    route: '/lab/free-fall',
    badge: 'CƠ HỌC',
  },
  {
    id: 'sim-friction-coefficient',
    title: 'Bài 21: Đo Hệ Số Ma Sát Trượt',
    grade: 'Lớp 10',
    domain: 'Cơ Học',
    lesson: 'Trang 83 SGK',
    formula: 'μ = F / (m*g)',
    description: 'Dùng lực kế kéo khối gỗ gắn quả cân trượt đều trên mặt bàn để đo hệ số ma sát trượt μ.',
    route: '/lab/sliding-friction',
    badge: 'CƠ HỌC',
  },
  {
    id: 'sim-momentum-collision',
    title: 'Bài 30: Khảo Sát Động Lượng & Va Chạm',
    grade: 'Lớp 10',
    domain: 'Cơ Học',
    lesson: 'Trang 117 SGK',
    formula: 'p = m₁v₁ + m₂v₂',
    description: 'Mô phỏng va chạm 2 xe trượt trên đệm không khí, kiểm chứng định luật bảo toàn động lượng.',
    route: '/lab/momentum-collision',
    badge: 'CƠ HỌC',
  },
  {
    id: 'sim-hooke-law',
    title: 'Bài 38: Độ Giãn Lò Xo (Định Luật Hooke)',
    grade: 'Lớp 10',
    domain: 'Cơ Học',
    lesson: 'Trang 148 SGK',
    formula: 'F = k * Δl',
    description: 'Treo quả cân lên lò xo xoắn, đo độ giãn Δl và xác định độ cứng k của lò xo.',
    route: '/lab/spring-mass',
    badge: 'CƠ HỌC',
  },

  // LỚP 11
  {
    id: 'sim-sound-resonance',
    title: 'Bài 5: Đo Tốc Độ Truyền Âm (Ống Cộng Hưởng)',
    grade: 'Lớp 11',
    domain: 'Sóng & Âm',
    lesson: 'Trang 22 SGK',
    formula: 'v = 4*(L₂ - L₁)*f',
    description: 'Mô phỏng 3D ống thủy tinh cộng hưởng âm thanh, nâng hạ cột nước & loa Tone.js để đo v.',
    route: '/lab/sound-resonance',
    badge: 'SÓNG & ÂM',
  },
  {
    id: 'sim-simple-pendulum',
    title: 'Bài 7: Khảo Sát Dao Động Con Lắc Đơn',
    grade: 'Lớp 11',
    domain: 'Cơ Học',
    lesson: 'Trang 29 SGK',
    formula: 'T = 2π√(l/g)',
    description: 'Khảo sát chu kỳ T = 2π√(l/g) của con lắc đơn theo chiều dài dây treo l.',
    route: '/lab/simple-pendulum',
    badge: 'CƠ HỌC',
  },
  {
    id: 'sim-young-interference',
    title: 'Bài 12: Đo Bước Sóng Ánh Sáng (Khe Y-âng)',
    grade: 'Lớp 11',
    domain: 'Quang Học',
    lesson: 'Trang 50 SGK',
    formula: 'λ = a*i / D',
    description: 'Chiếu laser qua khe kép Y-âng, dùng thước kẹp đo khoảng vân i để tính bước sóng ánh sáng λ.',
    route: '/lab/wave-interference',
    badge: 'QUANG HỌC',
  },
  {
    id: 'sim-emf-internal-r',
    title: 'Bài 19: Đo Suất Điện Động E & Điện Trở Trong r',
    grade: 'Lớp 11',
    domain: 'Điện & Từ',
    lesson: 'Trang 76 SGK',
    formula: 'U = E - I*r',
    description: 'Khảo sát đồ thị U-I của nguồn Pin DC bằng biến trở con chạy và công tắc đảo chiều.',
    route: '/lab/emf-internal-r',
    badge: 'ĐIỆN & TỪ',
  },
  {
    id: 'sim-refraction',
    title: 'Bài 21: Đo Chiết Suất Của Nước & Khúc Xạ',
    grade: 'Lớp 11',
    domain: 'Quang Học',
    lesson: 'Trang 85 SGK',
    formula: 'n = sin(i) / sin(r)',
    description: 'Chiếu tia laser qua bán trụ thủy tinh / nước để xác định góc khúc xạ r và chiết suất n.',
    route: '/lab/refraction',
    badge: 'QUANG HỌC',
  },
  {
    id: 'sim-dc-circuit',
    title: 'Mạch Điện Đơn Giản & Định Luật Ohm',
    grade: 'Lớp 11',
    domain: 'Điện & Từ',
    lesson: 'Mạch Điện DC',
    formula: 'I = U / R',
    description: 'Mô phỏng lắp mạch Pin, Điện trở, Ampe kế, Vôn kế và kiểm chứng định luật Ohm.',
    route: '/lab/dc-circuit',
    badge: 'ĐIỆN & TỪ',
  },

  // LỚP 12
  {
    id: 'sim-specific-heat',
    title: 'Bài 3: Đo Nhiệt Dung Riêng Của Nước',
    grade: 'Lớp 12',
    domain: 'Nhiệt Học',
    lesson: 'Trang 15 SGK',
    formula: 'c = (P*t) / (m*ΔT)',
    description: 'Dùng dây điện trở đun nước trong bình nhiệt lượng kế, đo công suất P và nhiệt độ T.',
    route: '/lab/specific-heat',
    badge: 'NHIỆT HỌC',
  },
  {
    id: 'sim-latent-heat',
    title: 'Bài 4: Đo Nhiệt Nóng Chảy Nước Đá',
    grade: 'Lớp 12',
    domain: 'Nhiệt Học',
    lesson: 'Trang 19 SGK',
    formula: 'λ = (P*t) / m',
    description: 'Khảo sát quá trình nóng chảy của nước đá bằng bình nhiệt lượng kế và nhiệt kế điện tử.',
    route: '/lab/latent-heat',
    badge: 'NHIỆT HỌC',
  },
  {
    id: 'sim-boyle-mariotte',
    title: 'Bài 7: Quá Trình Đẳng Nhiệt (Boyle - Mariotte)',
    grade: 'Lớp 12',
    domain: 'Nhiệt Học',
    lesson: 'Trang 30 SGK',
    formula: 'p * V = const',
    description: 'Nén piston trong xy-lanh nén khí và đọc áp kế để kiểm chứng định luật Boyle - Mariotte.',
    route: '/lab/boyle-mariotte',
    badge: 'NHIỆT HỌC',
  },
  {
    id: 'sim-electromagnetic-induction',
    title: 'Bài 12: Khảo Sát Cảm Ứng Điện Từ',
    grade: 'Lớp 12',
    domain: 'Điện & Từ',
    lesson: 'Trang 52 SGK',
    formula: 'e_c = -ΔΦ / Δt',
    description: 'Di chuyển nam châm vĩnh cửu qua cuộn dây cảm ứng để quan sát kim điện kế G lệch.',
    route: '/lab/induction',
    badge: 'ĐIỆN & TỪ',
  },
];

export const TeacherLabsPage: React.FC = () => {
  const navigate = useNavigate();
  const [labs] = useState<PresetLabItem[]>(PRESET_LABS);
  const [selectedGrade, setSelectedGrade] = useState<string>('ALL');
  const [selectedDomain, setSelectedDomain] = useState<string>('ALL');
  const [search, setSearch] = useState('');

  const filteredLabs = labs.filter(lab => {
    const matchGrade = selectedGrade === 'ALL' || lab.grade === selectedGrade;
    const matchDomain = selectedDomain === 'ALL' || lab.domain === selectedDomain;
    const matchSearch =
      !search ||
      lab.title.toLowerCase().includes(search.toLowerCase()) ||
      lab.description.toLowerCase().includes(search.toLowerCase()) ||
      lab.lesson.toLowerCase().includes(search.toLowerCase()) ||
      lab.formula.toLowerCase().includes(search.toLowerCase());

    return matchGrade && matchDomain && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded border"
              style={{
                backgroundColor: 'var(--bg-panel)',
                borderColor: 'var(--border-color)',
                color: 'var(--accent-primary)',
              }}
            >
              KHO BÀI THÍ NGHIỆM CHUẨN
            </span>
            <span className="text-xs opacity-60 font-semibold">
              15 Bài Thí Nghiệm GDPT 2018
            </span>
          </div>
          <h2 className="text-xl font-black tracking-tight" style={{ color: 'var(--text-main)' }}>
            Kho Lab Mẫu Vật Lý GDPT 2018
          </h2>
          <p className="text-xs opacity-75 mt-0.5" style={{ color: 'var(--text-muted)' }}>
            Toàn bộ 15 bài thí nghiệm tương tác phân loại theo Khối 10, 11, 12 sẵn sàng giao bài cho học sinh
          </p>
        </div>

        <button
          onClick={() => navigate('/teacher/assign')}
          className="px-4 py-2.5 rounded-lg text-xs font-bold text-white shadow-md transition-opacity hover:opacity-90 cursor-pointer shrink-0 inline-flex items-center gap-2"
          style={{ backgroundColor: 'var(--accent-primary)' }}
        >
          <span></span>
          <span>Giao Bài Cho Lớp Ngay</span>
        </button>
      </div>

      {/* Filter Toolbar: Grades, Domains & Search */}
      <div
        className="p-4 rounded-xl border space-y-3"
        style={{
          backgroundColor: 'var(--bg-panel)',
          borderColor: 'var(--border-color)',
        }}
      >
        {/* Row 1: Grade Chips */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-bold opacity-70 mr-1">Khối Lớp:</span>
          {['ALL', 'Lớp 10', 'Lớp 11', 'Lớp 12'].map(grade => (
            <button
              key={grade}
              onClick={() => setSelectedGrade(grade)}
              className={`px-3 py-1.5 rounded-lg font-semibold border cursor-pointer transition-all ${
                selectedGrade === grade
                  ? 'font-bold shadow-xs'
                  : 'opacity-70 hover:opacity-100'
              }`}
              style={{
                borderColor: selectedGrade === grade ? 'var(--accent-primary)' : 'var(--border-color)',
                backgroundColor: selectedGrade === grade ? 'var(--accent-primary)' : 'var(--bg-main)',
                color: selectedGrade === grade ? '#FFFFFF' : 'var(--text-main)',
              }}
            >
              {grade === 'ALL' ? 'Tất Cả Khối Lớp (15 bài)' : grade}
            </button>
          ))}
        </div>

        {/* Row 2: Domain Chips & Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-2 border-t" style={{ borderColor: 'var(--border-color)' }}>
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="font-bold opacity-70 mr-1">Chuyên đề:</span>
            {['ALL', 'Cơ Học', 'Sóng & Âm', 'Điện & Từ', 'Quang Học', 'Nhiệt Học'].map(domain => (
              <button
                key={domain}
                onClick={() => setSelectedDomain(domain)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold border cursor-pointer transition-colors ${
                  selectedDomain === domain
                    ? 'bg-slate-500/20 font-bold border-blue-500/50 text-blue-600 dark:text-blue-400'
                    : 'opacity-70 hover:opacity-100 border-transparent hover:bg-slate-500/10'
                }`}
              >
                {domain === 'ALL' ? 'Tất Cả' : domain}
              </button>
            ))}
          </div>

          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs min-w-[240px]"
            style={{
              backgroundColor: 'var(--bg-main)',
              borderColor: 'var(--border-color)',
            }}
          >
            <svg className="w-3.5 h-3.5 opacity-50 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Tìm theo bài học, SGK, công thức..."
              className="w-full bg-transparent focus:outline-none text-xs"
              style={{ color: 'var(--text-main)' }}
            />
            {search && (
              <button onClick={() => setSearch('')} className="text-xs opacity-50 hover:opacity-100">
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Labs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredLabs.map(lab => (
          <div
            key={lab.id}
            className="p-5 rounded-xl border flex flex-col justify-between space-y-4 hover:shadow-md transition-all group"
            style={{
              backgroundColor: 'var(--bg-panel)',
              borderColor: 'var(--border-color)',
            }}
          >
            <div className="space-y-2.5">
              {/* Badges */}
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded border font-mono"
                  style={{
                    backgroundColor: 'var(--bg-main)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--accent-primary)',
                  }}
                >
                  {lab.grade} • {lab.badge}
                </span>
                <span className="text-[11px] opacity-60 font-semibold font-mono">
                  {lab.lesson}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-sm font-bold leading-snug group-hover:text-blue-500 transition-colors" style={{ color: 'var(--text-main)' }}>
                {lab.title}
              </h3>

              {/* Description */}
              <p className="text-xs opacity-75 line-clamp-2 leading-relaxed">
                {lab.description}
              </p>

              {/* Target Formula */}
              <div
                className="p-2 rounded-lg border text-[11px] flex items-center justify-between font-mono"
                style={{
                  backgroundColor: 'var(--bg-main)',
                  borderColor: 'var(--border-color)',
                }}
              >
                <span className="opacity-60 text-[10px]">Công thức:</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">{lab.formula}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-3 border-t gap-2" style={{ borderColor: 'var(--border-color)' }}>
              <button
                type="button"
                onClick={() => navigate(lab.route)}
                className="px-3 py-1.5 text-xs font-semibold hover:underline cursor-pointer inline-flex items-center gap-1"
                style={{ color: 'var(--accent-primary)' }}
              >
                <span>Trải Nghiệm Lab →</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  navigate('/teacher/assign', {
                    state: { selectedLabId: lab.id },
                  })
                }
                className="px-3 py-1.5 text-xs font-bold rounded-lg border hover:bg-slate-500/10 transition-colors cursor-pointer inline-flex items-center gap-1 shadow-xs"
                style={{
                  borderColor: 'var(--border-color)',
                  backgroundColor: 'var(--bg-main)',
                }}
              >
                <span>Giao Bài</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredLabs.length === 0 && (
        <div className="text-center py-16 px-4 space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-500/10 flex items-center justify-center mx-auto text-xl">
          </div>
          <p className="text-xs font-bold" style={{ color: 'var(--text-main)' }}>
            Không tìm thấy bài thí nghiệm phù hợp với bộ lọc
          </p>
          <button
            onClick={() => {
              setSelectedGrade('ALL');
              setSelectedDomain('ALL');
              setSearch('');
            }}
            className="text-xs font-semibold underline cursor-pointer"
            style={{ color: 'var(--accent-primary)' }}
          >
            Xóa tất cả bộ lọc
          </button>
        </div>
      )}
    </div>
  );
};
