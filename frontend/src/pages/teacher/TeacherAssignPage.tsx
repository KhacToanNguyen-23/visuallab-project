import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { classService } from '../../services/classService';
import { assignmentService } from '../../services/assignmentService';
import { useAuth } from '../../context/AuthContext';

const LAB_OPTIONS = [
  { id: 'sim-simple-pendulum', title: '[CƠ HỌC] Con Lắc Đơn & Dao Động Điều Hòa', type: 'PENDULUM' },
  { id: 'sim-spring-hooke', title: '[CƠ HỌC] Con Lắc Lò Xo & Định Luật Hooke', type: 'SPRING' },
  { id: 'sim-dc-circuit', title: '[ĐIỆN HỌC] Mạch Điện Đơn Giản & Định Luật Ohm', type: 'ELECTRICITY_OHM' },
  { id: 'sim-emf-internal-r', title: '[ĐIỆN HỌC] Đo Suất Điện Động E & Điện Trở Trong r', type: 'ELECTRICITY_EMF' },
  { id: 'sim-free-fall', title: '[CƠ HỌC] Đo Gia Tốc Rơi Tự Do g', type: 'MECHANICS_FREE_FALL' },
  { id: 'sim-specific-heat', title: '[SÓNG - NHIỆT] Đo Nhiệt Dung Riêng c Của Nước', type: 'HEAT_SPECIFIC_HEAT' },
  { id: 'sim-refraction', title: '[QUANG HỌC] Khúc Xạ Ánh Sáng & Thấu Kính Hội Tụ', type: 'OPTICS_REFRACTION' },
];

export const TeacherAssignPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [classes, setClasses] = useState<Array<{ id: string; name: string; code: string; studentCount: number }>>([]);
  const [loadingClasses, setLoadingClasses] = useState(true);

  const [selectedClass, setSelectedClass] = useState('');
  const [selectedLab, setSelectedLab] = useState(LAB_OPTIONS[0].id);
  const [dueDate, setDueDate] = useState('2026-09-20');
  const [instructions, setInstructions] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user?.id) {
      setLoadingClasses(true);
      classService
        .getTeacherClasses(user.id)
        .then(async data => {
          const formatted = await Promise.all(
            data.map(async c => {
              const roster = await classService.getClassRoster(c.id);
              return {
                id: c.id,
                name: c.name,
                code: c.code,
                studentCount: roster ? roster.length : 0,
              };
            })
          );
          setClasses(formatted);
          if (formatted.length > 0) {
            setSelectedClass(formatted[0].id);
          }
        })
        .catch(err => console.error('Lỗi khi tải danh sách lớp học:', err))
        .finally(() => setLoadingClasses(false));
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClass) {
      setToastMessage('Vui lòng chọn lớp học để giao bài!');
      return;
    }

    setSubmitting(true);
    try {
      const selectedLabItem = LAB_OPTIONS.find(l => l.id === selectedLab) || LAB_OPTIONS[0];

      await assignmentService.createAssignment({
        classId: selectedClass,
        title: selectedLabItem.title,
        description: instructions || 'Tiến hành thí nghiệm mô phỏng và ghi nhận số liệu báo cáo.',
        labType: selectedLabItem.type,
        paramBoundsJson: JSON.stringify({ lengthMin: 0.5, lengthMax: 2.0, angleMin: 5, angleMax: 30 }),
        targetFormula: 'T = 2 * PI * sqrt(L / g)',
        tolerancePercent: 3.0,
        teacherId: user?.id || 't1',
      });

      setToastMessage('Đã giao bài thực hành thành công cho lớp học!');
      setTimeout(() => {
        setToastMessage(null);
        navigate('/teacher/grading');
      }, 1500);
    } catch (err: any) {
      console.error(err);
      setToastMessage(err.message || 'Lỗi khi giao bài thực hành');
    } finally {
      setSubmitting(false);
    }
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
            disabled={loadingClasses || classes.length === 0}
            className="w-full p-2.5 rounded-lg border font-semibold focus:outline-none cursor-pointer disabled:opacity-50"
            style={{
              backgroundColor: 'var(--bg-main)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-main)',
            }}
          >
            {loadingClasses ? (
              <option value="">Đang tải danh sách lớp học...</option>
            ) : classes.length > 0 ? (
              classes.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} - [{c.code}] ({c.studentCount} học sinh)
                </option>
              ))
            ) : (
              <option value="">Chưa có lớp học nào (Hãy tạo lớp học mới trước)</option>
            )}
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
            {LAB_OPTIONS.map(lab => (
              <option key={lab.id} value={lab.id}>
                {lab.title}
              </option>
            ))}
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
            disabled={submitting || !selectedClass}
            className="px-5 py-2 rounded-lg text-xs font-bold text-white transition-opacity hover:opacity-90 cursor-pointer shadow-sm disabled:opacity-50"
            style={{ backgroundColor: 'var(--accent-primary)' }}
          >
            {submitting ? 'Đang Giao Bài...' : 'Giao Bài Tập Cho Lớp'}
          </button>
        </div>
      </form>
    </div>
  );
};

