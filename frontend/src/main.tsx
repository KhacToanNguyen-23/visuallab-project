import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { SRSWorkflowPage } from './pages/SRSWorkflowPage';
import { WaveInterferenceLab } from './components/simulation/WaveInterferenceLab';
import { PhetVietnamLabWrapper } from './components/simulation/PhetVietnamLabWrapper';
import { PhetRefractionLab } from './components/simulation/PhetRefractionLab';
import { PhetPendulumLab } from './components/simulation/PhetPendulumLab';
import App from './App';
import './index.css';

// Real Google OAuth Client ID provided by user
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '76484117439-or3q8h67eki0j95d7r5t9kji3u2ljt0v.apps.googleusercontent.com';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <AuthProvider>
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
            <Route path="/simulation" element={<App />} />
            <Route path="/srs-lab" element={<SRSWorkflowPage />} />
            <Route path="/wave-interference" element={<WaveInterferenceLab />} />
            <Route path="/vietnam-phet-lab" element={<PhetVietnamLabWrapper />} />
            <Route path="/refraction-phet-lab" element={<PhetRefractionLab />} />
            <Route path="/pendulum-phet-lab" element={<PhetPendulumLab />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
