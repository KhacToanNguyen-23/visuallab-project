import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const OnboardingPage: React.FC = () => {
  const { user, completeOnboarding, isInitializing } = useAuth();
  const navigate = useNavigate();

  const [school, setSchool] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isInitializing) {
      if (!user) {
        navigate('/');
      } else if (user.onboardingCompleted) {
        navigate('/student');
      }
    }
  }, [user, isInitializing, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!school.trim()) {
      setError('Vui lòng nhập tên trường học hoặc lớp của bạn');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      await completeOnboarding(school.trim());
      navigate('/student');
    } catch (err: any) {
      setError(err.message || 'Cập nhật thông tin thất bại. Vui lòng thử lại.');
      setIsSubmitting(false);
    }
  };

  if (isInitializing || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <div className="w-full max-w-lg p-8 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl relative overflow-hidden">
        {/* Top Accent Gradient */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-blue-500 via-indigo-500 to-purple-500" />

        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 mb-4 border border-indigo-100 dark:border-indigo-800/60 shadow-inner">
            <span className="text-3xl">👋</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Chào mừng bạn đến với EduLab!
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Hãy hoàn thiện thông tin học sinh để bắt đầu trải nghiệm phòng thí nghiệm Vật lý ảo.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Read-only Full Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Họ và Tên
            </label>
            <input
              type="text"
              readOnly
              value={user.fullName || 'Học sinh'}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 text-sm cursor-not-allowed font-medium"
            />
          </div>

          {/* Read-only Email */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Email Xác Thực
            </label>
            <div className="relative">
              <input
                type="email"
                readOnly
                value={user.email}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 text-sm cursor-not-allowed font-medium pr-24"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-200/60 dark:border-emerald-800">
                ✓ Đã xác thực
              </span>
            </div>
          </div>

          {/* Role Badge (Fixed as STUDENT) */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Vai trò tài khoản
            </label>
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/60 text-indigo-900 dark:text-indigo-200 text-sm font-semibold">
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
              Học sinh (Student)
            </div>
          </div>

          {/* School Name Input */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Trường học / Lớp <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="VD: THPT Chuyên Hà Nội - Amsterdam (Lớp 11A1)"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-xs"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !school.trim()}
            className="w-full mt-2 py-3 px-4 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-800 disabled:cursor-not-allowed text-white shadow-lg hover:shadow-indigo-500/25 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <span>Đang lưu thông tin...</span>
            ) : (
              <span>Bắt đầu học tập ngay 🚀</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
export default OnboardingPage;
