import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { LabErrorBoundary } from './components/common/LabErrorBoundary';

import { LandingPage } from './pages/LandingPage';
import { CatalogPage } from './pages/CatalogPage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { SRSWorkflowPage } from './pages/SRSWorkflowPage';
import { AdminLayout } from './layouts/AdminLayout';
import { AdminOverviewPage } from './pages/admin/AdminOverviewPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminLabsPage } from './pages/admin/AdminLabsPage';
import { AdminAuditPage } from './pages/admin/AdminAuditPage';
import { TeacherLayout } from './layouts/TeacherLayout';
import { TeacherClassesPage } from './pages/teacher/TeacherClassesPage';
import { TeacherLabsPage } from './pages/teacher/TeacherLabsPage';
import { TeacherAssignPage } from './pages/teacher/TeacherAssignPage';
import { TeacherGradingPage } from './pages/teacher/TeacherGradingPage';
import { StudentLayout } from './layouts/StudentLayout';
import { StudentClassesPage } from './pages/student/StudentClassesPage';
import { StudentAssignmentsPage } from './pages/student/StudentAssignmentsPage';
import { StudentHistoryPage } from './pages/student/StudentHistoryPage';
import { StudentStoragePage } from './pages/student/StudentStoragePage';

// Simulation Engine Components (Lazy Loaded for Bundle Optimization)
const PhetPendulumLab = lazy(() => import('./components/simulations/PhetPendulumLab').then(m => ({ default: m.PhetPendulumLab })));
const PhetSpringLab = lazy(() => import('./components/simulations/PhetSpringLab').then(m => ({ default: m.PhetSpringLab })));
const PhetEmfLab = lazy(() => import('./components/simulations/PhetEmfLab').then(m => ({ default: m.PhetEmfLab })));
const PhetRefractionLab = lazy(() => import('./components/simulations/PhetRefractionLab').then(m => ({ default: m.PhetRefractionLab })));
const PhetFreeFallLab = lazy(() => import('./components/simulations/PhetFreeFallLab').then(m => ({ default: m.PhetFreeFallLab })));
const PhetVietnamLabWrapper = lazy(() => import('./components/simulations/PhetVietnamLabWrapper').then(m => ({ default: m.PhetVietnamLabWrapper })));
const WaveInterferenceLab = lazy(() => import('./components/simulations/WaveInterferenceLab').then(m => ({ default: m.WaveInterferenceLab })));
const SoundResonanceLab = lazy(() => import('./components/simulations/SoundResonanceLab').then(m => ({ default: m.SoundResonanceLab })));
const SpeedMeasurementLab = lazy(() => import('./components/simulations/SpeedMeasurementLab').then(m => ({ default: m.SpeedMeasurementLab })));
const SlidingFrictionLab = lazy(() => import('./components/simulations/SlidingFrictionLab').then(m => ({ default: m.SlidingFrictionLab })));
const MomentumCollisionLab = lazy(() => import('./components/simulations/MomentumCollisionLab').then(m => ({ default: m.MomentumCollisionLab })));
const SpecificHeatLab = lazy(() => import('./components/simulations/SpecificHeatLab').then(m => ({ default: m.SpecificHeatLab })));
const LatentHeatLab = lazy(() => import('./components/simulations/LatentHeatLab').then(m => ({ default: m.LatentHeatLab })));
const BoyleMariotteLab = lazy(() => import('./components/simulations/BoyleMariotteLab').then(m => ({ default: m.BoyleMariotteLab })));
const InductionLab = lazy(() => import('./components/simulations/InductionLab').then(m => ({ default: m.InductionLab })));

import App from './App.tsx';
import './index.css';

// Real Google OAuth Client ID provided by user
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '76484117439-or3q8h67eki0j95d7r5t9kji3u2ljt0v.apps.googleusercontent.com';

