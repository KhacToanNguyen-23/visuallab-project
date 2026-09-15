# Phase 03: Cập Nhật Luồng Khởi Chạy Từ `StudentAssignmentsPage` & Kiểm Thử Toàn Diện

**Goal:** Kết nối nút "Làm bài" và "Làm lại" từ bảng bài tập học sinh vào luồng Full Lab Workbench mới.

---

## 1. Chi Tiết Thực Hiện

- Cập nhật `frontend/src/pages/student/StudentAssignmentsPage.tsx`:
  - Khi bấm **"Làm & Nộp Bài →"** hoặc bấm nút trong Drawer:
  - Khởi tạo `student-instance` từ backend (nếu chưa có).
  - Điều hướng học sinh trực tiếp vào Full Lab Workbench tương ứng.
- Cập nhật `frontend/src/main.tsx` với route học sinh làm bài: `/student/assignment/:assignmentId/lab`.
- Kiểm thử toàn diện:
  - Thao tác đo đạc trên phòng lab ảo 60 FPS.
  - Mở Drawer nộp bài, nhập kết quả và kiểm tra chấm điểm AI.
  - Kiểm tra điều hướng quay lại danh sách bài tập.
