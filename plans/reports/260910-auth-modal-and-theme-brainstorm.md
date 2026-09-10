# Brainstorm: Redesign Auth Experience (Modal Dialog) & Public Theme System

**Date:** 2026-09-10

## Ideas Explored
- **Option 1 (Standalone Auth Page):** Keep `/login` and `/register` as separate pages. (Dismissed: abrupt navigation context break, less sleek UX for visitors).
- **Option 2 (Modal Dialog Overlay + Dark/Light Theme Support):** Convert Auth into an inline Modal Dialog overlay on top of current view with backdrop blur, tab switching (Login / Register), clean iconless OAuth/Form design, and dark/light theme toggle integrated into header and public pages. (Selected).

## User's Direction
- Remove "(Demo Mode)" Google login button completely.
- Professional iconless UI (zero decorative emojis or icons in forms and headers).
- Auth opens as a centered modal dialog overlay when clicking "Đăng nhập" / "Đăng ký" instead of navigating away to `/login`.
- Registration is strictly for **Students** (`STUDENT` role) — no role dropdown selection shown.
- Seamless Light / Dark theme support across public frontend pages (`LandingPage`, `Header`, `AuthModal`).

## Open Questions
- None. Requirements confirmed.

## Risks
- Accessibility & keyboard navigation (focus trap, Escape key closing modal) must be maintained.
- Ensuring state synchronization between modal login and AuthContext.
