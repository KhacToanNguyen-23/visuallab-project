# Phase 02: Integrate AuthModal and Public Theme Controls

**Objective:** Wire `AuthModal` into `LandingPage.tsx` and public headers, so clicking "Đăng nhập" or "Đăng ký" opens the modal inline without navigating away. Ensure full Light/Dark theme switching across all public components.

## Steps

1. In `LandingPage.tsx`:
   - Add state: `isAuthModalOpen: boolean`, `authModalTab: 'login' | 'register'`.
   - Update "Đăng Nhập" button handler to set `authModalTab = 'login'` and `isAuthModalOpen = true`.
   - Update "Đăng Ký" button handler to set `authModalTab = 'register'` and `isAuthModalOpen = true`.
   - Render `<AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} initialTab={authModalTab} />`.
2. In `LoginPage.tsx`:
   - Update component so if accessed directly via URL `/login`, it renders `AuthModal` full-screen or redirects cleanly to `/` with modal active.
3. Ensure theme switching using `useTheme()` properly toggles root CSS variables on dark and light modes.
