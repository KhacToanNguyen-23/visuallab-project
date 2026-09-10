import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { EditProfileModal } from '../components/auth/EditProfileModal';
import { RoleWorkspacePanel } from '../components/dashboard/RoleWorkspacePanel';
import { PhETFilterBar } from '../components/dashboard/PhETFilterBar';
import { SimCard, type SimItem } from '../components/dashboard/SimCard';

const BUILTIN_SIMULATIONS: SimItem[] = [
  {
    id: 'sim-simple-pendulum',
    title: 'Con Lắc Đơn & Dao Động Điều Hòa',
    gradeLevel: 'THPT - Lớp 11',
    subjectArea: 'Cơ Học',
    description: 'Khảo sát chu kỳ dao động T = 2π√(l/g) của con lắc đơn theo chiều dài dây treo l, khối lượng m, gia tốc trọng trường g và lực cản.',
    thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=600&q=80',
    route: '/pendulum-lab',
    isPopular: true,
  },
  {
    id: 'sim-dc-circuit',
    title: 'Mạch Điện Đơn Giản & Định Luật Ohm',
    gradeLevel: 'THPT - Lớp 11',
    subjectArea: 'Điện Học',
    description: 'Kéo thả linh kiện Pin, Điện trở, Bóng đèn, Công tắc, Ampe kế, Vôn kế. Thuật toán Kirchhoff tính toán chính xác dòng điện.',
    thumbnail: 'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&w=600&q=80',
    route: '/simulation',
    isPopular: true,
  },
  {
    id: 'sim-free-fall',
    title: 'Đo Gia Tốc Rơi Tự Do g',
    gradeLevel: 'THPT - Lớp 10',
    subjectArea: 'Cơ Học',
    description: 'Bi sắt rơi qua 2 cổng quang điện, đồng hồ hiện số MC-964 đo thời gian chính xác và tự động tính gia tốc g.',
    thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=600&q=80',
    route: '/srs-lab',
    isPopular: true,
  },
  {
    id: 'sim-emf-internal-r',
    title: 'Đo Suất Điện Động E & Điện Trở Trong r',
    gradeLevel: 'THPT - Lớp 11',
    subjectArea: 'Điện Học',
    description: 'Khảo sát đồ thị U-I của nguồn pin bằng biến trở con chạy, Vôn kế và Ampe kế.',
    thumbnail: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
    route: '/simulation',
    isPopular: false,
  },
  {
    id: 'sim-specific-heat',
    title: 'Đo Nhiệt Dung Riêng c Của Nước',
    gradeLevel: 'THPT - Lớp 12',
    subjectArea: 'Nhiệt Học',
    description: 'Đo công suất nhiệt Q = P*t và độ tăng nhiệt độ delta T để xác định chuẩn nhiệt dung riêng c.',
    thumbnail: 'https://images.unsplash.com/photo-1584483766114-2cea6facdf57?auto=format&fit=crop&w=600&q=80',
    route: '/srs-lab',
    isPopular: false,
  },
  {
    id: 'sim-refraction',
    title: 'Khúc Xạ Ánh Sáng & Thấu Kính Hội Tụ',
    gradeLevel: 'THPT - Lớp 11',
    subjectArea: 'Quang Học',
    description: 'Chiếu chùm tia sáng laser qua các môi trường chiết suất n1, n2 khác nhau và xác định góc khúc xạ.',
    thumbnail: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=600&q=80',
    route: '/simulation',
    isPopular: true,
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

      return matchesSearch && matchesSubject;
    });
  }, [allSimulations, searchQuery, selectedSubject]);

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
            {/* PhET Filter Bar with Domain Knowledge & Search */}
            <PhETFilterBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedSubject={selectedSubject}
              onSelectSubject={setSelectedSubject}
            />

            {/* Library Section Header */}
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold tracking-tight flex items-center gap-2" style={{ color: 'var(--text-main)' }}>
                  <span>Thư Viện Thí Nghiệm Mô Phỏng GDPT 2018</span>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded border" style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)', color: 'var(--accent-primary)' }}>
                    {filteredSimulations.length} Bài Mô Phỏng
                  </span>
                </h3>
                <p className="text-xs mt-0.5 opacity-75" style={{ color: 'var(--text-muted)' }}>
                  Học sinh chọn bài lab bên dưới để bắt đầu thực hành mô phỏng trực quan 2D
                </p>
              </div>

              {selectedSubject !== 'ALL' || searchQuery ? (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedSubject('ALL');
                  }}
                  className="text-xs font-semibold hover:underline cursor-pointer"
                  style={{ color: 'var(--accent-primary)' }}
                >
                  [Xóa Tất Cả Bộ Lọc]
                </button>
              ) : null}
            </div>

            {/* Visual Simulation Cards Grid */}
            {filteredSimulations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSimulations.map(sim => (
                  <SimCard key={sim.id} sim={sim} />
                ))}
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
                  }}
                  className="mt-2 px-4 py-2 text-xs font-semibold rounded border transition-colors cursor-pointer"
                  style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-main)', color: 'var(--text-main)' }}
                >
                  Đặt Lại Tìm Kiếm
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
