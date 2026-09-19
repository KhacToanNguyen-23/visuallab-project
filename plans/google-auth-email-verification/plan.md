# Plan: Google OAuth Registration with Email Verification & Student Onboarding

**Date:** 2026-09-18
**Mode:** hard
**Risk:** high-risk — touches authentication pipeline, JWT/refresh cookie handling, PostgreSQL user constraints (`UNIQUE(email)`, `UNIQUE(google_id)`), Redis infrastructure, and email delivery.
**Spec:** [spec.md](file:///d:/6_OJT/EduLab/plans/google-auth-email-verification/spec.md)

---

## Architecture Overview

```
Google OAuth Login/Signup
          │
          ▼
   Find User in DB
    /            \
  YES             NO
   │               │
 ACTIVE?      Redis Pending Staging
 /     \           │ (TTL 15m, token + email index)
YES     NO         ▼
 │       │    Dispatch Verification Email (Resend / Mock)
 │      403        │
 │                 ▼
 │            Frontend Verification Landing (/verify-registration?token=...)
 │                 │
 │                 ▼
 │            Call GET /api/auth/verify-registration
 │                 │
 │                 ▼
 │            Persist ACTIVE STUDENT to DB (onboardingCompleted = false)
 │                 │
 │                 ▼
 │            Issue JWT + HttpOnly Refresh Cookie
 │                 │
 └────────► Auto-Redirect
                   │
                   ▼
          /onboarding (School & Profile)
                   │
                   ▼
          onboardingCompleted = true
                   │
                   ▼
          Student Dashboard
```

---

## Phases

- [x] **Phase 01: Infra, Redis & Email Service Core** — Added `spring-boot-starter-data-redis`, `RedisConfig`, `PendingRegistration`, `PendingEmailIndex`, `RegistrationStagingService`, `EmailService` (Resend + Mock console), and updated `User` entity with `googleId`, `status`, `onboardingCompleted`, `UNIQUE` constraints.
- [x] **Phase 02: Auth Controller & Business Logic** — Implemented `POST /api/auth/google` (active fast-path vs pending staging), `GET /api/auth/verify-registration` (student creation + auto-login tokens), `POST /api/auth/resend-verification` (60s cooldown + token rotation), and `POST /api/auth/onboarding`.
- [x] **Phase 03: Frontend UI, Routing & AuthContext** — Implemented `VerificationPendingModal`, `/verify-registration` landing page, `/onboarding` student profile page, updated `AuthContext` and route protection in `main.tsx`.
- [x] **Phase 04: Testing, Verification & Security Audit** — 26/26 backend JUnit tests passing 100%, frontend TypeScript & Vite build passing cleanly.

---

## Session Notes
<!-- Updated by cook automatically — do not edit manually -->

**Last active:** 2026-09-18 22:07
**Phase in progress:** Completed all phases
**Status:** All 4 phases implemented, tested, and verified.

### Decisions made this session
- Public Google OAuth self-registration is strictly restricted to `STUDENT` accounts (`role = STUDENT` hardcoded on backend).
- `TEACHER` and `ADMIN` accounts are provisioned exclusively by Admins.
- Unverified Google registrations do not pollute PostgreSQL and reside in Redis with 15m TTL.
- Double-indexing (`token` + `email`) ensures old tokens are immediately invalidated on resend or repeated signup clicks.
- Email verification link points to frontend `/verify-registration` which calls backend, obtains HttpOnly refresh cookie + access token, and smoothly transitions to `/onboarding`.

### Next immediate action
- Ready for code review / git sync.
