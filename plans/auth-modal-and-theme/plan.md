# Plan: Auth Modal Overlay & Public Frontend Theme System

**Date:** 2026-09-10
**Mode:** --fast
**Risk:** high-risk — touches authentication flow, modal overlay, and public theme switching

---

## Overview

Convert the standalone `/login` navigation flow into an interactive **Auth Modal Dialog** overlay with backdrop blur, centered card, tab switching, and clean iconless design. Fix registration role strictly to `STUDENT` (no role picker dropdown). Ensure seamless dark/light theme switching across public header, landing page, and auth modal dialog.

---

## Proposed Phases

- [file:///d:/Project/FptProject/visuallab-project/plans/auth-modal-and-theme/phase-01-auth-modal.md](phase-01-auth-modal.md): Build `AuthModal.tsx` component (Tabs, Student-only registration, Clean OAuth, backdrop blur & keyboard close)
- [file:///d:/Project/FptProject/visuallab-project/plans/auth-modal-and-theme/phase-02-integration.md](phase-02-integration.md): Integrate `AuthModal` into `LandingPage.tsx`, `Header.tsx`, `App.tsx` and test `ThemeContext` styling
- [file:///d:/Project/FptProject/visuallab-project/plans/auth-modal-and-theme/phase-03-verification.md](phase-03-verification.md): Run build verification (`npm run build`) and test clean output

---

## File Ownership

| Phase | Files Touched |
| ----- | ------------- |
| Phase 01 | `frontend/src/components/auth/AuthModal.tsx` [NEW] |
| Phase 02 | `frontend/src/pages/LandingPage.tsx`, `frontend/src/components/header/Header.tsx`, `frontend/src/pages/LoginPage.tsx` |
| Phase 03 | Automated verification |

---

## Verification Plan

### Automated Verification
- `cd frontend && npm run build` (Must complete with exit code 0)

### Manual Verification
- Click "Đăng nhập" and "Đăng ký" on Landing Page -> verify Auth Modal opens in backdrop blur without page refresh.
- Check Register tab -> verify Role selection dropdown is absent and role is set to Student (`STUDENT`).
- Click Google sign in button -> verify clean OAuth button without "(Demo Mode)" labels.
- Toggle Theme button -> verify Light and Dark themes apply seamlessly to header, page content, and modal overlay.
