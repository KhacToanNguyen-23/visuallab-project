# Phase 03: Overview Dashboard, System Labs & Audit Log Pages

**Goal:** Xây dựng các trang `/admin` (Tổng quan KPI System Metrics), `/admin/labs` (Kho Lab Hệ Thống), `/admin/audit` (Nhật ký hoạt động Audit Log), và tự động chuyển hướng người dùng Admin từ `/dashboard` sang `/admin`.

---

## User Stories Covered
- **[P2]** As an System Administrator, I want overview KPI stat cards on the dashboard root (`/admin`) showing quick metrics (Total Users, Teachers, Active Labs, System Status) so that I have instant visibility into platform health.

---

## Scope of Changes

### [NEW] `frontend/src/pages/admin/AdminOverviewPage.tsx`
- Trang chủ tổng quan Admin tại Route `/admin`:
  - 4 Stat KPI cards (Tổng lượt chạy lab, Số tài khoản học sinh, Số giáo viên, Số lớp học).
  - Biểu đồ/thống kê lượt sử dụng hệ thống.
  - Khối xem nhanh Audit Log mới nhất và Nút chuyển đến `/admin/audit`.

### [NEW] `frontend/src/pages/admin/AdminLabsPage.tsx`
- Trang Quản lý Kho Lab Hệ thống tại Route `/admin/labs`:
  - Data table toàn màn hình cho danh sách bài thí nghiệm mô phỏng.
  - Phân loại theo Mạch kiến thức (Điện, Cơ, Quang, Sóng - Nhiệt).
  - Nút bật/tắt trạng thái hiển thị (`Hiển Thị` / `Bản Nháp`), Nút Xem Thử lab.

### [NEW] `frontend/src/pages/admin/AdminAuditPage.tsx`
- Trang Nhật ký hoạt động Audit Log tại Route `/admin/audit`:
  - Bảng ghi nhận các sự kiện hệ thống chi tiết (Timestamp, User, Role, Action, Module).
  - Bộ lọc theo Module và tìm kiếm sự kiện.

### [MODIFY] `frontend/src/pages/DashboardPage.tsx`
- Chỉnh sửa logic `DashboardPage.tsx`: Nếu `user.role === 'ADMIN'`, tự động chuyển hướng (`navigate('/admin')`) sang giao diện SaaS Admin chuyên dụng.

---

## Verification Plan

### Automated Tests
- Run `npm run build` inside `frontend/` to verify zero build errors across all admin components.

### Manual Verification
- Đăng nhập tài khoản ADMIN tại `/dashboard` -> Hệ thống tự động chuyển hướng mịn sang `/admin`.
- Kiểm tra KPI Stat cards trên `/admin`.
- Chuyển sang `/admin/labs`, test đổi trạng thái bài lab.
- Chuyển sang `/admin/audit`, xem nhật ký hệ thống.
