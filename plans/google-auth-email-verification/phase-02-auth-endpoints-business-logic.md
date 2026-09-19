# Phase 02: Auth Endpoints & Business Logic

**Parent Plan:** [plan.md](file:///d:/6_OJT/EduLab/plans/google-auth-email-verification/plan.md)
**Stories Covered:** P1, P2

---

## Objective
Implement and refactor the backend authentication endpoints and services to support staging new Google registrations, handling account verification & auto-login, enforcing status checks, student onboarding, and resending tokens.

---

## Tasks

### 1. Refactor Google Login Service (`UserServiceImpl.java` / `UserService.java`)
- Modify `loginWithGoogle(AuthRequest request)`:
  - Verify Google ID Token via `GoogleAuthService`. Extract `email`, `name`, `sub` (googleId).
  - Query PostgreSQL `userRepository.findByEmail(email.toLowerCase())`:
    - **Case 1: User Exists**:
      - Check `user.getStatus()`:
        - If `!ACTIVE`: Throw `IllegalArgumentException("Tài khoản đã bị tạm khóa hoặc vô hiệu hóa. Vui lòng liên hệ quản trị viên.")`.
      - If `user.getGoogleId() == null`: Link `user.setGoogleId(googleId)` and save.
      - Generate JWT Access Token + return `AuthResponse` with user details (Frontend will set refresh cookie).
    - **Case 2: User Does Not Exist**:
      - Call `RegistrationStagingService.stageRegistration(...)`.
      - Build verification URL: `${frontend.url}/verify-registration?token=${token}`.
      - Call `EmailService.sendVerificationEmail(email, name, verificationUrl)`.
      - Return `AuthResponse(null, null, "PENDING_VERIFICATION", email)`.

### 2. Implement Verification & Auto-Login Endpoint (`AuthController.java`)
- `GET /api/auth/verify-registration?token={token}`:
  - Validate token via `RegistrationStagingService.getAndValidateToken(token)`.
    - If expired/invalid $\rightarrow$ return `400 Bad Request` with `{ error: "TOKEN_EXPIRED_OR_INVALID" }`.
  - Idempotency check: verify `userRepository.findByEmail(data.getEmail())`. If exists, return error or existing login.
  - Insert new `User`:
    - `id`: `"gg-" + UUID.randomUUID().toString().substring(0, 8)`
    - `email`: `data.getEmail()`
    - `fullName`: `data.getFullName()`
    - `role`: `"STUDENT"` (hardcoded)
    - `status`: `"ACTIVE"`
    - `provider`: `"GOOGLE"`
    - `googleId`: `data.getGoogleId()`
    - `onboardingCompleted`: `false`
    - `school`: `null` (or "Chưa cập nhật")
  - Delete staging keys from Redis: `stagingService.invalidate(token, data.getEmail())`.
  - Issue JWT Access Token & create Refresh Token Cookie.
  - Return `200 OK` with `{ accessToken, user, onboardingCompleted: false }`.

### 3. Implement Resend Verification Endpoint
- `POST /api/auth/resend-verification` with body `{ email }`:
  - Check if email is registered in PostgreSQL $\rightarrow$ if already active, return message "Tài khoản đã được kích hoạt".
  - Check `stagingService.canResend(email)`:
    - If within 60s cooldown $\rightarrow$ return `429 Too Many Requests` with remaining seconds.
    - If max attempts exceeded $\rightarrow$ return `400 Bad Request`.
  - Invalidate old token, generate new token & TTL.
  - Send email via `EmailService`.
  - Return `{ success: true, cooldownSeconds: 60 }`.

### 4. Implement Student Onboarding Endpoint
- `POST /api/auth/onboarding` (Secured via JWT):
  - Extract authenticated `userId` from token.
  - Fetch `User`:
    - Check if `user.isOnboardingCompleted()` $\rightarrow$ return already completed if true.
    - Update `user.setSchool(request.school().trim())`.
    - Set `user.setOnboardingCompleted(true)`.
    - Save to PostgreSQL.
  - Return updated `User` object.

---

## Verification Criteria
- [ ] `POST /api/auth/google` with unregistered email does NOT create DB record, creates Redis key, and sends email.
- [ ] `POST /api/auth/google` with registered active user logs in directly.
- [ ] `POST /api/auth/google` with suspended user returns 403.
- [ ] `GET /api/auth/verify-registration?token={token}` creates `STUDENT` user in PostgreSQL and returns tokens with `onboardingCompleted: false`.
- [ ] `POST /api/auth/resend-verification` respects 60s cooldown and invalidates old token.
- [ ] `POST /api/auth/onboarding` sets school and marks `onboardingCompleted: true`.
