# Phase 01: Tạo Component Slide-over Drawer Nộp Bài Nổi (`FloatingAssignmentDrawer.tsx`)

**Goal:** Xây dựng component Drawer nộp bài trượt từ bên phải (Right Slide-over Drawer) cho học sinh trong chế độ làm bài tập.

---

## 1. Chi Tiết Thực Hiện

- Tạo file `frontend/src/components/assignment/FloatingAssignmentDrawer.tsx`:
  - Nhận props: `isOpen`, `onClose`, `assignmentId`, `instanceId`, `assignmentData`, `studentInstance`, `onSubmitted`.
  - Hiển thị thông số đề bài cá nhân (ví dụ: $L = 1.8m, \theta = 9^\circ$).
  - Form nhập số liệu thực nghiệm đo đạc (Chu kỳ $T$, gia tốc $g$, vận tốc $v$, v.v.) và diễn giải.
  - Gọi API `assignmentService.submitAssignment` (`/api/submissions`) để chấm điểm tự động bằng Math Engine + AI.
  - Hiển thị kết quả điểm số chi tiết: Điểm Toán (Math Score), Điểm Lập Luận (AI Score), Điểm Tổng (Total Score) và Lời nhận xét sư phạm.
  - Nút "Quay về danh sách bài tập".