const LoadingFallback = () => (
  <div className="w-screen h-screen bg-slate-950 flex flex-col items-center justify-center text-white font-sans space-y-3">
    <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
    <p className="text-sm font-medium text-slate-400">Đang tải phòng thí nghiệm...</p>
  </div>
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <ThemeProvider>
        <BrowserRouter>
          <AuthProvider>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/thu-vien" element={<CatalogPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/test-spring" element={<LabErrorBoundary><PhetSpringLab /></LabErrorBoundary>} />
                <Route path="/test-emf" element={<LabErrorBoundary><PhetEmfLab /></LabErrorBoundary>} />
                <Route path="/test-pendulum" element={<LabErrorBoundary><PhetPendulumLab /></LabErrorBoundary>} />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <DashboardPage />
                    </ProtectedRoute>
                  }
                />

                {/* Admin Dedicated SaaS Routes */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                      <AdminLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<AdminOverviewPage />} />
                  <Route path="users" element={<AdminUsersPage />} />
                  <Route path="labs" element={<AdminLabsPage />} />
                  <Route path="audit" element={<AdminAuditPage />} />
                </Route>

                {/* Teacher Dedicated SaaS Routes */}
                <Route
                  path="/teacher"
                  element={
                    <ProtectedRoute allowedRoles={['TEACHER', 'ADMIN']}>
                      <TeacherLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Navigate to="/teacher/classes" replace />} />
                  <Route path="classes" element={<TeacherClassesPage />} />
                  <Route path="labs" element={<TeacherLabsPage />} />
                  <Route path="assign" element={<TeacherAssignPage />} />
                  <Route path="grading" element={<TeacherGradingPage />} />
                </Route>

                {/* Student Dedicated SaaS Routes */}
                <Route
                  path="/student"
                  element={
                    <ProtectedRoute allowedRoles={['STUDENT', 'TEACHER', 'ADMIN']}>
                      <StudentLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Navigate to="/student/classes" replace />} />
                  <Route path="classes" element={<StudentClassesPage />} />
                  <Route path="assignments" element={<StudentAssignmentsPage />} />
                  <Route path="history" element={<StudentHistoryPage />} />
                  <Route path="storage" element={<StudentStoragePage />} />
                </Route>

                {/* Individual Simulation Lab Engine Routes */}
                <Route path="/lab/speed-measurement" element={<LabErrorBoundary><SpeedMeasurementLab /></LabErrorBoundary>} />
                <Route path="/lab/free-fall" element={<LabErrorBoundary><PhetFreeFallLab /></LabErrorBoundary>} />
                <Route path="/lab/sliding-friction" element={<LabErrorBoundary><SlidingFrictionLab /></LabErrorBoundary>} />
                <Route path="/lab/momentum-collision" element={<LabErrorBoundary><MomentumCollisionLab /></LabErrorBoundary>} />
                <Route path="/lab/spring-mass" element={<LabErrorBoundary><PhetSpringLab /></LabErrorBoundary>} />
                <Route path="/lab/simple-pendulum" element={<LabErrorBoundary><PhetPendulumLab /></LabErrorBoundary>} />
                <Route path="/lab/sound-resonance" element={<LabErrorBoundary><SoundResonanceLab /></LabErrorBoundary>} />
                <Route path="/lab/emf-internal-r" element={<LabErrorBoundary><PhetEmfLab /></LabErrorBoundary>} />
                <Route path="/lab/refraction" element={<LabErrorBoundary><PhetRefractionLab /></LabErrorBoundary>} />
                <Route path="/lab/wave-interference" element={<LabErrorBoundary><WaveInterferenceLab /></LabErrorBoundary>} />
                <Route path="/lab/specific-heat" element={<LabErrorBoundary><SpecificHeatLab /></LabErrorBoundary>} />
                <Route path="/lab/latent-heat" element={<LabErrorBoundary><LatentHeatLab /></LabErrorBoundary>} />
                <Route path="/lab/boyle-mariotte" element={<LabErrorBoundary><BoyleMariotteLab /></LabErrorBoundary>} />
                <Route path="/lab/induction" element={<LabErrorBoundary><InductionLab /></LabErrorBoundary>} />
                <Route path="/lab/dc-circuit" element={<LabErrorBoundary><App /></LabErrorBoundary>} />
                <Route path="/lab/ohm-vietnam" element={<LabErrorBoundary><PhetVietnamLabWrapper /></LabErrorBoundary>} />
                <Route path="/test-sound" element={<LabErrorBoundary><SoundResonanceLab /></LabErrorBoundary>} />

                {/* Backward compatibility routes */}
                <Route path="/simulation" element={<LabErrorBoundary><App /></LabErrorBoundary>} />
                <Route path="/srs-lab" element={<SRSWorkflowPage />} />

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);

