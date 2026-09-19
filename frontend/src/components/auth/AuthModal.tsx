import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { VerificationPendingModal } from './VerificationPendingModal';

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
  const navigate = useNavigate();
  const [isLoginTab, setIsLoginTab] = useState(initialTab === 'login');
  const [email, setEmail] = useState('student@edulab.vn');
  const [password, setPassword] = useState('123456');
  const [fullName, setFullName] = useState('');
  const [school, setSchool] = useState('');
  const [error, setError] = useState<string | null>(null);

  const [pendingEmail, setPendingEmail] = useState<string | null>(null);
  const [showPendingModal, setShowPendingModal] = useState(false);

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

  if (!isOpen && !showPendingModal) return null;

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

    const result = await loginWithGoogle(
      '',
      fullName,
      'STUDENT',
      credentialResponse.credential
    );

    if (result.status === 'PENDING_VERIFICATION') {
      setPendingEmail(result.email || email);
      setShowPendingModal(true);
      return;
    }

    if (result.status === 'SUCCESS') {
      onClose();
      if (result.onboardingCompleted === false) {
        navigate('/onboarding');
      } else if (onSuccessRedirect) {
        onSuccessRedirect();
      }
    } else {
      setError(result.message || 'Xác thực tài khoản Google với hệ thống thất bại');
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
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity duration-200"
          onClick={onClose}
        >
          <div 
            className="w-full max-w-md max-h-[92vh] overflow-y-auto border rounded-2xl shadow-2xl p-5 sm:p-6 flex flex-col gap-3 relative transition-all duration-150 transform scale-100"
            style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-3.5 right-3.5 w-7 h-7 flex items-center justify-center text-xs font-semibold rounded-full transition opacity-70 hover:opacity-100 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800"
              style={{ color: 'var(--text-muted)' }}
              title="Đóng cửa sổ (Esc)"
            >
              ✕
            </button>

            {/* Header */}
            <div className="flex flex-col gap-0.5 text-center pr-6 pl-6 pt-1">
              <h2 className="text-lg font-bold tracking-tight" style={{ color: 'var(--text-main)' }}>
                {isLoginTab ? 'Đăng Nhập EduLab' : 'Đăng Ký Học Sinh'}
              </h2>
              <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                {isLoginTab 
                  ? 'Truy cập phòng thí nghiệm ảo và bài tập'
                  : 'Tạo tài khoản học sinh để trải nghiệm mô phỏng'}
              </p>
            </div>

            {/* Tab Switcher */}
            <div className="grid grid-cols-2 gap-1 p-1 rounded-lg border text-xs font-semibold" style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)' }}>
              <button
                type="button"
                onClick={() => { setIsLoginTab(true); setError(null); }}
                className={`py-1 rounded-md transition cursor-pointer ${
                  isLoginTab 
                    ? 'shadow-xs font-bold' 
                    : 'opacity-70 hover:opacity-100'
                }`}
                style={{
                  backgroundColor: isLoginTab ? 'var(--bg-panel)' : 'transparent',
                  color: isLoginTab ? 'var(--text-main)' : 'var(--text-muted)',
                  border: isLoginTab ? '1px solid var(--border-color)' : 'none'
                }}
              >
                Đăng Nhập
              </button>
              <button
                type="button"
                onClick={() => { setIsLoginTab(false); setError(null); }}
                className={`py-1 rounded-md transition cursor-pointer ${
                  !isLoginTab 
                    ? 'shadow-xs font-bold' 
                    : 'opacity-70 hover:opacity-100'
                }`}
                style={{
                  backgroundColor: !isLoginTab ? 'var(--bg-panel)' : 'transparent',
                  color: !isLoginTab ? 'var(--text-main)' : 'var(--text-muted)',
                  border: !isLoginTab ? '1px solid var(--border-color)' : 'none'
                }}
              >
                Đăng Ký
              </button>
            </div>

            {/* Error Banner */}
            {error && (
              <div 
                className="p-2.5 text-xs rounded-md border font-medium text-center"
                style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  color: 'rgb(239, 68, 68)',
                  borderColor: 'rgba(239, 68, 68, 0.2)'
                }}
              >
                {error}
              </div>
            )}

            {/* Google OAuth Section */}
            <div className="flex flex-col items-center gap-1.5">
              <div className="w-full flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => setError('Đăng nhập Google thất bại')}
                  useOneTap={false}
                  theme={theme === 'dark' ? 'filled_black' : 'outline'}
                  shape="rectangular"
                  text={isLoginTab ? 'signin_with' : 'signup_with'}
                  size="medium"
                  width="100%"
                />
              </div>

              <div className="w-full flex items-center gap-2 my-0.5">
                <div className="flex-1 h-px" style={{ backgroundColor: 'var(--border-color)' }} />
                <span className="text-[10px] uppercase tracking-wider font-semibold opacity-60" style={{ color: 'var(--text-muted)' }}>
                  hoặc email
                </span>
                <div className="flex-1 h-px" style={{ backgroundColor: 'var(--border-color)' }} />
              </div>
            </div>

            {/* Traditional Email/Pass Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
              {!isLoginTab && (
                <div className="flex flex-col gap-0.5">
                  <label className="text-[11px] font-semibold" style={{ color: 'var(--text-main)' }}>
                    Họ và Tên
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nguyễn Văn A"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="px-3 py-1.5 text-xs rounded-lg border outline-hidden transition"
                    style={{
                      backgroundColor: 'var(--bg-main)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-main)'
                    }}
                  />
                </div>
              )}

              <div className="flex flex-col gap-0.5">
                <label className="text-[11px] font-semibold" style={{ color: 'var(--text-main)' }}>
                  Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="px-3 py-1.5 text-xs rounded-lg border outline-hidden transition"
                  style={{
                    backgroundColor: 'var(--bg-main)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-main)'
                  }}
                />
              </div>

              <div className="flex flex-col gap-0.5">
                <label className="text-[11px] font-semibold" style={{ color: 'var(--text-main)' }}>
                  Mật khẩu
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="px-3 py-1.5 text-xs rounded-lg border outline-hidden transition"
                  style={{
                    backgroundColor: 'var(--bg-main)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-main)'
                  }}
                />
              </div>

              {!isLoginTab && (
                <div className="flex flex-col gap-0.5">
                  <label className="text-[11px] font-semibold" style={{ color: 'var(--text-main)' }}>
                    Trường học
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="THPT Chuyên Hà Nội - Amsterdam"
                    value={school}
                    onChange={(e) => setSchool(e.target.value)}
                    className="px-3 py-1.5 text-xs rounded-lg border outline-hidden transition"
                    style={{
                      backgroundColor: 'var(--bg-main)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-main)'
                    }}
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2 mt-0.5 rounded-lg font-semibold text-xs text-white transition shadow-sm cursor-pointer disabled:opacity-50"
                style={{ backgroundColor: 'var(--color-primary, #2563eb)' }}
              >
                {isLoading ? 'Đang xử lý...' : isLoginTab ? 'Đăng Nhập' : 'Đăng Ký Học Sinh'}
              </button>
            </form>

            {/* Quick Demo Login */}
            <div className="pt-2.5 border-t flex flex-col gap-1.5 mt-0.5" style={{ borderColor: 'var(--border-color)' }}>
              <span className="text-[10px] font-semibold text-center uppercase tracking-wider opacity-60" style={{ color: 'var(--text-muted)' }}>
                Dùng thử nhanh Tài khoản Demo
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  onClick={() => handleQuickLogin('admin@edulab.vn')}
                  className="py-1 text-[11px] font-semibold rounded-md border transition cursor-pointer"
                  style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
                >
                  [ADMIN]
                </button>
                <button
                  onClick={() => handleQuickLogin('teacher@edulab.vn')}
                  className="py-1 text-[11px] font-semibold rounded-md border transition cursor-pointer"
                  style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
                >
                  [GIÁO VIÊN]
                </button>
                <button
                  onClick={() => handleQuickLogin('student@edulab.vn')}
                  className="py-1 text-[11px] font-semibold rounded-md border transition cursor-pointer"
                  style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
                >
                  [HỌC SINH]
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showPendingModal && pendingEmail && (
        <VerificationPendingModal
          isOpen={showPendingModal}
          email={pendingEmail}
          onClose={() => {
            setShowPendingModal(false);
            setPendingEmail(null);
            onClose();
          }}
        />
      )}
    </>
  );
};
export default AuthModal;
