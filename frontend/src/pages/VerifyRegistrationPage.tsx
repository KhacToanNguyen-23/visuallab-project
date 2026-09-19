import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const VerifyRegistrationPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { verifyRegistration } = useAuth();

  const token = searchParams.get('token');
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const hasRequested = React.useRef(false);

  useEffect(() => {
    if (hasRequested.current) {
      return;
    }

    if (!token || token.trim() === '') {
      setStatus('error');
      setErrorMessage('Mã xác thực không hợp lệ hoặc thiếu tham số trên đường dẫn.');
      return;
    }

    hasRequested.current = true;

    const performVerification = async () => {
      try {
        const result = await verifyRegistration(token.trim());
        if (result.success) {
          setStatus('success');
          // Short delay for smooth UI feedback before navigation
          setTimeout(() => {
            if (result.onboardingCompleted) {
              navigate('/student');
            } else {
              navigate('/onboarding');
            }
          }, 1200);
        } else {
          setStatus('error');
          setErrorMessage(result.message || 'Liên kết xác thực đã hết hạn hoặc đã được sử dụng trước đó.');
        }
      } catch (err: any) {
        setStatus('error');
        setErrorMessage(err.message || 'Có lỗi xảy ra trong quá trình xác thực.');
      }
    };

    performVerification();
  }, [token, verifyRegistration, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <div className="w-full max-w-md p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-blue-500 via-indigo-500 to-emerald-500" />

        {status === 'verifying' && (
          <div className="py-8 space-y-4">
            <div className="mx-auto w-16 h-16 border-4 border-indigo-200 dark:border-indigo-900 border-t-indigo-600 rounded-full animate-spin" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Đang xác thực tài khoản...
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Vui lòng đợi giây lát trong khi EduLab thiết lập tài khoản học sinh của bạn.
            </p>
          </div>
        )}

        {status === 'success' && (
          <div className="py-8 space-y-4 animate-in fade-in zoom-in-95 duration-300">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Xác thực thành công! 🎉
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Tài khoản của bạn đã được kích hoạt. Đang chuyển hướng đến bước hoàn thiện thông tin...
            </p>
          </div>
        )}

        {status === 'error' && (
          <div className="py-6 space-y-4 animate-in fade-in zoom-in-95 duration-300">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Xác thực không thành công
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 bg-rose-50/60 dark:bg-rose-950/40 p-3.5 rounded-xl border border-rose-200/80 dark:border-rose-900/60">
              {errorMessage}
            </p>
            <div className="pt-4 flex flex-col gap-2.5">
              <Link
                to="/"
                className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-indigo-500/25 transition-all text-center"
              >
                Về trang chủ / Đăng ký lại
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default VerifyRegistrationPage;
