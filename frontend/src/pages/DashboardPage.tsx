import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { EditProfileModal } from '../components/auth/EditProfileModal';
import { RoleWorkspacePanel } from '../components/dashboard/RoleWorkspacePanel';
import { PhETFilterBar } from '../components/dashboard/PhETFilterBar';
import { type SimItem } from '../components/dashboard/SimCard';

const BUILTIN_SIMULATIONS: SimItem[] = [
  {
    id: 'sim-dc-circuit',
    title: 'Mạch Điện Đơn Giản & Định Luật Ohm',
    gradeLevel: 'THPT',
    subjectArea: 'Điện Học',
    description: 'Kéo thả linh kiện Pin, Điện trở, Bóng đèn, Công tắc, Ampe kế, Vôn kế. Thuật toán Kirchhoff tính toán chính xác dòng điện.',
    route: '/simulation',
    isPopular: true,
  },
  {
    id: 'sim-free-fall',
    title: 'Đo Gia Tốc Rơi Tự Do g',
    gradeLevel: 'THPT',
    subjectArea: 'Cơ Học',
    description: 'Bi sắt rơi qua 2 cổng quang điện, đồng hồ hiện số MC-964 đo thời gian chính xác và tự động tính gia tốc g.',
    route: '/srs-lab',
    isPopular: true,
  },
  {
    id: 'sim-emf-internal-r',
    title: 'Đo Suất Điện Động E & Điện Trở Trong r',
    gradeLevel: 'THPT',
    subjectArea: 'Điện Học',
    description: 'Khảo sát đồ thị U-I của nguồn pin bằng biến trở con chạy, Vôn kế và Ampe kế.',
    route: '/simulation',
    isPopular: false,
  },
  {
    id: 'sim-specific-heat',
    title: 'Đo Nhiệt Dung Riêng c Của Nước',
    gradeLevel: 'THPT',
    subjectArea: 'Nhiệt Học',
    description: 'Đo công suất nhiệt Q = P*t và độ tăng nhiệt độ delta T để xác định chuẩn nhiệt dung riêng c.',
    route: '/srs-lab',
    isPopular: false,
  },
  {
    id: 'sim-refraction',
    title: 'Khúc Xạ Ánh Sáng & Thấu Kính Hội Tụ',
    gradeLevel: 'THPT',
    subjectArea: 'Quang Học',
    description: 'Chiếu chùm tia sáng laser qua các môi trường chiết suất n1, n2 khác nhau và xác định góc khúc xạ.',
    route: '/simulation',
    isPopular: true,
  },
  {
    id: 'sim-simple-pendulum',
    title: 'Con Lắc Đơn & Dao Động Điều Hòa',
    gradeLevel: 'THPT',
    subjectArea: 'Cơ Học',
    description: 'Khảo sát chu kỳ dao động T = 2pi*sqrt(l/g) của con lắc đơn theo chiều dài dây treo l.',
    route: '/simulation',
    isPopular: false,
  },
];

interface ApiTopic {
  id: string;
  title: string;
  gradeLevel: string;
  subjectArea: string;
  description: string;
}

