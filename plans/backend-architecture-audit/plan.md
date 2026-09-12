# Plan: Backend Architecture & Security Refactoring

**Mode:** fast
**Risk:** normal — touches backend authentication logic, JWT token provider, and repository files

## Overview
Kế hoạch rà soát và nâng cấp toàn bộ hệ thống Backend Java Spring Boot: loại bỏ repository fallback dư thừa, bảo vệ hằng số bí mật JWT qua biến môi trường, và áp dụng băm mật khẩu bảo mật.

---

## Phases

### Phase 1: Dọn Dẹp File Rác & Bảo Mật Mật Khẩu + JWT Config (P1)
- **File:** `plans/backend-architecture-audit/phase-01-backend-security.md`
- **Mục tiêu:** Xóa `InMemoryUserRepository.java` & `InMemoryCurriculumRepository.java`. Đưa `SECRET_KEY` về `application.properties`. Tích hợp băm mật khẩu `BCrypt` trong `UserServiceImpl`.

---

## Verification Plan
- Chạy `mvnw test` hoặc `mvnw clean compile` trong thư mục `backend/` để kiểm tra biên dịch Java.
