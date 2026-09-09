import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { User } from '../../context/AuthContext';

interface RoleWorkspacePanelProps {
  user: User | null;
  onEditProfile: () => void;
}

export const RoleWorkspacePanel: React.FC<RoleWorkspacePanelProps> = ({ user, onEditProfile }) => {
  const navigate = useNavigate();
  const role = user?.role || 'STUDENT';

  if (role === 'ADMIN') {
    return (
      <div className="bg-gradient-to-r from-rose-950/40 via-slate-900 to-slate-900 border border-rose-800/40 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-rose-600/20 border border-rose-500/30 flex items-center justify-center text-3xl">
            🛡️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-400 bg-rose-950 px-2.5 py-0.5 rounded-full border border-rose-800/40">
                Góc Quản Trị Viên (Admin)
              </span>
              <span className="text-xs text-slate-400">{user?.email}</span>
            </div>
            <h3 className="text-xl font-extrabold text-white mt-1">
              Trung Tâm Quản Lý Hệ Thống EduLab
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              Quản lý danh mục bài thực hành SGK, quản lý tài khoản Học sinh & Giáo viên và cấu hình hệ thống.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 flex-shrink-0">
          <button
            onClick={() => navigate('/srs-lab')}
            className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-lg transition cursor-pointer"
          >
            ⚙️ Quản Lý Bài Thực Hành
          </button>
          <button
            onClick={onEditProfile}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs rounded-xl transition cursor-pointer"
          >
            ✏️ Chỉnh Sửa Hồ Sơ
          </button>
        </div>
      </div>
    );
  }

  if (role === 'TEACHER') {
    return (
      <div className="bg-gradient-to-r from-purple-950/40 via-slate-900 to-slate-900 border border-purple-800/40 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-3xl">
            👨‍🏫
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-400 bg-purple-950 px-2.5 py-0.5 rounded-full border border-purple-800/40">
                Không Gian Giáo Viên
              </span>
              <span className="text-xs text-slate-400">{user?.school}</span>
            </div>
            <h3 className="text-xl font-extrabold text-white mt-1">
              Bộ Công Cụ Giảng Dạy & Trình Chiếu Thí Nghiệm
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              Chọn cấu hình bài thực hành mẫu theo chuẩn GDPT 2018 để trình chiếu trên lớp hoặc giao bài tập thực hành cho học sinh.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 flex-shrink-0">
          <button
            onClick={() => navigate('/srs-lab')}
            className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-lg transition cursor-pointer"
          >
            📋 Mở Quy Trình Thực Hành 5 Bước
          </button>
          <button
            onClick={() => navigate('/simulation')}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs rounded-xl transition cursor-pointer"
          >
            ⚡ Mở Canvas Trình Chiếu
          </button>
        </div>
      </div>
    );
  }

  // Student Role (Default)
  return (
    <div className="bg-gradient-to-r from-blue-950/40 via-slate-900 to-cyan-950/30 border border-blue-800/40 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row justify-between items-center gap-6">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-3xl">
          🎓
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 bg-blue-950 px-2.5 py-0.5 rounded-full border border-blue-800/40">
              Góc Học Sinh Luyện Tập
            </span>
            <span className="text-xs text-slate-400">{user?.school || 'Chưa cập nhật trường'}</span>
          </div>
          <h3 className="text-xl font-extrabold text-white mt-1">
            Thực Hành Thí Nghiệm & Tự Động Tính Sai Số
          </h3>
          <p className="text-xs text-slate-300 mt-1">
            Luyện tập kéo thả linh kiện, thu thập bảng số liệu và xuất bản tường trình báo cáo A4 nộp cho Giáo viên.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 flex-shrink-0">
        <button
          onClick={() => navigate('/srs-lab')}
          className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs rounded-xl shadow-lg transition cursor-pointer"
        >
          📝 Làm Bài Thực Hành SGK
        </button>
        <button
          onClick={() => navigate('/simulation')}
          className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs rounded-xl transition cursor-pointer"
        >
          ⚡ Khám Phá Mô Phỏng
        </button>
      </div>
    </div>
  );
};
