import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_BASE_URL } from '../config/api';
import {
  setAccessToken,
  refreshSession,
  setOnTokenExpired,
  fetchWithAuth,
} from '../services/apiClient';
import { subscribeAuthEvent, broadcastAuthEvent } from '../utils/authSync';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'TEACHER' | 'STUDENT' | 'ADMIN';
  school: string;
  provider?: string;
  status?: string;
  onboardingCompleted?: boolean;
}

export interface GoogleAuthResult {
  status: 'SUCCESS' | 'PENDING_VERIFICATION' | 'ERROR';
  email?: string;
  message?: string;
  onboardingCompleted?: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, pass: string) => Promise<boolean>;
  register: (email: string, pass: string, fullName: string, role: string, school: string) => Promise<boolean>;
  loginWithGoogle: (email: string, fullName: string, role: string, googleToken?: string) => Promise<GoogleAuthResult>;
  verifyRegistration: (token: string) => Promise<{ success: boolean; message?: string; onboardingCompleted?: boolean }>;
  resendVerification: (email: string) => Promise<{ success: boolean; message?: string; cooldownSeconds?: number }>;
  completeOnboarding: (school: string) => Promise<boolean>;
  updateProfile: (fullName: string, school: string) => Promise<boolean>;
  checkSession: () => Promise<User | null>;
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

  const checkSession = React.useCallback(async (): Promise<User | null> => {
    try {
      const session = await refreshSession();
      if (session && session.token && session.user) {
        updateToken(session.token);
        setUser(session.user);
        return session.user;
      } else {
        updateToken(null);
        setUser(null);
        return null;
      }
    } catch (err) {
      updateToken(null);
      setUser(null);
      return null;
    }
  }, []);

  // Initial session restoration on mount (Silent Refresh) & Cross-Tab Listener
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
        await checkSession();
      } finally {
        setIsInitializing(false);
      }
    };

    initAuth();

    // Cross-tab synchronization
    const unsubscribe = subscribeAuthEvent(async (event) => {
      if (event.type === 'LOGOUT') {
        updateToken(null);
        setUser(null);
      } else {
        await checkSession();
      }
    });

    return unsubscribe;
  }, [checkSession]);

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
  ): Promise<GoogleAuthResult> => {
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

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        return {
          status: 'ERROR',
          message: data.message || 'Đăng nhập/Đăng ký Google thất bại',
        };
      }

      if (data.status === 'PENDING_VERIFICATION' || !data.user) {
        return {
          status: 'PENDING_VERIFICATION',
          email: data.email || email,
          message: data.message || 'Vui lòng kiểm tra hộp thư để xác thực email.',
          onboardingCompleted: false,
        };
      }

      updateToken(data.token);
      setUser(data.user);
      return {
        status: 'SUCCESS',
        email: data.user.email,
        message: data.message,
        onboardingCompleted: data.onboardingCompleted ?? data.user.onboardingCompleted,
      };
    } catch (err: any) {
      console.error('Google login error:', err);
      return {
        status: 'ERROR',
        message: err.message || 'Không thể kết nối đến máy chủ',
      };
    } finally {
      setIsLoading(false);
    }
  };

  const verifyRegistration = React.useCallback(async (
    tokenString: string
  ): Promise<{ success: boolean; message?: string; onboardingCompleted?: boolean }> => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/verify-registration?token=${encodeURIComponent(tokenString)}`, {
        method: 'GET',
        credentials: 'include',
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        return {
          success: false,
          message: data.message || 'Liên kết xác thực không hợp lệ hoặc đã hết hạn.',
        };
      }

      if (data.token && data.user) {
        updateToken(data.token);
        setUser(data.user);
        broadcastAuthEvent({ type: 'VERIFY_SUCCESS', email: data.user.email, onboardingCompleted: data.onboardingCompleted });
      }
      return {
        success: true,
        message: data.message,
        onboardingCompleted: data.onboardingCompleted ?? data.user?.onboardingCompleted ?? false,
      };
    } catch (err: any) {
      return {
        success: false,
        message: err.message || 'Lỗi mạng khi xác thực tài khoản.',
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resendVerification = React.useCallback(async (
    recipientEmail: string
  ): Promise<{ success: boolean; message?: string; cooldownSeconds?: number }> => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/resend-verification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: recipientEmail }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        return {
          success: false,
          message: data.message || 'Gửi lại email xác thực thất bại.',
        };
      }
      return {
        success: true,
        message: data.message || 'Email xác thực mới đã được gửi thành công!',
        cooldownSeconds: data.cooldownSeconds || 60,
      };
    } catch (err: any) {
      return {
        success: false,
        message: err.message || 'Lỗi mạng khi yêu cầu gửi lại email.',
      };
    }
  }, []);

  const completeOnboarding = async (school: string): Promise<boolean> => {
    try {
      const res = await fetchWithAuth(`/auth/onboarding`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ school }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Hoàn tất thông tin thất bại');
      }
      const data = await res.json();
      if (data.user) {
        setUser(data.user);
        broadcastAuthEvent({ type: 'ONBOARDING_COMPLETED', email: data.user.email, onboardingCompleted: true });
      }
      return true;
    } catch (err) {
      console.error('Onboarding error:', err);
      throw err;
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
        verifyRegistration,
        resendVerification,
        completeOnboarding,
        updateProfile,
        checkSession,
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
