# Spec: Admin Portal & User Provisioning

**Date:** 2026-09-09  
**Status:** Approved  

---

## Problem Statement
Quản trị viên (Admin) cần một không gian làm việc tràn màn hình (Full-Width), không emoji (Zero-Emoji), nén mật độ cao để:
1. Trực tiếp tạo và cấp tài khoản cho Giáo viên (`[GIÁO VIÊN]`).
2. Quản lý danh sách người dùng, chuyển đổi vai trò (`HỌC SINH` <-> `GIÁO VIÊN` <-> `ADMIN`), và khóa/kích hoạt tài khoản.
3. Quản lý đơn giản kho bài Lab ảo mẫu (ẩn/hiện bài lab, cập nhật tên/route).
4. Quan sát số liệu tổng quan hệ thống và bảng nhật ký hoạt động (Audit Log).

---

## User Stories

<!-- P1 = MVP (must ship), P2 = nice-to-have, P3 = future/out-of-scope -->

- **[P1]** As an Admin, I want to create and provision Teacher accounts so that verified teachers can access the management workspace.  
  *Accepted when:* Admin điền form "Tạo Tài Khoản Giáo Viên" (Họ tên, Email, Trường học) -> Hệ thống sinh tài khoản Giáo viên (`[GIÁO VIÊN]`) đã kích hoạt.

- **[P1]** As an Admin, I want a High-Density User Management Table so that I can view, change roles, and suspend/activate accounts.  
  *Accepted when:* Bảng người dùng hiển thị danh sách dạng hàng (Họ tên, Email, Vai trò, Trường, Trạng thái) kèm các nút `[Đổi Vai Trò]`, `[Khóa/Kích Hoạt]`.

- **[P1]** As an Admin, I want a Simple Virtual Lab Catalog Table so that I can view and toggle visibility of system lab modules.  
  *Accepted when:* Bảng kho lab hiển thị nhãn Mạch kiến thức (`[ĐIỆN HỌC]`, `[CƠ HỌC]`, etc.), Tên bài, Route mô phỏng, và nút bật/tắt `[Hiển Thị]` / `[Ẩn]`.

- **[P1]** As an Admin, I want System Overview Metrics & Activity Audit Logs so that I can monitor overall platform health and active sessions.  
  *Accepted when:* Phần thống kê hiển thị các thẻ số liệu phẳng (Tổng lượt chạy lab, Học sinh active, Giáo viên kích hoạt, Lớp đang mở) + Bảng nhật ký hoạt động thời gian thực.

---

## Functional Requirements

1. **FR-01 (Cấp Tài Khoản Giáo Viên):** Form tạo tài khoản Giáo viên mới do Admin làm chủ. Học sinh có thể tự do đăng ký.
2. **FR-02 (Bảng Quản Lý Người Dùng & Phân Quyền):** Tìm kiếm người dùng theo Họ tên/Email, chuyển đổi vai trò (`STUDENT`, `TEACHER`, `ADMIN`), và đổi trạng thái (`Active` / `Suspended`).
3. **FR-03 (Bảng Quản Lý Kho Bài Lab Đơn Giản):** Bảng dữ liệu nén hiển thị bài lab ảo mẫu, cho phép bật/tắt trạng thái hiển thị trên thư viện chung.
4. **FR-04 (Thống Kê & Nhật Ký Hoạt Động):** Thẻ chỉ số hệ thống + Bảng Audit Log các thao tác chính trong hệ thống.

---

## Non-Functional Requirements

- **Design Standard:** 100% Zero-Emoji Academic Flat Style, Full-Width Layout.
- **Performance:** Thời gian phản hồi tìm kiếm & chuyển tab < 200ms.

---

## Success Criteria

- [ ] Admin tạo thành công tài khoản Giáo viên mới trong < 15 giây.
- [ ] Admin đổi vai trò hoặc khóa/mở khóa tài khoản trực tiếp từ bảng người dùng.
- [ ] 0 emoji xuất hiện trên toàn bộ không gian làm việc của Admin.
