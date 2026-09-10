# Phase 02: Classes Management & Join Class Slide-over Drawer

**Goal:** Xây dựng trang Lớp Học Của Tôi (`/student/classes`) với Bảng dữ liệu tràn viền (Full-width Table), mã lớp (font mono) và **JoinClassDrawer** trượt từ lề phải màn hình để nhập mã mời.

---

## User Stories Covered
- **[P1]** As a Student, I want to view my enrolled classes in a full-width table and join new classes via a Join Class Slide-over Drawer by entering a 6-character code from my teacher.

---

## Scope of Changes

### [NEW] `frontend/src/pages/student/StudentClassesPage.tsx`
- Trang chính `/student/classes` tràn chiều rộng màn hình:
  - Header: Tên trang "Lớp Học Của Tôi", Nút primary "+ Tham Gia Lớp Bằng Mã".
  - Data table: Tên Lớp Học, Giáo Viên Phụ Trách, Mã Lớp (font mono), Ngày Tham Gia, Thao Tác (Xem bài tập).

### [NEW] `frontend/src/components/student/JoinClassDrawer.tsx`
- Slide-over Panel trượt ra từ bên phải màn hình:
  - Title: "Tham Gia Lớp Học Mới".
  - Form Fields: Ô nhập mã mời 6 ký tự (VD: `X7K9P2`).
  - Action buttons: "Hủy bỏ" & "Tham Gia Lớp".

---

## Verification Plan

### Automated Tests
- Run `npm run build` inside `frontend/` to verify typing and imports.

### Manual Verification
- Truy cập `/student/classes`, bấm "+ Tham Gia Lớp Bằng Mã" -> Drawer mở từ cạnh phải.
- Điền mã mời và submit -> Bảng lớp cập nhật thành công.
