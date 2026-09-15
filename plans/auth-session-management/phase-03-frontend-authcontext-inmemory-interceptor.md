# Phase 03: Frontend AuthContext, In-Memory Storage & Interceptor

**Parent Plan:** `plans/auth-session-management/plan.md`  
**Stories Covered:** FR-04, P1

---

## Objective
Nâng cấp frontend React SPA: loại bỏ `localStorage.getItem('edulab_token')`, chuyển sang lưu `accessToken` hoàn toàn trong RAM (React state), cấu hình fetch/axios client tự động gửi `credentials: 'include'` và tự động refresh token trong nền (silent refresh) khi F5 hoặc khi token hết hạn (401).

---

## Detailed Tasks

1. **Xây dựng API Client Helper / Interceptor:**
   - File: `frontend/src/services/apiClient.ts`
   - Wrapper xung quanh `fetch` (hoặc Axios nếu có):
     - Mặc định đính kèm `credentials: 'include'` trên mọi request để cookie HttpOnly được gửi đúng.
     - Tự động gắn header `Authorization: Bearer <accessToken>` từ Auth State.
     - Xử lý 401: Khi API trả về 401 và không phải là request refresh, xếp hàng các request (Promise queue / lock) và gọi `POST /api/auth/refresh`. Nếu refresh thành công, lấy access token mới và retry các request đang chờ. Nếu refresh thất bại, xóa trạng thái đăng nhập và điều hướng về trang chủ/login.

2. **Cập nhật `AuthContext.tsx`:**
   - Loại bỏ `localStorage.getItem('edulab_token')` và `localStorage.setItem('edulab_token', ...)`.
   - Giữ `accessToken` trong React State (`const [token, setToken] = useState<string | null>(null)`).
   - Khi ứng dụng vừa khởi động (Mount `AuthProvider`):
     - Đặt `isInitializing = true`.
     - Gọi `POST /api/auth/refresh` với `credentials: 'include'`.
     - Nếu thành công -> lưu token & user vào state.
     - Nếu thất bại (chưa đăng nhập hoặc phiên hết hạn) -> set user = null, không báo lỗi phiền phức.
     - Đặt `isInitializing = false`.
   - Cập nhật hàm `login`, `register`, `loginWithGoogle`: Lưu token vào React state, không đụng tới `localStorage`.
   - Cập nhật hàm `logout`:
     - Gọi `POST /api/auth/logout` lên backend với `credentials: 'include'`.
     - Reset token = null, user = null.
   - Thêm hàm `logoutAll`:
     - Gọi `POST /api/auth/logout-all` lên backend.

3. **Cập nhật các Component & Layout liên quan:**
   - Đảm bảo các trang bảo vệ (`ProtectedRoute`) hiển thị màn hình Loading/Splash trong khi `isInitializing === true` để tránh bị redirect chớp nháy (FOUC) về login khi F5 trang.

---

## Verification
- Chạy `npm run build` trên thư mục `frontend` đảm bảo không có lỗi TypeScript / JSX.
- Kiểm tra trực tiếp trên trình duyệt:
  - Mở Application Tab -> Local Storage: Xác nhận không còn `edulab_token`.
  - Mở Cookies: Xác nhận có cookie `edulab_refresh_token` với cờ `HttpOnly`.
  - F5 tải lại trang: Phiên đăng nhập vẫn giữ nguyên mượt mà.
