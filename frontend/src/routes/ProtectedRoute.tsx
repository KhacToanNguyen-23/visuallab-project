import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('ADMIN' | 'TEACHER' | 'STUDENT')[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { token, user } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
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

