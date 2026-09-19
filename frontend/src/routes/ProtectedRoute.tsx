import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('ADMIN' | 'TEACHER' | 'STUDENT')[];
  allowUnonboarded?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  allowUnonboarded = false,
}) => {
  const { token, user, isInitializing } = useAuth();

  if (isInitializing) {
    return (
      <div style={{
        display: 'flex',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-primary, #0B1120)',
        color: 'var(--text-secondary, #94A3B8)',
        fontSize: '14px',
        fontWeight: 500,
        gap: '12px'
      }}>
        <div style={{
          width: '24px',
          height: '24px',
          border: '2px solid rgba(255,255,255,0.1)',
          borderTopColor: '#3B82F6',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }} />
        <span>Đang kiểm tra phiên đăng nhập...</span>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If user hasn't completed onboarding and route doesn't explicitly allow un-onboarded, redirect to /onboarding
  if (!allowUnonboarded && user?.onboardingCompleted === false) {
    return <Navigate to="/onboarding" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0 && user) {
    if (!allowedRoles.includes(user.role)) {
      if (user.role === 'ADMIN') return <Navigate to="/admin" replace />;
      if (user.role === 'TEACHER') return <Navigate to="/teacher/classes" replace />;
      if (user.role === 'STUDENT') return <Navigate to="/student/classes" replace />;
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
};
