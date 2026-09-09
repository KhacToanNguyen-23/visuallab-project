# Implementation Plan: Trang Đăng Nhập & Dashboard Người Dùng (EduLab Auth & Dashboard)

**Date:** 2026-09-08  
**Mode:** --hard  
**Risk:** high-risk — Touches authentication, user sessions, security tokens, and protected routes  
**Spec:** [`plans/auth-dashboard/spec.md`](file:///d:/6_OJT/EduLab/plans/auth-dashboard/spec.md)  

---

## Architecture Overview

Hệ thống bổ sung tính năng Xác thực người dùng (Authentication) và Trang quản lý (Dashboard):
1. **Backend (Java Spring Boot)**:
   - **`AuthController` & `UserService`**: Xử lý đăng ký, đăng nhập và xác thực JWT token.
   - **`JwtTokenProvider`**: Sinh và kiểm tra tính hợp lệ của JWT token.
   - **`UserRepository`**: Quản lý thông tin tài khoản người dùng và bài thí nghiệm đã lưu.

2. **Frontend (React 18 + TypeScript + React Router v6)**:
   - **`AuthContext`**: Quản lý trạng thái login, lưu JWT vào localStorage, tự động kèm Header `Authorization: Bearer <token>`.
   - **`LoginPage.tsx`**: Trang đăng nhập/đăng ký giao diện hiện đại (Modern Auth UI, Form validation).
   - **`DashboardPage.tsx`**: Trang Dashboard Bento Grid hiển thị danh sách bài thí nghiệm đã tạo, bài học nổi bật và thông số học tập.
   - **`ProtectedRoute.tsx`**: Điều hướng bảo vệ các trang yêu cầu đăng nhập.

---

## Implementation Phases

- [Phase 1: Spring Boot JWT Auth Backend API](./phase-01-spring-boot-jwt-auth-backend.md)
  - Triển khai Auth Controller, JWT Token Provider, User Repository & Service.
- [Phase 2: React Auth Context & Modern Login Page](./phase-02-react-auth-context-and-login-page.md)
  - Khởi tạo AuthContext, cài đặt React Router v6 và xây dựng trang Đăng nhập / Đăng ký.
- [Phase 3: Bento Grid Dashboard & Protected Routing](./phase-03-bento-grid-dashboard-and-routing.md)
  - Xây dựng trang Dashboard cá nhân hóa và tích hợp chuyển hướng giữa Dashboard và Workspace thí nghiệm.

---

## File Ownership & Phase Mapping

| Phase | Core Files / Components | Coverage |
| :--- | :--- | :--- |
| **Phase 1** | `backend/src/main/java/com/edulab/auth/`, `backend/src/main/java/com/edulab/model/User.java` | **[P1]** JWT Auth API |
| **Phase 2** | `src/context/AuthContext.tsx`, `src/pages/LoginPage.tsx`, `src/components/auth/` | **[P1]** Login/Register UI |
| **Phase 3** | `src/pages/DashboardPage.tsx`, `src/components/dashboard/`, `src/routes/` | **[P1, P2]** Bento Dashboard & Routing |

---

## Risks & Mitigations

1. **Bảo mật JWT Token & XSS/CSRF**:
   - *Khắc phục*: Sử dụng mã hóa SHA-256 JWT Secret, lưu token an toàn và gắn expire time 24h.
2. **Trải nghiệm người dùng chưa đăng nhập (Guest Mode)**:
   - *Khắc phục*: Cho phép dùng thử mô phỏng dạng Guest mà không bắt buộc đăng nhập ngay lập tức; khi nhấn "Lưu bài thí nghiệm" mới gợi ý Đăng nhập.
