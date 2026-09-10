# Plan: Admin Dashboard Redesign (SaaS Layout)

**Date:** 2026-09-10
**Mode:** --hard
**Risk:** normal — UI refactoring & new Admin Layout routes while reusing existing backend APIs and state contracts

---

## Executive Summary

Chuyển đổi giao diện Admin hiện tại từ dạng Boxed Card 3-tab chật chội sang **Full-Width Enterprise SaaS Layout** chuẩn mực (Vercel / Shadcn style) với Sidebar cố định (collapsible), Top Bar điều hướng (Breadcrumb, Search, Theme, Profile), và hệ thống Route URL riêng biệt (`/admin`, `/admin/users`, `/admin/labs`, `/admin/audit`). Form tạo/sửa người dùng được tách khỏi đầu trang và chuyển sang dạng **Slide-over Drawer** bên phải màn hình.

---

## Status: COMPLETED

---

## Phase Breakdown

- [x] **Phase 01: Admin Layout Shell & Route Architecture** (`phase-01-admin-layout-and-routing.md`)
- [x] **Phase 02: User Management Page & Slide-over Drawer** (`phase-02-user-management-and-drawer.md`)
- [x] **Phase 03: Overview Dashboard, System Labs & Audit Log Pages** (`phase-03-overview-and-lab-catalog-pages.md`)

---

## Session Notes
<!-- Updated by cook automatically — do not edit manually -->

**Last active:** 2026-09-10 13:42
**Phase in progress:** Completed
**Status:** All phases completed & verified with clean `npm run build` (0 TypeScript / JSX errors)

### Decisions made this session
- Tách biệt hẳn cụm trang Admin ra `/admin/*` (`/admin`, `/admin/users`, `/admin/labs`, `/admin/audit`) bọc trong `AdminLayout` chuẩn Full-width Enterprise SaaS.
- Chuyển Form tạo/sửa tài khoản thành `UserSlideOverDrawer` trượt ra từ bên phải màn hình.
- Thêm Cmd+K Quick Search Command Palette cho toàn bộ hệ thống Admin.

### Next immediate action
- Ready for user feedback and deployment.

---

## Verification Plan

### Automated Tests
- Build & Lint check:
  - `cd frontend && npm run build` (Hoặc Vite compile validation)
  - `cd frontend && npm run lint` (Oxlint check)

### Manual Verification
1. Truy cập tài khoản Admin tại `/admin`. Kiểm tra Sidebar hiển thị đúng full height, responsive collapse.
2. Chuyển sang `/admin/users`: Thử tìm kiếm theo tên, bấm "+ Cấp tài khoản mới" xem Drawer trượt ra từ bên phải màn hình.
3. Nhập dữ liệu trong Drawer và submit -> Bảng dữ liệu cập nhật không bị vỡ layout.
4. Kiểm tra các route `/admin/labs` và `/admin/audit`.
