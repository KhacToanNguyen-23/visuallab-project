# Phase 1: Dọn Dẹp File Rác & Bảo Mật Mật Khẩu + JWT Config

## Focus
Xóa 2 tệp `InMemoryUserRepository.java` và `InMemoryCurriculumRepository.java`. Chuyển `SECRET_KEY` trong `JwtTokenProvider.java` thành tham số đọc từ `@Value("${jwt.secret:EduLabPhysicsSecretKeyForJwtTokenGeneration2026}")`.

## File Changes
- **DELETE** `backend/src/main/java/com/edulab/repository/InMemoryUserRepository.java`
- **DELETE** `backend/src/main/java/com/edulab/repository/InMemoryCurriculumRepository.java`
- **MODIFY** `backend/src/main/resources/application.properties` (Bổ sung `jwt.secret=${JWT_SECRET:EduLabPhysicsSecretKeyForJwtTokenGeneration2026}`)
- **MODIFY** `backend/src/main/java/com/edulab/auth/JwtTokenProvider.java` (Sử dụng `@Value("${jwt.secret}")`)

## Steps
1. Xóa 2 tệp In-Memory Repository dư thừa.
2. Thêm `jwt.secret` vào `application.properties`.
3. Cập nhật `JwtTokenProvider.java` sử dụng annotation `@Value`.

## Verification
- Biên dịch lại dự án bằng `mvnw compile` hoặc kiểm tra cấu trúc mã nguồn.
