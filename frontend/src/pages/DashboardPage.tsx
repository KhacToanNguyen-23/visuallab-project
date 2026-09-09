import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { EditProfileModal } from '../components/auth/EditProfileModal';
import { PhETFilterBar } from '../components/dashboard/PhETFilterBar';
import { SimCard, type SimItem } from '../components/dashboard/SimCard';
import { SidebarNav } from '../components/dashboard/SidebarNav';
import { PhetModalViewer } from '../components/dashboard/PhetModalViewer';

// Built-in Simulations aligned with GDPT 2018
const BUILTIN_SIMULATIONS: SimItem[] = [
  {
    id: 'sim-phet-pendulum-lab',
    title: 'Thực Hành Con Lắc Đơn Đo Gia Tốc g (Linh Kiện Lắp Ghép)',
    gradeLevel: 'Lớp 11',
    subjectArea: 'Cơ Học',
    description: 'Lắp ghép linh kiện Cục tạ, Sợi dây, Thước đo góc & Đồng hồ hiện số: Kéo lệch góc small alpha, bấm thời gian 10T để đo gia tốc trọng trường g.',
    icon: '⏳',
    route: '/pendulum-phet-lab',
    isPopular: true,
  },
  {
    id: 'sim-phet-refraction-lab',
    title: 'Thực Hành Khúc Xạ Ánh Sáng (Linh Kiện PhET Engine)',
    gradeLevel: 'Lớp 11',
    subjectArea: 'Quang Học',
    description: 'Sử dụng Đèn Laser, Thước Đo Góc & Khối Chiết Suất PhET cho bài lab SGK: Xoay tia tới i, đo góc khúc xạ r, xác định chiết suất n2 theo Định luật Snell.',
    icon: '🔴',
    route: '/refraction-phet-lab',
    isPopular: true,
  },
  {
    id: 'sim-vietnam-ohm-lab',
    title: 'Bài Thực Hành SGK: Đo Điện Trở R (Định Luật Ohm)',
    gradeLevel: 'Lớp 11',
    subjectArea: 'Điện Học',
    description: 'Kết hợp bộ linh kiện PhET HTML5 & Khung 5 bước thực hành chuẩn GDPT 2018: Lắp mạch Vôn-Ampe, thu thập 3 lần đo U-I, tính R trung bình và sai số tuyệt đối.',
    icon: '🧪',
    route: '/vietnam-phet-lab',
    isPopular: true,
  },
  {
    id: 'sim-wave-interference-5step',
    title: 'Thí Nghiệm Thực Hành Giao Thoa Sóng (5 Bước)',
    gradeLevel: 'Lớp 11',
    subjectArea: 'Sóng Cơ Học',
    description: 'Thí nghiệm thực hành 5 bước chuẩn GDPT 2018: Khảo sát nguồn f, đo khoảng cách a và D, xác định vân cực đại/cực tiểu, kéo thước đo khoảng vân i và tính bước sóng \u03BB.',
    icon: '🌊',
    route: '/wave-interference',
    isPopular: true,
  },
  {
    id: 'sim-dc-circuit',
    title: 'Mạch Điện Đơn Giản & Định Luật Ohm',
    gradeLevel: 'Lớp 11',
    subjectArea: 'Điện Học',
    description: 'Kéo thả linh kiện Pin, Điện trở, Bóng đèn, Công tắc, Ampe kế, Vôn kế. Thuật toán Kirchhoff tính toán chính xác dòng điện và chuyển động hạt electron.',
    icon: '⚡',
    route: '/simulation',
    simUrl: '/simulations/ohms-law_vi.html',
    isPopular: true,
  },
  {
    id: 'sim-free-fall',
    title: 'Đo Gia Tốc Rơi Tự Do g',
    gradeLevel: 'Lớp 10',
    subjectArea: 'Cơ Học',
    description: 'Thí nghiệm Bài 1 (Lớp 10): Bi sắt rơi qua 2 cổng quang điện, đồng hồ hiện số MC-964 đo thời gian chính xác và tự động tính gia tốc g.',
    icon: '⏱️',
    route: '/srs-lab',
    isPopular: true,
  },
  {
    id: 'sim-emf-internal-r',
    title: 'Đo Suất Điện Động E & Điện Trở Trong r',
    gradeLevel: 'Lớp 11',
    subjectArea: 'Điện Học',
    description: 'Thí nghiệm Bài 2 (Lớp 11): Khảo sát đồ thị U-I của nguồn pin bằng biến trở con chạy, Vôn kế và Ampe kế.',
    icon: '🔋',
    route: '/simulation',
    isPopular: false,
  },
  {
    id: 'sim-specific-heat',
    title: 'Đo Nhiệt Dung Riêng c Của Nước',
    gradeLevel: 'Lớp 12',
    subjectArea: 'Nhiệt Học',
    description: 'Thí nghiệm Bài 3 (Lớp 12): Đo công suất nhiệt Q = P*t và độ tăng nhiệt độ delta T để xác định chuẩn nhiệt dung riêng c.',
    icon: '🔥',
    route: '/srs-lab',
    isPopular: false,
  },
  {
    id: 'sim-refraction',
    title: 'Khúc Xạ Ánh Sáng & Thấu Kính Hội Tụ',
    gradeLevel: 'Lớp 11',
    subjectArea: 'Quang Học',
    description: 'Chiếu chùm tia sáng laser qua các môi trường chiết suất n1, n2 khác nhau và xác định góc khúc xạ theo định luật Snell.',
    icon: '🔍',
    route: '/simulation',
    isPopular: true,
  },
  {
    id: 'sim-simple-pendulum',
    title: 'Con Lắc Đơn & Dao Động Điều Hòa',
    gradeLevel: 'Lớp 11',
    subjectArea: 'Cơ Học',
    description: 'Khảo sát chu kỳ dao động T = 2pi*sqrt(l/g) của con lắc đơn theo chiều dài dây treo l và vị trí địa lý.',
    icon: '⏳',
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
  const { user } = useAuth();
  const [apiTopics, setApiTopics] = useState<ApiTopic[]>([]);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [activeModalSim, setActiveModalSim] = useState<SimItem | null>(null);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('ALL');
  const [selectedSubject, setSelectedSubject] = useState('ALL');

  useEffect(() => {
    fetch('http://localhost:8080/api/curriculum/topics')
      .then(res => res.json())
      .then(data => setApiTopics(data))
      .catch(err => console.error(err));
  }, []);

  // Auto popup edit modal if Google user hasn't customized name/school
  useEffect(() => {
    if (user && (user.provider === 'GOOGLE' || user.fullName === 'Google User' || user.fullName === 'Người dùng Google' || !user.school)) {
      setIsEditProfileOpen(true);
    }
  }, [user]);

  // Combine built-in simulations and API topics into unified list
  const allSimulations = useMemo<SimItem[]>(() => {
    const apiSims: SimItem[] = apiTopics.map((t, index) => ({
      id: `api-topic-${t.id || index}`,
      title: t.title,
      gradeLevel: t.gradeLevel || 'THPT',
      subjectArea: t.subjectArea || 'Điện Học',
      description: t.description || 'Bài thí nghiệm mô phỏng tương tác theo chuẩn chương trình GDPT 2018.',
      icon: t.subjectArea?.includes('Cơ') ? '⏱️' : t.subjectArea?.includes('Quang') ? '🔍' : t.subjectArea?.includes('Nhiệt') ? '🔥' : '⚡',
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

  // Filter logic based on search, grade, and subject
  const filteredSimulations = useMemo(() => {
    return allSimulations.filter(sim => {
      const matchesSearch =
        !searchQuery ||
        sim.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sim.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sim.gradeLevel.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesGrade =
        selectedGrade === 'ALL' ||
        sim.gradeLevel.toLowerCase().includes(selectedGrade.toLowerCase()) ||
        (selectedGrade === 'THCS' && (sim.gradeLevel.includes('Lớp 6') || sim.gradeLevel.includes('Lớp 7') || sim.gradeLevel.includes('Lớp 8') || sim.gradeLevel.includes('Lớp 9')));

      const matchesSubject =
        selectedSubject === 'ALL' ||
        sim.subjectArea.toLowerCase().includes(selectedSubject.toLowerCase());

      return matchesSearch && matchesGrade && matchesSubject;
    });
  }, [allSimulations, searchQuery, selectedGrade, selectedSubject]);

  const handleLaunchSim = (sim: SimItem) => {
    if (sim.simUrl) {
      setActiveModalSim(sim);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-slate-950 text-slate-100 flex font-sans overflow-x-hidden">
      {/* Left Sidebar Navigation Menu */}
      <SidebarNav onEditProfile={() => setIsEditProfileOpen(true)} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full p-6 md:p-8 flex flex-col gap-8 overflow-y-auto">
        {/* PhET Filter Bar */}
        <PhETFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedGrade={selectedGrade}
          onSelectGrade={setSelectedGrade}
          selectedSubject={selectedSubject}
          onSelectSubject={setSelectedSubject}
        />

        {/* PhET Grid Header */}
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <span>Bộ Sưu Tập Bài Thí Nghiệm PhET</span>
              <span className="text-xs font-semibold text-cyan-400 bg-cyan-950 px-2.5 py-0.5 rounded-full border border-cyan-800/40">
                {filteredSimulations.length} Bài Mô Phỏng
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Phân loại theo chuẩn chương trình GDPT 2018 • Tích hợp Canvas 2D & Động lực học
            </p>
          </div>

          {(selectedGrade !== 'ALL' || selectedSubject !== 'ALL' || searchQuery) && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedGrade('ALL');
                setSelectedSubject('ALL');
              }}
              className="text-xs text-cyan-400 hover:underline font-semibold cursor-pointer"
            >
              🔄 Xóa Bộ Lọc
            </button>
          )}
        </div>

        {/* PhET Simulation Cards Grid */}
        {filteredSimulations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSimulations.map(sim => (
              <SimCard key={sim.id} sim={sim} onLaunch={sim.simUrl ? handleLaunchSim : undefined} />
            ))}
          </div>
        ) : (
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 text-center flex flex-col items-center justify-center gap-3">
            <div className="text-4xl">🔍</div>
            <h4 className="text-lg font-bold text-slate-200">Không Tìm Thấy Bài Thí Nghiệm Phù Hợp</h4>
            <p className="text-xs text-slate-400 max-w-md">
              Không tìm thấy kết quả cho "{searchQuery}". Thử chọn khối lớp hoặc phân môn khác!
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedGrade('ALL');
                setSelectedSubject('ALL');
              }}
              className="mt-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition cursor-pointer"
            >
              Xem Tất Cả Thí Nghiệm
            </button>
          </div>
        )}

        {/* Footer */}
        <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500 mt-auto">
          © 2026 EduLab Physics Platform. Mô phỏng học liệu mở chuẩn PhET & GDPT 2018.
        </footer>
      </main>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
      />

      {/* PhET Simulation Modal Viewer */}
      {activeModalSim && (
        <PhetModalViewer
          isOpen={!!activeModalSim}
          onClose={() => setActiveModalSim(null)}
          title={activeModalSim.title}
          simUrl={activeModalSim.simUrl || ''}
        />
      )}
    </div>
  );
};
