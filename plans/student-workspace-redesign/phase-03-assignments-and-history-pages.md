# Phase 03: Overview, Assignments & Practice History Pages

**Goal:** Xây dựng các trang `/student` (KPI Overview), `/student/assignments` (Bài tập được giao & Drawer nộp báo cáo), `/student/history` (Lịch sử kết quả & Nhận xét của giáo viên).

---

## User Stories Covered
- **[P1]** As a Student, I want to view assigned physics lab homework, launch the interactive lab, and submit my experiment report to my teacher.
- **[P2]** As a Student, I want to view my practice history, scores, and teacher comments on `/student/history`.

---

## Scope of Changes

### [NEW] `frontend/src/pages/student/StudentOverviewPage.tsx`
- Trang chủ Tổng quan Học sinh (`/student`):
  - 4 Stat KPI cards (Số Lớp Đã Tham Gia, Bài Tập Cần Nộp, Bài Đã Hoàn Thành, Điểm Trung Bình).
  - Nút "+ Tham Gia Lớp Bằng Mã" và danh sách bài tập sắp hết hạn.

### [NEW] `frontend/src/pages/student/StudentAssignmentsPage.tsx` & `SubmitAssignmentDrawer.tsx`
- Trang danh sách bài tập được giao (`/student/assignments`):
  - Data table: Tên Bài Tập, Lớp Học, Giáo Viên Giao, Hạn Nộp (Deadline), Trạng Thái.
  - Bấm chọn -> Bật `SubmitAssignmentDrawer` trượt từ lề phải ra xem yêu cầu & bấm "Khởi Chạy Phòng Lab Thực Hành →" và "Nộp Báo Cáo Thí Nghiệm".

### [NEW] `frontend/src/pages/student/StudentHistoryPage.tsx`
- Trang Lịch Sử & Kết Quả (`/student/history`):
  - Full-width data table: Tên Bài Thí Nghiệm, Lớp Học, Thời Gian Nộp, Điểm Số Giáo Viên Chấm, Nhận Xét Của Giáo Viên.

---

## Verification Plan

### Automated Tests
- Run `npm run build` inside `frontend/` to verify zero TypeScript errors.

### Manual Verification
- Truy cập `/student/assignments`, chọn bài tập -> Nộp bài -> Trạng thái đổi thành "Đã nộp bài" và kết quả xuất hiện ở `/student/history`.
