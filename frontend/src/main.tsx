import React, { Suspense } from 'react';
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
import { CurriculumLabPage } from './pages/CurriculumLabPage.tsx';
import { UniversalWorkbenchPage } from './pages/UniversalWorkbenchPage.tsx';

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
                {/* 
                <Route path="/test-spring" element={<LabErrorBoundary><PhetSpringLab /></LabErrorBoundary>} />
                <Route path="/test-emf" element={<LabErrorBoundary><PhetEmfLab /></LabErrorBoundary>} />
                <Route path="/test-pendulum" element={<LabErrorBoundary><PhetPendulumLab /></LabErrorBoundary>} />
                */}
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
                    <ProtectedRoute allowedRoles={['STUDENT']}>
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

                {/* Dual-Mode & Workbench Labs */}
                <Route path="/lab/sandbox" element={<LabErrorBoundary><CurriculumLabPage /></LabErrorBoundary>} />
                <Route path="/lab/guided" element={<Navigate to="/thu-vien" replace />} />
                <Route path="/lab/grade10/hooke" element={<Navigate to="/lab/curriculum/sim-spring-mass" replace />} />
                <Route path="/workbench" element={<UniversalWorkbenchPage />} />
                <Route path="/workbench/universal" element={<UniversalWorkbenchPage />} />

                {/* Dynamic Curriculum Scenario Route */}
                <Route path="/lab/curriculum/:labId" element={<LabErrorBoundary><CurriculumLabPage /></LabErrorBoundary>} />

                {/* Individual & Legacy Simulation Routes (Directly mapped to 2.5D Workbench) */}
                <Route path="/lab/dc-circuit" element={<LabErrorBoundary><CurriculumLabPage /></LabErrorBoundary>} />
                <Route path="/lab/speed-measurement" element={<LabErrorBoundary><CurriculumLabPage /></LabErrorBoundary>} />
                <Route path="/lab/free-fall" element={<LabErrorBoundary><CurriculumLabPage /></LabErrorBoundary>} />
                <Route path="/lab/sliding-friction" element={<LabErrorBoundary><CurriculumLabPage /></LabErrorBoundary>} />
                <Route path="/lab/momentum-collision" element={<LabErrorBoundary><CurriculumLabPage /></LabErrorBoundary>} />
                <Route path="/lab/spring-mass" element={<LabErrorBoundary><CurriculumLabPage /></LabErrorBoundary>} />
                <Route path="/lab/simple-pendulum" element={<LabErrorBoundary><CurriculumLabPage /></LabErrorBoundary>} />
                <Route path="/lab/sound-resonance" element={<LabErrorBoundary><CurriculumLabPage /></LabErrorBoundary>} />
                <Route path="/lab/emf-internal-r" element={<LabErrorBoundary><CurriculumLabPage /></LabErrorBoundary>} />
                <Route path="/lab/refraction" element={<LabErrorBoundary><CurriculumLabPage /></LabErrorBoundary>} />
                <Route path="/lab/wave-interference" element={<LabErrorBoundary><CurriculumLabPage /></LabErrorBoundary>} />
                <Route path="/lab/specific-heat" element={<LabErrorBoundary><CurriculumLabPage /></LabErrorBoundary>} />
                <Route path="/lab/latent-heat" element={<LabErrorBoundary><CurriculumLabPage /></LabErrorBoundary>} />
                <Route path="/lab/boyle-mariotte" element={<LabErrorBoundary><CurriculumLabPage /></LabErrorBoundary>} />
                <Route path="/lab/induction" element={<LabErrorBoundary><CurriculumLabPage /></LabErrorBoundary>} />

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);

