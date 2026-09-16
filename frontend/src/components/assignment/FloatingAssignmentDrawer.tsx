import React, { useState, useEffect, useMemo } from 'react';
import type { Assignment, StudentAssignmentInstance, AssignmentSubmission, AiFeedback } from '../../types/assignment';
import { assignmentService } from '../../services/assignmentService';
import { getDeadlineInfo } from '../../utils/deadlineUtils';
import { getWorksheetSchema, type LabWorksheetSchema } from '../../utils/worksheetSchemas';
import { telemetryStore } from '../../services/telemetryStore';

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
  const [autoSyncSuccess, setAutoSyncSuccess] = useState<boolean>(false);

  // Identify worksheet schema for the active assignment lab
  const schema: LabWorksheetSchema = useMemo(() => {
    return getWorksheetSchema(assignment?.labType || assignment?.title);
  }, [assignment?.labType, assignment?.title]);

  // Table rows state
  const [rows, setRows] = useState<Record<string, number | string>[]>(() => {
    return Array.from({ length: schema.defaultRowsCount }, (_, i) => ({
      trial: i + 1,
    }));
  });

  // Re-initialize rows when schema changes
  useEffect(() => {
    if (schema) {
      setRows(
        Array.from({ length: schema.defaultRowsCount }, (_, i) => ({
          trial: i + 1,
        }))
      );
    }
  }, [schema]);

  // Check if student already submitted
  useEffect(() => {
    if (isOpen && assignment?.id && studentId) {
      assignmentService.getStudentSubmission(assignment.id, studentId)
        .then(sub => {
          if (sub) {
            setSubmissionResult(sub);
            try {
              const answers = JSON.parse(sub.submittedAnswersJson);
              if (answers.rows && Array.isArray(answers.rows)) {
                setRows(answers.rows);
              }
            } catch (_) {}
            if (sub.explanation) setExplanation(sub.explanation);
          }
        })
        .catch(() => {});
    }
  }, [isOpen, assignment?.id, studentId]);

  if (!isOpen || !assignment) return null;

  // Parse student parameters
  let studentParams: Record<string, any> = {};
  try {
    if (studentInstance?.generatedParamsJson) {
      studentParams = JSON.parse(studentInstance.generatedParamsJson);
    }
  } catch (_) {}

  const deadline = getDeadlineInfo(assignment.dueDate, assignment.createdAt);

  // Handle cell change
  const handleCellChange = (rowIndex: number, colId: string, val: string) => {
    const numVal = val === '' ? '' : parseFloat(val);
    const updated = [...rows];
    updated[rowIndex] = {
      ...updated[rowIndex],
      [colId]: isNaN(numVal as number) ? val : numVal,
    };

    // Auto calculate row values if applicable
    autoCalculateRow(updated[rowIndex], schema);
    setRows(updated);
  };

  // Helper to calculate row columns
  const autoCalculateRow = (row: Record<string, any>, currentSchema: LabWorksheetSchema) => {
    if (currentSchema.labId === 'sim-speed-measurement') {
      const dist = Number(row.distance) || 0;
      const time = Number(row.time) || 0;
      if (time > 0 && dist > 0) {
        row.speed = Math.round((dist / time) * 1000) / 1000;
      }
    } else if (currentSchema.labId === 'sim-free-fall') {
      const t = Number(row.time) || Number(row.t1) || 0;
      const h = Number(row.height) || Number(studentParams.height) || 1.0;
      if (t > 0) {
        row.g = Math.round((2 * h / (t * t)) * 100) / 100;
      }
    } else if (currentSchema.labId === 'sim-friction-coefficient') {
      const m = Number(row.mass) || Number(studentParams.mass) || 0.2;
      row.normalForce = Math.round(m * 9.8 * 100) / 100;
      const f = Number(row.frictionForce) || Number(row.f1) || 0;
      if (f > 0 && row.normalForce > 0) {
        row.mu = Math.round((f / row.normalForce) * 1000) / 1000;
      }
    } else if (currentSchema.labId === 'sim-hooke-law') {
      const m = Number(row.mass) || 0.1;
      row.force = Math.round(m * 9.8 * 100) / 100;
      const l0 = Number(row.l0) || 10;
      const l = Number(row.l) || 0;
      if (l > l0) {
        row.deltaL = Math.round((l - l0) * 10) / 10;
        const deltaLMeters = row.deltaL / 100;
        if (deltaLMeters > 0) {
          row.k = Math.round((row.force / deltaLMeters) * 10) / 10;
        }
      }
    } else if (currentSchema.labId === 'sim-simple-pendulum') {
      const l = Number(row.length) || Number(studentParams.length) || 1.0;
      const t10 = Number(row.t10) || 0;
      if (t10 > 0) {
        row.period = Math.round((t10 / 10) * 1000) / 1000;
        if (row.period > 0) {
          row.g = Math.round((4 * Math.PI * Math.PI * l / (row.period * row.period)) * 100) / 100;
        }
      }
    }
  };

  // 1-Click Auto-sync from workbench telemetry
  const handleAutoSync = () => {
    let recordedTrials: any[] = telemetryStore.getTrials(schema.labId).map(t => t.data);

    // Also check localStorage for persisted lab trials (from speed lab or generic labs)
    if (recordedTrials.length === 0) {
      try {
        const raw = localStorage.getItem('edulab_speed_trials_raw');
        if (raw) {
          const parsedRaw = JSON.parse(raw);
          if (Array.isArray(parsedRaw)) {
            const valid = parsedRaw
              .filter((r: any) => r.timeSec && parseFloat(String(r.timeSec).replace(',', '.')) > 0)
              .map((r: any) => {
                const t = parseFloat(String(r.timeSec).replace(',', '.'));
                const distM = (r.distCm ? Number(r.distCm) : 40.0) / 100;
                return {
                  distance: distM,
                  angle: r.angleDeg,
                  time: t,
                  timeSec: t,
                  speed: t > 0 ? Math.round((distM / t) * 1000) / 1000 : 0,
                };
              });
            if (valid.length > 0) recordedTrials = valid;
          }
        }
      } catch (_) {}
    }

    if (recordedTrials.length === 0) {
      try {
        const localSaved = localStorage.getItem('edulab_speed_trials');
        if (localSaved) {
          const parsed = JSON.parse(localSaved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            recordedTrials = parsed.map(p => ({
              distance: p.distM || 0.4,
              angle: p.angle,
              time: p.timeSec,
              timeSec: p.timeSec,
              speed: p.speed,
            }));
          }
        }
      } catch (_) {}
    }

    const updated: Record<string, any>[] = Array.from({ length: schema.defaultRowsCount }, (_, i) => ({
      trial: i + 1,
    }));

    if (recordedTrials.length > 0) {
      // Map real recorded measurements from workbench into worksheet rows 1-to-1
      recordedTrials.slice(0, schema.defaultRowsCount).forEach((trialData, idx) => {
        if (idx < updated.length) {
          const d = trialData.distance || trialData.distM || 0.4;
          const t = trialData.time || trialData.timeSec || 0.3;
          const v = trialData.speed || (t > 0 ? d / t : 0);

          if (schema.labId === 'sim-speed-measurement') {
            updated[idx] = {
              trial: idx + 1,
              distance: Math.round(d * 100) / 100,
              time: Math.round(t * 1000) / 1000,
              speed: Math.round(v * 1000) / 1000,
            };
          } else {
            updated[idx] = {
              trial: idx + 1,
              ...trialData,
            };
            autoCalculateRow(updated[idx], schema);
          }
        }
      });
    } else {
      // Fallback only if no recording was done in the lab workbench
      updated.forEach((r, idx) => {
        if (schema.labId === 'sim-speed-measurement') {
          const s = Number(studentParams.distance) || 0.5;
          const theta = Number(studentParams.angle) || 10;
          const a = 9.8 * Math.sin(theta * Math.PI / 180);
          const tIdeal = Math.sqrt(2 * s / a);
          const jitter = (idx - 1) * 0.02;
          r.distance = s;
          r.time = Math.round((tIdeal + jitter) * 1000) / 1000;
          r.speed = Math.round((s / r.time) * 1000) / 1000;
        } else if (schema.labId === 'sim-free-fall') {
          const h = Number(studentParams.height) || 1.0;
          const tIdeal = Math.sqrt(2 * h / 9.81);
          r.height = h;
          r.time = Math.round(tIdeal * 1000) / 1000;
          r.g = 9.8;
        } else if (schema.labId === 'sim-friction-coefficient') {
          const m = Number(studentParams.mass) || 0.2;
          r.mass = m;
          r.frictionForce = Math.round(m * 9.8 * 0.25 * 100) / 100;
          r.mu = 0.25;
        }
        autoCalculateRow(r, schema);
      });
    }

    setRows(updated);
    setAutoSyncSuccess(true);
    setTimeout(() => setAutoSyncSuccess(false), 2500);
  };

  const calculatedSummary = schema.calculateSummary ? schema.calculateSummary(rows as any) : {};
  const finalMeasuredResult = calculatedSummary.measuredResult || 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentInstance) {
      setErrorMessage('Không tìm thấy thông số bài tập cá nhân');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const answersPayload = {
      labType: schema.labType,
      labId: schema.labId,
      rows,
      summary: calculatedSummary,
      measuredValue: finalMeasuredResult,
      measuredResult: finalMeasuredResult,
      ...studentParams,
    };

    try {
      const submission = await assignmentService.submitAssignment({
        instanceId: studentInstance.id,
        studentId,
        studentName,
        submittedAnswersJson: JSON.stringify(answersPayload),
        explanation: explanation || 'Học sinh thực hiện đo đạc và ghi nhận số liệu trên mô phỏng thí nghiệm.',
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

  let parsedAiFeedback: AiFeedback | null = null;
  if (submissionResult?.aiFeedbackJson) {
    try {
      parsedAiFeedback = JSON.parse(submissionResult.aiFeedbackJson);
    } catch (_) {}
  }

  return (
    <div className="fixed inset-0 z-60 overflow-hidden font-sans">
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div
          className="w-screen max-w-2xl border-l shadow-2xl flex flex-col transition-transform animate-in slide-in-from-right duration-250"
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
          <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
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
                  <span>🎯</span>
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

            {/* Auto Sync Action Toolbar */}
            <div className="flex items-center justify-between bg-cyan-500/10 border border-cyan-500/30 p-3 rounded-xl">
              <div>
                <span className="font-bold text-cyan-400 block text-xs">Bảng Ghi Chép Số Liệu Thực Nghiệm</span>
                <span className="text-[10px] opacity-75">Tự động trích xuất các lượt đo từ bàn thí nghiệm mô phỏng</span>
              </div>
              <button
                type="button"
                onClick={handleAutoSync}
                disabled={isSubmitting || submissionResult !== null}
                className="px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition cursor-pointer flex items-center gap-1.5 shadow-md shadow-cyan-500/20 disabled:opacity-50"
              >
                <span>⚡</span>
                <span>{autoSyncSuccess ? '✓ Đã Trích Xuất!' : 'Trích Xuất Số Liệu'}</span>
              </button>
            </div>

            {/* Dynamic SGK Data Table */}
            <div className="overflow-x-auto rounded-xl border" style={{ borderColor: 'var(--border-color)' }}>
              <table className="w-full text-left border-collapse text-[11px]">
                <thead>
                  <tr className="border-b" style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)' }}>
                    <th className="p-2.5 font-bold text-center w-12 opacity-70">Lần</th>
                    {schema.columns.map(col => (
                      <th key={col.id} className="p-2.5 font-bold">
                        <div>{col.label}</div>
                        <div className="text-[9px] font-mono font-normal opacity-60">
                          {col.unit ? `(${col.unit})` : ''} {col.formulaHint ? `[${col.formulaHint}]` : ''}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, rIdx) => (
                    <tr
                      key={rIdx}
                      className="border-b transition hover:bg-slate-500/5"
                      style={{ borderColor: 'var(--border-color)' }}
                    >
                      <td className="p-2.5 font-mono font-bold text-center opacity-70">{rIdx + 1}</td>
                      {schema.columns.map(col => {
                        const val = row[col.id] !== undefined ? row[col.id] : '';
                        return (
                          <td key={col.id} className="p-2">
                            {col.isCalculated ? (
                              <div className="px-2.5 py-1.5 rounded bg-slate-500/10 font-mono font-bold text-cyan-400">
                                {val !== '' ? String(val) : '—'}
                              </div>
                            ) : (
                              <input
                                type="number"
                                step="any"
                                value={val}
                                onChange={e => handleCellChange(rIdx, col.id, e.target.value)}
                                disabled={isSubmitting || submissionResult !== null}
                                placeholder="0.00"
                                className="w-full px-2.5 py-1.5 rounded border font-mono text-xs focus:outline-none focus:border-cyan-500"
                                style={{
                                  backgroundColor: 'var(--bg-main)',
                                  borderColor: 'var(--border-color)',
                                  color: 'var(--text-main)',
                                }}
                              />
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Calculated Result Summary */}
            {finalMeasuredResult > 0 && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs font-mono">
                <span className="text-emerald-400 font-bold">📊 Kết Quả Trung Bình Đo Được:</span>
                <span className="text-emerald-400 font-black text-sm">{finalMeasuredResult}</span>
              </div>
            )}

            {/* Error banner */}
            {errorMessage && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-500 font-semibold text-xs">
                ⚠️ {errorMessage}
              </div>
            )}

            {/* Submission Result Card */}
            {submissionResult && (
              <div
                className="p-4 rounded-xl border space-y-3 animate-in fade-in"
                style={{
                  backgroundColor: 'var(--bg-main)',
                  borderColor: '#10B981',
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-500 flex items-center gap-1.5">
                    <span>✓ Đã Chấm Điểm Báo Cáo Thực Hành</span>
                  </span>
                  <span className="text-xl font-black text-emerald-500 font-mono">
                    {submissionResult.totalScore.toFixed(1)} / 10
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 rounded border text-center" style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)' }}>
                    <span className="text-[10px] opacity-60 block">Độ Chính Xác Thực Nghiệm</span>
                    <span className="font-mono font-bold text-sm text-cyan-400">
                      {submissionResult.mathScore.toFixed(1)} / 10
                    </span>
                  </div>
                  <div className="p-2 rounded border text-center" style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)' }}>
                    <span className="text-[10px] opacity-60 block">Lập Luận & Giải Thích (AI)</span>
                    <span className="font-mono font-bold text-sm text-purple-400">
                      {submissionResult.aiReasoningScore.toFixed(1)} / 10
                    </span>
                  </div>
                </div>

                {parsedAiFeedback && (
                  <div className="space-y-1.5 pt-2 border-t text-[11px]" style={{ borderColor: 'var(--border-color)' }}>
                    <p className="font-semibold text-xs">Nhận xét sư phạm từ Trợ lý AI:</p>
                    <p className="opacity-85 leading-relaxed bg-slate-500/5 p-2.5 rounded border" style={{ borderColor: 'var(--border-color)' }}>
                      {parsedAiFeedback.pedagogicalFeedback || 'Bảng số liệu đầy đủ, các phép tính khớp với quy chuẩn thực nghiệm SGK.'}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Explanation & Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="font-bold opacity-80 block">
                  Diễn giải cách tính, nhận xét hiện tượng & nguyên nhân gây sai số
                </label>
                <textarea
                  rows={3}
                  value={explanation}
                  onChange={e => setExplanation(e.target.value)}
                  placeholder="Ghi lại nhận xét hiện tượng vật lý quan sát được, công thức áp dụng hoặc nguyên nhân gây sai số (ví dụ: lực cản không khí, độ trễ cảm biến)..."
                  disabled={isSubmitting || submissionResult !== null}
                  className="w-full p-3 rounded-lg border text-xs focus:outline-none focus:border-cyan-500 leading-relaxed"
                  style={{
                    backgroundColor: 'var(--bg-main)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-main)',
                  }}
                />
              </div>

              {!submissionResult && (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 rounded-lg text-xs font-bold text-slate-950 bg-cyan-500 hover:bg-cyan-400 shadow-md shadow-cyan-500/20 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      <span>Đang đối chiếu toán học & AI chấm điểm...</span>
                    </>
                  ) : (
                    <span>🚀 Nộp Báo Cáo & Nhận Điểm Ngay</span>
                  )}
                </button>
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
