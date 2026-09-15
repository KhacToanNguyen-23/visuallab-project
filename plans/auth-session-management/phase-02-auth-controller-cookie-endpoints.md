# Phase 02: AuthController Endpoints, Cookie Management & CORS

**Parent Plan:** `plans/auth-session-management/plan.md`  
**Stories Covered:** FR-02, FR-03, P1, P2

---

## Objective
Nâng cấp `AuthController` và cấu hình CORS / Security để phát hành Cookie HttpOnly an toàn, hỗ trợ refresh token, logout thiết bị hiện tại, logout tất cả thiết bị và bảo vệ CSRF.

---

## Detailed Tasks

1. **Cấu hình Cookie Helper:**
   - Tạo tiện ích sinh `ResponseCookie` chuẩn:
     - `Name: edulab_refresh_token`
     - `HttpOnly: true`
     - `Secure: false` (ở dev HTTP localhost) / `true` (ở production HTTPS)
     - `Path: /api/auth`
     - `SameSite: Strict` (hoặc `Lax`)
     - `MaxAge: 7 * 24 * 3600` (khi login/refresh) hoặc `MaxAge: 0` (khi logout)

2. **Cấu hình CORS toàn cục cho Spring Boot:**
   - File: `backend/src/main/java/com/edulab/config/WebCorsConfig.java` hoặc cập nhật trên controller.
   - Cho phép origins: `http://localhost:5173`, `http://localhost:3000`, `http://127.0.0.1:5173`.
   - `allowCredentials(true)`
   - Allowed headers: `Authorization`, `Content-Type`, `X-Requested-With`, `Accept`.
   - Allowed methods: `GET`, `POST`, `PUT`, `DELETE`, `OPTIONS`.

3. **Thêm/Cập nhật Endpoints trong `AuthController`:**
   - `POST /api/auth/login` & `/register` & `/google`:
     - Trả về JSON: `{ token: "<access_token_15m>", user: {...} }`
     - Set Header: `Set-Cookie: edulab_refresh_token=...`
   - `POST /api/auth/refresh`:
     - Nhận cookie `edulab_refresh_token` từ `@CookieValue`.
     - Gọi `RefreshTokenService.rotateToken(rawToken, userAgent, ipAddress)`.
     - Nếu hợp lệ: Trả về `{ token: "<new_access_token>", user: {...} }` kèm `Set-Cookie` mới.
     - Nếu không hợp lệ hoặc bị reuse: Trả về 401 Unauthorized kèm xóa cookie (`MaxAge=0`).
   - `POST /api/auth/logout`:
     - Đọc cookie `edulab_refresh_token`, đánh dấu `revoked = true` cho token đó.
     - Trả về 200 OK kèm `Set-Cookie: edulab_refresh_token=; Max-Age=0`.
   - `POST /api/auth/logout-all`:
     - Lấy user từ Bearer access token hoặc refresh token, thu hồi toàn bộ token của user.
     - Trả về 200 OK kèm xóa cookie.

---

## Verification
- Chạy backend Spring Boot.
- Test bằng Postman hoặc curl: login -> kiểm tra header `Set-Cookie`, gọi `/refresh` kiểm tra token rotation, gọi `/logout` kiểm tra cookie bị xóa.
