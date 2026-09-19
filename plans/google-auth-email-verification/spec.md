# Spec: Google OAuth Registration with Email Verification & Student Onboarding

**Date:** 2026-09-18
**Status:** Ready

---

## Problem Statement
Currently, Google Sign-In immediately registers and provisions active user records in PostgreSQL without validating if the user actually owns/checks that mailbox on our platform, potentially creating unverified database records. Furthermore, public registration must be strictly scoped to **STUDENT** accounts (Teacher/Admin accounts are provisioned exclusively by Admins). 

We need a secure, clean staging flow where:
1. Google OAuth creates a pending Redis registration indexed by both token and email to prevent duplicate pending states and support token invalidation on resend.
2. A verification link is sent via transactional email (Resend / Mock in dev) pointing to the frontend verification landing page (`/verify-registration?token=...`).
3. Frontend triggers backend verification, which verifies status, creates the PostgreSQL record with `role = STUDENT`, `status = ACTIVE`, and `onboardingCompleted = false` (guarded by DB unique constraints).
4. Auto-login issues access token & refresh cookie, redirecting directly to Student Onboarding (`/onboarding`).

---

## User Roles & Registration Matrix

| Role | Provisioning Method | Allowed Self-Registration | Status Required for Login |
| :--- | :--- | :--- | :--- |
| **STUDENT** | Google OAuth + Email Verification | Yes (Self-service via Google) | `ACTIVE` |
| **TEACHER** | Admin Dashboard / Invitation Provisioning | No (Admin provisioned only) | `ACTIVE` |
| **ADMIN** | System bootstrap / Super Admin | No | `ACTIVE` |

---

## User Stories

<!-- P1 = MVP (must ship), P2 = nice-to-have, P3 = future/out-of-scope -->

- **[P1]** As a student registering via Google, I want to click "Continue with Google" and receive a verification email so that my email ownership is verified before my account is created.
  - Accepted when: Google payload is stored in Redis under `pending:registration:{token}` and `pending:registration:email:{email}` with 15-minute TTL, an email is dispatched (or logged to console in dev mode), and no record is created in PostgreSQL.

- **[P1]** As a pending student, I want to click the verification link in my email to open the frontend verification page and automatically activate my account as a `STUDENT`.
  - Accepted when: Visiting `/verify-registration?token=...` calls backend verification, persists `ACTIVE` User record to PostgreSQL (`role = STUDENT`, `onboardingCompleted = false`), deletes Redis pending keys, sets JWT Access Token and HttpOnly Refresh Cookie, and navigates to `/onboarding`.

- **[P1]** As a newly verified student, I want to complete my school and profile details on the onboarding screen so that my student profile is complete.
  - Accepted when: Submitting `/api/auth/onboarding` updates `school` and sets `onboardingCompleted = true` in PostgreSQL, then redirects directly to the Student Dashboard.

- **[P1]** As an existing user, I want to log in via Google with proper account status checks.
  - Accepted when: If account exists and `status == ACTIVE`, backend issues authentication tokens immediately. If `status != ACTIVE` (e.g. `SUSPENDED`, `INACTIVE`), login is rejected with a distinct, descriptive error.

- **[P2]** As a pending student who lost or expired the verification email, I want to request a "Resend Verification Email" with strict rate limiting and token invalidation.
  - Accepted when: Resend is blocked if requested within 60s cooldown; successful resend invalidates the old token (`pending:registration:{oldToken}`) in Redis and issues a fresh token, ensuring only the latest token is valid. Maximum 5 resends per pending registration window.

---

## Functional Requirements

