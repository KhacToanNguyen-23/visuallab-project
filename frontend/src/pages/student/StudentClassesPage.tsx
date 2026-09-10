import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { JoinClassDrawer } from '../../components/student/JoinClassDrawer';
import { classService } from '../../services/classService';
import { useAuth } from '../../context/AuthContext';

export interface EnrolledClassItem {
  id: string;
  name: string;
  code: string;
  teacherName: string;
  studentsCount: number;
  joinedDate: string;
}

export const StudentClassesPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [classes, setClasses] = useState<EnrolledClassItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      classService.getStudentEnrollments(user.id).then(data => {
        const formatted = data.map(e => ({
          id: e.id,
          name: e.className || 'Lớp học',
          code: e.classCode || '',
          teacherName: e.teacherName || 'Giáo viên',
          studentsCount: 0,
          joinedDate: e.enrolledAt || '',
        }));
        setClasses(formatted);
      }).catch(err => console.error('Failed to load enrollments:', err));
    }
  }, [user]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleJoinSuccess = async (code: string) => {
    try {
      const enrollment = await classService.joinClass(
        code, user?.id || '', user?.fullName || '', user?.email || ''
      );
      const newClass: EnrolledClassItem = {
        id: enrollment.id,
        name: enrollment.className || `Lớp mới (${code})`,
        code: enrollment.classCode || code,
        teacherName: enrollment.teacherName || 'Giáo viên',
        studentsCount: 0,
        joinedDate: enrollment.enrolledAt || new Date().toISOString(),
      };
      setClasses(prev => [newClass, ...prev]);
      showToast(`Đã tham gia lớp thành công với mã ${code}!`);
    } catch (err: any) {
      if (err.isDuplicate) {
        showToast('Bạn đã tham gia lớp này rồi!');
      } else {
        showToast(err.message || 'Không thể tham gia lớp!');
      }
    }
  };

  const filteredClasses = classes.filter(cls =>
    !searchQuery ||
    cls.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cls.teacherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cls.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 font-semibold text-xs animate-bounce flex items-center gap-2">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black tracking-tight" style={{ color: 'var(--text-main)' }}>
            Lớp Học Của Tôi
          </h2>
          <p className="text-xs opacity-75 mt-0.5" style={{ color: 'var(--text-muted)' }}>
            Quản lý danh sách các lớp học Vật lý bạn đã tham gia
          </p>
        </div>

        <button
          onClick={() => setIsDrawerOpen(true)}
          className="px-4 py-2.5 rounded-lg text-xs font-bold text-white shadow-md transition-opacity hover:opacity-90 flex items-center justify-center gap-2 cursor-pointer shrink-0"
          style={{ backgroundColor: 'var(--accent-primary)' }}
        >
          <span>+ Tham Gia Lớp Bằng Mã</span>
        </button>
      </div>

      {/* Mini KPI Summary Bar (Consolidated Overview Metrics) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="border rounded-xl p-4 shadow-xs flex flex-col justify-between" style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)' }}>
          <span className="text-[11px] font-semibold opacity-70" style={{ color: 'var(--text-muted)' }}>Lớp Đã Tham Gia</span>
          <div className="text-2xl font-black mt-2" style={{ color: 'var(--accent-primary)' }}>{classes.length} Lớp</div>
        </div>
        <div className="border rounded-xl p-4 shadow-xs flex flex-col justify-between" style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)' }}>
          <span className="text-[11px] font-semibold opacity-70" style={{ color: 'var(--text-muted)' }}>Bài Tập Cần Nộp</span>
          <div className="text-2xl font-black mt-2 text-amber-500">2 Bài</div>
        </div>
        <div className="border rounded-xl p-4 shadow-xs flex flex-col justify-between" style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)' }}>
          <span className="text-[11px] font-semibold opacity-70" style={{ color: 'var(--text-muted)' }}>Bài Đã Hoàn Thành</span>
          <div className="text-2xl font-black mt-2 text-emerald-500">4 Bài</div>
        </div>
        <div className="border rounded-xl p-4 shadow-xs flex flex-col justify-between" style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)' }}>
          <span className="text-[11px] font-semibold opacity-70" style={{ color: 'var(--text-muted)' }}>Điểm TB Thực Hành</span>
          <div className="text-2xl font-black mt-2 text-cyan-500">9.2 / 10</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div
        className="p-4 rounded-xl border flex items-center justify-between gap-3"
        style={{
          backgroundColor: 'var(--bg-panel)',
          borderColor: 'var(--border-color)',
        }}
      >
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Tìm kiếm lớp học hoặc tên giáo viên..."
          className="w-full bg-transparent text-xs font-medium focus:outline-none"
          style={{ color: 'var(--text-main)' }}
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} className="text-xs opacity-60 hover:opacity-100">
            ✕
          </button>
        )}
      </div>

      {/* Full-width Enrolled Classes Data Table */}
      <div
        className="border rounded-xl overflow-hidden shadow-xs"
        style={{ borderColor: 'var(--border-color)' }}
      >
        <table className="w-full text-left text-xs">
          <thead
            className="border-b uppercase font-semibold text-[10px] tracking-wider"
            style={{
              backgroundColor: 'var(--bg-panel)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-muted)',
            }}
          >
            <tr>
              <th className="p-3.5 pl-4">Tên Lớp Học</th>
              <th className="p-3.5">Giáo Viên Phụ Trách</th>
              <th className="p-3.5">Mã Lớp</th>
              <th className="p-3.5">Sĩ Số Bạn Học</th>
              <th className="p-3.5">Ngày Tham Gia</th>
              <th className="p-3.5 text-right pr-4">Thao Tác</th>
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: 'var(--border-color)' }}>
            {filteredClasses.length > 0 ? (
              filteredClasses.map(cls => (
                <tr
                  key={cls.id}
                  className="hover:bg-slate-500/5 transition-colors"
                  style={{ backgroundColor: 'var(--bg-main)' }}
                >
                  <td className="p-3.5 pl-4 font-bold text-xs" style={{ color: 'var(--text-main)' }}>
                    {cls.name}
                  </td>
                  <td className="p-3.5 font-medium opacity-80">{cls.teacherName}</td>
                  <td className="p-3.5">
                    <span
                      className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-md border"
                      style={{
                        backgroundColor: 'var(--bg-panel)',
                        borderColor: 'var(--border-color)',
                        color: 'var(--accent-primary)',
                      }}
                    >
                      {cls.code}
                    </span>
                  </td>
                  <td className="p-3.5 font-bold">{cls.studentsCount} học sinh</td>
                  <td className="p-3.5 opacity-75 font-mono text-[11px]">{cls.joinedDate}</td>
                  <td className="p-3.5 text-right pr-4 whitespace-nowrap">
                    <button
                      onClick={() => navigate('/student/assignments')}
                      className="px-3 py-1 text-xs font-semibold rounded-md border cursor-pointer"
                      style={{
                        borderColor: 'var(--border-color)',
                        backgroundColor: 'var(--bg-panel)',
                      }}
                    >
                      Xem Bài Tập →
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-10 text-center opacity-60">
                  Bạn chưa tham gia lớp học nào. Bấm nút trên để nhập mã lớp từ giáo viên!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Join Class Slide-over Drawer */}
      <JoinClassDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onJoinSuccess={handleJoinSuccess}
      />
    </div>
  );
};
