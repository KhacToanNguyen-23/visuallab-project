# Phase 01: Infra, Redis & Email Service Core

**Parent Plan:** [plan.md](file:///d:/6_OJT/EduLab/plans/google-auth-email-verification/plan.md)
**Stories Covered:** Foundation for P1, P2

---

## Objective
Establish the infrastructure and backend services required for Redis token staging, email delivery abstractions (Resend & Mock), and updated User entity data contracts with unique constraints.

---

## Tasks

### 1. Dependencies & Configuration
- Modify `backend/pom.xml` to include:
  ```xml
  <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-data-redis</artifactId>
  </dependency>
  ```
- Modify `backend/src/main/resources/application.yml` (and `application-dev.yml`):
  - Redis host (`localhost`), port (`6379`), timeout
  - `email.mode`: `mock` (default in dev) | `resend`
  - `resend.api-key`: `${RESEND_API_KEY:mock-key}`
  - `resend.from-email`: `${RESEND_FROM_EMAIL:EduLab <onboarding@resend.dev>}`
  - `app.frontend-url`: `${FRONTEND_URL:http://localhost:5173}`

### 2. User Entity Schema Enhancements
- Modify `com.edulab.model.User`:
  - Add `@Column(unique = true)` or table-level `uniqueConstraints` for `email` and `googleId`
  - Add fields:
    - `private String googleId;`
    - `private String status = "ACTIVE";` // "ACTIVE", "SUSPENDED", "INACTIVE"
    - `private boolean onboardingCompleted = false;`
  - Update constructors, getters, setters, and JSON serialization.

### 3. Redis Staging DTOs & Service
- Create `com.edulab.dto.PendingRegistration`:
  - `String email`, `String googleId`, `String fullName`, `String avatar`, `long createdAt`
- Create `com.edulab.dto.PendingEmailIndex`:
  - `String token`, `int resendCount`, `long lastSentAt`
- Create `com.edulab.service.RegistrationStagingService`:
  - `String stageRegistration(PendingRegistration data)`:
    - Invalidate previous token if `pending:registration:email:{email}` exists
    - Save `pending:registration:{token}` with TTL = 15m
    - Save `pending:registration:email:{email}` with TTL = 15m
    - Return `token`
  - `Optional<PendingRegistration> getAndValidateToken(String token)`
  - `void invalidate(String token, String email)`
  - `boolean canResend(String email)` (enforces 60s cooldown, max 5 attempts)

### 4. Email Service Layer
- Create `com.edulab.service.EmailService`:
  - `void sendVerificationEmail(String recipientEmail, String recipientName, String verificationUrl);`
- Create `com.edulab.service.impl.MockEmailServiceImpl` (`@ConditionalOnProperty(name = "email.mode", havingValue = "mock", matchIfMissing = true)`):
  - Log styled verification box to console with clickable URL.
- Create `com.edulab.service.impl.ResendEmailServiceImpl` (`@ConditionalOnProperty(name = "email.mode", havingValue = "resend")`):
  - Call `https://api.resend.com/emails` via `org.springframework.web.client.RestClient` with HTML transactional template.

---

## Verification Criteria
- [ ] Redis connection initializes without errors on Spring Boot startup.
- [ ] Staging service successfully saves and retrieves payload with TTL from Redis.
- [ ] Mock email logs readable formatted verification link in console.
- [ ] User entity compiles with `googleId`, `status`, `onboardingCompleted` and JPA table mappings.
