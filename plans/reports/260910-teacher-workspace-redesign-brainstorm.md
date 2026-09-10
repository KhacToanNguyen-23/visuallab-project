# Brainstorm: Teacher Workspace Redesign (SaaS Layout)

**Date:** 2026-09-10

## Ideas Explored
- **Option 1 (Tabbed Panel inside Dashboard):** Giữ giao diện Teacher cũ trong dạng tab của trang `/dashboard`.
- **Option 2 (Dedicated Route-based Teacher SaaS Workspace):** Tách hẳn giao diện Giáo viên ra cụm route URL riêng biệt (`/teacher`, `/teacher/classes`, `/teacher/labs`, `/teacher/assign`, `/teacher/grading`) với Left Navigation Sidebar cố định, Top Header, và Slide-over Drawers cho các thao tác Tạo lớp, Giao bài & Chấm bài.

## User's Direction
- **Lựa chọn:** Thống nhất **Option 2 (Dedicated Route-based Teacher SaaS Workspace)**.
- **Quy tắc giao diện:**
  - Không sử dụng icon/emoji trang trí rườm rà.
  - Đồng bộ thiết kế với Admin SaaS (Bo tròn nhẹ `6px-8px`, bảng dữ liệu tràn viền Full-width).
  - Thao tác chấm bài ở Sổ điểm (`/teacher/grading`) dùng **Slide-over Drawer bên phải** trực tiếp trên trang, không chuyển trang (không rời khỏi sổ điểm).
  - Tự động chuyển hướng tài khoản Giáo viên (`TEACHER`) từ `/dashboard` sang `/teacher` khi đăng nhập.

## Open Questions
1. Chi tiết thông tin số liệu thực hành của học sinh hiển thị trong Drawer Chấm bài (thời gian làm, số lần thử, kết quả đo đạc).

## Risks
1. Đảm bảo luồng tạo lớp & giao bài tập đồng bộ chính xác với AuthContext và dữ liệu học sinh/lớp học.
