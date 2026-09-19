import React, { useState, useEffect, Suspense, lazy } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { assignmentService } from '../../services/assignmentService';
import { classService } from '../../services/classService';
import type { Assignment, StudentAssignmentInstance, AssignmentSubmission } from '../../types/assignment';
import { AssignmentLabHeaderBanner } from '../../components/assignment/AssignmentLabHeaderBanner';
import { FloatingAssignmentDrawer } from '../../components/assignment/FloatingAssignmentDrawer';
import { LabErrorBoundary } from '../../components/common/LabErrorBoundary';
import { getLabRoute } from '../../utils/labRoutes';

// Lazy load Simulation Engine Components
const PhetPendulumLab = lazy(() => import('../../components/simulations/PhetPendulumLab').then(m => ({ default: m.PhetPendulumLab })));
const PhetSpringLab = lazy(() => import('../../components/simulations/PhetSpringLab').then(m => ({ default: m.PhetSpringLab })));
const EmfInternalRLab = lazy(() => import('../../components/simulations/emf-internal-r/EmfInternalRLab').then(m => ({ default: m.EmfInternalRLab })));
const RefractionLab = lazy(() => import('../../components/simulations/refraction/RefractionLab').then(m => ({ default: m.RefractionLab })));
const PhetFreeFallLab = lazy(() => import('../../components/simulations/PhetFreeFallLab').then(m => ({ default: m.PhetFreeFallLab })));
const PhetVietnamLabWrapper = lazy(() => import('../../components/simulations/PhetVietnamLabWrapper').then(m => ({ default: m.PhetVietnamLabWrapper })));
const WaveInterferenceLab = lazy(() => import('../../components/simulations/WaveInterferenceLab').then(m => ({ default: m.WaveInterferenceLab })));
const SoundResonanceLab = lazy(() => import('../../components/simulations/SoundResonanceLab').then(m => ({ default: m.SoundResonanceLab })));
const SpeedMeasurementLab = lazy(() => import('../../components/simulations/speed-measurement/SpeedMeasurementLab').then(m => ({ default: m.SpeedMeasurementLab })));
const SlidingFrictionLab = lazy(() => import('../../components/simulations/SlidingFrictionLab').then(m => ({ default: m.SlidingFrictionLab })));
const MomentumCollisionLab = lazy(() => import('../../components/simulations/MomentumCollisionLab').then(m => ({ default: m.MomentumCollisionLab })));
const SpecificHeatLab = lazy(() => import('../../components/simulations/SpecificHeatLab').then(m => ({ default: m.SpecificHeatLab })));
const LatentHeatLab = lazy(() => import('../../components/simulations/LatentHeatLab').then(m => ({ default: m.LatentHeatLab })));
const BoyleMariotteLab = lazy(() => import('../../components/simulations/BoyleMariotteLab').then(m => ({ default: m.BoyleMariotteLab })));
const InductionLab = lazy(() => import('../../components/simulations/InductionLab').then(m => ({ default: m.InductionLab })));
const UniversalWorkbenchPage = lazy(() => import('../UniversalWorkbenchPage').then(m => ({ default: m.UniversalWorkbenchPage })));
const DcCircuitLab = lazy(() => import('../../App'));

const LoadingLabSpinner = () => (
  <div className="w-full h-full flex flex-col items-center justify-center p-12 space-y-3">
    <div className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    <p className="text-xs font-semibold text-slate-400">Đang khởi tạo phòng thí nghiệm ảo...</p>
  </div>
);

