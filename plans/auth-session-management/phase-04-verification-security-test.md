# Phase 04: Verification, Security Testing & Cleanup

**Parent Plan:** `plans/auth-session-management/plan.md`  
**Stories Covered:** FR-02, FR-03, P2

---

## Objective
Kiểm thử toàn diện các kịch bản an ninh và trải nghiệm người dùng: Token Rotation, Token Reuse Detection, Logout đơn/Logout toàn bộ, Xử lý F5 tải lại trang và Build CI/CD.

---

## Test Scenarios & Checklist

1. **Kịch bản 1: Đăng nhập cơ bản & Kiểm tra Cookie**
   - Đăng nhập tài khoản test (`student@edulab.vn` hoặc tài khoản mới).
   - Kiểm tra `DevTools > Application > Storage > Local Storage`: Không có access token.
   - Kiểm tra `DevTools > Application > Storage > Cookies`: Có cookie `edulab_refresh_token` với cờ `HttpOnly: true`.

2. **Kịch bản 2: F5 Reload & Silent Refresh**
   - Đang ở dashboard hoặc phòng thí nghiệm `/workbench/universal`.
   - Bấm F5 (Ctrl+R / Cmd+R): Ứng dụng gọi `/api/auth/refresh`, nạp lại user vào memory mà không bị văng ra màn hình đăng nhập.

3. **Kịch bản 3: Token Rotation & Phục hồi khi Token hết hạn**
   - Gọi `/api/auth/refresh`: Refresh token cũ bị đánh dấu thu hồi trong PostgreSQL, cookie được cập nhật với refresh token mới.

4. **Kịch bản 4: Phát hiện Token Reuse (Security Defense)**
   - Thử dùng lại một Refresh Token cũ đã bị rotate.
   - Hệ thống phát hiện gian lận và tự động thu hồi tất cả các phiên còn lại của tài khoản đó trong database.

5. **Kịch bản 5: Đăng xuất thiết bị hiện tại & Đăng xuất tất cả thiết bị**
   - Bấm Đăng xuất -> Cookie bị xóa (`Max-Age=0`), token trong DB chuyển sang `revoked=true`. F5 lại trang sẽ về trạng thái khách.
   - Bấm Đăng xuất tất cả thiết bị -> Toàn bộ token của user trong DB đều bị revoked.

6. **Kịch bản 6: Build Verification**
   - Backend: `mvn test-compile` hoàn thành với 0 lỗi.
   - Frontend: `npm run build` hoàn thành với 0 lỗi TypeScript / lint.
