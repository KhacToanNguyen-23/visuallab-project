# Phase 01: Student Layout Shell & Route Architecture

**Goal:** Dựng khung Student Layout tràn màn hình (`StudentLayout`, `StudentSidebar`, `StudentHeader` không chứa icon) và cấu hình `react-router-dom` cho cụm route `/student/*`, đồng thời tự động chuyển hướng người dùng STUDENT từ `/dashboard` sang `/student`.

---

## User Stories Covered
- **[P1]** As a Student, I want a full-width Student SaaS layout with a collapsible left sidebar and route-based navigation (`/student`, `/student/classes`, `/student/assignments`, `/student/history`) with zero icons so that I can manage my classes, assignments, and grades with maximum screen space.

---

## Scope of Changes

### [NEW] `frontend/src/components/student/StudentLayout.tsx`
- Component khung bọc ngoài (`StudentLayout`) cho các trang Học sinh. Zero icons.

### [NEW] `frontend/src/components/student/StudentSidebar.tsx`
- Thanh điều hướng bên trái chuẩn SaaS (không icon/emoji):
  - Header: Logo VisualLab + Badge HỌC SINH.
  - Menu Items: `Tổng Quan` (`/student`), `Lớp Học Của Tôi` (`/student/classes`), `Bài Tập Cần Nộp` (`/student/assignments`), `Lịch Sử & Kết Quả` (`/student/history`).

### [NEW] `frontend/src/components/student/StudentHeader.tsx`
- Thanh Header trên cùng (không icon/emoji):
  - Left: Toggle Mobile Sidebar + Breadcrumbs.
  - Right: Toggle Theme Sáng/Tối, Profile Dropdown.

### [MODIFY] `frontend/src/main.tsx`
- Thêm cụm route `/student` bọc trong `ProtectedRoute`.

### [MODIFY] `frontend/src/pages/DashboardPage.tsx`
- Thêm logic redirect: `if (user?.role === 'STUDENT') navigate('/student')`.

---

## Verification Plan

### Automated Tests
- Run `npm run build` inside `frontend/` to ensure clean TypeScript compilation.

### Manual Verification
- Đăng nhập tài khoản STUDENT -> Tự động chuyển đến `/student`.
- Thử bấm chuyển giữa các tab trên Sidebar, kiểm tra URL và active state.
