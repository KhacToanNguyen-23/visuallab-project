import React from 'react';
import { useNavigate } from 'react-router-dom';

export const LandingCurriculumTracks: React.FC = () => {
  const navigate = useNavigate();

  const tracks = [
    {
      grade: 'LỚP 10',
      code: 'GDPT-10',
      title: 'Động Học & Cơ Học Cổ Điển',
      desc: 'Hệ thống bài thực hành đo đạc các đại lượng động học, kiểm chứng định luật II Newton, khảo sát lực ma sát và bảo toàn cơ năng.',
      topics: [
        'Đo tốc độ máng nghiêng & Cổng quang',
        'Xác định gia tốc rơi tự do g',
        'Hệ số ma sát trượt & Lực kế',
        'Khảo sát độ giãn lò xo (Định luật Hooke)',
      ],
      apparatus: 'Cổng quang kép, Đồng hồ hiện số 0.001s, Lực kế số, Thước kẹp du xích',
      badgeColor: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
    },
    {
      grade: 'LỚP 11',
      code: 'GDPT-11',
      title: 'Dao Động, Sóng Cơ & Điện Quang',
      desc: 'Mô phỏng 60 FPS và 3D Three.js trực quan hóa dao động điều hòa, đo vận tốc âm trong cột khí cộng hưởng, giao thoa sóng và khúc xạ.',
      topics: [
        'Con lắc lò xo & Dao động điều hòa',
        'Đo tốc độ truyền âm (Cột khí cộng hưởng 3D)',
        'Giao thoa sóng nước & Sóng dừng trên dây',
        'Đo suất điện động & Điện trở trong nguồn',
      ],
      apparatus: 'Ống cộng hưởng 3D PBR, Máy phát âm tần Tone.js, Vôn kế, Ampe kế kim',
      badgeColor: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    },
    {
      grade: 'LỚP 12',
      code: 'GDPT-12',
      title: 'Khí Lý Tưởng, Nhiệt Học & Từ Trường',
      desc: 'Phòng thí nghiệm 3D tham số hóa: Định luật Boyle đẳng nhiệt, xác định nhiệt nóng chảy riêng của nước đá và hiện tượng cảm ứng điện từ.',
      topics: [
        'Định luật Boyle & Quá trình đẳng nhiệt (3D)',
        'Đo nhiệt nóng chảy riêng (Nhiệt lượng kế 3D)',
        'Cảm ứng điện từ & Định luật Faraday/Lenz',
        'Mô hình va chạm phân tử khí & Áp suất',
      ],
      apparatus: 'Xylanh Piston 3D, Áp kế Bourdon, Cảm biến nhiệt điện tử, Nam châm 3D',
      badgeColor: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    },
  ];

  return (
    <section id="curriculum" className="py-12 space-y-10">
      {/* Section Head */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-blue-500">
            <span>KHUNG CHƯƠNG TRÌNH</span>
            <span>·</span>
            <span>GDPT 2018</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: 'var(--text-main)' }}>
            Chương Trình Thí Nghiệm Vật Lý 3 Khối Lớp
          </h2>
          <p className="text-xs sm:text-sm opacity-75" style={{ color: 'var(--text-muted)' }}>
            Mỗi khối lớp được cấu trúc theo đúng tiến trình phân phối giảng dạy chính quy, bám sát các bài thực hành trong sách giáo khoa.
          </p>
        </div>

        <button
          onClick={() => navigate('/thu-vien')}
          className="px-5 py-2.5 text-xs font-bold rounded-xl text-white shadow-xs hover:opacity-95 transition shrink-0 flex items-center gap-2 cursor-pointer"
          style={{ backgroundColor: 'var(--accent-primary)' }}
        >
          <span>Mở Thư Viện SGK Chi Tiết</span>
          <span className="font-mono">→</span>
        </button>
      </div>

      {/* 3 Curriculum Grade Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {tracks.map((track) => (
          <div
            key={track.grade}
            className="p-7 border rounded-3xl shadow-xs transition-all duration-200 hover:-translate-y-1 hover:shadow-md flex flex-col justify-between space-y-6"
            style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)' }}
          >
            <div className="space-y-4">
              {/* Top Code Badge */}
              <div className="flex items-center justify-between">
                <span className={`font-mono text-xs font-bold px-2.5 py-1 rounded border ${track.badgeColor}`}>
                  {track.code}
                </span>
                <span className="font-mono text-xs font-bold opacity-60" style={{ color: 'var(--text-muted)' }}>
                  {track.grade}
                </span>
              </div>

              {/* Title & Description */}
              <div className="space-y-2">
                <h3 className="text-lg font-bold" style={{ color: 'var(--text-main)' }}>
                  {track.title}
                </h3>
                <p className="text-xs leading-relaxed opacity-75" style={{ color: 'var(--text-muted)' }}>
                  {track.desc}
                </p>
              </div>

              {/* Core Topics */}
              <div className="space-y-2 pt-2 border-t" style={{ borderColor: 'var(--border-color)' }}>
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider opacity-60 block" style={{ color: 'var(--text-muted)' }}>
                  BÀI THỰC HÀNH TRỌNG TÂM
                </span>
                <ul className="space-y-1.5 text-xs">
                  {track.topics.map((topic, i) => (
                    <li key={i} className="flex items-start gap-2" style={{ color: 'var(--text-main)' }}>
                      <span className="opacity-40 font-mono">•</span>
                      <span>{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Apparatus Highlight */}
              <div className="pt-2">
                <span className="text-[10px] font-mono uppercase tracking-wider opacity-50 block mb-1">
                  DỤNG CỤ ĐO TIÊU CHUẨN
                </span>
                <p className="text-[11px] font-mono opacity-80" style={{ color: 'var(--text-muted)' }}>
                  {track.apparatus}
                </p>
              </div>
            </div>

            {/* Action CTA Link */}
            <div className="pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
              <button
                onClick={() => navigate('/thu-vien')}
                className="w-full py-2.5 px-4 text-xs font-bold rounded-xl border hover:bg-slate-500/10 transition flex items-center justify-between cursor-pointer group"
                style={{ borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
              >
                <span>Khám phá bài học {track.grade}</span>
                <span className="font-mono text-blue-500 group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
