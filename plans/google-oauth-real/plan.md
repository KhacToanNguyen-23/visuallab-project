# Implementation Plan: Google OAuth Client Integration & Token Verification

**Date:** 2026-09-09  
**Mode:** --hard  
**Risk:** high-risk — Touches Security Verification (Google ID Token), Frontend OAuth Providers, and PostgreSQL User Sync  
**Spec:** [`plans/google-oauth-real/spec.md`](file:///d:/6_OJT/EduLab/plans/google-oauth-real/spec.md)  

---

## 1. Scope Challenge & Risk Classification

```
# Scope Challenge:
#   Exists?     → Đã có luồng backend /api/auth/google cơ bản & Google login UI frontend.
#   Minimum?    → Cài đặt @react-oauth/google trên Frontend, google-api-client trên Spring Boot, và cập nhật Google Onboarding Modal.
#   Complexity? → Hard (chữ ký Token, OAuth verification, Google Client ID integration)
#
# Mode: --hard
# Risk: high-risk — External OAuth authentication & JWT Security Token generation
```

---

## 2. Implementation Phases

### Phase 1: Google API Client Library & Backend Verifier
- **Files**:
  - `backend/pom.xml`: Thêm `google-api-client` (ver `2.2.0`) & `google-http-client-jackson2`.
  - `backend/src/main/java/com/edulab/service/GoogleAuthService.java`: Viết service `verifyGoogleToken(String idTokenString)` kiểm tra chữ ký với Google TokenVerifier.
  - `backend/src/main/java/com/edulab/service/impl/UserServiceImpl.java`: Cập nhật `loginWithGoogle` để verify token thật và cập nhật tên, trường học, role.

### Phase 2: Frontend @react-oauth/google Provider & UI Integration
- **Files**:
  - `frontend/package.json`: Cài đặt `@react-oauth/google`.
  - `frontend/src/main.tsx`: Wrap ứng dụng với `<GoogleOAuthProvider clientId="...">`.
  - `frontend/src/pages/LoginPage.tsx`: Tích hợp `<GoogleLogin>` component nhận credential callback thực tế.
  - `frontend/src/components/auth/EditProfileModal.tsx`: Tự động popup sau khi Google Sign-up để người dùng xác nhận Role (Học sinh/Giáo viên), Tên hiển thị và Trường học.

---

## 3. Verification Plan

### Automated Verification:
- **Backend Compile**: Run `mvn test-compile` để xác nhận Google API Client library được nạp đúng.
- **Frontend Build**: Run `npm run build` kiểm tra Google OAuth Provider JSX integration.

### Manual Verification:
- Kiểm tra nút Google Login chính thức hiển thị trên giao diện Đăng ký / Đăng nhập.
- Thử nghiệm luồng nhận Google Credential JWT và cập nhật hồ sơ cá nhân.
