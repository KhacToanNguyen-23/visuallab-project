# Spec: Trang Giới Thiệu (Landing Page), Đăng Ký Phân Role, Google OAuth & PostgreSQL Backend

**Date:** 2026-09-09  
**Status:** Ready  

---

## 1. Overview & Objective

Ứng dụng **EduLab** nâng cấp luồng truy cập người dùng:
1. Mở web sẽ hiển thị ngay **Trang Giới Thiệu (Landing Page)** với giao diện hiện đại, nút Đăng nhập / Đăng ký trực quan.
2. Form Đăng ký cho phép chọn **Vai trò (Role)**: `STUDENT` (Học sinh) hoặc `TEACHER` (Giáo viên).
3. Hỗ trợ **Đăng ký & Đăng nhập bằng Google (Google OAuth2)** kết hợp cấp JWT Token.
4. Backend tích hợp **PostgreSQL** lưu trữ tài khoản người dùng, vai trò và dữ liệu mô phỏng thí nghiệm thay cho In-Memory repository.

---

## 2. User Stories & Functional Requirements

- **[P1] Landing Page làm trang chủ**:
  - Khi mở đường dẫn `/`, hệ thống hiển thị Trang giới thiệu sản phẩm (Hero section, tính năng mô phỏng nổi bật, các bài học GDPT 2018).
  - Có các nút bấm "Khám phá ngay", "Đăng nhập", "Đăng ký".
- **[P1] Phân loại Role khi Đăng ký**:
  - Form Đăng ký cho phép người dùng chọn vai trò: Học sinh (`STUDENT`) hoặc Giáo viên (`TEACHER`).
  - Thông tin vai trò được gửi về backend và lưu trong bảng `users`.
- **[P1] Đăng nhập / Đăng ký qua Google OAuth**:
  - Tích hợp Google Identity Services (Google Sign-In button).
  - Người dùng bấm Đăng nhập bằng Google -> nhận Token -> Backend cấp JWT Token của EduLab.
  - Nếu là tài khoản Google mới đăng ký lần đầu, hiển thị Modal chọn Vai trò (Student/Teacher) trước khi hoàn tất tạo account.
- **[P1] Kết nối PostgreSQL Database**:
  - Thay thế InMemoryUserRepository bằng Spring Data JPA Repository giao tiếp PostgreSQL.
  - Tự động khởi tạo schema / migration bảng `users` (id, email, password, full_name, role, avatar_url, created_at).

---

## 3. Technical Architecture

### Backend (Java 21 Spring Boot + PostgreSQL + Spring Data JPA + JWT):
- **Database**: PostgreSQL (Driver: `org.postgresql:postgresql`).
- **JPA Entities**: `@Entity User` (`id`, `email`, `password`, `fullName`, `role`, `authProvider`, `createdAt`).
- **Endpoints**:
  - `POST /api/auth/register` (body: `{ email, password, fullName, role }`)
  - `POST /api/auth/login` (body: `{ email, password }`)
  - `POST /api/auth/google` (body: `{ idToken, role }`)
  - `GET /api/auth/me` (header: `Authorization: Bearer <token>`)

### Frontend (React 18 + TypeScript + TailwindCSS + Google OAuth):
- **Routing**:
  - `/` -> `LandingPage.tsx` (Trang giới thiệu)
  - `/login` -> `LoginPage.tsx` (Đăng nhập / Đăng ký / Google Auth)
  - `/dashboard` -> `DashboardPage.tsx` (Bento Grid Dashboard)
  - `/simulation` -> Workspace mô phỏng Canvas 2D
- **Auth Context**: Quản lý `user`, `role`, `token`, Google Sign-In state.

---

## 4. Acceptance Criteria

- [ ] Mở `/` hiển thị Landing Page đẹp mắt, mượt mà.
- [ ] Đăng ký có nút/radio chọn `STUDENT` hoặc `TEACHER`.
- [ ] Đăng nhập/Đăng ký qua Google hoạt động và cấp JWT hợp lệ.
- [ ] Dữ liệu user được lưu và truy vấn từ cơ sở dữ liệu PostgreSQL.
