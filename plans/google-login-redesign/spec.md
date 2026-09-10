# Spec: Google Login & Auth Portal Layout Redesign

**Date:** 2026-09-09
**Status:** Draft

---

## Problem Statement
Nút Đăng nhập Google hiện tại bị co ngắn và nằm lệch ở giữa, không khớp với chiều rộng 100% của ô Email/Password và nút Submit. Trang Đăng ký (`RoleSelector`) bị lỗi màu hiển thị ở Light Mode và chứa các icon emoji rườm rà.

---

## User Stories

- **[P1]** Với tư cách là người dùng, tôi muốn nút Đăng nhập bằng Google hiển thị căn chỉnh 100% full-width bằng với các ô nhập liệu khác để giao diện cân đối và đẹp mắt.
  Accepted when: Nút Google khớp chính xác chiều rộng 100% với ô Email/Mật khẩu trên mọi kích thước màn hình.

- **[P1]** Với tư cách là người dùng ở trang Đăng ký, tôi muốn xem các tùy chọn Vai trò (Học sinh, Giáo viên, Quản trị) hiển thị rõ ràng, không bị cháy màu icon/chữ ở Light Mode.
  Accepted when: Thẻ/Tab chọn vai trò phản hồi đúng CSS Variables theo theme sáng/tối và icon/chữ hiển thị sắc nét.

- **[P2]** Với tư cách là người dùng thử, tôi muốn nút Xác thực Google Demo Mode nằm gọn gàng, không bị chen ngang gây rối mắt giữa nút Google OAuth thật và form Email.
  Accepted when: Nút Google Demo Mode hiển thị như một tùy chọn phụ thanh thoát hoặc nằm trong nhóm Tài khoản Demo.

- **[P3]** Phủ animation chuyển tab Đăng Nhập <-> Đăng Ký mượt mà.

---

## Functional Requirements

1. FR-01: Nút Google Sign-In được bọc trong container `w-full` và cấu hình full-width 100%.
2. FR-02: `RoleSelector` hỗ trợ CSS variables theme (`var(--bg-main)`, `var(--border-color)`, `var(--text-main)`), thay thế các icon emoji thô bằng SVG badge / Pill Segmented Control gọn gàng.
3. FR-03: Căn chỉnh lại khoảng cách (`gap`, `margin`, `padding`) nhất quán giữa các section: Google Auth -> Divider -> Email Form -> Demo Accounts.

---

## Non-Functional Requirements

- Layout: Responsive 100% trên cả Desktop và Mobile auth modal/card.
- Accessibility: Đảm bảo độ tương phản (contrast ratio) chữ trên nền ở cả Light & Dark theme.

---

## Success Criteria

- [ ] Nút Google có độ rộng 100% khớp hoàn toàn với input field.
- [ ] Trang Đăng ký hiển thị vai trò rõ ràng trên Light Mode (không dính lỗi background tối `bg-slate-800`).
- [ ] Không còn lệch pixel hay dư thừa khoảng trắng giữa các tab.

---

## Out of Scope

- Thay đổi backend JWT Auth hoặc Google OAuth API endpoint logic.

---

## Assumptions

- Frontend sử dụng Tailwind CSS và React với `@react-oauth/google`.
