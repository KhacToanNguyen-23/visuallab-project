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
      // Self registration is strictly for STUDENT role
      success = await register(email, password, fullName, 'STUDENT', school);
    }

    if (success) {
      onClose();
      if (onSuccessRedirect) onSuccessRedirect();
    } else {
      setError(isLoginTab ? 'Email hoặc mật khẩu không chính xác' : 'Đăng ký thất bại. Email có thể đã được sử dụng.');
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md border rounded-xl shadow-lg p-6 md:p-8 flex flex-col gap-4 relative transition-all duration-150 transform scale-100"
        style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-xs font-semibold p-1.5 rounded-md hover:opacity-80 transition cursor-pointer"
          style={{ color: 'var(--text-muted)' }}
          aria-label="Đóng"
        >
          [Đóng]
        </button>

        {/* Modal Header */}
        <div className="flex flex-col items-center gap-1 text-center pr-6 pl-6">
          <h2 className="text-xl font-bold tracking-tight" style={{ color: 'var(--text-main)' }}>
            {isLoginTab ? 'Đăng Nhập Cổng Học Thuật' : 'Đăng Ký Tài Khoản Học Sinh'}
          </h2>
          <p className="text-xs opacity-75" style={{ color: 'var(--text-muted)' }}>
            {isLoginTab 
              ? 'Nền tảng Thí nghiệm Vật lý Tương tác GDPT 2018' 
              : 'Tài khoản tự đăng ký dành cho Học sinh tham gia lớp và làm bài'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1 rounded-lg border" style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)' }}>
          <button
            type="button"
            onClick={() => { setIsLoginTab(true); setError(null); }}
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
            onClick={() => { setIsLoginTab(false); setError(null); }}
            className={`flex-1 py-1.5 text-xs font-semibold rounded transition cursor-pointer ${
              !isLoginTab ? 'shadow-xs text-white' : 'opacity-70'
            }`}
            style={{ 
              backgroundColor: !isLoginTab ? 'var(--accent-primary)' : 'transparent',
              color: !isLoginTab ? '#FFFFFF' : 'var(--text-main)'
            }}
          >
            Đăng Ký Học Sinh
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs px-3 py-2 rounded font-medium text-center">
            [LỖI] {error}
          </div>
        )}

        {/* Google Login Section */}
        <div className="flex flex-col gap-2.5 items-center w-full">
          <div className="w-full flex justify-center [&>div]:w-full [&>div>iframe]:w-full">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError('Google Sign-In thất bại')}
              shape="rectangular"
              size="large"
              width="100%"
              text={isLoginTab ? 'signin_with' : 'signup_with'}
              theme={theme === 'dark' ? 'filled_black' : 'outline'}
            />
          </div>

          <div className="w-full flex items-center my-1">
            <div className="flex-1 border-t" style={{ borderColor: 'var(--border-color)' }} />
            <span className="px-3 text-[10px] uppercase tracking-widest font-semibold opacity-60" style={{ color: 'var(--text-muted)' }}>Hoặc dùng Email</span>
            <div className="flex-1 border-t" style={{ borderColor: 'var(--border-color)' }} />
          </div>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1 text-xs">
            <label className="font-semibold" style={{ color: 'var(--text-main)' }}>Địa chỉ Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="hocsinh@edulab.vn"
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
                <label className="font-semibold" style={{ color: 'var(--text-main)' }}>Trường học / Lớp</label>
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
            {isLoading ? 'Đang xử lý...' : isLoginTab ? 'Đăng Nhập Email' : 'Đăng Ký Tài Khoản Học Sinh'}
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
