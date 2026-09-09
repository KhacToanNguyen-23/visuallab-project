import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { EditProfileModal } from '../components/auth/EditProfileModal';

interface Topic {
  id: string;
  title: string;
  gradeLevel: string;
  subjectArea: string;
  description: string;
}

export const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  useEffect(() => {
    fetch('http://localhost:8080/api/curriculum/topics')
      .then(res => res.json())
      .then(data => setTopics(data))
      .catch(err => console.error(err));
  }, []);

  // Auto popup edit modal if Google user hasn't customized name/school
  useEffect(() => {
    if (user && (user.provider === 'GOOGLE' || user.fullName === 'Google User' || user.fullName === 'Người dùng Google' || !user.school)) {
      setIsEditProfileOpen(true);
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen w-screen bg-slate-950 text-slate-100 flex flex-col font-sans overflow-x-hidden">
      {/* Header Bar */}
      <header className="h-16 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-8 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-xl font-bold shadow-md">
            ⚛️
          </div>
          <div>
            <h1 className="font-bold text-base tracking-tight text-white">EduLab Dashboard</h1>
            <p className="text-xs text-slate-400">Không gian học tập & Mô phỏng thí nghiệm</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
            <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
              {user?.fullName ? user.fullName[0] : 'U'}
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-semibold text-slate-200">{user?.fullName || 'Người dùng'}</p>
                <button
                  onClick={() => setIsEditProfileOpen(true)}
                  className="text-[10px] text-blue-400 hover:underline cursor-pointer"
                >
                  ✏️ Sửa
                </button>
              </div>
              <p className="text-[10px] text-slate-400">
                {user?.school || 'Chưa cập nhật trường học'} • <span className="text-cyan-400 font-semibold">{user?.role === 'ADMIN' ? '🛡️ Quản trị viên' : user?.role === 'TEACHER' ? 'Giáo viên' : 'Học sinh'}</span>
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="px-3 py-1.5 bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white text-xs font-semibold rounded-lg transition cursor-pointer"
          >
            Đăng Xuất
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-8 flex flex-col gap-8">
        {/* Welcome Hero Banner */}
        <div className="relative rounded-3xl bg-gradient-to-r from-blue-900/60 via-slate-900 to-cyan-900/40 border border-slate-800 p-8 overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-2xl flex flex-col gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400 bg-cyan-950/60 px-3 py-1 rounded-full w-fit border border-cyan-800/40">
              Chào mừng {user?.fullName || 'bạn'} trở lại!
            </span>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Khám Phá Thế Giới Vật Lý Tương Tác
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Trực quan hóa các khái niệm Định luật Ohm, Mạch điện DC, Dao động cơ và Khúc xạ ánh sáng bám sát chương trình SGK GDPT 2018.
            </p>
            <div className="flex gap-4 mt-2">
              <button
                onClick={() => navigate('/simulation')}
                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold text-xs rounded-xl shadow-lg transition cursor-pointer"
              >
                ⚡ Khởi Chạy Workspace Mô Phỏng
              </button>
              <button
                onClick={() => setIsEditProfileOpen(true)}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold rounded-xl transition cursor-pointer"
              >
                ✏️ Cập Nhật Tên & Trường Học
              </button>
            </div>
          </div>
        </div>

        {/* Bento Grid Section */}
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-bold text-slate-200">
            Chuyên Đề Thí Nghiệm GDPT 2018
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Bento Card 1: Điện học */}
            <div className="md:col-span-2 bg-slate-900/70 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between gap-4 hover:border-blue-500/50 transition shadow-xl group">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
                    Điện Học & Mạch Điện DC
                  </span>
                  <h4 className="text-xl font-bold text-white mt-1 group-hover:text-blue-400 transition">
                    Mạch Điện Đơn Giản & Định Luật Ohm
                  </h4>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    Kéo thả Pin 9V, Điện trở, Bóng đèn, Công tắc và đo dòng điện $I$, hiệu điện thế $U$ với Ampe kế và Von kế theo chuẩn định luật Kirchhoff.
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center text-2xl font-bold">
                  ⚡
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-slate-800/80">
                <span className="text-xs text-slate-500 font-medium">Lớp 9 (THCS) & Lớp 11 (THPT)</span>
                <button
                  onClick={() => navigate('/simulation')}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition"
                >
                  Mở Thí Nghiệm →
                </button>
              </div>
            </div>

            {/* Bento Card 2: Cơ học */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between gap-4 hover:border-amber-500/50 transition shadow-xl group">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                    Cơ Học & Dao Động
                  </span>
                  <h4 className="text-lg font-bold text-white mt-1 group-hover:text-amber-400 transition">
                    Con Lắc Đơn & Con Lắc Lò Xo
                  </h4>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    Điều chỉnh chiều dài $l$, khối lượng $m$, gia tốc $g$ và xem đồ thị $x-t$ thời gian thực.
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center text-xl font-bold">
                  ⏱️
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-slate-800/80">
                <span className="text-xs text-slate-500 font-medium">Lớp 10 & 11</span>
                <span className="text-xs font-semibold text-amber-400 bg-amber-950/60 px-2.5 py-1 rounded-md border border-amber-800/40">
                  Xem Trước
                </span>
              </div>
            </div>

            {/* Bento Card 3: Quang học */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between gap-4 hover:border-cyan-500/50 transition shadow-xl group">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                    Quang Học
                  </span>
                  <h4 className="text-lg font-bold text-white mt-1 group-hover:text-cyan-400 transition">
                    Khúc Xạ Ánh Sáng & Thấu Kính
                  </h4>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    Chiếu tia laser qua thấu kính hội tụ, thấu kính phân kỳ và vẽ ảnh ảo/ảnh thật $A'B'$.
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-cyan-600/20 text-cyan-400 flex items-center justify-center text-xl font-bold">
                  🔍
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-slate-800/80">
                <span className="text-xs text-slate-500 font-medium">Lớp 9 & 11</span>
                <span className="text-xs font-semibold text-cyan-400 bg-cyan-950/60 px-2.5 py-1 rounded-md border border-cyan-800/40">
                  Xem Trước
                </span>
              </div>
            </div>

            {/* Bento Card 4: System Topics from REST API */}
            <div className="md:col-span-2 bg-slate-900/70 border border-slate-800 rounded-2xl p-6 flex flex-col gap-4 shadow-xl">
              <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
                Danh Mục Chủ Đề Tải Từ Backend Spring Boot API
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {topics.map(t => (
                  <div key={t.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col gap-1">
                    <span className="text-xs font-bold text-blue-400">{t.subjectArea} • {t.gradeLevel}</span>
                    <h5 className="font-semibold text-sm text-slate-100">{t.title}</h5>
                    <p className="text-xs text-slate-400 leading-normal">{t.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Edit Profile Modal Integration */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
      />
    </div>
  );
};
