# Phase 2: Google OAuth2 & Role Selection Backend API

**Goal:** Thêm hỗ trợ phân vai trò (Student/Teacher) và tích hợp đăng nhập/đăng ký bằng Google OAuth2 cấp JWT Token.

---

## Deliverables

1. `AuthRequest.java`: Thêm trường `role` (`STUDENT` / `TEACHER`) và `googleIdToken`.
2. `GoogleAuthService.java`: Module verify Google ID Token.
3. `AuthController.java`: Endpoint `POST /api/auth/google`.

---

## Tasks

- [ ] Cập nhật `AuthRequest` DTO.
- [ ] Xây dựng `GoogleAuthService`.
- [ ] Thêm endpoint `POST /api/auth/google` trong `AuthController`.
- [ ] Cập nhật `UserServiceImpl` xử lý đăng ký có Role & Google OAuth user linking.
