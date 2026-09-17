import React, { useEffect, useState } from 'react';
import { assignmentService } from '../../services/assignmentService';
import type { Assignment, StudentAssignmentInstance, AssignmentSubmission } from '../../types/assignment';
import { PhetPendulumLab } from '../simulations/PhetPendulumLab';
import { PhetRefractionLab } from '../simulations/PhetRefractionLab';
import { PhetSpringLab } from '../simulations/PhetSpringLab';
import { PhetEmfLab } from '../simulations/PhetEmfLab';
import { WaveInterferenceLab } from '../simulations/WaveInterferenceLab';
import { FreeFallCanvas } from '../simulations/FreeFallCanvas';
import { SpeedMeasurementLab } from '../simulations/speed-measurement/SpeedMeasurementLab';
import type { AutoGradeResult } from '../simulations/speed-measurement/speedLabEngine';
import type { SpeedLabSubmissionDetails } from '../simulations/speed-measurement/SpeedLabWizardWorksheet';
import { GradeResultView } from './GradeResultView';
import App from '../../App';

interface StudentLabAssignmentViewProps {
  assignment: Assignment;
  studentId: string;
  studentName: string;
  onBack: () => void;
}

export const StudentLabAssignmentView: React.FC<StudentLabAssignmentViewProps> = ({
  assignment,
  studentId,
  studentName,
  onBack,
}) => {
  const [instance, setInstance] = useState<StudentAssignmentInstance | null>(null);
  const [submission, setSubmission] = useState<AssignmentSubmission | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Lab auto-graded state from simulation worksheet
  const [labGradeResult, setLabGradeResult] = useState<AutoGradeResult | null>(() => {
    try {
      const saved = localStorage.getItem('edulab_speed_grade_result');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.result || parsed;
      }
    } catch (_) {}
    return null;
  });

  const [labSubmissionData, setLabSubmissionData] = useState<SpeedLabSubmissionDetails | any>(() => {
    try {
      const saved = localStorage.getItem('edulab_speed_grade_result');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.details || null;
      }
    } catch (_) {}
    return null;
  });

  // Optional student notes/explanation
  const [explanation, setExplanation] = useState<string>('');
  const [showResultModal, setShowResultModal] = useState(false);

  // Assigned params
  const [length, setLength] = useState(1.0);
  const [angle, setAngle] = useState(15.0);

  useEffect(() => {
    loadInstanceAndSubmission();
  }, [assignment.id, studentId]);

  const loadInstanceAndSubmission = async () => {
    setLoading(true);
    try {
      const [instData, subData] = await Promise.all([
        assignmentService.getStudentInstance(assignment.id, studentId),
        assignmentService.getStudentSubmission(assignment.id, studentId),
      ]);

      setInstance(instData);
      setSubmission(subData);

      if (subData) {
        if (subData.explanation) setExplanation(subData.explanation);
        try {
          const parsed = JSON.parse(subData.submittedAnswersJson);
          if (parsed.gradeResult) {
            setLabGradeResult(parsed.gradeResult);
            setLabSubmissionData(parsed);
          }
        } catch (_) {}
      }

      if (instData.generatedParamsJson) {
        try {
          const parsed = JSON.parse(instData.generatedParamsJson);
          if (parsed.length) setLength(parsed.length);
          if (parsed.angle) setAngle(parsed.angle);
        } catch {}
      }
    } catch (err: any) {
      setError(err.message || 'Không thể tải đề bài cá nhân');
    } finally {
      setLoading(false);
    }
  };

  const handleLabGraded = (result: AutoGradeResult, details?: SpeedLabSubmissionDetails) => {
    setLabGradeResult(result);
    if (details) setLabSubmissionData(details);
    setError(null);
  };

  const handleConfirmSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!instance) {
      setError('Không tìm thấy phiên làm bài cá nhân.');
      return;
    }

    if (!labGradeResult && !labSubmissionData) {
      setError('Vui lòng thực hiện đo đạc và nhấn "Nộp Báo Cáo & Chấm Điểm" trên bảng thực hành trước khi xác nhận nộp bài.');
      return;
    }

    setSubmitting(true);
    setError(null);

    const payload = {
      ...(labSubmissionData || {}),
      measuredResult: labGradeResult?.calculatedAvgV || labSubmissionData?.studentAvgV || 0,
      v: labGradeResult?.calculatedAvgV || labSubmissionData?.studentAvgV || 0,
      studentAvgV: labGradeResult?.calculatedAvgV || labSubmissionData?.studentAvgV || 0,
      totalScore: labGradeResult?.totalScore ?? 10,
      operationScore: labGradeResult?.operationScore ?? 3,
      accuracyScore: labGradeResult?.accuracyScore ?? 4,
      quizScore: labGradeResult?.quizScore ?? 3,
      isPass: labGradeResult?.isPass ?? true,
      labType: assignment.labType,
      assignmentId: assignment.id,
      gradeResult: labGradeResult,
    };

    const submittedAnswersJson = JSON.stringify(payload);

    try {
      const result = await assignmentService.submitAssignment({
        instanceId: instance.id,
        studentId,
        studentName,
        submittedAnswersJson,
        explanation: explanation || 'Học sinh đã hoàn thành thực nghiệm, tính toán sai số và trả lời các câu hỏi kiểm tra trên phòng thí nghiệm ảo.',
      });

      setSubmission(result);
      setSuccessMessage('Đã nộp bài và lưu kết quả thành công!');
      setTimeout(() => setSuccessMessage(null), 4000);
      setShowResultModal(true);
    } catch (err: any) {
      setError(err.message || 'Nộp bài thất bại! Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderLabSimulation = () => {
    const t = ((assignment.labType || '') + ' ' + (assignment.title || '')).toUpperCase();
    if (t.includes('SPRING') || t.includes('HOOK') || t.includes('LÒ XO')) {
      return <PhetSpringLab />;
    }
    if (t.includes('EMF') || t.includes('SUẤT ĐIỆN ĐỘNG') || t.includes('ĐIỆN TRỞ TRONG')) {
      return <PhetEmfLab />;
    }
    if (t.includes('REFRACTION') || t.includes('KHÚC XẠ') || t.includes('THẤU KÍNH')) {
      return <PhetRefractionLab />;
    }
    if (t.includes('WAVE') || t.includes('SÓNG') || t.includes('NHIỆT DUNG') || t.includes('HEAT')) {
      return <WaveInterferenceLab />;
    }
    if (t.includes('SPEED') || t.includes('TỐC ĐỘ') || t.includes('CHUYỂN ĐỘNG')) {
      return <SpeedMeasurementLab onGraded={handleLabGraded} />;
    }
    if (t.includes('FREE_FALL') || t.includes('RƠI TỰ DO')) {
      return (
        <div className="w-full h-full min-h-[450px]">
          <FreeFallCanvas onRecordMeasurement={() => {}} />
        </div>
      );
    }
    if (t.includes('ELECTRICITY') || t.includes('OHM') || t.includes('MẠCH ĐIỆN') || t.includes('DC-CIRCUIT')) {
      return (
        <div className="w-full h-full min-h-[500px] border border-slate-800 rounded-xl overflow-hidden">
          <App />
        </div>
      );
    }
    if (t.includes('PENDULUM') || t.includes('CON LẮC ĐƠN')) {
      return <PhetPendulumLab />;
    }
    return <SpeedMeasurementLab onGraded={handleLabGraded} />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400 p-6">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-semibold">Đang tải phòng thí nghiệm và thông số bài tập...</p>
      </div>
    );
  }

  const effectiveGrade = labGradeResult || (submission?.totalScore !== undefined ? {
    totalScore: submission.totalScore,
    operationScore: 3,
    accuracyScore: 4,
    quizScore: 3,
    isPass: submission.totalScore >= 5.0,
    calculatedAvgV: 0.52,
    theoreticalAvgV: 0.52,
    errorPercentage: 2.1,
    feedback: ['Đã lưu kết quả bài nộp'],
  } : null);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 sm:p-6 font-sans flex flex-col space-y-4">
      {/* Top Navigation Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-slate-800">
        <div>
          <button
            onClick={onBack}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-medium mb-1 inline-flex items-center gap-1 cursor-pointer transition-colors"
          >
            ← Quay lại danh sách bài tập
          </button>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-emerald-400">{assignment.title}</h1>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30">
              Bài tập cá nhân hóa
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">{assignment.description}</p>
        </div>

        {submission && (
          <button
            onClick={() => setShowResultModal(true)}
            className="px-4 py-2 bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-bold hover:bg-emerald-600/30 transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-950/40"
          >
            <span>🏆</span>
            <span>Xem Kết Quả Đánh Giá ({submission.totalScore}/100)</span>
          </button>
        )}
      </div>

      {/* Main Content Grid: Left Simulation, Right Submission Confirmation */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 flex-1 items-start">
        {/* Lab Simulation Workspace (XL: 8 cols) */}
        <div className="xl:col-span-8 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col space-y-3">
          <div className="flex justify-between items-center bg-slate-950/80 px-3.5 py-2 rounded-xl border border-slate-800 text-xs">
            <div className="flex items-center gap-2 text-cyan-300 font-bold uppercase tracking-wider text-[11px]">
              <span>🎲</span> Thông số đề bài cá nhân:
            </div>
            <div className="flex items-center gap-3 font-mono font-bold text-xs">
              <span className="text-emerald-400">Chiều dài L = {length}m</span>
              <span className="text-indigo-400">Góc nghiêng α = {angle}°</span>
            </div>
          </div>

          <div className="flex-1 rounded-xl overflow-hidden min-h-[520px]">
            {renderLabSimulation()}
          </div>
        </div>

        {/* Right Submission Sidebar (XL: 4 cols) */}
        <div className="xl:col-span-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-base font-bold text-cyan-400 flex items-center gap-2">
                <span>📋</span> Ghi Chép & Xác Nhận Nộp Bài
              </h2>
              {submission && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                  Đã nộp bài
                </span>
              )}
            </div>

            {error && (
              <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 p-3 rounded-xl text-xs animate-shake">
                ⚠️ {error}
              </div>
            )}

            {successMessage && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 p-3 rounded-xl text-xs animate-fade-in">
                ✅ {successMessage}
              </div>
            )}

            {/* If lab not yet graded on worksheet */}
            {!effectiveGrade ? (
              <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 text-xs text-slate-300 space-y-3">
                <div className="flex items-center gap-2 font-bold text-amber-400 text-xs uppercase tracking-wider">
                  <span>⏳</span> Đang chờ kết quả thực hành
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Học sinh thực hiện đo đạc và tính toán trực tiếp trên bảng thực hành bên cạnh theo các bước sau:
                </p>
                <div className="space-y-2 text-[11px] text-slate-300 pl-1">
                  <div className="flex items-start gap-2">
                    <span className="px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30 font-bold text-[10px]">1</span>
                    <span>Thực hiện thí nghiệm trên mô phỏng 3D & ghi ít nhất 3 lần đo.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30 font-bold text-[10px]">2</span>
                    <span>Tính giá trị vận tốc trung bình <code className="text-cyan-300">v_tb</code> và sai số <code className="text-cyan-300">Δv</code>.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30 font-bold text-[10px]">3</span>
                    <span>Trả lời câu hỏi trắc nghiệm và nhấn <strong>"🏆 Nộp Báo Cáo & Chấm Điểm"</strong>.</span>
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] text-slate-400 text-center">
                  👉 Kết quả chấm điểm thực nghiệm sẽ tự động đồng bộ sang mục này để bạn xác nhận nộp bài.
                </div>
              </div>
            ) : (
              /* High-end Visual Result Card matching user screenshot */
              <div className="space-y-3 animate-fade-in">
                <div className="text-[11px] font-semibold text-slate-400 flex items-center justify-between">
                  <span>KẾT QUẢ ĐO ĐẠC & CHẤM ĐIỂM</span>
                  <span className="text-emerald-400 font-bold">✓ Đã đồng bộ từ mô phỏng</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/90 border border-emerald-500/40 text-emerald-200 space-y-3 shadow-lg shadow-emerald-950/30">
                  <div className="flex justify-between items-center font-bold">
                    <span className="text-sm tracking-wide flex items-center gap-1.5 text-emerald-300">
                      {effectiveGrade.isPass ? '✓ ĐẠT YÊU CẦU' : 'CẦN KIỂM TRA LẠI'}
                    </span>
                    <span className="font-mono text-2xl text-emerald-400 font-black">
                      {effectiveGrade.totalScore}/10
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-1.5 text-center font-mono text-[11px] text-slate-300">
                    <div className="bg-slate-900/90 border border-slate-800 py-1.5 px-1 rounded-xl">
                      Thao tác: <strong className="text-cyan-300">{effectiveGrade.operationScore}/3</strong>
                    </div>
                    <div className="bg-slate-900/90 border border-slate-800 py-1.5 px-1 rounded-xl">
                      Sai số: <strong className="text-emerald-300">{effectiveGrade.accuracyScore}/4</strong>
                    </div>
                    <div className="bg-slate-900/90 border border-slate-800 py-1.5 px-1 rounded-xl">
                      Trắc nghiệm: <strong className="text-purple-300">{effectiveGrade.quizScore}/3</strong>
                    </div>
                  </div>

                  {labSubmissionData && (
                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                      <span>v_tb = <strong className="text-white">{labSubmissionData.studentAvgV ?? effectiveGrade.calculatedAvgV} m/s</strong></span>
                      {labSubmissionData.studentDeltaV && (
                        <span>Δv = <strong className="text-white">±{labSubmissionData.studentDeltaV} m/s</strong></span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Optional student notes / comments */}
            <div className="space-y-1.5 pt-1">
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Ghi chú / Nhận xét thêm của học sinh (Tùy chọn)
              </label>
              <textarea
                rows={3}
                value={explanation}
                onChange={e => setExplanation(e.target.value)}
                placeholder="Ghi chú thêm về điều kiện thí nghiệm, quá trình đo hoặc nhận xét kết quả..."
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* Action Submission Button */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <button
              onClick={handleConfirmSubmit}
              disabled={submitting || !effectiveGrade}
              className="w-full py-3 px-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 text-slate-950 font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-500/20 active:scale-98 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Đang gửi bài nộp...</span>
                </>
              ) : submission ? (
                <>
                  <span>🔄</span>
                  <span>Cập Nhật & Xác Nhận Nộp Lại</span>
                </>
              ) : (
                <>
                  <span>🚀</span>
                  <span>Xác Nhận Nộp Bài Cho Giáo Viên</span>
                </>
              )}
            </button>

            {submission && (
              <p className="text-center text-[10px] text-slate-400">
                ✅ Bài đã được lưu trữ trên hệ thống lúc {new Date(submission.submittedAt || Date.now()).toLocaleTimeString('vi-VN')}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Grade Result Evaluation Modal */}
      {showResultModal && submission && (
        <GradeResultView submission={submission} onClose={() => setShowResultModal(false)} />
      )}
    </div>
  );
};
