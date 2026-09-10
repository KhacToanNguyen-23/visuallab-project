# Brainstorm: Student Workspace Redesign (SaaS Layout)

**Date:** 2026-09-10

## Ideas Explored
- **Option 1 (Mixed Dashboard):** Gộp chung tìm kiếm thí nghiệm tự do và quản lý nộp bài tập của học sinh trong 1 trang `/dashboard`.
- **Option 2 (Decoupled SaaS Architecture):** Tách biệt Thư viện thí nghiệm công khai (`/labs` / Trang chủ `/`) và Trang cá nhân Học sinh (`/student/*`: `/student`, `/student/classes`, `/student/assignments`, `/student/history`).

## User's Direction
- **Lựa chọn:** Thống nhất **Option 2 (Decoupled SaaS Architecture)**.
- **Quy tắc giao diện:**
  - Đồng bộ 100% với Admin và Giáo viên: Tuyệt đối không dùng icon/emoji trang trí, tràn viền Full-width, bo góc nhẹ `6px-8px`.
  - Tự động chuyển hướng tài khoản Học sinh (`STUDENT`) từ `/dashboard` sang `/student`.
  - Thao tác "+ Tham gia lớp bằng mã" dùng **Slide-over Drawer bên phải**.
  - Xem chi tiết bài tập & nộp bài thực hành trong `/student/assignments`.

## Open Questions
1. Tích hợp dữ liệu báo cáo thực hành của học sinh vào luồng gửi cho giáo viên.

## Risks
1. Đảm bảo tính nhất quán của mã mời (Join Code) khi học sinh nhập mã từ giáo viên.
