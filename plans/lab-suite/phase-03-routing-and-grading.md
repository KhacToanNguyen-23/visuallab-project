# Phase 03: Tích Hợp Routing & Tự Động Chấm Điểm Auto-Grading

**Goal:** Tích hợp `PhetSpringLab` & `PhetEmfLab` vào hệ thống làm bài tập học sinh và giao bài tập của giáo viên.

---

## 🛠️ File Changes
1. **[MODIFY]** `frontend/src/components/assignment/StudentLabAssignmentView.tsx`: Tích hợp render `PhetSpringLab` và `PhetEmfLab` khi `assignment.labType` là `SPRING` hoặc `EMF`.
2. **[MODIFY]** `frontend/src/pages/teacher/TeacherAssignPage.tsx`: Thêm tùy chọn giao bài `Con Lắc Lò Xo` và `Đo Suất Điện Động E, r`.

---

## 🔬 Từng Bước Thực Hiện
- Cập nhật mapper `renderLabSimulation` trong `StudentLabAssignmentView.tsx`.
- Cập nhật danh sách `LAB_OPTIONS` trong `TeacherAssignPage.tsx`.
- Kiểm tra toàn bộ luồng giao bài -> học sinh mở bài lab -> chấm điểm tự động qua AI.

---

## 🧪 Kiểm Tra & Verification
- Test 1: `npm run build` không lỗi TypeScript.
- Test 2: Học sinh nhận bài tập Con lắc lò xo/Suất điện động E, r mở đúng giao diện lab tương ứng.
