# Brainstorm: Quản lý Session & Xác thực Đăng nhập (JWT HttpOnly Cookie + Stateful Refresh Token)

**Date:** 2026-09-15

## Ideas Explored
1. **Stateless JWT trong `localStorage` (Hiện tại):** Đơn giản nhưng dễ bị tấn công XSS, không thể thu hồi token tức thì từ backend khi cần logout hoặc đổi mật khẩu.
2. **Double HttpOnly Cookies (Cả Access Token & Refresh Token trong Cookie):** Miễn nhiễm XSS nhưng tăng nguy cơ CSRF trên tất cả các request API nghiệp vụ, cần cấu hình phức tạp với CSRF Token cho từng method mutating.
3. **Session Cookie truyền thống kết hợp Redis:** Đơn giản nhưng phụ thuộc hạ tầng Redis riêng, mất tính phân tán nhẹ nhàng của JWT.
4. **JWT In-Memory + Stateful Refresh Token trong HttpOnly Cookie (Được chọn):** Access Token (15 phút) lưu trong RAM của React SPA, Refresh Token (7 ngày) lưu HttpOnly Cookie và kiểm soát trạng thái trong bảng PostgreSQL.

## User's Direction
- **Lưu trữ Token phía Client:** Access Token lưu trong Memory (React State / In-memory variable), truyền qua header `Authorization: Bearer <token>`. Refresh Token lưu trong `HttpOnly`, `Secure`, `SameSite=Strict` Cookie.
- **Quản lý Session phía Backend:** Lưu Refresh Token vào cơ sở dữ liệu PostgreSQL (`refresh_tokens` table) để quản lý trạng thái (revoked, expiry, device/user-agent info).
- **Cơ chế Logout:**
  - Logout thiết bị hiện tại: Thu hồi Refresh Token tương ứng và xóa cookie.
  - Logout tất cả thiết bị: Đánh dấu thu hồi toàn bộ Refresh Token của user đó trong PostgreSQL.
- **Cơ chế Token Rotation:** Mỗi lần gọi refresh thành công, backend cấp cặp Access Token + Refresh Token mới và thu hồi token cũ. Nếu phát hiện Refresh Token cũ đã bị thu hồi mà vẫn gửi lên (Token Reuse), backend tự động thu hồi toàn bộ phiên của user để phòng thủ.
- **Thời hạn Token:** Access Token: 15 phút | Refresh Token: 7 ngày.

## Open Questions
- Cơ chế tự động dọn dẹp (cleanup job/scheduler) cho các refresh token đã hết hạn hoặc bị revoked trong PostgreSQL (ví dụ: Spring `@Scheduled` chạy 1 lần/ngày).
- Cấu hình CORS `allowCredentials(true)` và domain tương thích giữa môi trường dev (`localhost:5173`) và production.

## Risks
1. **F5 Page Reload UX:** Khi người dùng F5, React Memory bị xóa. Frontend cần gọi endpoint `/api/auth/refresh` trong lúc khởi động app (Splash/Loading state) để khôi phục phiên mà không bắt người dùng đăng nhập lại.
2. **Race condition khi gọi nhiều API cùng lúc lúc Token hết hạn:** Nhiều request đồng thời nhận 401 có thể kích hoạt nhiều lệnh refresh cùng lúc. Cần Axios/Fetch interceptor với queue cơ chế refresh đơn nhất (Single flight refresh lock).
