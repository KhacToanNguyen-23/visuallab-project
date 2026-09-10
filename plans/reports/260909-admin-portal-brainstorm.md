# Brainstorm Report: Admin Portal Redesign & Provisioning

**Date:** 2026-09-09

## Ideas Explored
1. **Self-service Teacher Registration with Approval:** Loại bỏ. Thống nhất rằng Giáo viên là tài khoản đặc quyền do Admin trực tiếp khởi tạo và cấp quyền để đảm bảo an toàn hệ thống.
2. **Complex Lab Builder & Telemetry Editor:** Tạm hoãn (tuân thủ YAGNI). Chưa cần thiết kế CRUD bài lab quá chi tiết khi chưa định hình xong cấu trúc phòng lab ảo. Chỉ giữ bảng quản lý bài lab đơn giản (Tên, Mạch kiến thức, Route, Ẩn/Hiện).
3. **High-Density Full-Width Admin Dashboard (Phương án chọn):** Áp dụng chuẩn thiết kế phồng nén 0 Emoji, 100% tràn màn hình. Gồm 3 Tab chính: Quản lý & Cấp tài khoản Người dùng, Bảng Kho bài Lab ảo đơn giản, Thống kê & Nhật ký hệ thống.

## User's Direction
- **Cấp Tài Khoản Giáo Viên:** Admin trực tiếp bấm nút tạo và cấp tài khoản cho Giáo viên (`[GIÁO VIÊN]`). Học sinh có thể tự do đăng ký/đăng nhập (`[HỌC SINH]`).
- **Quản Lý Người Dùng & Phân Quyền:** Bảng nén mật độ cao cho phép Admin chuyển đổi vai trò, khóa/kích hoạt tài khoản.
- **Kho Bài Lab Đơn Giản (KISS):** Bảng quản lý siêu nhẹ để bật/tắt hiển thị hoặc sửa thông tin cơ bản của bài lab mẫu.
- **Thống Kê & Audit Log:** Thẻ số liệu tổng quan + Bảng ghi lại lịch sử hoạt động realtime của hệ thống.
