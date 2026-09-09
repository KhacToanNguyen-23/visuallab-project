import React, { createContext, useContext, useState } from 'react';

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
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('edulab_token'));
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('edulab_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, pass: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass }),
      });
      if (!res.ok) throw new Error('Đăng nhập thất bại');
      const data = await res.json();
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('edulab_token', data.token);
      localStorage.setItem('edulab_user', JSON.stringify(data.user));
      return true;
    } catch (err) {
      console.error(err);
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
      const res = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass, fullName, role, school }),
      });
      if (!res.ok) throw new Error('Đăng ký thất bại');
      const data = await res.json();
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('edulab_token', data.token);
      localStorage.setItem('edulab_user', JSON.stringify(data.user));
      return true;
    } catch (err) {
      console.error(err);
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
      const res = await fetch('http://localhost:8080/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          fullName,
          role,
          googleIdToken: googleToken || 'google_auth_token_mock',
        }),
      });
      if (!res.ok) throw new Error('Đăng nhập/Đăng ký Google thất bại');
      const data = await res.json();
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('edulab_token', data.token);
      localStorage.setItem('edulab_user', JSON.stringify(data.user));
      return true;
    } catch (err) {
      console.error(err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('edulab_token');
    localStorage.removeItem('edulab_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, loginWithGoogle, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
