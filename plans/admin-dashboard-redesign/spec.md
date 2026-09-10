# Spec: Admin Dashboard Redesign (SaaS Layout)

**Date:** 2026-09-10
**Status:** Ready

---

## Problem Statement
Giao diện Admin hiện tại của VisualLab sử dụng bố cục Boxed hẹp giữa màn hình với form tạo tài khoản và bảng dữ liệu đặt chung một khung hình hẹp, làm thông tin bị gò bó, khó thao tác và không đạt chuẩn giao diện SaaS Enterprise hiện đại. Việc nâng cấp lên Full-width SaaS Layout với Navigation Sidebar và Slide-over Drawer giúp tối ưu không gian hiển thị và nâng cao trải nghiệm quản trị.

---

## User Stories

- **[P1]** As an System Administrator, I want a full-width Admin layout with a collapsible left navigation sidebar and route-based navigation so that I can easily navigate between user management, system labs, and audit logs with maximum screen space.
  Accepted when: The layout spans full screen width, sidebar renders active state correctly per URL route (`/admin/users`, `/admin/labs`, `/admin/audit`), and collapses smoothly on small screens.

- **[P1]** As an System Administrator, I want to manage users in a modern full-width data table with filter/search controls and a Slide-over Drawer for account creation/editing so that the table view remains clean and uncluttered.
  Accepted when: Clicking "+ Cấp tài khoản mới" opens a smooth right slide-over drawer containing the creation form, submitting updates the list without pushing down table content, and action dropdowns (`...`) allow role change and account lock/unlock.

- **[P2]** As an System Administrator, I want overview KPI stat cards on the dashboard root (`/admin`) showing quick metrics (Total Users, Teachers, Active Labs, System Status) so that I have instant visibility into platform health.
  Accepted when: Stat cards display clear numbers, icons, and trend indicators on `/admin`.

- **[P3]** As an System Administrator, I want quick keyboard shortcuts (Cmd+K / Ctrl+K) for global admin search.
  Accepted when: Pressing Cmd+K opens a command palette dialog.

---

## Functional Requirements

1. **FR-01 (Admin Layout Architecture):** Implement a full-screen layout component containing:
   - Left Sidebar: Logo, Navigation links (Dashboard, Users, Labs, Audit Logs, Settings), Collapse toggle.
   - Top Header Bar: Breadcrumb tracking, Global search trigger, Dark/Light theme toggle, User Profile dropdown with logout.
   - Main Content Area: Responsive container rendering `react-router-dom` child routes.

2. **FR-02 (User Management View - `/admin/users`):**
   - Page Header: Title "Quản Lý Người Dùng", Subtitle, Primary button "+ Cấp tài khoản mới".
   - Search & Filter Bar: Real-time search input (Name/Email/School), Role Filter dropdown (All, Teacher, Student, Admin), Status Filter (All, Active, Locked).
   - Data Table: Columns for Avatar/Name, Email, Role (colored pill badges), School/Organization, Status, Actions dropdown menu (`...`).
   - Pagination Footer: Page count, Rows per page, Next/Previous controls.

3. **FR-03 (Slide-over Drawer for User Creation & Edit):**
   - Right-side slide-over panel with backdrop.
   - Form fields: Full Name, Email (`@edulab.vn` or custom domain), Role selection, School/Unit.
   - Validation & Submit button with loading state.
   - Toast notification feedback on success/failure.

4. **FR-04 (Account Actions):**
   - Action menu items for each user row: Change Role, Lock/Unlock Account, Reset Password.
   - Confirmation dialog before locking/unlocking accounts.

---

## Non-Functional Requirements

- **Performance:** Page transitions between admin routes render in < 100ms; table filtering operates with zero noticeable UI latency.
- **UI/UX Consistency:** Built using Tailwind CSS with modern SaaS design language (clean borders, crisp pill badges, subtle shadows, consistent dark/light mode compatibility).
- **Responsiveness:** Sidebar auto-collapses on mobile/tablet screens (< 1024px) with a mobile hamburger overlay menu.

---

## Success Criteria

- [ ] Full-width layout replaces the legacy boxed container for all admin routes.
- [ ] Left Navigation Sidebar properly navigates between `/admin`, `/admin/users`, `/admin/labs`, and `/admin/audit`.
- [ ] User creation form is successfully decoupled from table header into a Slide-over Drawer.
- [ ] All existing admin capabilities (creating teacher accounts, searching, locking/activating accounts, changing roles) function without breaking existing backend API contracts.

---

## Out of Scope

- Redesigning non-admin student/teacher lab execution views.
- Backend API schema changes (must reuse existing `/api/admin` endpoints).

---

## Assumptions

- Frontend leverages `react-router-dom` (v7) and Tailwind CSS (v4) already present in `frontend/package.json`.
- Existing backend authentication and role-checking middleware will serve admin endpoints as-is.
