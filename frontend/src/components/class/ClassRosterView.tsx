import React, { useEffect, useState } from 'react';
import { classService } from '../../services/classService';
import { assignmentService } from '../../services/assignmentService';
import type { ClassEnrollment } from '../../types/class';
import type { Assignment, AssignmentSubmission, AiFeedback } from '../../types/assignment';

interface ClassRosterViewProps {
  classId: string;
  classNameTitle: string;
  onClose: () => void;
}

export const ClassRosterView: React.FC<ClassRosterViewProps> = ({ classId, classNameTitle, onClose }) => {
  const [roster, setRoster] = useState<ClassEnrollment[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(null);
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<AssignmentSubmission | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [classId]);

  const loadData = async () => {
    setLoading(true);
    const [rosterData, assignmentData] = await Promise.all([
      classService.getClassRoster(classId),
      assignmentService.getAssignmentsByClass(classId)
    ]);
    setRoster(rosterData);
    setAssignments(assignmentData);

    if (assignmentData.length > 0) {
      setSelectedAssignmentId(assignmentData[0].id);
      loadSubmissions(assignmentData[0].id);
    } else {
      setLoading(false);
    }
  };

  const loadSubmissions = async (assignmentId: string) => {
    setSelectedAssignmentId(assignmentId);
    const subs = await assignmentService.getSubmissionsByAssignment(assignmentId);
    setSubmissions(subs);
    setLoading(false);
  };

  const parseAiFeedback = (jsonStr: string): AiFeedback | null => {
    try {
      return JSON.parse(jsonStr);
    } catch {
      return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-5xl h-[85vh] flex flex-col text-white shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-950/50">
          <div>
            <h2 className="text-xl font-bold text-emerald-400">📊 Bảng Điểm & Danh Sách Học Sinh: {classNameTitle}</h2>
            <p className="text-xs text-slate-400">Tổng số học sinh: {roster.length} | Bài tập đã giao: {assignments.length}</p>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-semibold transition-colors"
          >
            ✕ Đóng
          </button>
        </div>

        {/* Assignment Selector Tabs */}
        {assignments.length > 0 && (
          <div className="px-5 py-3 border-b border-slate-800 flex gap-2 overflow-x-auto bg-slate-900/50">
            {assignments.map(asg => (
              <button
                key={asg.id}
                onClick={() => loadSubmissions(asg.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedAssignmentId === asg.id
                    ? 'bg-cyan-600 text-white shadow-md shadow-cyan-900/30'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                }`}
              >
                📝 {asg.title}
              </button>
            ))}
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Student Roster & Scores Table */}
          <div className="flex-1 p-5 overflow-y-auto">
            {loading ? (
              <div className="text-center py-12 text-slate-400">Đang tải bảng điểm...</div>
            ) : roster.length === 0 ? (
              <div className="text-center py-12 text-slate-500">Chưa có học sinh nào tham gia lớp học này bằng Class Code.</div>
            ) : (
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-400 bg-slate-950/40">
                    <th className="py-3 px-4">Học Sinh</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Trạng Thái</th>
                    <th className="py-3 px-4">Điểm Toán</th>
                    <th className="py-3 px-4">Điểm AI</th>
                    <th className="py-3 px-4">Tổng Điểm</th>
                    <th className="py-3 px-4">Hành Động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {roster.map(student => {
                    const sub = submissions.find(s => s.studentId === student.studentId);
                    return (
                      <tr key={student.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-4 font-semibold text-slate-200">{student.studentName || 'Học sinh'}</td>
                        <td className="py-3 px-4 text-xs text-slate-400">{student.studentEmail || 'N/A'}</td>
                        <td className="py-3 px-4">
                          {sub ? (
                            <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-xs font-semibold">
                              ✓ Đã chấm
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 bg-slate-800 text-slate-500 rounded-full text-xs font-semibold">
                              Chưa nộp
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-cyan-400">
                          {sub ? `${sub.mathScore}đ` : '-'}
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-indigo-400">
                          {sub ? `${sub.aiReasoningScore}đ` : '-'}
                        </td>
                        <td className="py-3 px-4 font-mono text-base font-extrabold text-emerald-400">
                          {sub ? `${sub.totalScore}/100` : '-'}
                        </td>
                        <td className="py-3 px-4">
                          {sub && (
                            <button
                              onClick={() => setSelectedSubmission(sub)}
                              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-cyan-300 rounded-lg border border-slate-700 transition-colors"
                            >
                              🔍 Xem chi tiết AI
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* Submission Inspection Sidebar */}
          {selectedSubmission && (
            <div className="w-96 border-l border-slate-800 p-5 bg-slate-950 overflow-y-auto space-y-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <h3 className="font-bold text-emerald-400">🤖 Chi Tiết AI Chấm Bài</h3>
                <button onClick={() => setSelectedSubmission(null)} className="text-slate-500 hover:text-white">✕</button>
              </div>

              <div>
                <p className="text-xs text-slate-400 uppercase font-semibold">Học sinh</p>
                <p className="font-semibold text-slate-200">{selectedSubmission.studentName}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 bg-slate-900 p-3 rounded-xl border border-slate-800 text-center">
                <div>
                  <p className="text-xs text-slate-400">Độ chính xác Toán</p>
                  <p className="text-lg font-bold text-cyan-400">{selectedSubmission.mathScore}%</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Lập luận Groq AI</p>
                  <p className="text-lg font-bold text-indigo-400">{selectedSubmission.aiReasoningScore}%</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-slate-400 uppercase font-semibold mb-1">Lời giải của học sinh</p>
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 whitespace-pre-wrap">
                  {selectedSubmission.explanation || '(Học sinh không điền phần tự luận)'}
                </div>
              </div>

              {(() => {
                const feedback = parseAiFeedback(selectedSubmission.aiFeedbackJson);
                if (!feedback) return null;
                return (
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-slate-400 uppercase font-semibold mb-1">Nhận xét sư phạm từ Groq AI</p>
                      <div className="bg-emerald-950/40 border border-emerald-800/40 p-3 rounded-xl text-xs text-emerald-200 leading-relaxed">
                        {feedback.pedagogicalFeedback}
                      </div>
                    </div>

                    {feedback.suggestions && (
                      <div>
                        <p className="text-xs text-slate-400 uppercase font-semibold mb-1">Gợi ý cải thiện</p>
                        <div className="bg-cyan-950/40 border border-cyan-800/40 p-3 rounded-xl text-xs text-cyan-200 leading-relaxed">
                          {feedback.suggestions}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
