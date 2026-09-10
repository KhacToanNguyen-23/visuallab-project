import React, { useEffect, useState } from 'react';
import { assignmentService } from '../../services/assignmentService';
import type { Assignment, StudentAssignmentInstance, AssignmentSubmission } from '../../types/assignment';
import { PhetPendulumLab } from '../simulation/PhetPendulumLab';
import { PhetRefractionLab } from '../simulation/PhetRefractionLab';
import { PhetSpringLab } from '../simulation/PhetSpringLab';
import { PhetEmfLab } from '../simulation/PhetEmfLab';
import { WaveInterferenceLab } from '../simulation/WaveInterferenceLab';
import { FreeFallCanvas } from '../simulations/FreeFallCanvas';
import { GradeResultView } from './GradeResultView';

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

  // Form inputs
  const [measuredPeriod, setMeasuredPeriod] = useState<string>('');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!instance || !measuredPeriod) return;

    setSubmitting(true);
    setError(null);

    const submittedAnswersJson = JSON.stringify({
      period: parseFloat(measuredPeriod),
      length: length,
    });

    try {
      const result = await assignmentService.submitAssignment({
        instanceId: instance.id,
        studentId,
        studentName,
        submittedAnswersJson,
        explanation,
      });

      setSubmission(result);
      setShowResultModal(true);
    } catch (err: any) {
      setError(err.message || 'Chấm bài thất bại!');
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
    if (t.includes('WAVE') || t.includes('SÓNG') || t.includes('NHIỆT DUNG')) {
      return <WaveInterferenceLab />;
    }
    if (t.includes('FREE_FALL') || t.includes('RƠI TỰ DO')) {
      return (
        <div className="w-full h-full min-h-[450px]">
          <FreeFallCanvas onRecordMeasurement={() => {}} />
        </div>
      );
    }
    if (t.includes('ELECTRICITY') || t.includes('OHM') || t.includes('MẠCH ĐIỆN')) {
      return (
        <iframe
          src="/simulations/ohms-law_vi.html"
          title="PhET Ohm's Law Apparatus"
          className="w-full h-full min-h-[450px] border-0 rounded-xl"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      );
    }
    return <PhetPendulumLab />;
  };

  if (loading) {
    return <div className="p-10 text-center text-slate-400">Đang tải thông số đề bài cá nhân hóa...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 font-sans flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center pb-4 mb-6 border-b border-slate-800">
        <div>
          <button onClick={onBack} className="text-xs text-cyan-400 hover:underline mb-1 block">
            ← Quay lại danh sách bài tập
          </button>
          <h1 className="text-2xl font-bold text-emerald-400">{assignment.title}</h1>
          <p className="text-xs text-slate-400">{assignment.description}</p>
        </div>

        {submission && (
          <button
            onClick={() => setShowResultModal(true)}
            className="px-4 py-2 bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-bold hover:bg-emerald-600/40 transition-colors"
          >
            🏆 Xem Kết Quả Điểm ({submission.totalScore}/100)
          </button>
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        {/* Lab Simulation Workspace (2 cols) */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
          <div className="mb-3 flex justify-between items-center bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-xs text-cyan-400 font-bold uppercase tracking-wider">
              🎲 Thông số đề bài cá nhân của bạn:
            </span>
            <div className="flex gap-4 text-xs font-mono font-bold">
              <span className="text-emerald-400">Chiều dài L = {length}m</span>
              <span className="text-indigo-400">Góc lệch θ = {angle}°</span>
            </div>
          </div>

          <div className="flex-1 bg-slate-950 rounded-xl overflow-hidden min-h-[450px]">
            {renderLabSimulation()}
          </div>
        </div>

        {/* Submission Form (1 col) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-cyan-400 mb-4 flex items-center gap-2">
              <span>✍️</span> Form Nộp Bài Thí Nghiệm
            </h2>

            {error && (
              <div className="mb-4 bg-rose-500/10 border border-rose-500/30 text-rose-300 p-3 rounded-lg text-xs">
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Chu kỳ đo được T (giây) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={measuredPeriod}
                  onChange={e => setMeasuredPeriod(e.target.value)}
                  placeholder="Ví dụ: 2.01"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-mono placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Lời giải / Giải thích từng bước (Cho Groq AI chấm)
                </label>
                <textarea
                  rows={6}
                  value={explanation}
                  onChange={e => setExplanation(e.target.value)}
                  placeholder="Áp dụng công thức T = 2*pi*sqrt(L/g). Thay L = 1.0m, ta đo được T = 2.01s..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={submitting || !measuredPeriod}
                className="w-full py-3 bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-900/30 transition-all disabled:opacity-50"
              >
                {submitting ? '🤖 AI Đang Chấm Bài...' : '🚀 Nộp Bài & Nhận Điểm AI'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {showResultModal && submission && (
        <GradeResultView submission={submission} onClose={() => setShowResultModal(false)} />
      )}
    </div>
  );
};
