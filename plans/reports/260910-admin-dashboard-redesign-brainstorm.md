# Brainstorm: Admin Dashboard Redesign (SaaS Layout)

**Date:** 2026-09-10

## Ideas Explored
- **Direction A (Classic SaaS Layout):** Left Sidebar cố định (collapsible), Top Bar với Breadcrumbs/Search/Profile, và tách các trang quản trị theo Route URL riêng (`/admin/users`, `/admin/labs`, `/admin/audit`).
- **Direction B (Linear-style / Slide-over Focus):** Tập trung tối đa vào bảng dữ liệu, sử dụng Drawer slide-over từ phải qua cho việc tạo/sửa dữ liệu thay vì đặt Form cố định trên đầu trang.
- **Direction C (Metric-First Dashboard):** Đặt các Stat/KPI cards hiển thị tổng quan hệ thống lên vị trí ưu tiên đầu tiên ở trang chính Admin.

## User's Direction
- **Lựa chọn:** Kết hợp **Direction A** (Classic SaaS App Layout với Left Sidebar & Route-based Navigation) và **Slide-over Drawer** (dùng bảng trượt từ bên phải khi bấm "+ Cấp tài khoản mới" hoặc thao tác với người dùng).
- **Cấu trúc trang:** Khuyên dùng và chốt phương án **Tách theo Route URL riêng biệt (`/admin/users`, `/admin/labs`, `/admin/audit`)** để tối đa hóa không gian hiển thị bảng dữ liệu, hỗ trợ bookmark trực tiếp và cải thiện trải nghiệm người dùng SaaS.

## Open Questions
1. Chi tiết các cột dữ liệu và tính năng cho trang `/admin/labs` và `/admin/audit` ngoài trang `/admin/users`.
2. Tích hợp Toast notification phản hồi khi thực hiện các action thành công trong Drawer (Tạo tài khoản, Đổi vai trò, Khóa/Kích hoạt).

## Risks
1. Cần đảm bảo các API endpoint hiện tại (`/api/admin/...`) hoạt động khớp với giao diện mới mà không yêu cầu thay đổi breaking change ở backend.
2. Đảm bảo tính tương thích responsive trên các màn hình nhỏ (Tablet / Mobile collapse sidebar).
