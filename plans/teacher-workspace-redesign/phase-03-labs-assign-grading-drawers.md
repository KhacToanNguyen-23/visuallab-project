# Phase 03: Overview, Lab Catalog, Assign & In-place Grading Drawer

**Goal:** Xây dựng các trang `/teacher` (KPI Overview), `/teacher/labs` (Kho Lab Mẫu), `/teacher/assign` (Giao bài tập), `/teacher/grading` (Sổ điểm tiến độ) và **GradeSubmissionDrawer** trượt từ lề phải chấm bài/nhận xét trực tiếp tại chỗ không rời trang.

---

## User Stories Covered
- **[P1]** As a Teacher, I want to view student submissions in a full-width grading matrix and grade submissions directly via a Slide-over Drawer without leaving the grading page.
- **[P2]** As a Teacher, I want overview KPI stat cards on `/teacher` (Active Classes, Total Students, Assignments Open, Pending Submissions) so that I have instant visibility into my teaching workflow.

---

## Scope of Changes

### [NEW] `frontend/src/pages/teacher/TeacherOverviewPage.tsx`
- Trang chủ Tổng quan Giáo viên (`/teacher`):
  - 4 Stat KPI cards (Số Lớp Học, Sĩ Số Học Sinh, Bài Thực Hành Đã Giao, Bài Cần Chấm).
  - Khối xem nhanh danh sách lớp & nút tắt giao bài nhanh.

### [NEW] `frontend/src/pages/teacher/TeacherLabsPage.tsx` & `TeacherAssignPage.tsx`
- Kho Lab Mẫu chuẩn GDPT 2018 (`/teacher/labs`) và Form Giao Bài Tập (`/teacher/assign`).

### [NEW] `frontend/src/pages/teacher/TeacherGradingPage.tsx` & `GradeSubmissionDrawer.tsx`
- Trang Sổ Điểm Tiến Độ (`/teacher/grading`):
  - Full-width data table: Tên Học Sinh, Lớp Học, Bài Thí Nghiệm, Thời Gian Nộp, Trạng Thái (Đã Hoàn Thành / Đang Làm / Chưa Nộp), Điểm Số.
  - Bấm vào học sinh -> Bật **GradeSubmissionDrawer** trượt ra từ lề phải màn hình.
  - Cho phép nhập Điểm (0-10) + Ghi chú nhận xét của Giáo viên và bấm "Lưu Điểm" -> Bảng cập nhật tức thì tại chỗ mà không điều hướng rời trang.

---

## Verification Plan

### Automated Tests
- Run `npm run build` inside `frontend/` to verify zero TypeScript errors.

### Manual Verification
- Truy cập `/teacher/grading`, click chọn học sinh -> Drawer Chấm điểm mở từ lề phải.
- Nhập điểm và bấm Lưu -> Điểm hiển thị ngay trong bảng tại chỗ.
