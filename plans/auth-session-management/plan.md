# Implementation Plan: Quản lý Session & Xác thực Đăng nhập (In-Memory Access Token + Stateful HttpOnly Refresh Token)

**Directory:** `plans/auth-session-management/`  
**Mode:** Hard  
**Risk:** high-risk — Thay đổi kiến trúc xác thực toàn hệ thống (Database entity, Spring Security / CORS, Cookie handling, và React AuthContext).  
**Date:** 2026-09-15  
**Spec Reference:** `plans/auth-session-management/spec.md`

---

## Architecture Overview

```
Client (React SPA)                                  Server (Spring Boot) + DB (PostgreSQL)
-------------------                                  -------------------------------------
[Memory / React State]                               [AuthController]
- accessToken (15m TTL)                                - POST /api/auth/login
- user info                                            - POST /api/auth/google
                                                       - POST /api/auth/refresh
[Browser Cookie Storage]                               - POST /api/auth/logout
- edulab_refresh_token (7d, HttpOnly, SameSite=Strict) - POST /api/auth/logout-all
                                                       - GET  /api/auth/me
[Axios / Fetch Interceptor]
- Auto-attach Authorization: Bearer <token>          [RefreshTokenService & Repo]
- On 401: Mutex queue -> Call /api/auth/refresh        - Bảng refresh_tokens trong PostgreSQL
- On F5 load: App init silent refresh                  - Hash token SHA-256
                                                       - Token Rotation & Token Reuse Detection
```

---

## Phases

- [x] **Phase 01:** Database Entity, Repository & Jwt Token Service (FR-01, P1)
- [x] **Phase 02:** AuthController Endpoints, Cookie Management & CORS (FR-02, FR-03, P1, P2)
- [x] **Phase 03:** Frontend AuthContext, In-Memory Storage & Interceptor (FR-04, P1)
- [x] **Phase 04:** Security Testing, Token Rotation Verification & Cleanup (FR-02, FR-03, P2)

## Session Notes
<!-- Updated by cook automatically — do not edit manually -->

**Last active:** 2026-09-15 12:13  
**Phase in progress:** Completed all phases  
**Status:** All 4 phases implemented and verified. 11/11 Java tests passed, frontend TypeScript compiled with 0 errors.

### Decisions made this session
- Replaced wildcard `@CrossOrigin` with global `WebCorsConfig` supporting `allowCredentials(true)` for standard origins.
- Implemented Token Reuse Detection in `RefreshTokenServiceImpl` to automatically revoke all user sessions if a compromised/stolen token is replayed.
- Created `apiClient.ts` with silent refresh queue lock to eliminate race conditions when multiple API calls trigger 401 simultaneously.
- Cleaned up any legacy `localStorage` auth items on app mount for bulletproof security.

### Next immediate action
- Ready for deployment / git commit.

---

## File Ownership & Changes

### Backend:
- `[NEW]` `backend/src/main/java/com/edulab/model/RefreshToken.java`
- `[NEW]` `backend/src/main/java/com/edulab/repository/RefreshTokenRepository.java`
- `[NEW]` `backend/src/main/java/com/edulab/service/RefreshTokenService.java`
- `[NEW]` `backend/src/main/java/com/edulab/service/impl/RefreshTokenServiceImpl.java`
- `[MODIFY]` `backend/src/main/java/com/edulab/auth/JwtTokenProvider.java` (Rút ngắn thời hạn Access Token xuống 15 phút, thêm tiện ích hash token)
- `[MODIFY]` `backend/src/main/java/com/edulab/controller/AuthController.java` (Thêm endpoints `/refresh`, `/logout`, `/logout-all`, xử lý ResponseCookie HttpOnly)
- `[MODIFY]` `backend/src/main/java/com/edulab/service/UserService.java` & `UserServiceImpl.java`

### Frontend:
- `[MODIFY]` `frontend/src/context/AuthContext.tsx` (Bỏ `localStorage.setItem('edulab_token')`, chuyển sang Memory state, tích hợp silent refresh khi F5)
- `[NEW/MODIFY]` `frontend/src/services/apiClient.ts` hoặc `frontend/src/config/api.ts` (Đính kèm credentials `include`, xử lý interceptor khi gặp 401)
- `[MODIFY]` `frontend/src/components/common/Header.tsx` / `LandingPage.tsx` (Cập nhật hành động logout)

---

## Risks & Mitigations

1. **CORS credentials issue:**
   - *Risk:* Khi frontend gọi request có cookie (`credentials: 'include'`), backend nếu để `Access-Control-Allow-Origin: *` sẽ bị trình duyệt chặn ngay lập tức.
   - *Mitigation:* Cấu hình `@CrossOrigin(origins = {"http://localhost:5173", ...}, allowCredentials = "true")` hoặc `WebMvcConfigurer` global CORS với `allowCredentials(true)`.
2. **Infinite Refresh Loop on 401:**
   - *Risk:* Khi token hết hạn và `/refresh` cũng trả về 401, interceptor có thể bị lặp vô tận nếu không có cờ chặn.
   - *Mitigation:* Đặt cờ `_isRetry` và xóa session đưa về login nếu endpoint `/refresh` thất bại.
3. **Concurrent Requests 401 Race Condition:**
   - *Risk:* Nhiều API gọi cùng lúc khi Access Token vừa hết hạn gây ra nhiều lệnh refresh đồng thời làm token rotation bị trigger reuse nhầm.
   - *Mitigation:* Dùng cơ chế Promise Queue / Single-flight refresh lock trong client interceptor.
