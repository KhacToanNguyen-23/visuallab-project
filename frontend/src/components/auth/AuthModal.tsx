import React, { useState, useEffect } from 'react';
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'login' | 'register';
  onSuccessRedirect?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'login',
  onSuccessRedirect,
}) => {
  const [isLoginTab, setIsLoginTab] = useState(initialTab === 'login');
  const [email, setEmail] = useState('student@edulab.vn');
  const [password, setPassword] = useState('123456');
  const [fullName, setFullName] = useState('');
  const [school, setSchool] = useState('');
  const [error, setError] = useState<string | null>(null);

  const { login, register, loginWithGoogle, isLoading } = useAuth();
  const { theme } = useTheme();

  useEffect(() => {
    setIsLoginTab(initialTab === 'login');
    setError(null);
  }, [initialTab, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    let success = false;
    if (isLoginTab) {
      success = await login(email, password);
    } else {
      success = await register(email, password, fullName, 'STUDENT', school);
    }

    if (success) {
      onClose();
      if (onSuccessRedirect) onSuccessRedirect();
    } else {
      setError(isLoginTab ? 'Email hoặc mật khẩu không chính xác.' : 'Đăng ký thất bại. Email có thể đã tồn tại.');
    }
  };

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    setError(null);
    if (!credentialResponse.credential) {
      setError('Không nhận được thông tin xác thực từ Google');
      return;
    }

    const success = await loginWithGoogle(
      '',
      fullName,
      'STUDENT',
      credentialResponse.credential
    );

    if (success) {
      onClose();
      if (onSuccessRedirect) onSuccessRedirect();
    } else {
      setError('Xác thực tài khoản Google với hệ thống thất bại');
    }
  };

  const handleQuickLogin = async (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('123456');
    const success = await login(demoEmail, '123456');
    if (success) {
      onClose();
      if (onSuccessRedirect) onSuccessRedirect();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-sm border rounded-2xl shadow-2xl p-6 sm:p-7 flex flex-col gap-5 relative transition-all duration-200 animate-scaleUp"
        style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={isLoginTab ? 'Đăng nhập tài khoản' : 'Tạo tài khoản'}
      >
        {/* Clean Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg opacity-60 hover:opacity-100 hover:bg-slate-500/10 transition cursor-pointer text-sm font-semibold"
          aria-label="Đóng cửa sổ"
        >
          ✕
        </button>

        {/* Modal Brand & Heading */}
        <div className="space-y-1 pr-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md flex items-center justify-center font-bold text-white text-[10px]" style={{ backgroundColor: 'var(--accent-primary)' }}>
              VL
            </div>
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider opacity-60">VISUALLAB GDPT 2018</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight" style={{ color: 'var(--text-main)' }}>
            {isLoginTab ? 'Đăng nhập' : 'Tạo tài khoản học sinh'}
          </h2>
        </div>

        {/* Segmented Tab Switcher */}
        <div className="flex p-1 rounded-xl border text-xs font-semibold" style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)' }}>
          <button
            type="button"
            onClick={() => { setIsLoginTab(true); setError(null); }}
            className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
              isLoginTab ? 'bg-blue-600 text-white shadow-xs' : 'opacity-70 hover:opacity-100'
            }`}
            style={{ color: isLoginTab ? '#FFFFFF' : 'var(--text-main)' }}
          >
            Đăng nhập
          </button>
          <button
            type="button"
            onClick={() => { setIsLoginTab(false); setError(null); }}
            className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
              !isLoginTab ? 'bg-blue-600 text-white shadow-xs' : 'opacity-70 hover:opacity-100'
            }`}
            style={{ color: !isLoginTab ? '#FFFFFF' : 'var(--text-main)' }}
          >
            Đăng ký
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs px-3 py-2 rounded-lg font-medium text-center">
            {error}
          </div>
        )}

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {!isLoginTab && (
            <>
              <div className="space-y-1">
                <label className="font-semibold block" style={{ color: 'var(--text-main)' }}>Họ và tên</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="Nguyễn Văn A"
                  className="w-full border rounded-lg px-3 py-2 text-xs focus:outline-hidden transition-colors"
                  style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold block" style={{ color: 'var(--text-main)' }}>Trường học / Lớp</label>
                <input
                  type="text"
                  value={school}
                  onChange={e => setSchool(e.target.value)}
                  placeholder="THPT Chuyên..."
                  className="w-full border rounded-lg px-3 py-2 text-xs focus:outline-hidden transition-colors"
                  style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
                />
              </div>
            </>
          )}

          <div className="space-y-1">
            <label className="font-semibold block" style={{ color: 'var(--text-main)' }}>Địa chỉ Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="hocsinh@edulab.vn"
              className="w-full border rounded-lg px-3 py-2 text-xs focus:outline-hidden transition-colors"
              style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold block" style={{ color: 'var(--text-main)' }}>Mật khẩu</label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border rounded-lg px-3 py-2 text-xs focus:outline-hidden transition-colors"
              style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 text-white font-bold text-xs rounded-xl shadow-xs transition opacity-95 hover:opacity-100 cursor-pointer"
            style={{ backgroundColor: 'var(--accent-primary)' }}
          >
            {isLoading ? 'Đang xử lý...' : isLoginTab ? 'Đăng nhập' : 'Tạo tài khoản'}
          </button>
        </form>

        {/* Divider & Google Login */}
        <div className="space-y-3 pt-1">
          <div className="flex items-center gap-2">
            <div className="flex-1 border-t" style={{ borderColor: 'var(--border-color)' }} />
            <span className="text-[10px] uppercase font-mono opacity-50">hoặc</span>
            <div className="flex-1 border-t" style={{ borderColor: 'var(--border-color)' }} />
          </div>

          <div className="w-full flex justify-center [&>div]:w-full [&>div>iframe]:w-full">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError('Google Sign-In thất bại')}
              shape="rectangular"
              size="medium"
              width="100%"
              text={isLoginTab ? 'signin_with' : 'signup_with'}
              theme={theme === 'dark' ? 'filled_black' : 'outline'}
            />
          </div>
        </div>

        {/* Subtle Demo Quick Access Bar */}
        <div className="pt-3 border-t flex items-center justify-between text-[11px]" style={{ borderColor: 'var(--border-color)' }}>
          <span className="opacity-50 font-mono text-[10px]">TÀI KHOẢN MẪU:</span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => handleQuickLogin('student@edulab.vn')}
              className="px-2 py-0.5 rounded border text-[10px] font-semibold hover:bg-slate-500/10 transition cursor-pointer opacity-75 hover:opacity-100"
              style={{ borderColor: 'var(--border-color)' }}
              title="Đăng nhập thử với tài khoản Học sinh"
            >
              Học sinh
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('teacher@edulab.vn')}
              className="px-2 py-0.5 rounded border text-[10px] font-semibold hover:bg-slate-500/10 transition cursor-pointer opacity-75 hover:opacity-100"
              style={{ borderColor: 'var(--border-color)' }}
              title="Đăng nhập thử với tài khoản Giáo viên"
            >
              Giáo viên
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('admin@edulab.vn')}
              className="px-2 py-0.5 rounded border text-[10px] font-semibold hover:bg-slate-500/10 transition cursor-pointer opacity-75 hover:opacity-100"
              style={{ borderColor: 'var(--border-color)' }}
              title="Đăng nhập thử với tài khoản Quản trị"
            >
              Admin
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
