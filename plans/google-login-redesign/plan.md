# Plan: Redesign Google Login Button & Auth Portal Layout

Mode: --fast
Risk: normal — redesign UI components (Google button alignment & RoleSelector theme/tabs)
Spec: plans/google-login-redesign/spec.md

---

## Overview
Cải thiện giao diện Auth Portal bằng cách biến nút Đăng nhập Google thành full-width 100% cân đối với form, đưa nút Google Demo Mode xuống vị trí hợp lý và redesign `RoleSelector` hỗ trợ CSS variables theme (Light/Dark mode) cùng giao diện Segmented Pill Control gọn gàng.

---

## Phases

- [x] **Phase 1: Full-width Google Button & RoleSelector Redesign** (`plans/google-login-redesign/phase-01-fullwidth-google-login-and-role-selector.md`)
  - Covers: [P1] Nút Đăng nhập Google 100% full-width, [P2] Nút Google Demo Mode gọn gàng, [P1] RoleSelector theme & tabs.

---

## File Ownership
- `frontend/src/pages/LoginPage.tsx`
- `frontend/src/components/auth/RoleSelector.tsx`

## Session Notes
<!-- Updated by cook automatically — do not edit manually -->

**Last active:** 2026-09-09 17:59
**Phase in progress:** phase-01-fullwidth-google-login-and-role-selector
**Status:** Phase 1 complete and verified with npm run build.

### Decisions made this session
- Cấu hình GoogleLogin bọc trong flex container `w-full` và `[&>div]:w-full [&>div>iframe]:w-full` cùng prop `width="100%"` và `shape="rectangular"` để chuẩn Google OAuth button giãn đều 100% chiều rộng matching input fields.
- Redesign `RoleSelector.tsx` dùng Segmented Pill Tabs hỗ trợ CSS Theme variables (`var(--bg-main)`, `var(--border-color)`, `var(--text-main)`, `var(--accent-primary)`), loại bỏ các hardcoded Tailwind slate class và emoji icons to gây rườm rà.

### Next immediate action
Complete execution.
