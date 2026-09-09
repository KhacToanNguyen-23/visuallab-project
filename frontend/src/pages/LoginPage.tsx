import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
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
    <div className="w-screen min-h-screen bg-slate-950 flex items-center justify-center p-4 md:p-8 relative font-sans">
      {/* Background Glow Orbs */}
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900/90 backdrop-blur-xl border border-slate-800 p-6 md:p-8 rounded-2xl shadow-2xl relative z-10 flex flex-col gap-4 text-white my-auto">
        <div className="flex flex-col items-center gap-1.5 text-center">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-xl shadow-lg">
            ⚛️
          </div>
          <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
            EduLab Physics
          </h1>
          <p className="text-[11px] text-slate-400">Nền tảng Thí nghiệm Vật lý Tương tác GDPT 2018</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-950/80 p-1 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => setIsLoginTab(true)}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition ${
              isLoginTab ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Đăng Nhập
          </button>
          <button
            type="button"
            onClick={() => setIsLoginTab(false)}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition ${
              !isLoginTab ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Đăng Ký
          </button>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/40 text-red-300 text-xs px-3 py-1.5 rounded-lg text-center font-medium">
            ⚠️ {error}
          </div>
        )}

        {/* Role Selector shown for Registration */}
        {!isLoginTab && (
          <RoleSelector selectedRole={role} onSelectRole={setRole} />
        )}

        {/* Real Google OAuth Button + Fallback */}
        <div className="flex flex-col gap-2 items-center">
          <div className="w-full flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError('Google Sign-In thất bại!')}
              shape="pill"
              size="medium"
              text={isLoginTab ? 'signin_with' : 'signup_with'}
              theme="filled_blue"
            />
          </div>

          <button
            type="button"
            onClick={handleGoogleMockFallback}
            disabled={isLoading}
            className="w-full py-1.5 bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700 text-[11px] rounded-lg transition flex items-center justify-center gap-2 cursor-pointer"
          >
            ⚡ Đăng ký / Đăng nhập Google Nhanh (Demo Mode)
          </button>

          <div className="w-full flex items-center my-0.5">
            <div className="flex-1 border-t border-slate-800" />
            <span className="px-3 text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Hoặc dùng Email</span>
            <div className="flex-1 border-t border-slate-800" />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
          <div className="flex flex-col gap-1 text-xs">
            <label className="text-slate-300 font-medium">Địa chỉ Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="nhapemail@school.edu.vn"
              className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          <div className="flex flex-col gap-1 text-xs">
            <label className="text-slate-300 font-medium">Mật khẩu</label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          {!isLoginTab && (
            <>
              <div className="flex flex-col gap-1 text-xs">
                <label className="text-slate-300 font-medium">Họ và Tên</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="Nguyễn Văn A"
                  className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-blue-500 transition"
                />
              </div>

              <div className="flex flex-col gap-1 text-xs">
                <label className="text-slate-300 font-medium">Trường học</label>
                <input
                  type="text"
                  value={school}
                  onChange={e => setSchool(e.target.value)}
                  placeholder="THPT Chuyên Hà Nội - Amsterdam"
                  className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-blue-500 transition"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="mt-1 w-full py-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold text-xs rounded-lg transition shadow-lg disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? 'Đang xử lý...' : isLoginTab ? 'Đăng Nhập Với Email' : 'Đăng Ký Với Email'}
          </button>
        </form>

        {/* Quick Demo Login */}
        <div className="pt-2 border-t border-slate-800 flex flex-col gap-1.5">
          <span className="text-[10px] text-slate-500 font-medium text-center uppercase tracking-wider">
            Dùng thử tài khoản Demo
          </span>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              onClick={() => handleQuickLogin('admin@edulab.vn')}
              className="py-1.5 bg-rose-900/40 hover:bg-rose-800 text-rose-300 text-[11px] rounded-lg border border-rose-700/50 transition cursor-pointer font-medium"
            >
              🛡️ Admin Demo
            </button>
            <button
              onClick={() => handleQuickLogin('teacher@edulab.vn')}
              className="py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] rounded-lg border border-slate-700 transition cursor-pointer font-medium"
            >
              👨‍🏫 Giáo viên
            </button>
            <button
              onClick={() => handleQuickLogin('student@edulab.vn')}
              className="py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] rounded-lg border border-slate-700 transition cursor-pointer font-medium"
            >
              🧑‍🎓 Học sinh
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
