# Spec: Quản lý Session & Xác thực Đăng nhập (JWT In-Memory + Stateful HttpOnly Refresh Token)

**Date:** 2026-09-15  
**Status:** Ready

---

## Problem Statement
Hiện tại hệ thống EduLab lưu JWT trực tiếp trong `localStorage` với thời hạn cố định 24h, tiềm ẩn rủi ro rò rỉ qua tấn công XSS và không thể thu hồi token khi người dùng đăng xuất, đổi mật khẩu hoặc bị chiếm quyền. Tính năng này nâng cấp cơ chế xác thực sang mô hình Access Token (15 phút) lưu trong RAM kết hợp Stateful Refresh Token (7 ngày) lưu trong HttpOnly Cookie có quản lý trong PostgreSQL.

---

## User Stories

- **[P1]** As a **User (Student/Teacher/Admin)**, I want my login session to stay active securely across page refreshes and API calls without storing long-lived credentials in localStorage, so that my account is protected against XSS attacks.  
  *Accepted when:* Access Token được lưu trong React state/memory, gửi qua `Authorization: Bearer <token>`; Refresh Token được lưu trong `HttpOnly, Secure, SameSite=Strict` Cookie; F5 tải lại trang tự động khôi phục Access Token qua endpoint `/api/auth/refresh`.

- **[P1]** As a **User**, I want to log out of my current device securely so that no further requests can be made from this browser.  
  *Accepted when:* Gọi `POST /api/auth/logout`, backend đánh dấu thu hồi (`revoked = true`) Refresh Token trong PostgreSQL, gửi Set-Cookie `Max-Age=0`, và frontend xóa Access Token trong RAM rồi chuyển hướng về `/login`.

- **[P1]** As a **User**, I want to log out of all active devices with a single action when I suspect account compromise.  
  *Accepted when:* Gọi `POST /api/auth/logout-all`, backend thu hồi tất cả các Refresh Token đang hoạt động thuộc về `userId` trong cơ sở dữ liệu PostgreSQL.

- **[P2]** As a **System/User**, I want automatic Token Rotation and Reuse Detection on refresh, so that if a stolen refresh token is replayed, all sessions of the user are immediately revoked.  
  *Accepted when:* Mỗi lần `/api/auth/refresh` thành công, token cũ bị thu hồi và token mới được cấp; nếu phát hiện một token đã bị revoked được gửi lại, hệ thống lập tức vô hiệu hóa toàn bộ refresh tokens của tài khoản đó.

- **[P3]** _(Out of scope - Future)_ Giao diện người dùng xem danh sách các phiên đăng nhập chi tiết (IP, vị trí địa lý, tên thiết bị) và nút kick từng phiên riêng lẻ.

---

## Functional Requirements

1. **FR-01 (Database Entity):** Tạo bảng `refresh_tokens` trong PostgreSQL bao gồm các trường:
   - `id` (UUID hoặc BIGINT PK)
   - `user_id` (FK tới users)
   - `token_hash` (Chuỗi mã hóa/hash của refresh token)
   - `expires_at` (Timestamp, 7 ngày kể từ lúc tạo)
   - `revoked` (Boolean, default false)
   - `created_at` (Timestamp)
   - `user_agent` (String, thông tin trình duyệt/thiết bị)
   - `ip_address` (String)

2. **FR-02 (Authentication Endpoints):**
   - `POST /api/auth/login` & `POST /api/auth/google`: Trả về JSON `{ token: "<access_token>", user: {...} }` (TTL 15m) và đính kèm `Set-Cookie: edulab_refresh_token=<raw_token>; HttpOnly; Secure; SameSite=Strict; Path=/api/auth; Max-Age=604800`.
   - `POST /api/auth/refresh`: Đọc Cookie `edulab_refresh_token`, kiểm tra tính hợp lệ trong DB, thực hiện Token Rotation (thu hồi token cũ, tạo token mới, set cookie mới), trả về Access Token mới.
   - `POST /api/auth/logout`: Đọc Cookie `edulab_refresh_token`, đánh dấu `revoked = true` trong DB, trả về Set-Cookie `Max-Age=0`.
   - `POST /api/auth/logout-all`: Đánh dấu `revoked = true` cho tất cả refresh tokens của user hiện tại, trả về Set-Cookie `Max-Age=0`.

3. **FR-03 (Security & CORS):**
   - Cấu hình Spring Security CORS hỗ trợ `allowCredentials(true)` và chỉ cho phép frontend origin hợp lệ (`http://localhost:5173`, production domains).
   - Bảo vệ CSRF cho endpoint `/api/auth/refresh` và `/api/auth/logout` thông qua `SameSite=Strict` cookie và yêu cầu custom header (ví dụ `X-Requested-With: XMLHttpRequest`).

4. **FR-04 (Frontend Auth Architecture):**
   - Loại bỏ hoàn toàn `localStorage.setItem('edulab_token', ...)` và `localStorage.getItem('edulab_token')`.
   - Lưu `accessToken` và `user` trong React state của `AuthContext` (Memory).
   - Tích hợp cơ chế tự động refresh token trong HTTP client interceptor (tự động giữ hàng đợi request khi token hết hạn và phát lại sau khi refresh xong).
   - Khởi tạo phiên khi app load (Silent refresh lúc F5 trang).

---

## Non-Functional Requirements

- **Performance:** 
  - Endpoint `/api/auth/refresh` có thời gian xử lý < 80ms.
  - Index PostgreSQL trên cột `token_hash` và `user_id` để tối ưu hóa truy vấn xác thực.
- **Security:**
  - Token không bao giờ lộ ra trong JavaScript context (đối với Refresh Token).
  - Access Token chỉ có hiệu lực tối đa 15 phút.
  - Refresh Token lưu dạng băm (SHA-256 hoặc BCrypt) trong DB để tránh rò rỉ nếu DB bị dump.
- **Availability:**
  - Định kỳ dọn dẹp các token hết hạn quá 30 ngày bằng background scheduler để tránh phình bảng DB.

---

## Success Criteria

- [ ] Không còn lưu bất kỳ access token / refresh token nào trong `localStorage` hay `sessionStorage`.
- [ ] Người dùng đăng nhập thành công nhận được HttpOnly cookie và Access Token trong RAM.
- [ ] Khi F5 trang web, ứng dụng tự động silent-refresh và giữ nguyên trạng thái đăng nhập mà không bị đá về màn hình Login.
- [ ] Gọi `logout` thu hồi token trong DB và xóa cookie trình duyệt ngay lập tức.
- [ ] Kiểm thử gửi lại Refresh Token cũ sau khi đã refresh (Token Reuse) kích hoạt cơ chế khóa toàn bộ phiên của user.

---

## Out of Scope

- Giao diện Admin/User xem danh sách chi tiết các thiết bị và vị trí địa lý trên bản đồ.
- Tích hợp 2FA / WebAuthn / Passkeys (sẽ làm trong giai đoạn sau).
- Sử dụng Redis làm session store (thống nhất sử dụng PostgreSQL để đơn giản hóa vận hành).

---

## Assumptions

- Trình duyệt người dùng hỗ trợ HttpOnly Cookie và tiêu chuẩn CORS hiện đại (`credentials: 'include'`).
- Cơ sở dữ liệu PostgreSQL đang hoạt động ổn định và kết nối trực tiếp từ Spring Boot.
