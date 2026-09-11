# Phase 01: Implement User Avatar Dropdown in Header

**Objective:** Replace "Vào Dashboard" button with User Avatar Dropdown menu in `LandingPage.tsx`.

## Steps

1. In `LandingPage.tsx`:
   - Add state: `isUserDropdownOpen: boolean`.
   - Add click-outside listener to close dropdown when clicking elsewhere.
   - Replace logged-in header section (lines 79-91) with User Avatar trigger (`Avatar Circle + Full Name + Role Badge + Caret Icon`).
   - Render dropdown card menu containing:
     - Header info: Full Name, Email, Role badge.
     - Divider line.
     - Option 1: "Không Gian Lớp Học" / "Quản Trị Hệ Thống" (navigates to `/student/classes`, `/teacher/classes`, or `/admin`).
     - Option 2: "Hồ Sơ Cá Nhân" (opens `EditProfileModal`).
     - Divider line.
     - Option 3: "Đăng Xuất" (calls `logout()` and redirects to `/`).
   - Import and render `EditProfileModal` when user clicks "Hồ Sơ Cá Nhân".
