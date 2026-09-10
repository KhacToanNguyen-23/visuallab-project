# Spec: Auth Modal Dialog & Public Frontend Theme System

**Date:** 2026-09-10
**Status:** Ready

---

## Problem Statement
The current Auth experience relies on a standalone `/login` page with redundant "(Demo Mode)" Google buttons, and the public frontend lacks full Light/Dark theme switching capabilities. Replacing the page redirect with an interactive Auth Modal Dialog and wiring `ThemeContext` into the public Header/Landing page provides a seamless, high-end user experience.

---

## User Stories

- **[P1]** As a visitor, I want to click "Đăng nhập" or "Đăng ký" on any public page so that an Auth Modal Dialog opens over the current page with backdrop blur without refreshing or navigating away.
  Accepted when: Modal overlay appears centered with backdrop blur, supports tab switching between Login and Register, closes on backdrop click or Escape key.

- **[P1]** As a user, I want a clean, professional Google OAuth and Email/Password login experience without decorative emojis or confusing "(Demo Mode)" labels.
  Accepted when: "(Demo Mode)" button is removed, form fields have clear labels and inputs with zero decorative emojis.

- **[P1]** As a new student registering an account, my role is fixed to Student (Học sinh) automatically without displaying a role selection dropdown.
  Accepted when: Register form defaults and submits role as `STUDENT` / `STUDENT` without any role picker dropdown.

- **[P1]** As a visitor, I want to toggle between Light and Dark themes from the Header so that the website UI updates instantly across all public components and modal overlays.
  Accepted when: Theme toggle button in Header toggles `ThemeContext` between light and dark modes, applying appropriate theme tokens cleanly across Header, LandingPage, and AuthModal.

---

## Functional Requirements

1. FR-01: Create reusable `AuthModal.tsx` component with tabs ("Đăng nhập", "Đăng ký"), clean Google OAuth button, email/password form fields, submit action, and error feedback.
2. FR-02: Public self-registration (Đăng ký) is exclusively for Students (`STUDENT` role) — hide role dropdown and automatically pass `role: 'STUDENT'` on register submit.
3. FR-03: Update `Header.tsx` and `LandingPage.tsx` to trigger `AuthModal` state (`isOpen`, `initialTab`) instead of navigating to `/login`.
4. FR-04: Integrate `ThemeContext` toggle into `Header.tsx` and ensure CSS theme variables are applied consistently across dark/light mode for `LandingPage`, `Header`, and `AuthModal`.
5. FR-05: Ensure clean production build (`npm run build`) without TypeScript or lint errors.

---

## Non-Functional Requirements

- Performance: Modal open/close animation < 150ms.
- Security: Password inputs properly masked; auth tokens stored securely via existing `AuthContext`.
- Design: Strict adherence to high-end iconless design principles (no decorative emojis/icons).

---

## Success Criteria

- [ ] Auth Modal opens seamlessly over public pages on "Đăng nhập" / "Đăng ký" click.
- [ ] Google "(Demo Mode)" button removed entirely.
- [ ] Dark/Light theme switches instantly across Header, Landing Page, and Auth Modal.
- [ ] `npm run build` succeeds cleanly with exit code 0.

---

## Out of Scope

- Redesigning inner workspace dashboards (`/admin`, `/teacher`, `/student`) which were previously refactored.

---

## Assumptions

- Backend auth endpoints `/api/auth/login`, `/api/auth/register`, `/api/auth/google` remain unchanged.
