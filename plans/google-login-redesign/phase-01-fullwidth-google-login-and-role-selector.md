# Phase 01: Full-width Google Login & RoleSelector Theme Redesign

## Goal
Redesign nút Google Login thành 100% full-width, cập nhật `RoleSelector` thành Segmented Pills hỗ trợ CSS Variables Light/Dark Mode, và bố trí lại vị trí nút Google Demo Mode.

## Changes Required

### 1. `frontend/src/pages/LoginPage.tsx`
- Sửa container quanh `<GoogleLogin />`: dùng flex full-width và cấu hình prop `width="100%"` (hoặc bọc container flex-1 w-full để iframe `@react-oauth/google` bung rộng 100% bằng ô input).
- Điều chỉnh lại vị trí nút `Xác thực Google (Demo Mode)` thành một tùy chọn nhạt bên dưới nút Google hoặc hợp nhất xuống footer demo accounts.
- Cân chỉnh `gap` và `margin` nhất quán giữa các section.

### 2. `frontend/src/components/auth/RoleSelector.tsx`
- Thay các hardcoded Tailwind dark classes (`bg-slate-800/40`, `text-slate-300`, `border-slate-700`) bằng CSS variables:
  - Background: `var(--bg-main)` / `var(--bg-sub)`
  - Border: `var(--border-color)`
  - Text: `var(--text-main)` / `var(--accent-primary)`
- Chuyển layout từ 3 box chứa emoji rườm rà thành **Segmented Control Tabs (Pill style)** nằm ngang siêu phẳng, gọn và đồng bộ theme.

## Verification
- Chạy frontend dev server / build check (`npm run build` trong `frontend/`).
- Kiểm tra hiển thị nút Google 100% full width trên cả trang Login & Register.
- Kiểm tra chuyển đổi Light Mode & Dark Mode cho RoleSelector trên trang Register.