export const StudentLabAssignmentWorkbenchPage: React.FC = () => {
  const { assignmentId } = useParams<{ assignmentId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [studentInstance, setStudentInstance] = useState<StudentAssignmentInstance | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const studentId = user?.id || 's1';
  const studentName = user?.fullName || 'Học sinh';

  useEffect(() => {
    if (!assignmentId) return;

    const loadData = async () => {
      setLoading(true);
      try {
        // Fetch assignment directly by ID
        let foundAsg: Assignment | null = await assignmentService.getAssignmentById(assignmentId);

        if (!foundAsg && user?.id) {
          const enrollments = await classService.getStudentEnrollments(user.id);
          for (const enr of enrollments) {
            const classAsgs = await assignmentService.getAssignmentsByClass(enr.classId);
            const match = classAsgs.find(a => a.id === assignmentId);
            if (match) {
              foundAsg = match;
              break;
            }
          }
        }

        if (!foundAsg) {
          setError('Không tìm thấy bài tập được giao.');
          setLoading(false);
          return;
        }
        setAssignment(foundAsg);

        // Fetch or create student instance
        try {
          const inst = await assignmentService.getStudentInstance(assignmentId, studentId);
          setStudentInstance(inst);
        } catch (instErr) {
          console.warn('Could not load student instance, creating fallback:', instErr);
          setStudentInstance({
            id: `inst-${assignmentId}-${studentId}`,
            assignmentId,
            studentId,
            generatedParamsJson: JSON.stringify({ distance: 0.5, angle: 10 }),
            createdAt: new Date().toISOString(),
          });
        }
        // Clear obsolete unlinked grade results from previous sessions
        const keysToPurge = [
          'edulab_speed_grade_result',
          'edulab_boyle_grade_result',
          'edulab_latent_heat_grade_result',
          'edulab_induction_grade_result',
          'edulab_momentum_grade_result',
          'edulab_refraction_grade_result',
          'edulab_sliding_friction_grade_result',
          'edulab_specific_heat_grade_result',
          'edulab_emf_internal_r_grade_result',
        ];
        keysToPurge.forEach(k => {
          try {
            const val = localStorage.getItem(k);
            if (val) {
              const parsed = JSON.parse(val);
              if (parsed?.assignmentId !== assignmentId) {
                localStorage.removeItem(k);
              }
            }
          } catch (_) {
            localStorage.removeItem(k);
          }
        });
      } catch (err: any) {
        setError(err.message || 'Không thể tải thông tin bài tập');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [assignmentId, user?.id]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleSubmitted = (submission: AssignmentSubmission) => {
    showToast(`Đã nộp bài thành công! Điểm tổng kết: ${submission.totalScore.toFixed(0)}/10. Đang quay lại trang bài tập...`);
    setTimeout(() => {
      navigate('/student/assignments');
    }, 1200);
  };

  const handleExit = () => {
    navigate('/student/assignments');
  };

  const renderSimulationComponent = () => {
    if (!assignment) return null;

    const route = getLabRoute(assignment.labType, assignment.title);

    switch (route) {
      case '/lab/speed-measurement':
        return <SpeedMeasurementLab assignmentId={assignment.id} onOpenSubmissionDrawer={() => setIsDrawerOpen(true)} />;
      case '/lab/free-fall':
        return <PhetFreeFallLab />;
      case '/lab/sliding-friction':
        return <SlidingFrictionLab assignmentId={assignment.id} onOpenSubmissionDrawer={() => setIsDrawerOpen(true)} />;
      case '/lab/momentum-collision':
        return <MomentumCollisionLab assignmentId={assignment.id} onOpenSubmissionDrawer={() => setIsDrawerOpen(true)} />;
      case '/lab/spring-mass':
        return <PhetSpringLab />;
      case '/lab/simple-pendulum':
        return <PhetPendulumLab />;
      case '/lab/sound-resonance':
        return <SoundResonanceLab />;
      case '/lab/emf-internal-r':
        return <EmfInternalRLab assignmentId={assignment.id} onOpenSubmissionDrawer={() => setIsDrawerOpen(true)} />;
      case '/lab/refraction':
        return <RefractionLab assignmentId={assignment.id} onOpenSubmissionDrawer={() => setIsDrawerOpen(true)} />;
      case '/lab/wave-interference':
        return <WaveInterferenceLab />;
      case '/lab/specific-heat':
        return <SpecificHeatLab assignmentId={assignment.id} onOpenSubmissionDrawer={() => setIsDrawerOpen(true)} />;
      case '/lab/latent-heat':
        return <LatentHeatLab assignmentId={assignment.id} onOpenSubmissionDrawer={() => setIsDrawerOpen(true)} />;
      case '/lab/boyle-mariotte':
        return <BoyleMariotteLab assignmentId={assignment.id} onOpenSubmissionDrawer={() => setIsDrawerOpen(true)} />;
      case '/lab/induction':
        return <InductionLab assignmentId={assignment.id} onOpenSubmissionDrawer={() => setIsDrawerOpen(true)} />;
      case '/lab/ohm-vietnam':
        return <PhetVietnamLabWrapper />;
      case '/workbench/universal':
        return <UniversalWorkbenchPage />;
      case '/lab/dc-circuit':
      default:
        return <DcCircuitLab />;
    }
  };

  if (loading) {
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center space-y-3" style={{ backgroundColor: 'var(--bg-main)', color: 'var(--text-main)' }}>
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-semibold opacity-75">Đang thiết lập phòng thí nghiệm bài tập...</p>
      </div>
    );
  }

  if (error || !assignment) {
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center p-6 text-center space-y-4" style={{ backgroundColor: 'var(--bg-main)', color: 'var(--text-main)' }}>
        <div className="text-4xl">⚠️</div>
        <h2 className="text-lg font-bold text-rose-500">Không thể mở phòng thí nghiệm</h2>
        <p className="text-xs opacity-75 max-w-md">{error || 'Không tìm thấy thông tin bài tập.'}</p>
        <button
          onClick={handleExit}
          className="px-4 py-2 rounded-lg text-xs font-bold text-white cursor-pointer"
          style={{ backgroundColor: 'var(--accent-primary)' }}
        >
          ← Quay lại danh sách bài tập
        </button>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen h-screen flex flex-col overflow-y-auto relative select-text" style={{ backgroundColor: 'var(--bg-main)' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 right-6 z-70 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-emerald-500/40 font-semibold text-xs animate-bounce flex items-center gap-2">
          <span>✓</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner with Assignment Information & Actions */}
      <AssignmentLabHeaderBanner
        assignment={assignment}
        studentInstance={studentInstance}
        onOpenDrawer={() => setIsDrawerOpen(true)}
        onExit={handleExit}
        isDrawerOpen={isDrawerOpen}
      />

      {/* Full-Screen Lab Workbench Simulation Engine */}
      <main className="flex-1 w-full relative min-h-[calc(100vh-3.5rem)] overflow-y-auto">
        <LabErrorBoundary>
          <Suspense fallback={<LoadingLabSpinner />}>
            {renderSimulationComponent()}
          </Suspense>
        </LabErrorBoundary>
      </main>

      {/* Slide-over Floating Assignment Submission Drawer */}
      <FloatingAssignmentDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        assignment={assignment}
        studentInstance={studentInstance}
        studentId={studentId}
        studentName={studentName}
        onSubmitted={handleSubmitted}
        onBackToAssignments={handleExit}
      />
    </div>
  );
};
