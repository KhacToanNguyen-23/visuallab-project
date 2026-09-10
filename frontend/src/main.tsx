import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { SRSWorkflowPage } from './pages/SRSWorkflowPage';
import { PhetPendulumLab } from './components/simulation/PhetPendulumLab';
import { TeacherClassesPage } from './pages/TeacherClassesPage';
import { StudentAssignmentsPage } from './pages/StudentAssignmentsPage';
import App from './App.tsx';
import './index.css';

// Real Google OAuth Client ID provided by user
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '76484117439-or3q8h67eki0j95d7r5t9kji3u2ljt0v.apps.googleusercontent.com';

const TeacherClassesRoute: React.FC = () => {
  const { user } = useAuth();
  return (
    <TeacherClassesPage
      teacherId={user?.id || 'u-1'}
      teacherName={user?.fullName || 'Giáo viên EduLab'}
    />
  );
};

const StudentAssignmentsRoute: React.FC = () => {
  const { user } = useAuth();
  return (
    <StudentAssignmentsPage
      studentId={user?.id || 'u-2'}
      studentName={user?.fullName || 'Học sinh EduLab'}
      studentEmail={user?.email || 'student@edulab.vn'}
    />
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <AuthProvider>
          <ThemeProvider>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/teacher-classes"
                element={
                  <ProtectedRoute>
                    <TeacherClassesRoute />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student-assignments"
                element={
                  <ProtectedRoute>
                    <StudentAssignmentsRoute />
                  </ProtectedRoute>
                }
              />
              <Route path="/simulation" element={<App />} />
              <Route path="/pendulum-lab" element={<PhetPendulumLab />} />
              <Route path="/srs-lab" element={<SRSWorkflowPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </ThemeProvider>
        </AuthProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>
);


