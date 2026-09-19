# Phase 04: Testing, Verification & QA

**Parent Plan:** [plan.md](file:///d:/6_OJT/EduLab/plans/google-auth-email-verification/plan.md)
**Stories Covered:** Quality & Security Assurance for all stories

---

## Objective
Execute automated tests (unit and integration) and end-to-end verification covering the registration lifecycle, Redis token management, resend rate limiting, idempotent activation, and route protection.

---

## Tasks

### 1. Backend Unit & Integration Tests
- `RegistrationStagingServiceTest`:
  - Test staging creation, TTL, and key expiry.
  - Test double-indexing and old token invalidation when staging again with the same email.
  - Test `canResend` cooldown rules (reject < 60s, allow >= 60s, block > 5 attempts).
- `AuthControllerGoogleVerificationTest`:
  - Test `POST /api/auth/google` with new user $\rightarrow$ returns `PENDING_VERIFICATION`, no row in DB.
  - Test `POST /api/auth/google` with active user $\rightarrow$ returns tokens.
  - Test `POST /api/auth/google` with suspended user $\rightarrow$ returns 403 Forbidden.
  - Test `GET /api/auth/verify-registration` with valid token $\rightarrow$ creates user with `role = STUDENT`, `onboardingCompleted = false`, returns tokens.
  - Test `GET /api/auth/verify-registration` with expired/invalid token $\rightarrow$ returns 400.
  - Test `POST /api/auth/onboarding` $\rightarrow$ sets school and flags `onboardingCompleted = true`.

### 2. Frontend Component & Flow Testing
- Test `VerificationPendingModal`:
  - Displays correct email.
  - Resend button disabled during 60s cooldown, enables after timer finishes.
- Test `VerifyRegistrationPage`:
  - Handles valid token: displays spinner $\rightarrow$ triggers auto-login $\rightarrow$ redirects to `/onboarding`.
  - Handles invalid/expired token: displays error state with back to login button.
- Test `OnboardingPage`:
  - Requires school input.
  - Successfully submits and transitions user to dashboard.

### 3. End-to-End Manual / Integration Run
- Execute complete user journey in development mode (`email.mode=mock` + Docker Redis):
  1. Click "Continue with Google" with a test account.
  2. Inspect backend console log for mock email containing the verification link.
  3. Verify PostgreSQL `users` table: verify 0 rows exist for this email.
  4. Open the verification URL in browser.
  5. Verify user is logged in and redirected to `/onboarding`.
  6. Fill school name and submit.
  7. Verify user lands in Student Dashboard.
  8. Log out and click "Continue with Google" again $\rightarrow$ instant login without email prompts.

---

## Verification Criteria
- [ ] All Maven tests in `backend` compile and pass (`mvn test`).
- [ ] Frontend builds without TypeScript errors (`npm run build`).
- [ ] Full end-to-end registration flow verified cleanly.
