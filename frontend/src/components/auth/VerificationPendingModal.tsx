import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { subscribeAuthEvent } from '../../utils/authSync';
import { API_BASE_URL } from '../../config/api';

interface VerificationPendingModalProps {
  isOpen: boolean;
  email: string;
  onClose: () => void;
}

export const VerificationPendingModal: React.FC<VerificationPendingModalProps> = ({
  isOpen,
  email,
  onClose,
}) => {
  const navigate = useNavigate();
  const { resendVerification, checkSession, user } = useAuth();
  const [cooldown, setCooldown] = useState(60);
  const [isResending, setIsResending] = useState(false);
  const [isAutoVerified, setIsAutoVerified] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const isNavigating = useRef(false);

  // Auto-detection of verification completion (Cross-tab broadcast + Backend Status Polling)
  useEffect(() => {
    if (!isOpen || isNavigating.current) return;

    const handleSuccessRedirect = (onboardingCompleted: boolean) => {
      if (isNavigating.current) return;
      isNavigating.current = true;
      setIsAutoVerified(true);
      setTimeout(() => {
        onClose();
        if (onboardingCompleted) {
          navigate('/student');
        } else {
          navigate('/onboarding');
        }
      }, 800);
    };

    // Check if user state in context is already active
    if (user && user.email?.toLowerCase() === email.toLowerCase()) {
      handleSuccessRedirect(user.onboardingCompleted ?? false);
      return;
    }

    // 1. Listen for cross-tab event
    const unsubscribe = subscribeAuthEvent(async (event) => {
      if (event.type === 'VERIFY_SUCCESS' || event.type === 'ONBOARDING_COMPLETED') {
        const currentUser = await checkSession();
        handleSuccessRedirect(event.onboardingCompleted ?? currentUser?.onboardingCompleted ?? false);
      }
    });

    // 2. Poll server registration-status endpoint
    const intervalId = setInterval(async () => {
      if (isNavigating.current) return;
      try {
        const res = await fetch(`${API_BASE_URL}/auth/registration-status?email=${encodeURIComponent(email.toLowerCase().trim())}`);
        if (res.ok) {
          const data = await res.json();
          if (data.status === 'ACTIVE') {
            const currentUser = await checkSession();
            handleSuccessRedirect(data.onboardingCompleted ?? currentUser?.onboardingCompleted ?? false);
          }
        }
      } catch (e) {
        // Ignore network check error
      }
    }, 2500);

    return () => {
      unsubscribe();
      clearInterval(intervalId);
    };
  }, [isOpen, email, user, checkSession, navigate, onClose]);

  useEffect(() => {
    let timer: any;
    if (isOpen && cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isOpen, cooldown]);

  if (!isOpen) return null;

  const handleResend = async () => {
    if (cooldown > 0 || isResending) return;
    setIsResending(true);
    setMessage(null);

    const result = await resendVerification(email);
    setIsResending(false);

    if (result.success) {
      setMessage({ type: 'success', text: result.message || 'Đã gửi lại email xác thực thành công!' });
      setCooldown(result.cooldownSeconds || 60);
    } else {
      setMessage({ type: 'error', text: result.message || 'Không thể gửi lại email xác thực lúc này.' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md max-h-[92vh] overflow-y-auto p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow Header Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-blue-500 via-indigo-500 to-purple-500" />

        <div className="text-center">
          {/* Email Envelope Icon */}
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 mb-4 border border-indigo-100 dark:border-indigo-800/60 shadow-inner">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>

          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            Kiểm tra hộp thư của bạn 📩
          </h3>

          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            Chúng tôi đã gửi liên kết xác thực đến địa chỉ email:
          </p>

          <div className="inline-block px-3.5 py-1.5 rounded-lg bg-indigo-50/80 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800 text-indigo-900 dark:text-indigo-200 font-semibold text-sm mb-4 break-all">
            {email}
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
            Vui lòng nhấn vào nút <strong>Xác Thực Tài Khoản</strong> trong email để hoàn tất đăng ký và bắt đầu sử dụng phòng thí nghiệm ảo EduLab. (Nếu không thấy, vui lòng kiểm tra thư mục Spam).
          </p>

          {isAutoVerified ? (
            <div className="p-3.5 rounded-xl text-xs font-semibold mb-4 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center gap-2 animate-in zoom-in-95 duration-200">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Đã xác thực thành công! Đang tự động chuyển hướng... 🎉</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 mb-4 text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 py-1.5 px-3 rounded-lg border border-slate-200/60 dark:border-slate-800">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
              <span>Tab này sẽ tự động chuyển trang ngay khi bạn bấm xác thực trong email</span>
            </div>
          )}

          {message && !isAutoVerified && (
            <div className={`p-3 rounded-lg text-xs font-medium mb-4 ${
              message.type === 'success' 
                ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' 
                : 'bg-rose-50 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
            }`}>
              {message.text}
            </div>
          )}

          <div className="space-y-3">
            <button
              type="button"
              onClick={handleResend}
              disabled={cooldown > 0 || isResending}
              className={`w-full py-2.5 px-4 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                cooldown > 0 || isResending
                  ? 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-indigo-500/25 active:scale-[0.98]'
              }`}
            >
              {isResending ? (
                <span>Đang gửi lại...</span>
              ) : cooldown > 0 ? (
                <span>Gửi lại email sau ({cooldown}s)</span>
              ) : (
                <span>Gửi lại email xác thực</span>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 px-4 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
            >
              Đóng cửa sổ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
