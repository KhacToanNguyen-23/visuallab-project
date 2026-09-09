# Implementation Plan: Landing Page, Role Selection, Google OAuth & PostgreSQL Integration

**Date:** 2026-09-09  
**Mode:** --hard  
**Risk:** high-risk — Touches Database Schema (PostgreSQL JPA), Authentication Flow (JWT + Google OAuth), User Roles, and Main App Routing  
**Spec:** [`plans/landing-oauth-postgre/spec.md`](file:///d:/6_OJT/EduLab/plans/landing-oauth-postgre/spec.md)  

---

## 1. Executive Summary

Bản kế hoạch triển khai nâng cấp toàn bộ hệ thống EduLab theo yêu cầu:
1. **Landing Page đầu tiên**: Khi mở trang web `/`, người dùng được tiếp cận Trang giới thiệu sản phẩm hiện đại (Landing Page) trước khi vào ứng dụng.
2. **Đăng ký phân Role**: Người dùng chủ động chọn **Student (Học sinh)** hoặc **Teacher (Giáo viên)** khi tạo tài khoản.
3. **Google OAuth + JWT Integration**: Đăng ký và Đăng nhập 1-click thông qua tài khoản Google, tự động liên kết và sinh JWT Token.
4. **PostgreSQL Database backend**: Chuyển đổi lưu trữ tài khoản người dùng và dữ liệu từ In-Memory sang PostgreSQL chuẩn doanh nghiệp với Spring Data JPA.

---

## 2. Technical Architecture & Component Changes

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           React Frontend                                │
│                                                                         │
│  [/] LandingPage ──> [/login] AuthPage (Role: Student/Teacher, Google)  │
│                             │                                           │
│                             ▼ JWT Token                                 │
│  [/dashboard] DashboardPage (Student/Teacher) <─> [/simulation] Canvas  │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │ REST API / JWT
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                       Spring Boot Backend                               │
│                                                                         │
│   AuthController ──> UserService / JwtTokenProvider / GoogleAuthService  │
│                             │                                           │
│                             ▼ JPA Repository                            │
│                  PostgreSQL Database (users table)                      │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Implementation Phases & Files Breakdown

### Phase 1: PostgreSQL & Spring Data JPA Database Setup (Backend)
- **Files to modify/create**:
  - `backend/pom.xml`: Thêm dependency `org.postgresql:postgresql` và `spring-boot-starter-data-jpa`.
  - `backend/src/main/resources/application.yml`: Cấu hình datasource PostgreSQL (`jdbc:postgresql://localhost:5432/edulab`) kèm H2 fallback mode cho dev test.
  - `backend/src/main/java/com/edulab/model/User.java`: Chuyển đổi thành JPA `@Entity` với `@Table(name = "users")`, trường `role` (`STUDENT` / `TEACHER`), `provider` (`LOCAL` / `GOOGLE`).
  - `backend/src/main/java/com/edulab/repository/UserRepository.java`: Thừa kế `JpaRepository<User, String>`.

### Phase 2: Google OAuth2 & Role Selection Backend API
- **Files to modify/create**:
  - `backend/src/main/java/com/edulab/auth/dto/AuthRequest.java`: Thêm trường `role` và `googleIdToken`.
  - `backend/src/main/java/com/edulab/service/GoogleAuthService.java`: Verify Google ID Token và trả về thông tin Google Account (Email, Name, Picture).
  - `backend/src/main/java/com/edulab/controller/AuthController.java`: Thêm endpoint `POST /api/auth/google`.

### Phase 3: Frontend Landing Page, Role Selector & Google Login UI
- **Files to modify/create**:
  - `frontend/src/pages/LandingPage.tsx`: Trang giới thiệu sản phẩm cao cấp (Hero banner 3D/Glassmorphism, tính năng mô phỏng, bảng phân biệt Học sinh & Giáo viên, nút bấm Đăng ký / Đăng nhập).
  - `frontend/src/components/auth/RoleSelector.tsx`: Component chọn Role trực quan (Thẻ chọn Học sinh / Giáo viên kèm icon minh họa).
  - `frontend/src/pages/LoginPage.tsx`: Cập nhật tab Đăng ký tích hợp RoleSelector và nút "Đăng nhập với Google".
  - `frontend/src/App.tsx` & Routing: Thiết lập định tuyến `/` -> `LandingPage`, `/login` -> `LoginPage`, `/dashboard` -> `DashboardPage`.

---

## 4. Verification Plan

### Automated Verification:
- **Backend Build & JPA Test**: Chạy `mvn clean test` kiểm tra Spring Data JPA repository và `AuthControllerTest`.
- **Frontend Build**: Chạy `npm run build` đảm bảo không có lỗi TypeScript hay JSX syntax.

### Manual / Visual Verification:
- Truy cập `http://localhost:5173/`: Kiểm tra trang Landing Page xuất hiện đầu tiên.
- Thử Đăng ký tài khoản chọn role `TEACHER` hoặc `STUDENT`.
- Thử Đăng nhập bằng Google và kiểm tra thông tin JWT Token & Role được lưu đúng trong PostgreSQL / local State.