1. **FR-01 (Google Auth & Pending Staging)**: When `/api/auth/google` receives a valid Google ID token:
   - If email exists in PostgreSQL with `status == ACTIVE`: Issue login JWT + Refresh cookie immediately.
   - If email exists in PostgreSQL with `status != ACTIVE`: Return `403 Forbidden` with account status message.
   - If email is new: Check `pending:registration:email:{email}` in Redis. Invalidate any existing old token, generate new secure UUID token, and set:
     - `pending:registration:{token}` $\rightarrow$ `{ email, googleId, fullName, avatar, createdAt }` (TTL: 15m)
     - `pending:registration:email:{email}` $\rightarrow$ `{ token, resendCount, lastSentAt }` (TTL: 15m)
     - Return `{ status: "PENDING_VERIFICATION", email: "..." }` to frontend.

2. **FR-02 (Email Delivery Service)**: An abstraction `EmailService` supports `email.mode=resend` (using Resend REST API) and `email.mode=mock` (logging verification link directly to console). The email contains a link to `http://localhost:5173/verify-registration?token={token}` (or production web URL).

3. **FR-03 (Token Verification & Account Activation)**: Endpoint `GET /api/auth/verify-registration?token={token}`:
   - Validates token in Redis.
   - Checks for duplicate email in PostgreSQL (idempotent guard).
   - Inserts User (`id = gg-...`, `email`, `role = STUDENT`, `status = ACTIVE`, `onboardingCompleted = false`, `auth_provider = GOOGLE`).
   - Deletes `pending:registration:{token}` and `pending:registration:email:{email}`.
   - Sets HttpOnly refresh cookie, returns `{ accessToken, user, onboardingCompleted: false }`.

4. **FR-04 (Auto-Login & Routing)**: Frontend receives response from verification endpoint, saves `accessToken` into client auth state, and immediately routes the user to `/onboarding`.

5. **FR-05 (Student Onboarding Endpoint)**: Endpoint `POST /api/auth/onboarding` allows authenticated users with `onboardingCompleted = false` to submit their profile (e.g. `school`). The role is strictly enforced by the backend as `STUDENT` and cannot be altered via request body. Upon completion, `onboardingCompleted` is updated to `true`.

6. **FR-06 (Resend Verification Endpoint)**: Endpoint `POST /api/auth/resend-verification` accepts `{ email }`. If within cooldown (< 60s), returns `429 Too Many Requests`. Otherwise, deletes old token key, creates new token, updates email index, dispatches fresh email, and returns `{ success: true, cooldownSeconds: 60 }`.

---

## Non-Functional Requirements

- **Database Integrity & Race Protection**: PostgreSQL schema enforces `UNIQUE(email)` and `UNIQUE(google_id)`. Verification insert handles `DataIntegrityViolationException` gracefully.
- **Security & Authorization**: Strict server-side role assignment (`role = STUDENT` hardcoded during Google registration; client-supplied roles are ignored/rejected).
- **Token Security**: Cryptographically random UUIDv4 verification tokens with 15-minute expiration; old tokens invalidated immediately upon resend.
- **Performance**: Redis token lookup and PostgreSQL creation completed in < 200ms (p95).

---

## Success Criteria

- [ ] Google signup creates zero rows in PostgreSQL until email link is verified.
- [ ] Email link click opens Frontend `/verify-registration`, creates the active PostgreSQL user with `role = STUDENT` and `onboardingCompleted = false`, and auto-logs in.
- [ ] Multiple Google clicks or resends invalidate old tokens; only the newest token activates the account.
- [ ] Existing users with `status = ACTIVE` log in via Google in a single click with zero emails dispatched.
- [ ] Users with `status != ACTIVE` cannot log in via Google.
- [ ] PostgreSQL `UNIQUE` constraints prevent race condition duplicates.

---

## Out of Scope

- Teacher self-registration (Teacher accounts can only be provisioned by an authorized Admin).
- Role switching or role self-elevation (Teacher/Admin privileges require administrative assignment).

---

## Assumptions

- Docker Redis container runs alongside the backend during development (`localhost:6379`).
- Frontend routes `/verify-registration` and `/onboarding` are implemented to support the flow seamlessly.
- Resend API key is configured for production email dispatching; `mock` mode is active for local dev.
