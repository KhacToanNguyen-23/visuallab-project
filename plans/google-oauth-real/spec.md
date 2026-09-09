# Spec: Google OAuth Client Integration & Real Google Identity Token Verification

**Date:** 2026-09-09  
**Status:** Ready  

---

## 1. Overview & Objective

Nâng cấp luồng **Đăng nhập / Đăng ký bằng Google (Google OAuth2)** từ luồng giả lập (mock) lên tích hợp SDK thực tế:
1. **Frontend**: Sử dụng thư viện `@react-oauth/google` (Google Identity Services API) để render nút Google Login chính thức hoặc tiếp nhận Google Credential JWT từ Google Popup/One-Tap.
2. **Backend**: Tích hợp Google API Client Library (`google-api-client`) trên Java Spring Boot để verify chữ ký cryptographic của `idToken` gửi từ Google API Servers.
3. **User Onboarding Flow**:
   - Nếu email Google đã tồn tại -> Đăng nhập thành công và cấp EduLab JWT Token.
   - Nếu email Google mới -> Hiển thị Modal cho người dùng chọn **Role (Học sinh / Giáo viên)** và điền **Tên hiển thị & Trường học** trước khi lưu vào database PostgreSQL.

---

## 2. Technical Architecture & Endpoints

### Frontend Configuration:
- `VITE_GOOGLE_CLIENT_ID`: Cấu hình trong `.env` / `GoogleOAuthProvider`.
- Component `GoogleLogin` từ `@react-oauth/google` rendering nút chuẩn của Google.

### Backend Endpoints:
- `POST /api/auth/google`:
  - Request body: `{ googleIdToken: string, role?: string, fullName?: string, school?: string }`
  - Response: `{ token: string, user: User, message: string }`

---

## 3. Acceptance Criteria

- [ ] Nút Google Login render nút chuẩn của Google SDK.
- [ ] Backend verify `googleIdToken` bằng Google Public Keys.
- [ ] Người dùng mới qua Google được hỏi thông tin Role & Trường học hợp lệ trước khi hoàn tất.