export const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [apiTopics, setApiTopics] = useState<ApiTopic[]>([]);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('ALL');
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      navigate('/admin');
    } else if (user?.role === 'TEACHER') {
      navigate('/teacher/classes');
    } else if (user?.role === 'STUDENT' || user) {
      navigate('/student/classes');
    }
  }, [user, navigate]);

  useEffect(() => {
    fetch('http://localhost:8080/api/curriculum/topics')
      .then(res => res.json())
      .then(data => setApiTopics(data))
      .catch(err => console.error(err));
  }, []);

  const allSimulations = useMemo<SimItem[]>(() => {
    const apiSims: SimItem[] = apiTopics.map((t, index) => ({
      id: `api-topic-${t.id || index}`,
      title: t.title,
      gradeLevel: 'THPT',
      subjectArea: t.subjectArea || 'Điện Học',
      description: t.description || 'Bài thí nghiệm mô phỏng tương tác theo chuẩn chương trình GDPT 2018.',
      route: '/simulation',
      isPopular: index % 2 === 0,
    }));

    const combined = [...BUILTIN_SIMULATIONS];
    apiSims.forEach(sim => {
      if (!combined.some(c => c.title.toLowerCase() === sim.title.toLowerCase())) {
        combined.push(sim);
      }
    });
    return combined;
  }, [apiTopics]);

  const filteredSimulations = useMemo(() => {
    return allSimulations.filter(sim => {
      const matchesSearch =
        !searchQuery ||
        sim.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sim.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSubject =
        selectedSubject === 'ALL' ||
        sim.subjectArea.toLowerCase().includes(selectedSubject.toLowerCase());

      const matchesGrade =
        selectedGrade === null ||
        sim.title.includes(` ${selectedGrade}`) ||
        sim.description.includes(` ${selectedGrade}`) ||
        (selectedGrade === 10 && (sim.title.includes('Gia Tốc') || sim.title.includes('Newton') || sim.title.includes('Panme') || sim.title.includes('Va Chạm') || sim.title.includes('Hooke'))) ||
        (selectedGrade === 11 && (sim.title.includes('Con Lắc') || sim.title.includes('Ohm') || sim.title.includes('Khúc Xạ') || sim.title.includes('Suất Điện Động') || sim.title.includes('Truyền Âm') || sim.title.includes('Khe Young'))) ||
        (selectedGrade === 12 && (sim.title.includes('Nhiệt') || sim.title.includes('Boyle') || sim.title.includes('Quang Điện') || sim.title.includes('Từ Trường') || sim.title.includes('Hạt Nhân')));

      return matchesSearch && matchesSubject && matchesGrade;
    });
  }, [allSimulations, searchQuery, selectedSubject, selectedGrade]);

  return (
    <div className="min-h-screen w-screen flex flex-col font-sans overflow-x-hidden transition-colors duration-200" style={{ backgroundColor: 'var(--bg-main)', color: 'var(--text-main)' }}>
      {/* Full-Width Sleek Academic Header */}
      <header className="w-full border-b px-6 py-3.5 flex justify-between items-center z-50 sticky top-0 transition-colors" style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)' }}>
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate('/dashboard')}>
          <div className="w-8 h-8 rounded border font-bold text-white text-xs flex items-center justify-center tracking-wider shrink-0" style={{ backgroundColor: 'var(--accent-primary)' }}>
            VL
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider font-semibold block opacity-70" style={{ color: 'var(--text-muted)' }}>
              GDPT 2018
            </span>
            <h1 className="font-bold text-sm tracking-tight" style={{ color: 'var(--text-main)' }}>
              VISUAL<span style={{ color: 'var(--accent-primary)' }}>LAB</span> <span className="text-xs font-normal opacity-60">| Nền tảng Thí nghiệm Vật lý</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-bold px-2.5 py-1 rounded border uppercase tracking-wider" style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)', color: 'var(--accent-primary)' }}>
            [{user?.role || 'STUDENT'}]
          </span>

          <button 
            onClick={toggleTheme} 
            className="p-1.5 px-3 rounded border transition-colors flex items-center justify-center text-xs gap-1.5 cursor-pointer"
            style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-main)', color: 'var(--text-main)' }}
            title={`Chuyển sang giao diện ${theme === 'light' ? 'Tối' : 'Sáng'}`}
          >
            <span className="font-medium">{theme === 'light' ? 'Giao Diện Tối' : 'Giao Diện Sáng'}</span>
          </button>

          <button
            onClick={() => setIsEditProfileOpen(true)}
            className="px-3 py-1.5 rounded border text-xs font-semibold cursor-pointer transition-colors"
            style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-main)', color: 'var(--text-main)' }}
          >
            Hồ Sơ
          </button>

          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="px-3 py-1.5 rounded border text-xs font-semibold transition-colors cursor-pointer"
            style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-main)', color: 'var(--text-main)' }}
          >
            Đăng Xuất
          </button>
        </div>
      </header>

      {/* Main Full-Width Content Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-6 md:p-8 flex flex-col gap-6 overflow-y-auto">
        {/* Role Specific Workspace Panel */}
        <RoleWorkspacePanel user={user} onEditProfile={() => setIsEditProfileOpen(true)} />

        {/* For Student role: Show public lab library & streamlined filter */}
        {(user?.role === 'STUDENT' || !user?.role) && (
          <>
            {/* PhET Filter Bar with Grade Level and Domain Knowledge */}
            <PhETFilterBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedSubject={selectedSubject}
              onSelectSubject={setSelectedSubject}
              selectedGrade={selectedGrade}
              onSelectGrade={setSelectedGrade}
            />

            {/* Library Table Header */}
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold tracking-tight flex items-center gap-2" style={{ color: 'var(--text-main)' }}>
                  <span>Thư Viện Thí Nghiệm Mô Phỏng GDPT 2018</span>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded border" style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)', color: 'var(--accent-primary)' }}>
                    {filteredSimulations.length} Bài Mô Phỏng
                  </span>
                </h3>
                <p className="text-xs mt-0.5 opacity-75" style={{ color: 'var(--text-muted)' }}>
                  Cây Mục Lục 3 Cấp (Khối Lớp ➔ Chương SGK ➔ Bài Lab Áo) • Dual Engine Canvas 60fps
                </p>
              </div>

              {selectedSubject !== 'ALL' || searchQuery || selectedGrade !== null ? (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedSubject('ALL');
                    setSelectedGrade(null);
                  }}
                  className="text-xs font-semibold hover:underline cursor-pointer"
                  style={{ color: 'var(--accent-primary)' }}
                >
                  [Xóa Tất Cả Bộ Lọc]
                </button>
              ) : null}
            </div>

            {/* High-Density Simulation Data Table (Zero Cards, Full Width) */}
            {filteredSimulations.length > 0 ? (
              <div className="border rounded-lg overflow-hidden" style={{ borderColor: 'var(--border-color)' }}>
                <table className="w-full text-left text-xs">
                  <thead className="border-b uppercase font-semibold text-[10px] tracking-wider" style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>
                    <tr>
                      <th className="p-3">Mạch Kiến Thức</th>
                      <th className="p-3">Tên Bài Thí Nghiệm Mô Phỏng</th>
                      <th className="p-3">Mô Tả & Chuẩn Kiến Thức GDPT</th>
                      <th className="p-3 text-right">Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y" style={{ borderColor: 'var(--border-color)' }}>
                    {filteredSimulations.map(sim => (
                      <tr key={sim.id} className="hover:bg-opacity-50 transition-colors" style={{ backgroundColor: 'var(--bg-main)' }}>
                        <td className="p-3 shrink-0 whitespace-nowrap">
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded border" style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)', color: 'var(--accent-primary)' }}>
                            [{sim.subjectArea.toUpperCase()}]
                          </span>
                        </td>
                        <td className="p-3 font-bold text-xs" style={{ color: 'var(--text-main)' }}>
                          {sim.title}
                          {sim.isPopular && (
                            <span className="ml-2 text-[9px] font-semibold px-1.5 py-0.5 rounded border opacity-75" style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)' }}>
                              [Nổi Bật]
                            </span>
                          )}
                        </td>
                        <td className="p-3 opacity-75 max-w-xl">{sim.description}</td>
                        <td className="p-3 text-right whitespace-nowrap">
                          <button
                            onClick={() => navigate(sim.route)}
                            className="px-3.5 py-1.5 text-xs font-bold text-white rounded transition-opacity hover:opacity-90 cursor-pointer"
                            style={{ backgroundColor: 'var(--accent-primary)' }}
                          >
                            Khởi Chạy →
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="border rounded-xl p-10 text-center flex flex-col items-center justify-center gap-3" style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)' }}>
                <h4 className="text-base font-bold">Không Tìm Thấy Bài Thí Nghiệm Phù Hợp</h4>
                <p className="text-xs max-w-md opacity-75" style={{ color: 'var(--text-muted)' }}>
                  Không tìm thấy kết quả cho "{searchQuery}". Thử xóa từ khóa hoặc chọn chuyên đề khác!
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedSubject('ALL');
                    setSelectedGrade(null);
                  }}
                  className="mt-2 px-4 py-2 text-xs font-semibold rounded border transition-colors cursor-pointer"
                  style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-main)', color: 'var(--text-main)' }}
                >
                  Xem Tất Cả Thí Nghiệm
                </button>
              </div>
            )}
          </>
        )}

        {/* Footer */}
        <footer className="border-t py-6 text-center text-xs mt-auto opacity-75" style={{ borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>
          © 2026 VisualLab Physics Platform — Nền tảng Thí nghiệm Học thuật
        </footer>
      </main>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
      />
    </div>
  );
};
