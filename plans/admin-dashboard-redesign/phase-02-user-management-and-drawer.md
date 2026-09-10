# Phase 02: User Management Page & Slide-over Drawer

**Goal:** Xây dựng trang Quản lý Người dùng (`/admin/users`) với Bảng dữ liệu tràn viền (Full-width Table), thanh Filter/Search nâng cao, Pill badges sắc nét và **Slide-over Drawer** tạo/chỉnh sửa tài khoản từ lề phải màn hình.

---

## User Stories Covered
- **[P1]** As an System Administrator, I want to manage users in a modern full-width data table with filter/search controls and a Slide-over Drawer for account creation/editing so that the table view remains clean and uncluttered.

---

## Scope of Changes

### [NEW] `frontend/src/pages/admin/AdminUsersPage.tsx`
- Trang chính `/admin/users` chiếm 100% diện tích màn hình:
  - Header: Tên trang, Subtitle, Nút "+ Cấp tài khoản mới" (bật Slide-over Drawer).
  - Quick Filter Cards: Tổng người dùng, Giáo viên, Học sinh, Đã khóa.
  - Controls Bar: Live Search input (Tên/Email/Trường), Filter Role select, Filter Status select.
  - Data Table: Avatar/Initial, Họ tên, Email (font mono), Role Pill badge (Emerald/Blue/Purple), Đơn vị/Trường, Status Pill (Hoạt động / Đã khóa), Action dropdown button (`...`).
  - Pagination bar ở chân bảng.

### [NEW] `frontend/src/components/admin/UserSlideOverDrawer.tsx`
- Slide-over Panel trượt ra từ bên phải với Backdrop làm mờ background:
  - Slide-in animation mượt mà.
  - Title: "Cấp Tài Khoản Giáo Viên / Người Dùng Mới".
  - Form Fields: Họ và tên, Email, Vai trò (Giáo viên / Học sinh / Admin), Đơn vị/Trường học, Mật khẩu khởi tạo.
  - Action buttons: "Hủy bỏ" & "+ Cấp tài khoản".
  - Auto focus field đầu tiên khi mở Drawer.

### [NEW] `frontend/src/components/admin/UserActionDropdown.tsx`
- Menu ngữ cảnh 3 chấm (`...`) cho từng dòng người dùng:
  - [Đổi vai trò hệ thống]
  - [Khóa / Kích hoạt tài khoản]
  - [Reset mật khẩu]

---

## Verification Plan

### Automated Tests
- Run `npm run build` inside `frontend/` to verify component typing and imports.

### Manual Verification
- Truy cập `/admin/users`, thử tìm kiếm theo từ khóa.
- Bấm "+ Cấp tài khoản mới", kiểm tra Slide-over Drawer xuất hiện mượt mà ở lề phải màn hình.
- Nhập thông tin tài khoản và submit -> Hộp thoại tự đóng và người dùng mới xuất hiện ngay trong bảng.
- Bấm menu `...` đổi vai trò hoặc khóa tài khoản -> Badge cập nhật ngay lập tức.
