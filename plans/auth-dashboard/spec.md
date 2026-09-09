# Spec: Trang Đăng Nhập & Dashboard Người Dùng (EduLab Auth & Dashboard)

**Date:** 2026-09-08  
**Status:** Ready  

---

## Problem Statement

Để hỗ trợ cá nhân hóa trải nghiệm học tập, học sinh và giáo viên cần hệ thống Đăng nhập / Đăng ký và trang Dashboard tổng quan. Nơi đây lưu giữ lịch sử các bài thí nghiệm đã thực hiện, các sơ đồ mạch điện/vật lý đã lưu, bài tập được giao và quản lý hồ sơ cá nhân.

---

## User Stories

- **[P1]** Là một người dùng (Học sinh/Giáo viên), tôi muốn Đăng nhập / Đăng ký tài khoản với Email và Mật khẩu để bảo mật dữ liệu cá nhân.
  - *Acceptance Criteria:* Trả về JWT Token hợp lệ khi đăng nhập thành công; hiển thị thông báo lỗi rõ ràng nếu email hoặc mật khẩu không đúng.
- **[P1]** Là một người dùng đã đăng nhập, tôi muốn truy cập trang Dashboard để xem danh sách các bài thí nghiệm đã lưu, tìm kiếm bài thí nghiệm mẫu và kích hoạt bài làm chỉ với 1 click.
  - *Acceptance Criteria:* Dashboard hiển thị dạng Bento Grid trực quan, danh sách bài thí nghiệm kèm hình ảnh/icon minh họa, bộ lọc theo môn học (Điện, Cơ, Quang).
- **[P2]** Là một người dùng, tôi muốn cập nhật thông tin cá nhân (Tên hiển thị, Trường học, Khối lớp) và Đăng xuất an toàn.
  - *Acceptance Criteria:* Xóa JWT Token khỏi localStorage/sessionStorage khi đăng xuất; bảo vệ các route riêng tư (Protected Routes).

---

## Technical Architecture & Stack

- **Backend (Java Spring Boot)**:
  - Spring Security + JWT Authentication (Stateless session).
  - Endpoints:
    - `POST /api/auth/register` (Đăng ký)
    - `POST /api/auth/login` (Đăng nhập -> Trả về JWT Token & User Info)
    - `GET /api/user/profile` (Lấy thông tin user hiện tại)
    - `GET /api/user/experiments` (Lấy danh sách bài thí nghiệm cá nhân)
- **Frontend (React + TypeScript)**:
  - React Router v6 cho điều hướng (`/login`, `/dashboard`, `/simulation`).
  - AuthContext (`src/context/AuthContext.tsx`) quản lý JWT token & user state.
  - Page Component `LoginPage.tsx` & `DashboardPage.tsx` thiết kế cao cấp (Glassmorphism, Bento Grid).

---

## Success Criteria

- [ ] Đăng nhập / Đăng ký hoạt động chính xác với JWT Token.
- [ ] Bảo vệ Route (`/dashboard` & `/simulation` yêu cầu đăng nhập hoặc cho phép dùng thử Demo).
- [ ] Dashboard hiển thị danh sách bài thí nghiệm cá nhân và khởi chạy mượt mà.
