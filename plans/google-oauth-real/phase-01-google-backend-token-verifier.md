# Phase 1: Google API Client Library & Backend Verifier

**Goal:** Tích hợp SDK Google API Client trên Java Spring Boot để xác thực cryptographic signature của Google ID Token.

---

## Deliverables

1. `backend/pom.xml`: Thêm `google-api-client` (v2.2.0) dependency.
2. `GoogleAuthService.java`: Class xử lý `GoogleIdTokenVerifier` giải mã email, fullName và verify issuer `https://accounts.google.com`.
3. `UserServiceImpl.java`: Tích hợp `GoogleAuthService` vào phương thức `loginWithGoogle`.

---

## Tasks

- [ ] Cập nhật `pom.xml` với `google-api-client`.
- [ ] Viết `GoogleAuthService.java`.
- [ ] Cập nhật `UserServiceImpl.java` và `AuthController.java`.
- [ ] Compile kiểm tra `mvn test-compile`.
