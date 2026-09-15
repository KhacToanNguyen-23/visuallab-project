import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { classService } from '../../services/classService';
import { assignmentService } from '../../services/assignmentService';
import { getLabRoute } from '../../utils/labRoutes';
import type { ClassEnrollment } from '../../types/class';
import type { Assignment } from '../../types/assignment';

interface ClassRosterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  classItem: {
    id: string;
    name: string;
    code: string;
    gradeLevel?: string;
  } | null;
  initialTab?: 'students' | 'assignments';
  onCopyInviteLink?: (code: string) => void;
  onCopyCode?: (code: string) => void;
  onAssignmentDeleted?: () => void;
}

export const ClassRosterDrawer: React.FC<ClassRosterDrawerProps> = ({
  isOpen,
  onClose,
  classItem,
  initialTab = 'students',
  onCopyInviteLink,
  onCopyCode,
  onAssignmentDeleted,
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'students' | 'assignments'>('students');
  const [roster, setRoster] = useState<ClassEnrollment[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);
  const [assignmentToDelete, setAssignmentToDelete] = useState<{ id: string; title: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirmDelete = async () => {
    if (!assignmentToDelete) return;
    setIsDeleting(true);
    try {
      await assignmentService.deleteAssignment(assignmentToDelete.id);
      setAssignments(prev => prev.filter(a => a.id !== assignmentToDelete.id && a.title !== assignmentToDelete.title));
      if (onAssignmentDeleted) {
        onAssignmentDeleted();
      }
      setAssignmentToDelete(null);
    } catch (err) {
      console.error('Lỗi khi xóa bài tập:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab, isOpen]);

  useEffect(() => {
    if (isOpen && classItem?.id) {
      setLoading(true);
      Promise.all([
        classService.getClassRoster(classItem.id),
        assignmentService.getAssignmentsByClass(classItem.id),
      ])
        .then(([rosterData, assignmentData]) => {
          setRoster(rosterData || []);
          const rawAsgs = assignmentData || [];
          const dedupedAsgs = Array.from(
            new Map(rawAsgs.map(a => [(a.labType && a.labType.trim()) || a.title, a])).values()
          );
          setAssignments(dedupedAsgs);
        })
        .catch(err => {
          console.error('Lỗi khi tải thông tin lớp học:', err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isOpen, classItem?.id]);

  if (!isOpen || !classItem) return null;

  const handleCopyCodeLocal = () => {
    if (onCopyCode) {
      onCopyCode(classItem.code);
    } else {
      navigator.clipboard?.writeText(classItem.code);
    }
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const filteredRoster = roster.filter(
    s =>
      !search ||
      s.studentName?.toLowerCase().includes(search.toLowerCase()) ||
      s.studentEmail?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredAssignments = assignments.filter(
    a =>
      !search ||
      a.title?.toLowerCase().includes(search.toLowerCase()) ||
      a.description?.toLowerCase().includes(search.toLowerCase())
  );

  const getInitials = (name: string) => {
    if (!name) return 'HS';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const getResolvedFormula = (asg: Assignment) => {
    const type = (asg.labType || '').toUpperCase();
    const title = (asg.title || '').toLowerCase();

    if (type.includes('OHM') || title.includes('ohm') || title.includes('mạch điện')) {
      return 'I = U / R';
    }
    if (type.includes('EMF') || title.includes('suất điện động') || title.includes('điện trở trong')) {
      return 'U = E - I * r';
    }
    if (type.includes('SPRING') || title.includes('lò xo') || title.includes('hooke')) {
      return 'F = k * delta_l';
    }
    if (type.includes('FREE_FALL') || title.includes('rơi tự do')) {
      return 'g = 2 * s / (t * t)';
    }
    if (type.includes('SPEED') || title.includes('tốc độ')) {
      return 'v = s / t';
    }
    if (type.includes('FRICTION') || title.includes('ma sát')) {
      return 'mu = F / (m * g)';
    }
    if (type.includes('MOMENTUM') || title.includes('động lượng') || title.includes('va chạm')) {
      return 'p = m1 * v1 + m2 * v2';
    }
    if (type.includes('SOUND') || type.includes('RESONANCE') || title.includes('cộng hưởng') || title.includes('truyền âm')) {
      return 'v = 4 * (L2 - L1) * f';
    }
    if (type.includes('INTERFERENCE') || title.includes('giao thoa') || title.includes('khe y-âng') || title.includes('bước sóng')) {
      return 'lambda = (a * i) / D';
    }
    if (type.includes('SPECIFIC_HEAT') || title.includes('nhiệt dung riêng')) {
      return 'c = (P * t) / (m * delta_T)';
    }
    if (type.includes('LATENT_HEAT') || title.includes('nóng chảy')) {
      return 'lambda = (P * t) / m';
    }
    if (type.includes('BOYLE') || title.includes('đẳng nhiệt') || title.includes('khí lý tưởng')) {
      return 'p * V = const';
    }
    if (type.includes('INDUCTION') || title.includes('cảm ứng điện từ')) {
      return 'e_c = - delta_Phi / delta_t';
    }
    if (type.includes('REFRACTION') || title.includes('khúc xạ')) {
      return 'n = sin(i) / sin(r)';
    }
    return asg.targetFormula || 'T = 2 * PI * sqrt(l / g)';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div
          className="w-screen max-w-lg border-l shadow-2xl flex flex-col transition-transform animate-in slide-in-from-right duration-250"
          style={{
            backgroundColor: 'var(--bg-panel)',
            borderColor: 'var(--border-color)',
            color: 'var(--text-main)',
          }}
        >
          {/* Header */}
          <div
            className="p-6 border-b flex items-center justify-between shrink-0"
            style={{ borderColor: 'var(--border-color)' }}
          >
            <div>
              <div className="flex items-center gap-2">
                <span
                  className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border"
                  style={{
                    backgroundColor: 'var(--bg-main)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--accent-primary)',
                  }}
                >
                  CHI TIẾT LỚP HỌC
                </span>
                <span className="text-xs opacity-60 font-medium">
                  {classItem.gradeLevel || 'Vật lý'}
                </span>
              </div>
              <h3 className="text-lg font-black tracking-tight mt-1">
                Lớp {classItem.name}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-slate-500/10 text-xs font-bold transition-colors cursor-pointer"
              title="Đóng"
            >
              ✕
            </button>
          </div>

          {/* Class Code & Quick Actions Info Bar */}
          <div
            className="px-6 py-3 border-b flex items-center justify-between gap-3 text-xs"
            style={{
              backgroundColor: 'var(--bg-main)',
              borderColor: 'var(--border-color)',
            }}
          >
            <div className="flex items-center gap-2">
              <span className="opacity-70">Mã tham gia:</span>
              <button
                type="button"
                onClick={handleCopyCodeLocal}
                title="Nhấp để sao chép mã"
                className="inline-flex items-center gap-1 font-mono font-bold px-2 py-0.5 rounded border cursor-pointer hover:opacity-80 active:scale-95 transition-all text-xs"
                style={{
                  backgroundColor: 'var(--bg-panel)',
                  borderColor: copiedCode ? '#10b981' : 'var(--border-color)',
                  color: copiedCode ? '#10b981' : 'var(--accent-primary)',
                }}
              >
                <span>{classItem.code}</span>
                {copiedCode ? (
                  <svg className="w-3 h-3 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-3 h-3 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
              </button>
            </div>

            {onCopyInviteLink && (
              <button
                type="button"
                onClick={() => onCopyInviteLink(classItem.code)}
                className="text-[11px] font-semibold hover:underline cursor-pointer"
                style={{ color: 'var(--accent-primary)' }}
              >
                Sao Chép Link Mời
              </button>
            )}
          </div>

          {/* Navigation Tabs (Học Sinh vs Bài Thực Hành) */}
          <div
            className="flex border-b text-xs font-semibold"
            style={{
              borderColor: 'var(--border-color)',
              backgroundColor: 'var(--bg-panel)',
            }}
          >
            <button
              type="button"
              onClick={() => {
                setActiveTab('students');
                setSearch('');
              }}
              className={`flex-1 py-3 px-4 text-center border-b-2 transition-all cursor-pointer flex items-center justify-center gap-2 ${
                activeTab === 'students'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-bold bg-blue-500/5'
                  : 'border-transparent opacity-70 hover:opacity-100 hover:bg-slate-500/5'
              }`}
            >
              <span>👥 Danh Sách Học Sinh</span>
              <span
                className="text-[10px] px-1.5 py-0.2 rounded-full font-bold"
                style={{
                  backgroundColor: activeTab === 'students' ? 'var(--accent-primary)' : 'var(--bg-main)',
                  color: activeTab === 'students' ? '#ffffff' : 'inherit',
                }}
              >
                {roster.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('assignments');
                setSearch('');
              }}
              className={`flex-1 py-3 px-4 text-center border-b-2 transition-all cursor-pointer flex items-center justify-center gap-2 ${
                activeTab === 'assignments'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-bold bg-blue-500/5'
                  : 'border-transparent opacity-70 hover:opacity-100 hover:bg-slate-500/5'
              }`}
            >
              <span>📝 Bài Thực Hành Đã Giao</span>
              <span
                className="text-[10px] px-1.5 py-0.2 rounded-full font-bold"
                style={{
                  backgroundColor: activeTab === 'assignments' ? 'var(--accent-primary)' : 'var(--bg-main)',
                  color: activeTab === 'assignments' ? '#ffffff' : 'inherit',
                }}
              >
                {assignments.length}
              </span>
            </button>
          </div>

          {/* Search & Stats Bar */}
          <div className="p-4 border-b space-y-3" style={{ borderColor: 'var(--border-color)' }}>
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold opacity-75">
                {activeTab === 'students' ? (
                  <>Sĩ số lớp: <strong className="text-blue-600 dark:text-blue-400">{roster.length}</strong> học sinh</>
                ) : (
                  <>Tổng số bài đã giao: <strong className="text-blue-600 dark:text-blue-400">{assignments.length}</strong> bài</>
                )}
              </span>
              {search && (
                <span className="text-[11px] opacity-60">
                  Tìm thấy {activeTab === 'students' ? filteredRoster.length : filteredAssignments.length} kết quả
                </span>
              )}
            </div>

            <div
              className="flex items-center gap-2 px-3 py-2 rounded-lg border text-xs"
              style={{
                backgroundColor: 'var(--bg-main)',
                borderColor: 'var(--border-color)',
              }}
            >
              <svg className="w-4 h-4 opacity-50 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={
                  activeTab === 'students'
                    ? 'Tìm học sinh theo tên hoặc email...'
                    : 'Tìm bài thực hành theo tiêu đề, mô tả...'
                }
                className="w-full bg-transparent focus:outline-none text-xs"
                style={{ color: 'var(--text-main)' }}
              />
              {search && (
                <button onClick={() => setSearch('')} className="text-xs opacity-50 hover:opacity-100">
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3 opacity-60">
                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-xs font-medium">Đang tải dữ liệu lớp học...</span>
              </div>
            ) : activeTab === 'students' ? (
              /* TAB 1: DANH SÁCH HỌC SINH */
              filteredRoster.length === 0 ? (
                <div className="text-center py-16 px-4 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-slate-500/10 flex items-center justify-center mx-auto text-xl">
                    👥
                  </div>
                  <div>
                    <p className="text-xs font-bold" style={{ color: 'var(--text-main)' }}>
                      {search ? 'Không tìm thấy học sinh phù hợp' : 'Chưa có học sinh tham gia'}
                    </p>
                    <p className="text-[11px] opacity-60 mt-1 max-w-xs mx-auto">
                      {search
                        ? 'Thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc.'
                        : 'Chia sẻ Mã tham gia hoặc Link mời để học sinh vào lớp học thực hành.'}
                    </p>
                  </div>
                  {!search && onCopyInviteLink && (
                    <button
                      type="button"
                      onClick={() => onCopyInviteLink(classItem.code)}
                      className="px-3.5 py-2 rounded-lg text-xs font-semibold text-white shadow-xs hover:opacity-90 transition-opacity cursor-pointer inline-flex items-center gap-1.5"
                      style={{ backgroundColor: 'var(--accent-primary)' }}
                    >
                      <span>Sao Chép Link Mời Học Sinh</span>
                    </button>
                  )}
                </div>
              ) : (
                filteredRoster.map((student, idx) => (
                  <div
                    key={student.id || student.studentId || idx}
                    className="p-3 rounded-xl border flex items-center justify-between gap-3 transition-colors hover:bg-slate-500/5"
                    style={{
                      backgroundColor: 'var(--bg-main)',
                      borderColor: 'var(--border-color)',
                    }}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-xs"
                        style={{
                          backgroundColor: `hsl(${(idx * 67) % 360}, 65%, 48%)`,
                        }}
                      >
                        {getInitials(student.studentName)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold truncate" style={{ color: 'var(--text-main)' }}>
                            {student.studentName || 'Học sinh'}
                          </span>
                        </div>
                        <p className="text-[11px] opacity-60 truncate">
                          {student.studentEmail || `ID: ${student.studentId}`}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        Đã tham gia
                      </span>
                      {student.enrolledAt && (
                        <p className="text-[10px] opacity-50 mt-0.5 font-mono">
                          {new Date(student.enrolledAt).toLocaleDateString('vi-VN')}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              )
            ) : (
              /* TAB 2: BÀI THỰC HÀNH ĐÃ GIAO */
              filteredAssignments.length === 0 ? (
                <div className="text-center py-16 px-4 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-slate-500/10 flex items-center justify-center mx-auto text-xl">
                    📝
                  </div>
                  <div>
                    <p className="text-xs font-bold" style={{ color: 'var(--text-main)' }}>
                      {search ? 'Không tìm thấy bài thực hành phù hợp' : 'Chưa có bài thực hành nào được giao'}
                    </p>
                    <p className="text-[11px] opacity-60 mt-1 max-w-xs mx-auto">
                      {search
                        ? 'Thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc.'
                        : 'Giáo viên có thể giao bài tập mô phỏng phòng lab cho lớp học này.'}
                    </p>
                  </div>
                  {!search && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        navigate('/teacher/assign', {
                          state: { selectedClassId: classItem.id },
                        });
                      }}
                      className="px-3.5 py-2 rounded-lg text-xs font-semibold text-white shadow-xs hover:opacity-90 transition-opacity cursor-pointer inline-flex items-center gap-1.5"
                      style={{ backgroundColor: 'var(--accent-primary)' }}
                    >
                      <span>+ Giao Bài Thực Hành Mới</span>
                    </button>
                  )}
                </div>
              ) : (
                filteredAssignments.map((asg, idx) => {
                  const labRoute = getLabRoute(asg.labType || asg.id, asg.title);
                  return (
                    <div
                      key={asg.id || idx}
                      className="p-4 rounded-xl border space-y-3 transition-all hover:shadow-xs"
                      style={{
                        backgroundColor: 'var(--bg-main)',
                        borderColor: 'var(--border-color)',
                      }}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className="text-[10px] font-bold px-2 py-0.5 rounded border"
                              style={{
                                backgroundColor: 'var(--bg-panel)',
                                borderColor: 'var(--border-color)',
                                color: 'var(--accent-primary)',
                              }}
                            >
                              {asg.labType || 'VẬT LÝ'}
                            </span>
                            <h4 className="text-xs font-bold leading-snug" style={{ color: 'var(--text-main)' }}>
                              {asg.title}
                            </h4>
                          </div>
                          {asg.description && (
                            <p className="text-[11px] opacity-75 line-clamp-2 leading-relaxed">
                              {asg.description}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Details specs */}
                      <div
                        className="p-2.5 rounded-lg border text-[11px] space-y-1"
                        style={{
                          backgroundColor: 'var(--bg-panel)',
                          borderColor: 'var(--border-color)',
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <span className="opacity-60">Công thức mục tiêu:</span>
                          <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                            {getResolvedFormula(asg)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="opacity-60">Sai số chấm tự động:</span>
                          <span className="font-mono font-semibold">
                            ±{asg.tolerancePercent || 3}%
                          </span>
                        </div>
                        {asg.createdAt && (
                          <div className="flex items-center justify-between">
                            <span className="opacity-60">Ngày giao bài:</span>
                            <span className="font-mono opacity-80">
                              {new Date(asg.createdAt).toLocaleString('vi-VN', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-1 gap-2 flex-wrap">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              onClose();
                              navigate(labRoute);
                            }}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold text-white transition-opacity hover:opacity-90 cursor-pointer inline-flex items-center gap-1.5 shadow-xs"
                            style={{ backgroundColor: 'var(--accent-primary)' }}
                            title="Mở và trải nghiệm mô phỏng phòng thí nghiệm"
                          >
                            <span>🧪 Mở Thí Nghiệm</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              onClose();
                              navigate('/teacher/grading');
                            }}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold border hover:bg-slate-500/10 transition-colors cursor-pointer inline-flex items-center gap-1.5"
                            style={{
                              borderColor: 'var(--border-color)',
                              backgroundColor: 'var(--bg-panel)',
                            }}
                          >
                            <span>📊 Xem Sổ Điểm →</span>
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => setAssignmentToDelete({ id: asg.id, title: asg.title })}
                          className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer inline-flex items-center gap-1 border border-rose-500/20"
                          title="Xóa bài thực hành khỏi lớp học"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          <span>Xóa</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )
            )}
          </div>

          {/* Drawer Footer */}
          <div
            className="p-4 border-t flex items-center justify-between shrink-0"
            style={{ borderColor: 'var(--border-color)' }}
          >
            <div className="flex items-center gap-2">
              <span className="text-[11px] opacity-60">
                Mã lớp: <strong className="font-mono">{classItem.code}</strong>
              </span>
              {activeTab === 'assignments' && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    navigate('/teacher/assign', {
                      state: { selectedClassId: classItem.id },
                    });
                  }}
                  className="text-xs font-semibold hover:underline cursor-pointer ml-2"
                  style={{ color: 'var(--accent-primary)' }}
                >
                  + Giao Thêm Bài
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold border hover:bg-slate-500/10 transition-colors cursor-pointer"
              style={{
                borderColor: 'var(--border-color)',
                backgroundColor: 'var(--bg-panel)',
              }}
            >
              Đóng
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Popup Modal */}
      {assignmentToDelete && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-150"
            onClick={() => !isDeleting && setAssignmentToDelete(null)}
          />
          <div
            className="relative w-full max-w-md p-6 rounded-2xl shadow-2xl border z-10 space-y-4 transition-all animate-in zoom-in-95 duration-150"
            style={{
              backgroundColor: 'var(--bg-panel)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-main)',
            }}
          >
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0 border border-rose-500/20">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </div>
              <div className="space-y-1 min-w-0 flex-1">
                <h3 className="text-sm font-bold leading-tight">
                  Xác nhận xóa bài thực hành?
                </h3>
                <p className="text-xs opacity-70 leading-relaxed">
                  Bạn có chắc chắn muốn xóa bài thực hành{' '}
                  <strong className="text-rose-500 dark:text-rose-400 font-semibold">
                    "{assignmentToDelete.title}"
                  </strong>{' '}
                  khỏi lớp học <strong className="font-semibold">{classItem.name}</strong> không?
                </p>
              </div>
            </div>

            <div
              className="p-3 rounded-lg border text-[11px] opacity-75"
              style={{
                backgroundColor: 'var(--bg-main)',
                borderColor: 'var(--border-color)',
              }}
            >
              ⚠️ Lưu ý: Sau khi xóa, học sinh trong lớp sẽ không thể nộp báo cáo thực hành cho bài này nữa.
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setAssignmentToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold border hover:bg-slate-500/10 transition-colors cursor-pointer disabled:opacity-50"
                style={{
                  borderColor: 'var(--border-color)',
                  backgroundColor: 'var(--bg-main)',
                }}
              >
                Hủy
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition-colors cursor-pointer disabled:opacity-50 inline-flex items-center gap-1.5 shadow-xs"
              >
                {isDeleting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Đang xóa...</span>
                  </>
                ) : (
                  <span>Xác nhận xóa</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
