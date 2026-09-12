# Spec: User Avatar Dropdown Header Menu

**Date:** 2026-09-11
**Status:** Ready

---

## Problem Statement
When a user is logged in, the public header displayed an awkward "Vào Dashboard" button alongside an isolated avatar circle. Replacing this with a sleek User Avatar Dropdown menu removes clutter and provides clean access to the user's workspace, profile modal, and logout function.

---

## User Stories

- **[P1]** As a logged-in user, I want to click my avatar or name in the header to open a dropdown menu with quick links to my workspace, profile, and logout so that header navigation is clean and modern.
  Accepted when: "Vào Dashboard" button is removed, clicking avatar toggles dropdown menu with "Không Gian Lớp Học / Quản Trị", "Hồ Sơ Cá Nhân", and "Đăng Xuất".

---

## Functional Requirements

1. FR-01: Remove "Vào Dashboard" button from `LandingPage.tsx` header when `user` is logged in.
2. FR-02: Render User Avatar button with avatar circle + user full name + dropdown arrow indicator.
3. FR-03: Add dropdown menu state (`isDropdownOpen: boolean`) and close-on-click-outside / Escape key handler.
4. FR-04: Include 3 dropdown actions:
   - Workspace Link (Navigates to `/student/classes` for Student, `/teacher/classes` for Teacher, `/admin` for Admin).
   - Profile Link (Opens `EditProfileModal`).
   - Logout Link (Logs out user and redirects to `/`).
5. FR-05: Ensure clean production build (`npm run build`) with exit code 0.

---

## Success Criteria

- [ ] "Vào Dashboard" button removed from public header.
- [ ] User Avatar Dropdown menu opens on click and triggers correct actions.
- [ ] `npm run build` succeeds cleanly with exit code 0.
