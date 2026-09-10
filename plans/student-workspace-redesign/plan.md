# Plan: Student Workspace Redesign (SaaS Layout)

**Date:** 2026-09-10
**Mode:** --hard
**Risk:** normal — UI refactoring & new Student Layout routes while preserving AuthContext and student states

---

## Executive Summary

Chuyển đổi giao diện Học sinh sang **Full-Width Enterprise SaaS Layout** chuẩn mực (Vercel / Shadcn style) với Sidebar cố định (collapsible), Top Bar điều hướng (Breadcrumb, Theme, Profile), và hệ thống Route URL riêng biệt (`/student`, `/student/classes`, `/student/assignments`, `/student/history`). Tất cả giao diện **tuyệt đối không sử dụng icon/emoji trang trí**. Thao tác tham gia lớp bằng mã và nộp bài tập thí nghiệm được thiết kế dưới dạng **Slide-over Drawer** trượt ra từ lề phải.

---

## Status: COMPLETED

---

## Phase Breakdown

- [x] **Phase 01: Student Layout Shell & Route Architecture** (`phase-01-student-layout-and-routing.md`)
- [x] **Phase 02: Classes Management & Join Class Slide-over Drawer** (`phase-02-classes-and-join-drawer.md`)
- [x] **Phase 03: Overview, Assignments & Practice History Pages** (`phase-03-assignments-and-history-pages.md`)

---

## Session Notes
<!-- Updated by cook automatically — do not edit manually -->

**Last active:** 2026-09-10 14:05
**Phase in progress:** Completed
**Status:** All student phases completed & verified with clean `npm run build` (0 TypeScript / JSX errors, 0 icons)

### Decisions made this session
- Tách hẳn trang Học sinh sang cụm route `/student/*` (`/student`, `/student/classes`, `/student/assignments`, `/student/history`).
- Thiết kế 100% tuyệt đối không sử dụng icon/emoji trang trí.
- Tham gia lớp bằng mã dùng `JoinClassDrawer` trượt từ lề phải.
- Xem yêu cầu & gửi báo cáo bài tập thực hành dùng `SubmitAssignmentDrawer` trượt từ lề phải.
- Tự động chuyển hướng tài khoản `STUDENT` từ `/dashboard` sang `/student`.

### Next immediate action
- Ready for user feedback and deployment.

---

## Verification Plan

### Automated Tests
- Build & Type check:
  - `cd frontend && npm run build` (tsc -b && vite build)

### Manual Verification
1. Đăng nhập tài khoản STUDENT tại `/dashboard` -> Hệ thống tự chuyển sang `/student`.
2. Kiểm tra Sidebar không chứa emoji. Bấm "+ Tham gia lớp bằng mã" tại `/student/classes` -> Drawer mở từ lề phải.
3. Nhập mã mời và submit -> Bảng lớp cập nhật thành công.
4. Truy cập `/student/assignments`, nộp báo cáo -> Trạng thái đổi sang "Đã nộp bài" và hiển thị tại `/student/history`.
