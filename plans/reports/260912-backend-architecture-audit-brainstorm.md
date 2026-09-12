# Brainstorm Report: Backend Architecture Audit & Refactoring

**Date:** 2026-09-12

## Executive Summary
Kết quả rà soát toàn bộ 50 tệp mã nguồn Java trong hệ thống Backend (`backend/src/main/java`) cho thấy kiến trúc Spring Boot cơ bản đã được thiết lập đúng cấu trúc 3 tầng (Controller -> Service -> Repository). Tuy nhiên, **chưa đạt chuẩn kiến trúc công nghiệp Production/Enterprise** do tồn tại các rủi ro bảo mật nghiêm trọng như **mật khẩu lưu dạng Text thô**, **JWT mã hóa thủ công**, và **thiếu Spring Security FilterChain**.

---

## 1. Thống kê Chi tiết theo 5 Tiêu chí Rà soát

### 📊 Thống kê Tổng quan Số lượng File
- **Tổng số tệp Java nguồn**: 50 tệp
- **Controllers**: 7 tệp (`AuthController`, `ClassroomController`, `AssignmentController`, `SubmissionController`, `LabController`, `CurriculumController`, `StorageController`)
- **Entities/Models**: 10 tệp (`User`, `Classroom`, `ClassEnrollment`, `Assignment`, `AssignmentSubmission`, `StudentAssignmentInstance`, `Lab`, `ExperimentTopic`, `SimulationPreset`, `StudentLabSnapshot`)
- **Services**: 9 Interfaces & 8 Implementation classes
- **Repositories**: 12 Interfaces & 2 In-Memory Fallbacks

---

### 🚨 Tiêu chí 1: Đánh giá Chuẩn Kiến trúc Công nghiệp
- **Điểm đánh giá hiện tại**: **65 / 100 (Chưa đạt chuẩn Production Enterprise)**.
- **Rủi ro kiến trúc & Bảo mật cốt lõi**:
  1. **Mật khẩu lưu Plaintext**: Mật khẩu người dùng được so sánh và lưu trực tiếp dạng văn bản thô (`!user.getPassword().equals(request.password())`) mà không qua mã hóa băm `BCryptPasswordEncoder`.
  2. **Mã hóa JWT Thủ Công**: `JwtTokenProvider.java` tự ghép chuỗi JSON `{"sub":"%s",...}` và mã hóa Base64 bằng mã Java tự viết thay vì dùng thư viện chuẩn `io.jsonwebtoken:jjwt`.
  3. **Thiếu Spring Security**: Dự án chưa có `spring-boot-starter-security`. Các controller bật `@CrossOrigin("*")` tự do và không có bộ lọc `JwtAuthenticationFilter` tập trung ở tầng HTTP.

---

### 🗑️ Tiêu chí 2: Thống kê File Rác / Thừa / Mồ Côi (Junk Files)
1. **`InMemoryUserRepository.java`**: Repository mồ côi (In-Memory Fallback), không được sử dụng khi Spring Data JPA chạy.
2. **`InMemoryCurriculumRepository.java`**: Repository mồ côi tương tự.
3. **`HELP.md`**: Tệp tài liệu mặc định sinh ra từ Spring Initializr.

---

### 📌 Tiêu chí 3: Thống kê File Fix Cứng (Hardcoded Credentials)
1. **`JwtTokenProvider.java`**: Fix cứng `SECRET_KEY = "EduLabPhysicsSecretKeyForJwtTokenGeneration2026"` trực tiếp trong Java code.
2. **`application.properties`**: Fix cứng `spring.datasource.password=12345` và `spring.datasource.url=jdbc:postgresql://localhost:5432/edulab` thiếu biến môi trường dự phòng.

---

### 🛡️ Tiêu chí 4: Lỗi Phân Quyền & Validation ở Controllers (Role & API Hardening)
- Thiếu các Annotation Validation (`@Valid`, `@NotBlank`, `@Email`) tại tầng Controller DTOs (`AuthRequest`).
- Các đường dẫn API nhạy cảm (`/api/classes`, `/api/assignments`) không kiểm tra xem Token gửi lên có đúng Role `TEACHER` hay `ADMIN` ở tầng Filter Server.

---

## 2. Kế Hoạch Nâng Cấp Đề Xuất (Refactoring Plan Options)

### Phase 1: Chuẩn Hóa Bảo Mật & Mã Hóa (Security Hardening - Phải làm ngay)
- Tích hợp mã hóa **BCrypt** cho mật khẩu người dùng trong `UserServiceImpl.java`.
- Đưa `JWT_SECRET` trong `JwtTokenProvider.java` về `application.properties` (`${JWT_SECRET:...}`).
- Xóa các file `InMemory*Repository.java` dư thừa.

### Phase 2: Nâng Cấp Spring Security & Token Interceptor (Enterprise Security - Nâng cao)
- Bổ sung `spring-boot-starter-security` và `jjwt` vào `pom.xml`.
- Tạo `SecurityConfig.java` và `JwtAuthenticationFilter.java` phân quyền API chuẩn theo Role (`ROLE_ADMIN`, `ROLE_TEACHER`, `ROLE_STUDENT`).

---

## 🚀 Kế Hoạch Thực Thi (Cook Command)
```bash
$bb-cook --fast plans/backend-architecture-audit/plan.md
```
