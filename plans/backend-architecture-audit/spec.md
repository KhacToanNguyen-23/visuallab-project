# Feature Spec: Backend Security & Industrial Architecture Refactoring

**Status:** Draft / Planned
**Date:** 2026-09-12
**Target Area:** `backend/src/main/java/com/edulab`

## 1. Context & Purpose
Rà soát và nâng cấp toàn bộ dự án Backend (`backend/`) theo chuẩn kiến trúc Spring Boot Enterprise. Chuẩn hóa mã hóa mật khẩu, bảo mật JWT Secret, loại bỏ tệp fallback dư thừa và thiết lập kiểm tra hợp lệ dữ liệu DTO.

## 2. Requirements & Scope

### P1 — Essential Security & Cleanup (Phải làm ngay)
- [ ] **Mã hóa Mật khẩu BCrypt**: Mã hóa mật khẩu người dùng với `BCrypt` trong `UserServiceImpl.java` thay vì lưu plaintext.
- [ ] **Bảo mật JWT Secret Key**: Đưa `SECRET_KEY` từ `JwtTokenProvider.java` vào `application.properties` với biến môi trường `JWT_SECRET`.
- [ ] **Xóa file rác**: Xóa `InMemoryUserRepository.java` và `InMemoryCurriculumRepository.java` dư thừa.

### P2 — Security & Validation Hardening (Nâng cấp)
- [ ] **Validation DTOs**: Thêm kiểm tra hợp lệ `@NotBlank`, `@Email` cho DTOs đăng nhập/đăng ký.
- [ ] **Cấu hình CORS tập trung**: Thống nhất cấu hình CORS trong Spring Boot thay vì gắn `@CrossOrigin("*")` thủ công ở từng Controller.

## 3. Success Criteria
- [ ] Backend build thành công (`mvnw clean compile` hoặc `mvn test`).
- [ ] Mật khẩu tạo mới hoặc cập nhật được băm mã hóa an toàn bằng BCrypt.
- [ ] Không còn secret key bị fix cứng trực tiếp trong file Java.
