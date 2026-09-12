# Plan: Replace Dashboard Button with User Avatar Dropdown

**Date:** 2026-09-11
**Mode:** --fast
**Risk:** normal — header UI enhancement

---

## Overview

Remove the "Vào Dashboard" button from the public header when logged in. Replace it with an interactive User Avatar Dropdown menu displaying user initials, full name, and role badge, with dropdown links to Workspace, Profile Modal, and Logout.

---

## Proposed Phases

- [file:///d:/Project/FptProject/visuallab-project/plans/user-avatar-dropdown/phase-01-dropdown.md](phase-01-dropdown.md): Replace "Vào Dashboard" button with User Avatar Dropdown component in `LandingPage.tsx`
- [file:///d:/Project/FptProject/visuallab-project/plans/user-avatar-dropdown/phase-02-verification.md](phase-02-verification.md): Run build verification (`npm run build`) and update `feature_list.json`

---

## File Ownership

| Phase | Files Touched |
| ----- | ------------- |
| Phase 01 | `frontend/src/pages/LandingPage.tsx` |
| Phase 02 | Automated build verification |

---

## Verification Plan

### Automated Verification
- `cd frontend && npm run build` (Must complete with exit code 0)

### Manual Verification
- Log in as user -> view header on Landing Page.
- Verify "Vào Dashboard" button is absent.
- Click User Avatar/Name -> verify dropdown menu opens with "Không Gian Lớp Học", "Hồ Sơ Cá Nhân", and "Đăng Xuất".
- Click items -> verify correct navigation/modal actions.
