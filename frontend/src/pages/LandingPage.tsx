import React from 'react';
import { useNavigate } from 'react-router-dom';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="w-screen min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col selection:bg-blue-500 selection:text-white">
      {/* Top Navbar */}
      <header className="w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-xl shadow-lg shadow-blue-500/20">
            ⚛️
          </div>
          <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-300 to-teal-200">
            EduLab Physics
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white transition cursor-pointer"
          >
            Đăng Nhập
          </button>
          <button
            onClick={() => navigate('/login')}
            className="px-5 py-2 text-xs font-semibold bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-full shadow-lg shadow-blue-600/25 transition cursor-pointer"
          >
            Đăng Ký Miễn Phí
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20 relative overflow-hidden">
        {/* Glow Orbs */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/2 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-950/60 border border-blue-800/50 text-blue-400 text-xs font-medium mb-6">
          <span>✨ Chuẩn Chương Trình GDPT 2018</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight max-w-4xl leading-tight">
          Phòng Thí Nghiệm Vật Lý Tương Tác{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-300 to-teal-300">
            Trực Quan & Trực Tuyến
          </span>
        </h1>

        <p className="mt-6 text-base md:text-lg text-slate-400 max-w-2xl leading-relaxed">
          Khám phá không giới hạn thế giới Điện học, Cơ học, Nhiệt học bằng công nghệ mô phỏng Canvas 2D mượt mà. Đạt chuẩn thực hành của Giáo viên và Học sinh.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <button
            onClick={() => navigate('/login')}
            className="px-8 py-3.5 bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 hover:opacity-95 text-white font-semibold text-sm rounded-full shadow-xl shadow-cyan-500/20 transition cursor-pointer"
          >
            Bắt Đầu Thí Nghiệm Ngay 🚀
          </button>
          <button
            onClick={() => navigate('/srs-lab')}
            className="px-8 py-3.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-semibold text-sm rounded-full transition cursor-pointer"
          >
            Xem Bài Mẫu SGK
          </button>
        </div>

        {/* Feature Cards Grid */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full text-left">
          <div className="bg-slate-900/60 backdrop-blur border border-slate-800 p-6 rounded-2xl flex flex-col gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-2xl">
              ⚡
            </div>
            <h3 className="text-lg font-bold text-slate-100">Mạch Điện Tương Tác 2D</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Kéo thả linh kiện pin, điện trở, ampe kế, vôn kế. Thuật toán Kirchhoff tính toán chính xác dòng điện và hiển thị hạt electron chuyển động.
            </p>
          </div>

          <div className="bg-slate-900/60 backdrop-blur border border-slate-800 p-6 rounded-2xl flex flex-col gap-3">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-2xl">
              ⏱️
            </div>
            <h3 className="text-lg font-bold text-slate-100">Đo Gia Tốc Rơi Tự Do</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Bi sắt rơi tự do qua 2 cổng quang điện, đồng hồ hiện số MC-964 ghi nhận thời gian chính xác, tự động tính gia tốc g.
            </p>
          </div>

          <div className="bg-slate-900/60 backdrop-blur border border-slate-800 p-6 rounded-2xl flex flex-col gap-3">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-2xl">
              👨‍🏫
            </div>
            <h3 className="text-lg font-bold text-slate-100">Phân Phối Cho Giáo Viên</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Tạo tài khoản Giáo viên để giao bài thí nghiệm, xem báo cáo bản tường trình A4 của học sinh và chiếu trực tiếp trên lớp.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500">
        © 2026 EduLab Physics Platform. Bản quyền thuộc về Dự án Nâng cao Năng lực GDPT 2018.
      </footer>
    </div>
  );
};
