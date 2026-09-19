import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CreateClassDrawer, type ClassFormData } from '../../components/teacher/CreateClassDrawer';
import { ClassRosterDrawer } from '../../components/teacher/ClassRosterDrawer';
import { classService } from '../../services/classService';
import { assignmentService } from '../../services/assignmentService';
import { useAuth } from '../../context/AuthContext';

export interface ClassItem {
  id: string;
  name: string;
  code: string;
  students: number;
  assignments: number;
  gradeLevel: string;
  createdAt: string;
}

export const TeacherClassesPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedClassForRoster, setSelectedClassForRoster] = useState<ClassItem | null>(null);
  const [isRosterDrawerOpen, setIsRosterDrawerOpen] = useState(false);
  const [activeDrawerTab, setActiveDrawerTab] = useState<'students' | 'assignments'>('students');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const loadClasses = () => {
    if (user?.id) {
      classService.getTeacherClasses(user.id).then(async data => {
        const formatted = await Promise.all(
          data.map(async c => {
            const roster = await classService.getClassRoster(c.id);
            const asgs = await assignmentService.getAssignmentsByClass(c.id);
            return {
              id: c.id,
              name: c.name,
              code: c.code,
              students: roster ? roster.length : 0,
              assignments: asgs ? asgs.length : 0,
              gradeLevel: c.description || 'Chung',
              createdAt: c.createdAt || new Date().toISOString()
            };
          })
        );
        setClasses(formatted);
      }).catch(err => console.error("Failed to load classes:", err));
    }
  };

  useEffect(() => {
    loadClasses();
  }, [user]);

  useEffect(() => {
    if (classes.length > 0 && location.state?.openClassId) {
      const targetClass = classes.find(c => c.id === location.state.openClassId);
      if (targetClass) {
        setSelectedClassForRoster(targetClass);
        setActiveDrawerTab(location.state.tab || 'assignments');
        setIsRosterDrawerOpen(true);
      }
    }
  }, [classes, location.state]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCreateClass = async (formData: ClassFormData) => {
    try {
      const newClass = await classService.createClass(
        formData.name,
        formData.gradeLevel,
        user?.id || 't1',
        user?.fullName || 'Teacher'
      );
      const formatted: ClassItem = {
        id: newClass.id,
        name: newClass.name,
        code: newClass.code,
        students: 0,
        assignments: 0,
        gradeLevel: newClass.description || 'Chung',
        createdAt: newClass.createdAt || new Date().toISOString()
      };
      setClasses(prev => [formatted, ...prev]);
      showToast(`Đã tạo lớp thành công! Mã tham gia: ${newClass.code}`);
      setIsDrawerOpen(false);
    } catch (err) {
      console.error(err);
      showToast('Lỗi tạo lớp học!');
    }
  };

  const handleCopyCode = (code: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    showToast(`Đã sao chép mã tham gia: ${code}`);
    setTimeout(() => {
      setCopiedCode(prev => (prev === code ? null : prev));
    }, 2000);
  };

  const handleCopyInviteLink = (code: string) => {
    const inviteLink = `https://visuallab.edu.vn/join?code=${code}`;
    navigator.clipboard?.writeText(inviteLink);
    showToast(`Đã sao chép link mời: ${inviteLink}`);
  };

  const handleOpenRoster = (cls: ClassItem, tab: 'students' | 'assignments' = 'students') => {
    setSelectedClassForRoster(cls);
    setActiveDrawerTab(tab);
    setIsRosterDrawerOpen(true);
  };

  const filteredClasses = classes.filter(cls =>
    !searchQuery ||
    cls.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cls.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalStudents = classes.reduce((sum, c) => sum + c.students, 0);
  const totalAssignments = classes.reduce((sum, c) => sum + c.assignments, 0);

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 font-semibold text-xs animate-bounce flex items-center gap-2">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black tracking-tight" style={{ color: 'var(--text-main)' }}>
            Quản Lý Lớp Học Thực Hành
          </h2>
          <p className="text-xs opacity-75 mt-0.5" style={{ color: 'var(--text-muted)' }}>
            Danh sách lớp học Vật lý GDPT 2018 đang giảng dạy
          </p>
        </div>

        <button
          onClick={() => setIsDrawerOpen(true)}
          className="px-4 py-2.5 rounded-lg text-xs font-bold text-white shadow-md transition-opacity hover:opacity-90 flex items-center justify-center gap-2 cursor-pointer shrink-0"
          style={{ backgroundColor: 'var(--accent-primary)' }}
        >
          <span>+ Tạo Lớp Mới</span>
        </button>
      </div>

      {/* Mini KPI Summary Bar (Consolidated Overview Metrics) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="border rounded-xl p-4 shadow-xs flex flex-col justify-between" style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)' }}>
          <span className="text-[11px] font-semibold opacity-70" style={{ color: 'var(--text-muted)' }}>Lớp Đang Dạy</span>
          <div className="text-2xl font-black mt-2" style={{ color: 'var(--accent-primary)' }}>{classes.length} Lớp</div>
        </div>
        <div className="border rounded-xl p-4 shadow-xs flex flex-col justify-between" style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)' }}>
          <span className="text-[11px] font-semibold opacity-70" style={{ color: 'var(--text-muted)' }}>Tổng Học Sinh</span>
          <div className="text-2xl font-black mt-2 text-cyan-500">{totalStudents} Em</div>
        </div>
        <div className="border rounded-xl p-4 shadow-xs flex flex-col justify-between" style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)' }}>
          <span className="text-[11px] font-semibold opacity-70" style={{ color: 'var(--text-muted)' }}>Bài Tập Đã Giao</span>
          <div className="text-2xl font-black mt-2 text-emerald-500">{totalAssignments} Bài</div>
        </div>
        <div className="border rounded-xl p-4 shadow-xs flex flex-col justify-between" style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)' }}>
          <span className="text-[11px] font-semibold opacity-70" style={{ color: 'var(--text-muted)' }}>Bài Chờ Chấm</span>
          <div className="text-2xl font-black mt-2 text-amber-500">0 Nộp</div>
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
          placeholder="Tìm kiếm lớp học theo Tên hoặc Mã tham gia..."
          className="w-full bg-transparent text-xs font-medium focus:outline-none"
          style={{ color: 'var(--text-main)' }}
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} className="text-xs opacity-60 hover:opacity-100">
            ✕
          </button>
        )}
      </div>

      {/* Full-width Classes Data Table */}
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
              <th className="p-3.5">Mã Tham Gia</th>
              <th className="p-3.5">Khối Lớp</th>
              <th className="p-3.5">Sĩ Số Học Sinh</th>
              <th className="p-3.5">Bài Thực Hành Đã Giao</th>
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
                    <button
                      type="button"
                      onClick={() => handleOpenRoster(cls)}
                      className="font-bold hover:underline cursor-pointer text-left"
                      title="Nhấp để xem danh sách học sinh trong lớp"
                    >
                      {cls.name}
                    </button>
                  </td>
                  <td className="p-3.5">
                    <button
                      type="button"
                      onClick={(e) => handleCopyCode(cls.code, e)}
                      title="Nhấp để sao chép mã tham gia"
                      className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold px-2.5 py-1 rounded-md border transition-all hover:opacity-85 active:scale-95 cursor-pointer group"
                      style={{
                        backgroundColor: 'var(--bg-panel)',
                        borderColor: copiedCode === cls.code ? '#10b981' : 'var(--border-color)',
                        color: copiedCode === cls.code ? '#10b981' : 'var(--accent-primary)',
                      }}
                    >
                      <span>{cls.code}</span>
                      {copiedCode === cls.code ? (
                        <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg
                          className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 transition-opacity"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      )}
                    </button>
                  </td>
                  <td className="p-3.5 font-medium opacity-80">{cls.gradeLevel}</td>
                  <td className="p-3.5 font-bold">
                    <button
                      type="button"
                      onClick={() => handleOpenRoster(cls)}
                      className="font-bold text-xs hover:underline cursor-pointer inline-flex items-center gap-1.5 transition-opacity hover:opacity-80"
                      style={{ color: 'var(--text-main)' }}
                      title="Nhấp để xem danh sách học sinh"
                    >
                      <span>{cls.students} học sinh</span>
                      <span className="text-[10px] opacity-60"></span>
                    </button>
                  </td>
                  <td className="p-3.5 opacity-80">
                    <button
                      type="button"
                      onClick={() => handleOpenRoster(cls, 'assignments')}
                      className="font-bold text-xs hover:underline cursor-pointer inline-flex items-center gap-1.5 transition-opacity hover:opacity-80"
                      style={{ color: 'var(--text-main)' }}
                      title="Nhấp để xem các bài thực hành đã giao cho lớp này"
                    >
                      <span>{cls.assignments} bài</span>
                      <span className="text-[10px] opacity-60"></span>
                    </button>
                  </td>
                  <td className="p-3.5 text-right pr-4 whitespace-nowrap space-x-2">
                    <button
                      onClick={() => handleOpenRoster(cls, 'students')}
                      className="px-2.5 py-1 text-xs font-semibold hover:underline cursor-pointer"
                      style={{ color: 'var(--accent-primary)' }}
                    >
                      Danh Sách Học Sinh
                    </button>
                    <button
                      onClick={() => handleCopyInviteLink(cls.code)}
                      className="px-3 py-1 text-xs font-semibold hover:underline cursor-pointer"
                      style={{ color: 'var(--accent-primary)' }}
                    >
                      Sao Chép Link Mời
                    </button>
                    <button
                      onClick={() => navigate('/teacher/grading')}
                      className="px-3 py-1 text-xs font-semibold rounded-md border cursor-pointer"
                      style={{
                        borderColor: 'var(--border-color)',
                        backgroundColor: 'var(--bg-panel)',
                      }}
                    >
                      Xem Sổ Điểm →
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-10 text-center opacity-60">
                  Chưa có lớp học nào phù hợp.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Create Class Slide-over Drawer */}
      <CreateClassDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSubmit={handleCreateClass}
      />

      {/* Class Roster Slide-over Drawer */}
      <ClassRosterDrawer
        isOpen={isRosterDrawerOpen}
        onClose={() => setIsRosterDrawerOpen(false)}
        classItem={selectedClassForRoster}
        initialTab={activeDrawerTab}
        onCopyInviteLink={handleCopyInviteLink}
        onCopyCode={handleCopyCode}
        onAssignmentDeleted={loadClasses}
      />
    </div>
  );
};
