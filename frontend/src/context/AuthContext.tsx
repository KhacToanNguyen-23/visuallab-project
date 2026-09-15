import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_BASE_URL } from '../config/api';
import {
  setAccessToken,
  refreshSession,
  setOnTokenExpired,
  fetchWithAuth,
} from '../services/apiClient';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'TEACHER' | 'STUDENT' | 'ADMIN';
  school: string;
  provider?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, pass: string) => Promise<boolean>;
  register: (email: string, pass: string, fullName: string, role: string, school: string) => Promise<boolean>;
  loginWithGoogle: (email: string, fullName: string, role: string, googleToken?: string) => Promise<boolean>;
  updateProfile: (fullName: string, school: string) => Promise<boolean>;
  logout: () => Promise<void>;
  logoutAll: () => Promise<void>;
  isLoading: boolean;
  isInitializing: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setTokenState] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  // Sync token state helper
  const updateToken = (newToken: string | null) => {
    setAccessToken(newToken);
    setTokenState(newToken);
  };

  // Initial session restoration on mount (Silent Refresh)
  useEffect(() => {
    // Cleanup any legacy localStorage tokens for security
    localStorage.removeItem('edulab_token');
    localStorage.removeItem('edulab_user');

    setOnTokenExpired(() => {
      updateToken(null);
      setUser(null);
    });

    const initAuth = async () => {
      try {
        const session = await refreshSession();
        if (session && session.token && session.user) {
          updateToken(session.token);
          setUser(session.user);
        } else {
          updateToken(null);
          setUser(null);
        }
      } catch (err) {
        updateToken(null);
        setUser(null);
      } finally {
        setIsInitializing(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, pass: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password: pass }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Đăng nhập thất bại');
      }
      const data = await res.json();
      updateToken(data.token);
      setUser(data.user);
      return true;
    } catch (err) {
      console.error('Login error:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    email: string,
    pass: string,
    fullName: string,
    role: string,
    school: string
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password: pass, fullName, role, school }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Đăng ký thất bại');
      }
      const data = await res.json();
      updateToken(data.token);
      setUser(data.user);
      return true;
    } catch (err) {
      console.error('Register error:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async (
    email: string,
    fullName: string,
    role: string,
    googleToken?: string
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email,
          fullName,
          role,
          googleIdToken: googleToken || 'google_auth_token_mock',
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Đăng nhập/Đăng ký Google thất bại');
      }
      const data = await res.json();
      updateToken(data.token);
      setUser(data.user);
      return true;
    } catch (err) {
      console.error('Google login error:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (fullName: string, school: string): Promise<boolean> => {
    if (!user?.id && !user?.email) return false;
    try {
      const res = await fetchWithAuth(`/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.id,
          email: user?.email,
          fullName,
          school,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Cập nhật hồ sơ thất bại trên Server');
      }
      const updatedUser = await res.json();
      setUser(updatedUser);
      return true;
    } catch (err) {
      console.error('Lỗi khi cập nhật profile:', err);
      throw err;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
      });
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      updateToken(null);
      setUser(null);
    }
  };

  const logoutAll = async (): Promise<void> => {
    try {
      await fetchWithAuth(`/auth/logout-all`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
      });
    } catch (err) {
      console.error('Logout all error:', err);
    } finally {
      updateToken(null);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        loginWithGoogle,
        updateProfile,
        logout,
        logoutAll,
        isLoading,
        isInitializing,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
