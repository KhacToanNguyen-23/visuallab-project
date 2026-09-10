# Plan: Teacher Workspace Redesign (SaaS Layout)

**Date:** 2026-09-10
**Mode:** --hard
**Risk:** normal — UI refactoring & new Teacher Layout routes while preserving AuthContext and class/assignment states

---

## Executive Summary

Chuyển đổi giao diện Giáo viên từ dạng Card thu nhỏ trong `/dashboard` sang **Full-Width Enterprise SaaS Layout** chuẩn mực (Vercel / Shadcn style) với Sidebar cố định (collapsible), Top Bar điều hướng (Breadcrumb, Theme, Profile), và hệ thống Route URL riêng biệt (`/teacher`, `/teacher/classes`, `/teacher/labs`, `/teacher/assign`, `/teacher/grading`). Tất cả giao diện **tuyệt đối không sử dụng icon/emoji trang trí**. Thao tác tạo lớp và chấm điểm được thiết kế dưới dạng **Slide-over Drawer** trượt ra từ lề phải trực tiếp trên trang.

---

## Status: COMPLETED

---

## Phase Breakdown

- [x] **Phase 01: Teacher Layout Shell & Route Architecture** (`phase-01-teacher-layout-and-routing.md`)
- [x] **Phase 02: Class Management & Create Class Slide-over Drawer** (`phase-02-classes-management-and-drawer.md`)
- [x] **Phase 03: Overview, Lab Catalog, Assign & In-place Grading Drawer** (`phase-03-labs-assign-grading-drawers.md`)

---

## Session Notes
<!-- Updated by cook automatically — do not edit manually -->

**Last active:** 2026-09-10 13:56
**Phase in progress:** Completed
**Status:** All teacher phases completed & verified with clean `npm run build` (0 TypeScript / JSX errors, 0 icons)

### Decisions made this session
- Tách hẳn trang Giáo viên sang cụm route `/teacher/*` (`/teacher`, `/teacher/classes`, `/teacher/labs`, `/teacher/assign`, `/teacher/grading`).
- Thiết kế 100% tuyệt đối không sử dụng icon/emoji trang trí.
- Tạo lớp mới dùng `CreateClassDrawer` trượt từ lề phải.
- Chấm bài tiến độ dùng `GradeSubmissionDrawer` trượt từ lề phải trực tiếp trên trang `/teacher/grading` không điều hướng rời trang.
- Tự động chuyển hướng tài khoản `TEACHER` từ `/dashboard` sang `/teacher`.

### Next immediate action
- Ready for user feedback and deployment.

---

## Verification Plan

### Automated Tests
- Build & Type check:
  - `cd frontend && npm run build` (tsc -b && vite build)

### Manual Verification
1. Đăng nhập tài khoản TEACHER tại `/dashboard` -> Hệ thống chuyển hướng mịn sang `/teacher`.
2. Kiểm tra Sidebar không có emoji/icon. Truy cập `/teacher/classes`, bấm "+ Tạo Lớp Mới" -> Drawer trượt từ bên phải ra.
3. Tạo lớp thành công -> Bảng lớp cập nhật ngay.
4. Truy cập `/teacher/grading`, bấm vào dòng học sinh -> Drawer Chấm bài & Nhận xét trượt từ lề phải ra, cập nhật điểm không rời trang.
