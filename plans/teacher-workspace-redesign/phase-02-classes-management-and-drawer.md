# Phase 02: Class Management & Create Class Slide-over Drawer

**Goal:** Xây dựng trang Quản lý Lớp học (`/teacher/classes`) với Bảng dữ liệu tràn viền (Full-width Table), mã mời (Join Code font mono), nút sao chép link mời và **CreateClassDrawer** trượt từ lề phải màn hình.

---

## User Stories Covered
- **[P1]** As a Teacher, I want to manage my classes in a full-width table and create new classes via a Slide-over Drawer from the right edge so that the class table remains clean and uncluttered.

---

## Scope of Changes

### [NEW] `frontend/src/pages/teacher/TeacherClassesPage.tsx`
- Trang chính `/teacher/classes` tràn chiều rộng màn hình:
  - Header: Tên trang "Quản Lý Lớp Học", Nút primary "+ Tạo Lớp Mới".
  - Data table: Tên Lớp Học, Mã Tham Gia (font mono), Sĩ Số Học Sinh, Số Bài Thực Hành Đã Giao, Thao Tác (Sao chép link mời, Xem bài nộp).

### [NEW] `frontend/src/components/teacher/CreateClassDrawer.tsx`
- Slide-over Panel trượt ra từ bên phải màn hình:
  - Title: "Tạo Lớp Học Mới".
  - Form Fields: Tên lớp học (vd: Vật lý 12A1), Khối lớp, Mô tả ngắn.
  - Tự động sinh mã mời ngẫu nhiên (6 ký tự hoa/số).
  - Action buttons: "Hủy bỏ" & "+ Tạo Lớp Học".

---

## Verification Plan

### Automated Tests
- Run `npm run build` inside `frontend/` to verify typing and imports.

### Manual Verification
- Truy cập `/teacher/classes`, bấm "+ Tạo Lớp Mới" -> Drawer xuất hiện từ cạnh phải.
- Điền tên lớp và submit -> Bảng cập nhật lớp mới và thông báo toast xuất hiện.
