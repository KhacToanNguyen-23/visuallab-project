import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const TeacherAssignPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedClass, setSelectedClass] = useState('tc-1');
  const [selectedLab, setSelectedLab] = useState('sim-dc-circuit');
  const [dueDate, setDueDate] = useState('2026-09-20');
  const [instructions, setInstructions] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setToastMessage('Đã giao bài thực hành thành công cho lớp học!');
    setTimeout(() => {
      setToastMessage(null);
      navigate('/teacher/grading');
    }, 2000);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 font-semibold text-xs animate-bounce flex items-center gap-2">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h2 className="text-xl font-black tracking-tight" style={{ color: 'var(--text-main)' }}>
          Giao Bài Tập Thực Hành Mô Phỏng
        </h2>
        <p className="text-xs opacity-75 mt-0.5" style={{ color: 'var(--text-muted)' }}>
          Chọn lớp học, bài lab mẫu và cài đặt thời hạn nộp bài cho học sinh
        </p>
      </div>

      {/* Form Card */}
      <form
        onSubmit={handleSubmit}
        className="p-6 rounded-xl border space-y-5 shadow-xs"
        style={{
          backgroundColor: 'var(--bg-panel)',
          borderColor: 'var(--border-color)',
        }}
      >
        <div className="space-y-1.5 text-xs">
          <label className="font-bold opacity-80 block">Chọn Lớp Học Mở (*)</label>
          <select
            value={selectedClass}
            onChange={e => setSelectedClass(e.target.value)}
            className="w-full p-2.5 rounded-lg border font-semibold focus:outline-none cursor-pointer"
            style={{
              backgroundColor: 'var(--bg-main)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-main)',
            }}
          >
            <option value="tc-1">Vật lý 12 - Lớp 12A1 Chuyên Lý (42 học sinh)</option>
            <option value="tc-2">Vật lý 11 - Lớp 11A3 (38 học sinh)</option>
          </select>
        </div>

        <div className="space-y-1.5 text-xs">
          <label className="font-bold opacity-80 block">Chọn Bài Thí Nghiệm Mô Phỏng (*)</label>
          <select
            value={selectedLab}
            onChange={e => setSelectedLab(e.target.value)}
            className="w-full p-2.5 rounded-lg border font-semibold focus:outline-none cursor-pointer"
            style={{
              backgroundColor: 'var(--bg-main)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-main)',
            }}
          >
            <option value="sim-dc-circuit">[ĐIỆN HỌC] Mạch Điện Đơn Giản & Định Luật Ohm</option>
            <option value="sim-emf-internal-r">[ĐIỆN HỌC] Đo Suất Điện Động E & Điện Trở Trong r</option>
            <option value="sim-free-fall">[CƠ HỌC] Đo Gia Tốc Rơi Tự Do g</option>
            <option value="sim-simple-pendulum">[CƠ HỌC] Con Lắc Đơn & Dao Động Điều Hòa</option>
            <option value="sim-specific-heat">[SÓNG - NHIỆT] Đo Nhiệt Dung Riêng c Của Nước</option>
            <option value="sim-refraction">[QUANG HỌC] Khúc Xạ Ánh Sáng & Thấu Kính Hội Tụ</option>
          </select>
        </div>

        <div className="space-y-1.5 text-xs">
          <label className="font-bold opacity-80 block">Hạn Nộp Bài (Deadline)</label>
          <input
            type="date"
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
            className="w-full p-2.5 rounded-lg border font-mono font-medium focus:outline-none"
            style={{
              backgroundColor: 'var(--bg-main)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-main)',
            }}
          />
        </div>

        <div className="space-y-1.5 text-xs">
          <label className="font-bold opacity-80 block">Hướng Dẫn Làm Bài Yêu Cầu Học Sinh</label>
          <textarea
            rows={4}
            value={instructions}
            onChange={e => setInstructions(e.target.value)}
            placeholder="VD: Tiến hành thay đổi điện trở R từ 10 Ohm đến 50 Ohm, ghi nhận bảng số liệu U-I và tính giá trị R trung bình..."
            className="w-full p-2.5 rounded-lg border font-medium focus:outline-none"
            style={{
              backgroundColor: 'var(--bg-main)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-main)',
            }}
          />
        </div>

        <div className="pt-4 border-t flex justify-end gap-3" style={{ borderColor: 'var(--border-color)' }}>
          <button
            type="button"
            onClick={() => navigate('/teacher')}
            className="px-4 py-2 rounded-lg border text-xs font-semibold cursor-pointer"
            style={{
              borderColor: 'var(--border-color)',
              backgroundColor: 'var(--bg-main)',
            }}
          >
            Hủy Bỏ
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-lg text-xs font-bold text-white transition-opacity hover:opacity-90 cursor-pointer shadow-sm"
            style={{ backgroundColor: 'var(--accent-primary)' }}
          >
            Giao Bài Tập Cho Lớp
          </button>
        </div>
      </form>
    </div>
  );
};
