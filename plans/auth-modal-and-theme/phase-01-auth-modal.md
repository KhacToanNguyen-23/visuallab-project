# Phase 01: Create Reusable AuthModal Component

**Objective:** Build `AuthModal.tsx` as a centered dialog overlay with backdrop blur, tab switching between Login and Register, Student-only registration (`STUDENT` role), clean Google OAuth, zero icons/emojis, and keyboard (Escape) / backdrop click close handlers.

## Steps

1. Create `frontend/src/components/auth/AuthModal.tsx`.
2. Implement modal props: `isOpen: boolean`, `onClose: () => void`, `initialTab?: 'login' | 'register'`.
3. Render fixed backdrop (`bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4`).
4. Implement tab header ("Đăng nhập", "Đăng ký").
5. On "Đăng ký" tab, hide any role selection dropdown and hardcode `role` state to `'STUDENT'`.
6. Include email, password, full name, and school fields using theme CSS variables (`var(--bg-panel)`, `var(--bg-main)`, `var(--text-main)`, `var(--border-color)`).
7. Clean up Google Sign In button (remove "(Demo Mode)" wording from UI text).
8. Support Escape key listener to trigger `onClose()`.
