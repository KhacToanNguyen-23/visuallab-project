# Phase 02: Tích Hợp Top Assignment Banner & Drawer vào Toàn Bộ Lab Workbench

**Goal:** Xây dựng Wrapper Container hoặc Topbar Banner nhận diện chế độ làm bài trên toàn bộ các phòng Lab.

---

## 1. Chi Tiết Thực Hiện

- Tạo component `frontend/src/components/assignment/AssignmentLabHeaderBanner.tsx`:
  - Hiển thị thanh Banner cố định trên đỉnh của phòng Lab khi `assignmentId` tồn tại.
  - Hiển thị badge: `[ĐANG LÀM BÀI TẬP] {Tên Bài} • Đề bài: {Thông số cá nhân}`.
  - Hiển thị badge Deadline xanh/đỏ thời gian thực.
  - Nút **"📝 Ghi Chép & Nộp Bài"** mở `FloatingAssignmentDrawer`.
  - Nút **"← Thoát bài làm"** quay lại `/student/assignments`.
- Tạo `frontend/src/pages/student/StudentLabAssignmentWorkbenchPage.tsx` hoặc Wrapper Route kết nối các lab engines:
  - Tự động map `labType` (hoặc route) để nhúng phòng lab tương ứng (`PhetSpringLab`, `PhetPendulumLab`, `SpeedMeasurementLab`, `PhetEmfLab`, `SRSWorkflowPage`, `UniversalWorkbenchPage`, v.v.).
