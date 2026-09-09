# Phase 2: React Auth Context & Modern Login Page

**Goal:** Xây dựng AuthContext quản lý state đăng nhập trên React và thiết kế trang Đăng nhập / Đăng ký hiện đại.

---

## Deliverables

1. **AuthContext (`src/context/AuthContext.tsx`)**:
   - Lưu trữ thông tin `user`, `token`, các hàm `login()`, `register()`, `logout()`.
2. **LoginPage (`src/pages/LoginPage.tsx`)**:
   - Giao diện Đăng nhập / Đăng ký hiện đại (Tab chuyển đổi, Form validation, Toast thông báo).

---

## Tasks

- [ ] Cài đặt `AuthContext` và hook `useAuth()`.
- [ ] Xây dựng trang `LoginPage.tsx` đẹp mắt với hiệu ứng gradient & glassmorphic UI.
- [ ] Tích hợp API đăng nhập với Spring Boot backend.
- [ ] Kiểm tra đăng nhập thành công và lưu Token vào localStorage.
