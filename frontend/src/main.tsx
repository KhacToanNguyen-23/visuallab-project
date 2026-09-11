import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { LandingPage } from './pages/LandingPage';
import { PhetSpringLab } from './components/simulation/PhetSpringLab';
import { PhetEmfLab } from './components/simulation/PhetEmfLab';
import { CatalogPage } from './pages/CatalogPage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { SRSWorkflowPage } from './pages/SRSWorkflowPage';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminOverviewPage } from './pages/admin/AdminOverviewPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminLabsPage } from './pages/admin/AdminLabsPage';
import { AdminAuditPage } from './pages/admin/AdminAuditPage';
import { TeacherLayout } from './components/teacher/TeacherLayout';
import { TeacherClassesPage } from './pages/teacher/TeacherClassesPage';
import { TeacherLabsPage } from './pages/teacher/TeacherLabsPage';
import { TeacherAssignPage } from './pages/teacher/TeacherAssignPage';
import { TeacherGradingPage } from './pages/teacher/TeacherGradingPage';
import { StudentLayout } from './components/student/StudentLayout';
import { StudentClassesPage } from './pages/student/StudentClassesPage';
import { StudentAssignmentsPage } from './pages/student/StudentAssignmentsPage';
import { StudentHistoryPage } from './pages/student/StudentHistoryPage';
import App from './App.tsx';
import './index.css';

// Real Google OAuth Client ID provided by user
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '76484117439-or3q8h67eki0j95d7r5t9kji3u2ljt0v.apps.googleusercontent.com';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <ThemeProvider>
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/thu-vien" element={<CatalogPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/test-spring" element={<PhetSpringLab />} />
              <Route path="/test-emf" element={<PhetEmfLab />} />
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
                  <ProtectedRoute>
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
                  <ProtectedRoute>
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
                  <ProtectedRoute>
                    <StudentLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/student/classes" replace />} />
                <Route path="classes" element={<StudentClassesPage />} />
                <Route path="assignments" element={<StudentAssignmentsPage />} />
                <Route path="history" element={<StudentHistoryPage />} />
              </Route>

              <Route path="/simulation" element={<App />} />
              <Route path="/srs-lab" element={<SRSWorkflowPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
