# Phase 01: Teacher Layout Shell & Route Architecture

**Goal:** Dựng khung Teacher Layout tràn màn hình (`TeacherLayout`, `TeacherSidebar`, `TeacherHeader` không chứa icon) và cấu hình `react-router-dom` cho cụm route `/teacher/*`, đồng thời tự động chuyển hướng người dùng TEACHER từ `/dashboard` sang `/teacher`.

---

## User Stories Covered
- **[P1]** As a Teacher, I want a dedicated full-width Teacher layout with a collapsible left sidebar and route-based navigation (`/teacher`, `/teacher/classes`, `/teacher/labs`, `/teacher/assign`, `/teacher/grading`) so that I can manage my classes, lab assignments, and student progress with maximum screen space.

---

## Scope of Changes

### [NEW] `frontend/src/components/teacher/TeacherLayout.tsx`
- Component khung bọc ngoài (`TeacherLayout`) cho các trang Giáo viên.
- Chứa `TeacherSidebar`, `TeacherHeader`, và `<Outlet />` hiển thị nội dung route con. Zero icons.

### [NEW] `frontend/src/components/teacher/TeacherSidebar.tsx`
- Thanh điều hướng bên trái chuẩn SaaS (không icon/emoji):
  - Header: Logo VisualLab + Badge GIÁO VIÊN.
  - Menu Items: `Tổng Quan` (`/teacher`), `Quản Lý Lớp Học` (`/teacher/classes`), `Kho Lab Mẫu` (`/teacher/labs`), `Giao Bài Tập` (`/teacher/assign`), `Sổ Điểm Tiến Độ` (`/teacher/grading`).

### [NEW] `frontend/src/components/teacher/TeacherHeader.tsx`
- Thanh Header trên cùng (không icon/emoji):
  - Left: Toggle Mobile Sidebar + Breadcrumbs.
  - Right: Toggle Theme Sáng/Tối, Profile Dropdown.

### [MODIFY] `frontend/src/main.tsx`
- Thêm cụm route `/teacher` bọc trong `ProtectedRoute`.

### [MODIFY] `frontend/src/pages/DashboardPage.tsx`
- Thêm logic redirect: `if (user?.role === 'TEACHER') navigate('/teacher')`.

---

## Verification Plan

### Automated Tests
- Run `npm run build` inside `frontend/` to ensure clean TypeScript compilation.

### Manual Verification
- Đăng nhập tài khoản TEACHER -> Tự động chuyển đến `/teacher`.
- Thử bấm chuyển giữa các tab trên Sidebar, kiểm tra URL và active state.
