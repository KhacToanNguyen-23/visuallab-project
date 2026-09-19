# Brainstorm: Google OAuth Registration with Email Verification & Student Onboarding

**Date:** 2026-09-18

## Ideas Explored
1. **Direct Account Creation with UNVERIFIED status in PostgreSQL**: Save user directly to database with `status = UNVERIFIED`, update to `ACTIVE` upon email confirmation. *(Dismissed: Pollutes PostgreSQL database with unverified junk accounts if users abandon registration).*
2. **Redis-backed Pending Registration (Selected)**: Google OAuth authenticates identity $\rightarrow$ payload cached temporarily in Redis with TTL (15 mins) $\rightarrow$ Verification link sent via transactional email $\rightarrow$ User clicks link $\rightarrow$ PostgreSQL creates `ACTIVE` user with `role = STUDENT` $\rightarrow$ Auto-login + Student Onboarding.
3. **Public Role Picker vs Admin-Only Teacher Provisioning**: 
   - *Public Role Picker (Dismissed)*: Allowing users to choose `TEACHER` creates authorization vulnerabilities.
   - *Admin Provisioning (Selected)*: Google self-registration is strictly for `STUDENT`. `TEACHER` and `ADMIN` accounts are created exclusively by Admins.
4. **Email Services**: Evaluated Gmail SMTP, SendGrid, Resend, and AWS SES. *(Selected: Resend for clean transactional email API, with `MockEmailService` / console logging in development mode).*
5. **Anti-duplicate & Resend Token Invalidation**: Double indexing in Redis (`pending:registration:{token}` + `pending:registration:email:{email}`) with automatic invalidation of old tokens upon resend/re-attempt.

## Architecture Decisions & Enhancements
- **Frontend Verification Landing**: Email contains URL pointing to Frontend (`/verify-registration?token=...`). Frontend calls `GET /api/auth/verify-registration?token=...`, saves Access Token, receives HttpOnly Refresh cookie, and transitions seamlessly to `/onboarding`.
- **Existing User Status Verification**: If user exists in DB, backend explicitly verifies `status == ACTIVE`. Inactive/suspended accounts are rejected with 403.
- **Double Redis Indexing & Old Token Invalidation**: Multiple clicks or resend requests for the same email invalidate previous tokens, preventing race conditions and multiple active tokens for a single registration.
- **PostgreSQL Hard Constraints**: `UNIQUE(email)` and `UNIQUE(google_id)` enforce database-level idempotency regardless of concurrency.
- **Strict Role Lockdown**: `role = STUDENT` and `onboardingCompleted = false` hardcoded on registration. Onboarding only captures student profile details (e.g. `school`).

## Risks
- **Redis Availability**: If Redis is down, new registrations fail (mitigated by health checks and standard docker deployment).
- **Email Deliverability**: Verification emails going to Spam (mitigated by DKIM/SPF setup in Resend for production domain).
