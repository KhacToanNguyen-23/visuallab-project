import React, { useState, useEffect, useMemo } from 'react';
import type { Assignment, StudentAssignmentInstance, AssignmentSubmission } from '../../types/assignment';
import { assignmentService } from '../../services/assignmentService';
import { getDeadlineInfo } from '../../utils/deadlineUtils';
import { getWorksheetSchema, type LabWorksheetSchema } from '../../utils/worksheetSchemas';

interface FloatingAssignmentDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  assignment: Assignment | null;
  studentInstance: StudentAssignmentInstance | null;
  studentId: string;
  studentName: string;
  onSubmitted?: (submission: AssignmentSubmission) => void;
  onBackToAssignments?: () => void;
}

export const FloatingAssignmentDrawer: React.FC<FloatingAssignmentDrawerProps> = ({
  isOpen,
  onClose,
  assignment,
  studentInstance,
  studentId,
  studentName,
  onSubmitted,
  onBackToAssignments,
}) => {
  const [explanation, setExplanation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<AssignmentSubmission | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Identify worksheet schema for the active assignment lab
  const schema: LabWorksheetSchema = useMemo(() => {
    return getWorksheetSchema(assignment?.labType || assignment?.title);
  }, [assignment?.labType, assignment?.title]);

  // Read recorded & evaluated lab results from localStorage (only for matching lab)
  const [labGradeData, setLabGradeData] = useState<{ result: any; details: any } | null>(() => {
    try {
      if (schema.labId === 'sim-speed-measurement') {
        const saved = localStorage.getItem('edulab_speed_grade_result');
        if (saved) return JSON.parse(saved);
      } else if (schema.labId === 'sim-boyle-mariotte') {
        const saved = localStorage.getItem('edulab_boyle_grade_result');
        if (saved) return JSON.parse(saved);
      }
    } catch (_) {}
    return null;
  });

  // Re-check localStorage and submissions when drawer opens or assignment changes
  useEffect(() => {
    if (!isOpen || !assignment?.id) return;

    // Reset previous lab state
    if (schema.labId === 'sim-speed-measurement') {
      try {
        const saved = localStorage.getItem('edulab_speed_grade_result');
        if (saved) setLabGradeData(JSON.parse(saved));
        else setLabGradeData(null);
      } catch (_) {
        setLabGradeData(null);
      }
    } else if (schema.labId === 'sim-boyle-mariotte') {
      try {
        const saved = localStorage.getItem('edulab_boyle_grade_result');
        if (saved) setLabGradeData(JSON.parse(saved));
        else setLabGradeData(null);
      } catch (_) {
        setLabGradeData(null);
      }
    } else if (schema.labId === 'sim-latent-heat') {
      try {
        const saved = localStorage.getItem('edulab_latent_heat_grade_result');
        if (saved) setLabGradeData(JSON.parse(saved));
        else setLabGradeData(null);
      } catch (_) {
        setLabGradeData(null);
      }
    } else if (schema.labId === 'sim-induction') {
      try {
        const saved = localStorage.getItem('edulab_induction_grade_result');
        if (saved) setLabGradeData(JSON.parse(saved));
        else setLabGradeData(null);
      } catch (_) {
        setLabGradeData(null);
      }
    } else {
      setLabGradeData(null);
    }

    if (studentId) {
      assignmentService.getStudentSubmission(assignment.id, studentId)
        .then(sub => {
          if (sub) {
            setSubmissionResult(sub);
            if (sub.explanation) setExplanation(sub.explanation);
            try {
              const answers = JSON.parse(sub.submittedAnswersJson);
              const parsedGradeResult = answers.gradeResult || {
                totalScore: answers.totalScore ?? sub.totalScore,
                operationScore: answers.operationScore ?? 3,
                accuracyScore: answers.accuracyScore ?? 4,
                quizScore: answers.quizScore ?? 3,
                isPass: answers.isPass ?? (sub.totalScore >= 5.0),
                calculatedAvgV: answers.studentAvgV ?? answers.measuredResult ?? 0,
              };
              setLabGradeData({
                result: parsedGradeResult,
                details: answers,
              });
            } catch (_) {
              setLabGradeData({
                result: {
                  totalScore: sub.totalScore,
                  operationScore: 3,
                  accuracyScore: 4,
                  quizScore: 3,
                  isPass: sub.totalScore >= 5.0,
                  calculatedAvgV: 0,
                },
                details: {},
              });
            }
          } else {
            setSubmissionResult(null);
            setExplanation('');
          }
        })
        .catch(() => {
          setSubmissionResult(null);
        });
    }
  }, [isOpen, assignment?.id, schema.labId, studentId]);

  if (!isOpen || !assignment) return null;

  // Parse student parameters
  let studentParams: Record<string, any> = {};
  try {
    if (studentInstance?.generatedParamsJson) {
      studentParams = JSON.parse(studentInstance.generatedParamsJson);
    }
  } catch (_) {}

  const deadline = getDeadlineInfo(assignment.dueDate, assignment.createdAt);

  const labResult = labGradeData?.result;
  const labDetails = labGradeData?.details;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentInstance) {
      setErrorMessage('Không tìm thấy thông số bài tập cá nhân');
      return;
    }

    if (!labResult && !labDetails && !submissionResult) {
      setErrorMessage('Vui lòng thực hiện đo đạc và nhấn "Nộp Báo Cáo & Chấm Điểm" trên bảng thực hành trước khi xác nhận nộp bài.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const answersPayload = {
      labType: schema.labType,
      labId: schema.labId,
      rows: labDetails?.rows || [],
      measuredValue: labDetails?.studentAvgV || labResult?.calculatedAvgV || 0,
      measuredResult: labDetails?.studentAvgV || labResult?.calculatedAvgV || 0,
      studentAvgV: labDetails?.studentAvgV || labResult?.calculatedAvgV || 0,
      studentAvgT: labDetails?.studentAvgT,
      studentDeltaV: labDetails?.studentDeltaV,
      totalScore: labResult?.totalScore ?? submissionResult?.totalScore ?? 10,
      operationScore: labResult?.operationScore ?? 3,
      accuracyScore: labResult?.accuracyScore ?? 4,
      quizScore: labResult?.quizScore ?? 3,
      isPass: labResult?.isPass ?? (submissionResult ? submissionResult.totalScore >= 5.0 : true),
      gradeResult: labResult,
      ...studentParams,
    };

    try {
      const submission = await assignmentService.submitAssignment({
        instanceId: studentInstance.id,
        studentId,
        studentName,
        submittedAnswersJson: JSON.stringify(answersPayload),
        explanation: explanation || 'Học sinh hoàn thành bài thực hành trực tiếp trên mô phỏng thí nghiệm ảo.',
      });

      setSubmissionResult(submission);
      if (onSubmitted) {
        onSubmitted(submission);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Lỗi khi nộp bài. Vui lòng thử lại!');
    } finally {
      setIsSubmitting(false);
    }
  };

  const effectiveScore = labResult?.totalScore !== undefined
    ? Number(labResult.totalScore).toFixed(0)
    : (submissionResult?.totalScore !== undefined ? Number(submissionResult.totalScore).toFixed(0) : '10');
  const isPass = labResult?.isPass !== undefined
    ? labResult.isPass
    : (submissionResult?.totalScore !== undefined ? submissionResult.totalScore >= 5.0 : true);

  return (
    <div className="fixed inset-0 z-60 overflow-hidden font-sans">
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div
          className="w-screen max-w-xl border-l shadow-2xl flex flex-col transition-transform animate-in slide-in-from-right duration-250"
          style={{
            backgroundColor: 'var(--bg-panel)',
            borderColor: 'var(--border-color)',
            color: 'var(--text-main)',
          }}
        >
          {/* Header */}
          <div
            className="p-5 border-b flex items-center justify-between shrink-0"
            style={{ borderColor: 'var(--border-color)' }}
          >
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border"
                  style={{
                    backgroundColor: 'var(--bg-main)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--accent-primary)',
                  }}
                >
                  BÁO CÁO THỰC HÀNH SGK
                </span>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${deadline.bgBadgeClass}`}>
                  {deadline.timeRemainingText}
                </span>
              </div>
              <h3 className="text-base font-black tracking-tight mt-1 truncate max-w-md">
                {schema.title}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-slate-500/10 text-xs font-bold transition-colors cursor-pointer"
              title="Đóng bảng nộp bài"
            >
              ✕
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
            {/* Target Parameters Card */}
            <div
              className="p-4 rounded-xl border space-y-2.5"
              style={{
                backgroundColor: 'var(--bg-main)',
                borderColor: 'var(--border-color)',
              }}
            >
              <div className="font-bold flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span>Thông Số Đề Bài Cá Nhân Hóa</span>
                </span>
                <span className="text-[10px] opacity-60 font-mono">ID: {studentId}</span>
              </div>

              {Object.keys(studentParams).length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                  {Object.entries(studentParams).map(([key, val]) => (
                    <div
                      key={key}
                      className="p-2.5 rounded-lg border flex flex-col"
                      style={{
                        backgroundColor: 'var(--bg-panel)',
                        borderColor: 'var(--border-color)',
                      }}
                    >
                      <span className="text-[10px] opacity-60 uppercase font-semibold">{key}</span>
                      <span className="font-mono font-bold text-sm" style={{ color: 'var(--accent-primary)' }}>
                        {String(val)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[11px] opacity-70">Sử dụng thông số mặc định theo hướng dẫn của bài thực hành.</p>
              )}

              <div className="pt-2 border-t flex items-center justify-between text-[11px]" style={{ borderColor: 'var(--border-color)' }}>
                <span className="opacity-60">Công thức mục tiêu SGK:</span>
                <span className="font-mono font-bold text-cyan-500 text-xs">{schema.targetFormula}</span>
              </div>
            </div>

            {/* Error banner */}
            {errorMessage && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-500 font-semibold text-xs">
                {errorMessage}
              </div>
            )}

            {/* Evaluated Lab Results Section (No repetitive table) */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs flex items-center gap-1.5">
                  <span>Kết Quả Thực Hành Đã Thực Hiện</span>
                </span>
                {labResult && (
                  <span className="text-[10px] text-emerald-400 font-bold">
                    ✓ Đã đồng bộ từ mô phỏng
                  </span>
                )}
              </div>

              {labResult || submissionResult ? (
                <div
                  className="p-4 rounded-xl border space-y-3 animate-in fade-in"
                  style={{
                    backgroundColor: 'var(--bg-main)',
                    borderColor: '#10B981',
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-400 flex items-center gap-1.5 text-sm">
                      {isPass ? '✓ ĐẠT YÊU CẦU' : 'CẦN KIỂM TRA LẠI'}
                    </span>
                    <span className="text-2xl font-black text-emerald-400 font-mono">
                      {effectiveScore}/10
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div
                      className="p-2 rounded-lg border text-center"
                      style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)' }}
                    >
                      <span className="text-[10px] opacity-60 block">Thao tác</span>
                      <span className="font-mono font-bold text-xs text-cyan-400">
                        {labResult?.operationScore ?? 3}/3
                      </span>
                    </div>
                    <div
                      className="p-2 rounded-lg border text-center"
                      style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)' }}
                    >
                      <span className="text-[10px] opacity-60 block">Sai số</span>
                      <span className="font-mono font-bold text-xs text-emerald-400">
                        {labResult?.accuracyScore ?? 4}/4
                      </span>
                    </div>
                    <div
                      className="p-2 rounded-lg border text-center"
                      style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)' }}
                    >
                      <span className="text-[10px] opacity-60 block">Trắc nghiệm</span>
                      <span className="font-mono font-bold text-xs text-purple-400">
                        {labResult?.quizScore ?? 3}/3
                      </span>
                    </div>
                  </div>

                  {labDetails && (
                    <div
                      className="pt-2 border-t flex items-center justify-between text-[11px] font-mono opacity-80"
                      style={{ borderColor: 'var(--border-color)' }}
                    >
                      <span>Vận tốc v_tb: <strong className="text-white">{labDetails.studentAvgV ?? labResult?.calculatedAvgV} m/s</strong></span>
                      {labDetails.studentDeltaV && (
                        <span>Sai số Δv: <strong className="text-white">±{labDetails.studentDeltaV} m/s</strong></span>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div
                  className="p-4 rounded-xl border text-center space-y-2 opacity-80"
                  style={{
                    backgroundColor: 'var(--bg-main)',
                    borderColor: 'var(--border-color)',
                  }}
                >
                  <p className="font-bold text-amber-400 text-xs">Chưa có kết quả thực hành</p>
                  <p className="text-[11px] leading-relaxed">
                    Bạn hãy thực hiện các thao tác đo đạc, tính sai số và bấm <strong>"Nộp Báo Cáo & Chấm Điểm"</strong> trực tiếp trên bảng thực hành ảo. Kết quả sẽ tự động hiển thị tại đây.
                  </p>
                </div>
              )}
            </div>

            {/* Submission Form */}
            <form onSubmit={handleSubmit} className="space-y-3 pt-2">
              <div className="space-y-1.5">
                <label className="font-bold opacity-80 block text-[11px]">
                  Ghi chú / Nhận xét thêm của học sinh (Tùy chọn)
                </label>
                <textarea
                  rows={3}
                  value={explanation}
                  onChange={e => setExplanation(e.target.value)}
                  placeholder="Ghi chú thêm về điều kiện thực hành, quan sát hiện tượng hoặc nhận xét kết quả..."
                  disabled={isSubmitting}
                  className="w-full p-2.5 rounded-lg border text-xs focus:outline-none focus:border-cyan-500 leading-relaxed"
                  style={{
                    backgroundColor: 'var(--bg-main)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-main)',
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || (!labResult && !submissionResult)}
                className="w-full py-3 rounded-xl text-xs font-black text-slate-950 bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed uppercase tracking-wider active:scale-98"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>Đang nộp bài...</span>
                  </>
                ) : submissionResult ? (
                  <span>Cập Nhật & Xác Nhận Nộp Lại</span>
                ) : (
                  <span>Xác Nhận Nộp Bài Cho Giáo Viên</span>
                )}
              </button>

              {submissionResult && (
                <p className="text-center text-[10px] text-emerald-400 font-bold">
                  ✓ Đã lưu bài nộp trên hệ thống lớp học lúc {new Date(submissionResult.submittedAt || Date.now()).toLocaleTimeString('vi-VN')}
                </p>
              )}
            </form>
          </div>

          {/* Footer */}
          <div
            className="p-4 border-t flex items-center justify-between shrink-0"
            style={{ borderColor: 'var(--border-color)' }}
          >
            {onBackToAssignments && (
              <button
                type="button"
                onClick={onBackToAssignments}
                className="px-3.5 py-2 rounded-lg text-xs font-semibold hover:underline cursor-pointer opacity-80 hover:opacity-100"
                style={{ color: 'var(--accent-primary)' }}
              >
                ← Về Danh Sách Bài Tập
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold border hover:bg-slate-500/10 transition-colors cursor-pointer ml-auto"
              style={{
                borderColor: 'var(--border-color)',
                backgroundColor: 'var(--bg-panel)',
              }}
            >
              Thu Gọn
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
