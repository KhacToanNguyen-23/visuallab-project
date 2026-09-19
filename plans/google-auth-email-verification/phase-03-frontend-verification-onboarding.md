# Phase 03: Frontend Verification & Onboarding

**Parent Plan:** [plan.md](file:///d:/6_OJT/EduLab/plans/google-auth-email-verification/plan.md)
**Stories Covered:** P1, P2

---

## Objective
Implement the frontend user interface and state management for the verification waiting screen, verification landing page, student onboarding screen, and routing guards.

---

## Tasks

### 1. Update `AuthContext.tsx`
- Add `onboardingCompleted?: boolean; status?: string;` to `User` interface.
- Update `loginWithGoogle` response handling:
  - If response status is `"PENDING_VERIFICATION"`: return `{ status: 'PENDING_VERIFICATION', email: '...' }` so the UI can open the verification modal/dialog.
  - If authenticated: update tokens & user in state. If `!user.onboardingCompleted`, navigate to `/onboarding`.
- Add `completeOnboarding(school: string)` helper in AuthContext.

### 2. Create Verification Notice Modal / Screen (`VerificationPendingModal.tsx`)
- Displayed when user clicks Google Sign-In for the first time:
  - Header: "Xác thực email của bạn"
  - Body: "Chúng tôi đã gửi một liên kết xác thực tới email **{email}**. Vui lòng kiểm tra hộp thư (hoặc mục Spam) và nhấn vào liên kết để hoàn tất đăng ký."
  - Button "Gửi lại email xác thực" với bộ đếm ngược 60 giây (cooldown timer).
  - Toast thông báo khi gửi lại thành công hoặc có lỗi.

### 3. Create Verification Landing Page (`VerifyRegistrationPage.tsx`)
- Route: `/verify-registration`
- Lifecycle:
  1. Extract `token` from URL query parameter (`?token=...`).
  2. If token is missing, show "Liên kết không hợp lệ".
  3. Show sleek loading animation ("Đang xác thực tài khoản EduLab của bạn...").
  4. Call backend `GET /api/auth/verify-registration?token={token}`.
  5. On Success:
     - Save `accessToken` into `AuthContext`
     - Set user state
     - Redirect to `/onboarding`
  6. On Error (token expired or used):
     - Display clear error card: "Liên kết xác thực đã hết hạn hoặc không hợp lệ."
     - Button "Quay lại trang Đăng nhập" / "Yêu cầu gửi lại email".

### 4. Create Student Onboarding Page (`OnboardingPage.tsx`)
- Route: `/onboarding`
- Guarded route: Only accessible to authenticated users with `onboardingCompleted === false`.
- UI Design:
  - Header: "Chào mừng bạn đến với EduLab! 👋"
  - Subtitle: "Hãy hoàn thiện thông tin học sinh để bắt đầu trải nghiệm phòng thí nghiệm ảo."
  - Form Fields:
    - Họ và tên (Pre-filled từ Google, readonly hoặc editable)
    - Email (Pre-filled, readonly)
    - Vai trò: Badge cố định "Học sinh" (Student)
    - Trường học / Lớp học (Input text với gợi ý trường phổ biến, bắt buộc)
  - CTA Button: "Bắt đầu học tập ngay 🚀"
  - Submitting calls `POST /api/auth/onboarding`, updates AuthContext, and redirects to `/dashboard` (or `/student`).

### 5. Routing Guards & Navigation Updates (`App.tsx`)
- Register `/verify-registration` (public).
- Register `/onboarding` (protected route, redirects to `/dashboard` if already onboarded).
- Global route protection: if user is authenticated but `onboardingCompleted === false` and navigating to protected areas, redirect to `/onboarding`.

---

## Verification Criteria
- [ ] Clicking Google login for unregistered user displays the "Check your email" modal with resend countdown.
- [ ] Clicking email link navigates to `/verify-registration?token=...`, activates account, and auto-navigates to `/onboarding`.
- [ ] Completing `/onboarding` sets `onboardingCompleted = true` and enters Student Dashboard.
- [ ] Re-visiting `/onboarding` when already completed redirects straight to Dashboard.
