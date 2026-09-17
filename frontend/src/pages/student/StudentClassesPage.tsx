import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { JoinClassDrawer } from '../../components/student/JoinClassDrawer';
import { classService } from '../../services/classService';
import { assignmentService } from '../../services/assignmentService';
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
  const [totalAssignmentsCount, setTotalAssignmentsCount] = useState<number>(0);
  const [submittedAssignmentsCount, setSubmittedAssignmentsCount] = useState<number>(0);
  const [avgScore, setAvgScore] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyCode = (code: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    showToast(`Đã sao chép mã tham gia: ${code}`);
    setTimeout(() => {
      setCopiedCode(prev => (prev === code ? null : prev));
    }, 2000);
  };

  const fetchClasses = async () => {
    if (!user?.id) return;
    try {
      const data = await classService.getStudentEnrollments(user.id);
      let asgSum = 0;
      let subCount = 0;
      let totalScoreSum = 0;

      const formatted: EnrolledClassItem[] = await Promise.all(
        data.map(async e => {
          const [roster, asgs, clsDetails] = await Promise.all([
            classService.getClassRoster(e.classId),
            assignmentService.getAssignmentsByClass(e.classId),
            classService.getClassDetails(e.classId),
          ]);
          asgSum += asgs ? asgs.length : 0;

          if (asgs && asgs.length > 0) {
            for (const a of asgs) {
              try {
                const sub = await assignmentService.getStudentSubmission(a.id, user.id);
                if (sub) {
                  subCount++;
                  totalScoreSum += sub.totalScore;
                }
              } catch (_) {}
            }
          }

          return {
            id: e.id,
            name: clsDetails?.name || e.className || `Lớp học (${e.classCode || e.classId})`,
            code: clsDetails?.code || e.classCode || 'ENROLLED',
            teacherName: clsDetails?.teacherName || e.teacherName || 'Giáo viên',
            studentsCount: roster ? roster.length : 1,
            joinedDate: e.enrolledAt ? new Date(e.enrolledAt).toLocaleDateString('vi-VN') : 'Đã tham gia'
          };
        })
      );
      setClasses(formatted);
      setTotalAssignmentsCount(asgSum);
      setSubmittedAssignmentsCount(subCount);
      setAvgScore(subCount > 0 ? Math.round((totalScoreSum / subCount) * 10) / 10 : null);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, [user?.id]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleJoinSuccess = async (code: string) => {
    await fetchClasses();
    showToast(`Đã tham gia lớp thành công với mã ${code}!`);
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
          <span className="text-[11px] font-semibold opacity-70" style={{ color: 'var(--text-muted)' }}>Bài Tập Được Giao</span>
          <div className="text-2xl font-black mt-2 text-amber-500">{totalAssignmentsCount} Bài</div>
        </div>
        <div className="border rounded-xl p-4 shadow-xs flex flex-col justify-between" style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)' }}>
          <span className="text-[11px] font-semibold opacity-70" style={{ color: 'var(--text-muted)' }}>Bài Đã Nộp</span>
          <div className="text-2xl font-black mt-2 text-emerald-500">{submittedAssignmentsCount} Bài</div>
        </div>
        <div className="border rounded-xl p-4 shadow-xs flex flex-col justify-between" style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)' }}>
          <span className="text-[11px] font-semibold opacity-70" style={{ color: 'var(--text-muted)' }}>Điểm TB Thực Hành</span>
          <div className="text-2xl font-black mt-2 text-cyan-500">
            {avgScore !== null ? `${avgScore.toFixed(1)} / 10` : '— / 10'}
          </div>
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
