import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { RoleSelector } from '../components/auth/RoleSelector';

export const LoginPage: React.FC = () => {
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [email, setEmail] = useState('teacher@edulab.vn');
  const [password, setPassword] = useState('123456');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'TEACHER' | 'STUDENT' | 'ADMIN'>('STUDENT');
  const [school, setSchool] = useState('');
  const [error, setError] = useState<string | null>(null);

  const { login, register, loginWithGoogle, isLoading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    let success = false;
    if (isLoginTab) {
      success = await login(email, password);
    } else {
      success = await register(email, password, fullName, role, school);
    }

    if (success) {
      navigate('/dashboard');
    } else {
      setError(isLoginTab ? 'Email hoặc mật khẩu không đúng!' : 'Đăng ký thất bại! Email có thể đã tồn tại.');
    }
  };

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    setError(null);
    if (!credentialResponse.credential) {
      setError('Không nhận được Token từ Google!');
      return;
    }

    const success = await loginWithGoogle(
      '',
      fullName,
      role,
      credentialResponse.credential
    );

    if (success) {
      navigate('/dashboard');
    } else {
      setError('Xác thực với Server Google thất bại!');
    }
  };

  const handleGoogleMockFallback = async () => {
    setError(null);
    const googleEmail = `google_user_${Date.now().toString().slice(-4)}@gmail.com`;
    const googleName = fullName || (role === 'TEACHER' ? 'Giáo viên Google User' : 'Học sinh Google User');
    
    const success = await loginWithGoogle(googleEmail, googleName, role, 'mock_google_id_token_' + Date.now());
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Đăng ký / Đăng nhập Google không thành công!');
    }
  };

  const handleQuickLogin = async (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('123456');
    const success = await login(demoEmail, '123456');
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="w-screen min-h-screen flex flex-col items-center justify-center p-4 md:p-8 font-sans transition-colors duration-200" style={{ backgroundColor: 'var(--bg-main)', color: 'var(--text-main)' }}>
      {/* Top Header */}
      <div className="w-full max-w-md flex items-center justify-between mb-6">
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-8 h-8 rounded flex items-center justify-center font-bold text-white text-xs" style={{ backgroundColor: 'var(--accent-primary)' }}>
            VL
          </div>
          <span className="font-bold text-lg tracking-tight">VISUAL<span style={{ color: 'var(--accent-primary)' }}>LAB</span></span>
        </div>

        <button 
          onClick={toggleTheme} 
          className="p-2 rounded border transition-colors flex items-center justify-center text-xs gap-1.5 cursor-pointer"
          style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-panel)', color: 'var(--text-main)' }}
          title={`Chuyển sang giao diện ${theme === 'light' ? 'Tối' : 'Sáng'}`}
        >
          {theme === 'light' ? (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          )}
          <span className="font-medium">{theme === 'light' ? 'Chế độ Tối' : 'Chế độ Sáng'}</span>
        </button>
      </div>

      {/* Main Cisco Academic Flat Card */}
      <div 
        className="w-full max-w-md border p-6 md:p-8 rounded-xl shadow-xs flex flex-col gap-4 transition-colors"
        style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)' }}
      >
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-xl font-bold tracking-tight" style={{ color: 'var(--text-main)' }}>
            {isLoginTab ? 'Đăng nhập Cổng Học thuật' : 'Đăng ký Tài khoản Mới'}
          </h1>
          <p className="text-xs opacity-75" style={{ color: 'var(--text-muted)' }}>
            Nền tảng Thí nghiệm Vật lý Tương tác GDPT 2018
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1 rounded-lg border" style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)' }}>
          <button
            type="button"
            onClick={() => setIsLoginTab(true)}
            className={`flex-1 py-1.5 text-xs font-semibold rounded transition cursor-pointer ${
              isLoginTab ? 'shadow-xs text-white' : 'opacity-70'
            }`}
            style={{ 
              backgroundColor: isLoginTab ? 'var(--accent-primary)' : 'transparent',
              color: isLoginTab ? '#FFFFFF' : 'var(--text-main)'
            }}
          >
            Đăng Nhập
          </button>
          <button
            type="button"
            onClick={() => setIsLoginTab(false)}
            className={`flex-1 py-1.5 text-xs font-semibold rounded transition cursor-pointer ${
              !isLoginTab ? 'shadow-xs text-white' : 'opacity-70'
            }`}
            style={{ 
              backgroundColor: !isLoginTab ? 'var(--accent-primary)' : 'transparent',
              color: !isLoginTab ? '#FFFFFF' : 'var(--text-main)'
            }}
          >
            Đăng Ký
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs px-3 py-2 rounded font-medium text-center">
            [LỖI] {error}
          </div>
        )}

        {!isLoginTab && (
          <RoleSelector selectedRole={role} onSelectRole={setRole} />
        )}

        {/* Real Google OAuth Button + Fallback */}
        <div className="flex flex-col gap-2.5 items-center w-full">
          <div className="w-full flex justify-center [&>div]:w-full [&>div>iframe]:w-full">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError('Google Sign-In thất bại!')}
              shape="rectangular"
              size="large"
              width="100%"
              text={isLoginTab ? 'signin_with' : 'signup_with'}
              theme={theme === 'dark' ? 'filled_black' : 'outline'}
            />
          </div>

          <button
            type="button"
            onClick={handleGoogleMockFallback}
            disabled={isLoading}
            className="w-full py-2 border text-xs font-medium rounded-md transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer hover:opacity-90 active:scale-[0.99]"
            style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
          >
            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>{isLoginTab ? 'Đăng nhập Google (Demo Mode)' : 'Đăng ký Google (Demo Mode)'}</span>
          </button>

          <div className="w-full flex items-center my-1">
            <div className="flex-1 border-t" style={{ borderColor: 'var(--border-color)' }} />
            <span className="px-3 text-[10px] uppercase tracking-widest font-semibold opacity-60" style={{ color: 'var(--text-muted)' }}>Hoặc dùng Email</span>
            <div className="flex-1 border-t" style={{ borderColor: 'var(--border-color)' }} />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1 text-xs">
            <label className="font-semibold" style={{ color: 'var(--text-main)' }}>Địa chỉ Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="nhapemail@school.edu.vn"
              className="border rounded-md px-3 py-2 text-xs focus:outline-none transition-colors"
              style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
            />
          </div>

          <div className="flex flex-col gap-1 text-xs">
            <label className="font-semibold" style={{ color: 'var(--text-main)' }}>Mật khẩu</label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="border rounded-md px-3 py-2 text-xs focus:outline-none transition-colors"
              style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
            />
          </div>

          {!isLoginTab && (
            <>
              <div className="flex flex-col gap-1 text-xs">
                <label className="font-semibold" style={{ color: 'var(--text-main)' }}>Họ và Tên</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="Nguyễn Văn A"
                  className="border rounded-md px-3 py-2 text-xs focus:outline-none transition-colors"
                  style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
                />
              </div>

              <div className="flex flex-col gap-1 text-xs">
                <label className="font-semibold" style={{ color: 'var(--text-main)' }}>Trường học / Đơn vị</label>
                <input
                  type="text"
                  value={school}
                  onChange={e => setSchool(e.target.value)}
                  placeholder="THPT Chuyên Hà Nội - Amsterdam"
                  className="border rounded-md px-3 py-2 text-xs focus:outline-none transition-colors"
                  style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="mt-1 w-full py-2.5 text-white font-bold text-xs rounded transition opacity-90 hover:opacity-100 shadow-xs cursor-pointer"
            style={{ backgroundColor: 'var(--accent-primary)' }}
          >
            {isLoading ? 'Đang xử lý...' : isLoginTab ? 'Đăng Nhập Với Email' : 'Đăng Ký Với Email'}
          </button>
        </form>

        {/* Quick Demo Login */}
        <div className="pt-3 border-t flex flex-col gap-2 mt-1" style={{ borderColor: 'var(--border-color)' }}>
          <span className="text-[10px] font-semibold text-center uppercase tracking-wider opacity-60" style={{ color: 'var(--text-muted)' }}>
            Dùng thử nhanh Tài khoản Demo
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleQuickLogin('admin@edulab.vn')}
              className="py-1.5 text-[11px] font-semibold rounded border transition cursor-pointer"
              style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
            >
              [ADMIN]
            </button>
            <button
              onClick={() => handleQuickLogin('teacher@edulab.vn')}
              className="py-1.5 text-[11px] font-semibold rounded border transition cursor-pointer"
              style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
            >
              [GIÁO VIÊN]
            </button>
            <button
              onClick={() => handleQuickLogin('student@edulab.vn')}
              className="py-1.5 text-[11px] font-semibold rounded border transition cursor-pointer"
              style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
            >
              [HỌC SINH]
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
