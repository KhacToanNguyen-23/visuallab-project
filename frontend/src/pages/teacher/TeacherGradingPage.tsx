import React, { useState, useEffect } from 'react';
import { GradeSubmissionDrawer, type SubmissionData } from '../../components/teacher/GradeSubmissionDrawer';
import { assignmentService } from '../../services/assignmentService';
import { classService } from '../../services/classService';
import { useAuth } from '../../context/AuthContext';

export const TeacherGradingPage: React.FC = () => {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<SubmissionData[]>([]);
  const [classes, setClasses] = useState<{ id: string; name: string }[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<SubmissionData | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchSubmissions = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      // 1. Fetch teacher classes
      const teacherClasses = await classService.getTeacherClasses(user.id);
      setClasses(teacherClasses.map(c => ({ id: c.id, name: c.name })));

      const classMap: Record<string, string> = {};
      teacherClasses.forEach(c => {
        classMap[c.id] = c.name;
      });

      // 2. Fetch assignments across all classes
      const assignmentMap: Record<string, { title: string; className: string }> = {};
      const allSubmissions: SubmissionData[] = [];

      for (const cls of teacherClasses) {
        const asgs = await assignmentService.getAssignmentsByClass(cls.id);
        for (const a of asgs) {
          assignmentMap[a.id] = { title: a.title, className: cls.name };
          const subs = await assignmentService.getSubmissionsByAssignment(a.id);
          for (const s of subs) {
            const timeStr = s.submittedAt
              ? new Date(s.submittedAt).toLocaleString('vi-VN', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : 'Vừa xong';

            let aiFeedbackText = '';
            if (s.aiFeedbackJson) {
              try {
                const fb = JSON.parse(s.aiFeedbackJson);
                aiFeedbackText = fb.pedagogicalFeedback || fb.feedback || s.aiFeedbackJson;
              } catch (_) {
                aiFeedbackText = s.aiFeedbackJson;
              }
            }

            const rawScore = s.totalScore || 0;
            const normalizedScore = rawScore > 10 ? rawScore / 10.0 : rawScore;
            const safeScore = Math.min(10.0, Math.max(0.0, normalizedScore));

            allSubmissions.push({
              id: s.id,
              studentName: s.studentName || `Học sinh (${s.studentId})`,
              className: cls.name,
              labTitle: a.title,
              time: timeStr,
              status: 'COMPLETED',
              score: `${safeScore.toFixed(1)} / 10`,
              feedback: aiFeedbackText,
              submittedAnswersJson: s.submittedAnswersJson,
              explanation: s.explanation,
              mathScore: (s.mathScore || 0) > 10 ? (s.mathScore || 0) / 10.0 : s.mathScore,
              aiReasoningScore: (s.aiReasoningScore || 0) > 10 ? (s.aiReasoningScore || 0) / 10.0 : s.aiReasoningScore,
              aiFeedbackJson: s.aiFeedbackJson,
            });
          }
        }
      }

      setSubmissions(allSubmissions);
    } catch (err) {
      console.error('Lỗi khi tải danh sách bài nộp của học sinh:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [user?.id]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenGradeDrawer = (sub: SubmissionData) => {
    setSelectedSubmission(sub);
    setIsDrawerOpen(true);
  };

  const handleSaveGrade = async (id: string, newScore: string, feedback: string) => {
    try {
      const cleanNum = parseFloat(newScore.split('/')[0].trim());
      const scoreToSave = isNaN(cleanNum) ? 10.0 : Math.min(10.0, Math.max(0.0, cleanNum));
      await assignmentService.gradeSubmission(id, scoreToSave, feedback);
      
      setSubmissions(prev =>
        prev.map(sub => {
          if (sub.id !== id) return sub;
          return {
            ...sub,
            score: `${scoreToSave.toFixed(1)} / 10`,
            status: 'COMPLETED',
            feedback,
          };
        })
      );
      showToast(`Đã lưu điểm (${scoreToSave.toFixed(1)} / 10) và nhận xét thành công!`);
    } catch (err: any) {
      showToast(err.message || 'Lỗi khi cập nhật điểm');
    }
  };

  // Filter by selected class and search query
  const filteredSubmissions = submissions.filter(sub => {
    const matchesClass =
      selectedClassId === 'ALL' ||
      classes.find(c => c.id === selectedClassId)?.name === sub.className;

    const matchesSearch =
      !searchQuery ||
      sub.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.labTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.className.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesClass && matchesSearch;
  });

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
            Sổ Điểm Tiến Độ & Chấm Bài Thực Hành
          </h2>
          <p className="text-xs opacity-75 mt-0.5" style={{ color: 'var(--text-muted)' }}>
            Quản lý và chấm bài thí nghiệm theo từng lớp học trực quan
          </p>
        </div>
      </div>

      {/* Filter Bar with Integrated Class Dropdown & Search */}
      <div
        className="p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
        style={{
          backgroundColor: 'var(--bg-panel)',
          borderColor: 'var(--border-color)',
        }}
      >
        {/* Class Dropdown Selector */}
        <div className="flex items-center gap-2 min-w-[220px]">
          <label className="text-xs font-bold opacity-75 shrink-0 flex items-center gap-1.5" style={{ color: 'var(--text-main)' }}>
            <span></span>
            <span>Lớp học:</span>
          </label>
          <select
            value={selectedClassId}
            onChange={e => setSelectedClassId(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border text-xs font-semibold focus:outline-none cursor-pointer transition-colors"
            style={{
              backgroundColor: 'var(--bg-main)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-main)',
            }}
          >
            <option value="ALL">Tất Cả Lớp ({submissions.length})</option>
            {classes.map(cls => {
              const classSubCount = submissions.filter(s => s.className === cls.name).length;
              return (
                <option key={cls.id} value={cls.id}>
                  Lớp {cls.name} ({classSubCount} bài nộp)
                </option>
              );
            })}
          </select>
        </div>

        <div className="h-5 w-[1px] bg-slate-500/20 hidden sm:block shrink-0" />

        {/* Search Input */}
        <div className="flex-1 flex items-center gap-2 px-3 py-1.5 rounded-lg border" style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)' }}>
          <span className="text-xs opacity-60"></span>
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm theo Tên học sinh hoặc Tên bài lab..."
            className="w-full bg-transparent text-xs font-medium focus:outline-none"
            style={{ color: 'var(--text-main)' }}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-xs opacity-60 hover:opacity-100 cursor-pointer">
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Full-width Submissions Table */}
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
              <th className="p-3.5 pl-4">Họ và Tên Học Sinh</th>
              <th className="p-3.5">Lớp Học</th>
              <th className="p-3.5">Bài Thí Nghiệm</th>
              <th className="p-3.5">Thời Gian Nộp</th>
              <th className="p-3.5">Trạng Thái</th>
              <th className="p-3.5">Điểm Số</th>
              <th className="p-3.5 text-right pr-4">Thao Tác</th>
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: 'var(--border-color)' }}>
            {loading ? (
              <tr>
                <td colSpan={7} className="p-10 text-center opacity-60">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                    <span>Đang tải danh sách bài nộp của học sinh...</span>
                  </div>
                </td>
              </tr>
            ) : filteredSubmissions.length > 0 ? (
              filteredSubmissions.map(sub => (
                <tr
                  key={sub.id}
                  onClick={() => handleOpenGradeDrawer(sub)}
                  className="hover:bg-slate-500/5 transition-colors cursor-pointer"
                  style={{ backgroundColor: 'var(--bg-main)' }}
                >
                  <td className="p-3.5 pl-4 font-bold text-xs" style={{ color: 'var(--text-main)' }}>
                    {sub.studentName}
                  </td>

                  <td className="p-3.5 font-medium opacity-80">{sub.className}</td>

                  <td className="p-3.5 font-semibold text-xs">{sub.labTitle}</td>

                  <td className="p-3.5 font-mono text-[11px] opacity-75">{sub.time}</td>

                  <td className="p-3.5">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        sub.status === 'COMPLETED'
                          ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                          : sub.status === 'IN_PROGRESS'
                          ? 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                          : 'bg-slate-500/10 text-slate-500 border-slate-500/20'
                      }`}
                    >
                      {sub.status === 'COMPLETED'
                        ? 'HOÀN THÀNH'
                        : sub.status === 'IN_PROGRESS'
                        ? 'ĐANG THỰC HIỆN'
                        : 'CHƯA NỘP'}
                    </span>
                  </td>

                  <td className="p-3.5 font-mono font-bold text-xs" style={{ color: 'var(--accent-primary)' }}>
                    {sub.score}
                  </td>

                  <td className="p-3.5 text-right pr-4 whitespace-nowrap">
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        handleOpenGradeDrawer(sub);
                      }}
                      className="px-3 py-1 text-xs font-semibold rounded-md border cursor-pointer"
                      style={{
                        borderColor: 'var(--border-color)',
                        backgroundColor: 'var(--bg-panel)',
                      }}
                    >
                      Xem & Chấm Điểm →
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="p-10 text-center opacity-60">
                  Không tìm thấy bài nộp nào phù hợp.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Slide-over Drawer for In-place Grading */}
      <GradeSubmissionDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        submission={selectedSubmission}
        onSaveGrade={handleSaveGrade}
      />
    </div>
  );
};
