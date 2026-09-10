import React, { useState, useEffect } from 'react';
import { SubmitAssignmentDrawer, type StudentAssignmentItem } from '../../components/student/SubmitAssignmentDrawer';
import { StudentLabAssignmentView } from '../../components/assignment/StudentLabAssignmentView';
import { classService } from '../../services/classService';
import { assignmentService } from '../../services/assignmentService';
import { useAuth } from '../../context/AuthContext';
import type { Assignment } from '../../types/assignment';

export const StudentAssignmentsPage: React.FC = () => {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<StudentAssignmentItem[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState<StudentAssignmentItem | null>(null);
  const [activeAssignment, setActiveAssignment] = useState<Assignment | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchAssignments = () => {
    if (!user?.id) return;
    classService
      .getStudentEnrollments(user.id)
      .then(async enrollments => {
        const allAsgs: StudentAssignmentItem[] = [];
        for (const enr of enrollments) {
          const [asgs, clsDetails] = await Promise.all([
            assignmentService.getAssignmentsByClass(enr.classId),
            classService.getClassDetails(enr.classId),
          ]);

          const teacherName = clsDetails?.teacherName || enr.teacherName || 'Giáo viên';
          const className = clsDetails?.name || enr.className || `Lớp ${enr.classId}`;

          asgs.forEach(a => {
            allAsgs.push({
              id: a.id,
              labTitle: a.title,
              className: className,
              teacherName: teacherName,
              dueDate: 'Sắp tới',
              status: 'NOT_STARTED',
              route: '/simulation',
              instructions: a.description || 'Hoàn thành bài thí nghiệm theo đúng thông số được giao.',
              rawAssignment: a,
            });
          });
        }
        setAssignments(allAsgs);
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchAssignments();
  }, [user?.id]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenDrawer = (asg: StudentAssignmentItem) => {
    setSelectedAssignment(asg);
    setIsDrawerOpen(true);
  };

  const handleStartAssignment = (rawAssignment: Assignment) => {
    setActiveAssignment(rawAssignment);
  };

  const handleSubmitReport = (id: string) => {
    setAssignments(prev => prev.map(asg => (asg.id === id ? { ...asg, status: 'SUBMITTED' } : asg)));
    showToast('Đã gửi báo cáo thực hành thành công cho Giáo viên!');
  };

  if (activeAssignment) {
    return (
      <StudentLabAssignmentView
        assignment={activeAssignment}
        studentId={user?.id || 's1'}
        studentName={user?.fullName || 'Học sinh'}
        onBack={() => {
          setActiveAssignment(null);
          fetchAssignments();
        }}
      />
    );
  }

  const filteredAssignments = assignments.filter(asg =>
    !searchQuery ||
    asg.labTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    asg.className.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            Bài Tập Cần Nộp
          </h2>
          <p className="text-xs opacity-75 mt-0.5" style={{ color: 'var(--text-muted)' }}>
            Danh sách các bài thí nghiệm mô phỏng do Giáo viên giao cho bạn
          </p>
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
          placeholder="Tìm kiếm bài tập hoặc tên lớp..."
          className="w-full bg-transparent text-xs font-medium focus:outline-none"
          style={{ color: 'var(--text-main)' }}
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} className="text-xs opacity-60 hover:opacity-100">
            ✕
          </button>
        )}
      </div>

      {/* Full-width Assignments Data Table */}
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
              <th className="p-3.5 pl-4">Tên Bài Thí Nghiệm</th>
              <th className="p-3.5">Lớp Học</th>
              <th className="p-3.5">Giáo Viên Giao</th>
              <th className="p-3.5">Hạn Nộp (Deadline)</th>
              <th className="p-3.5">Trạng Thái</th>
              <th className="p-3.5 text-right pr-4">Thao Tác</th>
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: 'var(--border-color)' }}>
            {filteredAssignments.length > 0 ? (
              filteredAssignments.map(asg => (
                <tr
                  key={asg.id}
                  onClick={() => handleOpenDrawer(asg)}
                  className="hover:bg-slate-500/5 transition-colors cursor-pointer"
                  style={{ backgroundColor: 'var(--bg-main)' }}
                >
                  <td className="p-3.5 pl-4 font-bold text-xs" style={{ color: 'var(--text-main)' }}>
                    {asg.labTitle}
                  </td>
                  <td className="p-3.5 font-medium opacity-80">{asg.className}</td>
                  <td className="p-3.5 opacity-80">{asg.teacherName}</td>
                  <td className="p-3.5 font-mono font-bold text-rose-500 text-[11px]">{asg.dueDate}</td>
                  <td className="p-3.5">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        asg.status === 'SUBMITTED'
                          ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                          : asg.status === 'IN_PROGRESS'
                          ? 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                          : 'bg-slate-500/10 text-slate-500 border-slate-500/20'
                      }`}
                    >
                      {asg.status === 'SUBMITTED'
                        ? 'ĐÃ NỘP BÀI'
                        : asg.status === 'IN_PROGRESS'
                        ? 'ĐANG THỰC HIỆN'
                        : 'CHƯA BẮT ĐẦU'}
                    </span>
                  </td>
                  <td className="p-3.5 text-right pr-4 whitespace-nowrap">
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        handleOpenDrawer(asg);
                      }}
                      className="px-3 py-1 text-xs font-semibold rounded-md border cursor-pointer"
                      style={{
                        borderColor: 'var(--border-color)',
                        backgroundColor: 'var(--bg-panel)',
                      }}
                    >
                      {asg.status === 'SUBMITTED' ? 'Xem Lại →' : 'Làm & Nộp Bài →'}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-10 text-center opacity-60">
                  Không có bài tập nào cần nộp.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Submit Assignment Drawer */}
      <SubmitAssignmentDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        assignment={selectedAssignment}
        onSubmitReport={handleSubmitReport}
        onStartAssignment={handleStartAssignment}
      />
    </div>
  );
};
