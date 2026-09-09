# Phase 2: Frontend Google OAuth SDK & Onboarding Profile Modal

**Goal:** Triển khai nút Google Login chính thức bằng `@react-oauth/google` và hoàn thiện luồng điền Tên/Trường học/Role sau khi đăng ký.

---

## Deliverables

1. `frontend/src/main.tsx`: Wrap ứng dụng bằng `GoogleOAuthProvider`.
2. `LoginPage.tsx`: Nhận Google Credential JWT từ Google Login Button.
3. `EditProfileModal.tsx`: Popup tự động sau khi tạo tài khoản Google để người dùng cập nhật Role, Tên hiển thị và Trường học.

---

## Tasks

- [ ] Cài đặt `@react-oauth/google` trong frontend.
- [ ] Cấu hình `GoogleOAuthProvider` trong `main.tsx`.
- [ ] Cập nhật `LoginPage.tsx` và `EditProfileModal.tsx`.
- [ ] Build kiểm thử `npm run build`.
