import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [school, setSchool] = useState(user?.school || '');
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // Update local user state
    const currentUser = JSON.parse(localStorage.getItem('edulab_user') || '{}');
    const updatedUser = {
      ...currentUser,
      fullName: fullName.trim() || currentUser.fullName,
      school: school.trim() || currentUser.school,
    };
    localStorage.setItem('edulab_user', JSON.stringify(updatedUser));
    
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
      window.location.reload(); // Quick refresh to update UI state across context
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-fadeIn font-sans">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col gap-5 text-slate-100 relative">
        <div className="flex justify-between items-center pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold">
              ✏️
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Cập Nhật Thông Tin Cá Nhân</h3>
              <p className="text-[11px] text-slate-400">Thiết lập tên hiển thị & trường học của bạn</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-lg font-bold p-1 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {isSaved ? (
          <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs p-4 rounded-xl text-center font-semibold animate-pulse">
            ✅ Đã lưu thông tin hồ sơ thành công!
          </div>
        ) : (
          <form onSubmit={handleSave} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5 text-xs">
              <label className="text-slate-300 font-semibold">Tên hiển thị mong muốn</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="Ví dụ: Nguyễn Văn A"
                className="bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-blue-500 transition"
              />
            </div>

            <div className="flex flex-col gap-1.5 text-xs">
              <label className="text-slate-300 font-semibold">Tên Trường Học / Lớp</label>
              <input
                type="text"
                value={school}
                onChange={e => setSchool(e.target.value)}
                placeholder="Ví dụ: THPT Chuyên Hà Nội - Amsterdam"
                className="bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-blue-500 transition"
              />
            </div>

            <div className="flex gap-3 mt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl border border-slate-700 transition cursor-pointer"
              >
                Bỏ Qua
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold text-xs rounded-xl shadow-lg transition cursor-pointer"
              >
                Lưu Thay Đổi
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
