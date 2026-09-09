# Phase 1: Spring Boot JWT Auth Backend API

**Goal:** Triển khai các API đăng ký, đăng nhập và sinh JWT Token trên Java Spring Boot.

---

## Deliverables

1. **User & Auth Model**: `User.java`, `AuthRequest.java`, `AuthResponse.java`.
2. **UserRepository**: Interface và InMemory implementation quản lý tài khoản.
3. **JwtTokenProvider**: Module tạo và xác thực JWT token.
4. **AuthController**: REST Endpoints `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`.

---

## Tasks

- [ ] Tạo model `User` (id, email, password, fullName, role, school, experiments).
- [ ] Cài đặt `JwtTokenProvider` mã hóa token HMAC-SHA256.
- [ ] Xây dựng `UserRepository` lưu trữ tài khoản người dùng.
- [ ] Xây dựng `AuthController` và các endpoint đăng ký/đăng nhập.
- [ ] Kiểm thử unit test cho Auth API thành công.
