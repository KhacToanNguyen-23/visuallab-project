# Phase 01: Admin Layout Shell & Route Architecture

**Goal:** Dựng khung Admin Layout chuẩn SaaS tràn màn hình (Full-width Left Sidebar + Top Header) và cấu hình `react-router-dom` cho cụm route `/admin/*`.

---

## User Stories Covered
- **[P1]** As an System Administrator, I want a full-width Admin layout with a collapsible left navigation sidebar and route-based navigation so that I can easily navigate between user management, system labs, and audit logs with maximum screen space.

---

## Scope of Changes

### [NEW] `frontend/src/components/admin/AdminLayout.tsx`
- Component khung bọc ngoài (`AdminLayout`) cho tất cả trang Admin.
- Chứa `AdminSidebar`, `AdminHeader`, và `<Outlet />` hiển thị nội dung route con.
- Hỗ trợ state thu gọn/mở rộng Sidebar (`isSidebarCollapsed`).

### [NEW] `frontend/src/components/admin/AdminSidebar.tsx`
- Thanh điều hướng bên trái chuẩn Enterprise SaaS:
  - Header: Logo VisualLab + Badge ADMIN.
  - Menu Items: `Tổng Quan` (`/admin`), `Quản Lý Người Dùng` (`/admin/users`), `Kho Lab Hệ Thống` (`/admin/labs`), `Audit Log` (`/admin/audit`).
  - Active state dựa theo `useLocation().pathname`.
  - Responsive overlay trên màn hình di động/tablet.

### [NEW] `frontend/src/components/admin/AdminHeader.tsx`
- Thanh Header trên cùng:
  - Left: Nút Toggle Sidebar + Breadcrumbs đường dẫn (vd: `Admin / Quản Lý Người Dùng`).
  - Right: Quick Search input / trigger, Toggle Theme (Sáng/Tối), Profile Dropdown + Logout.

### [MODIFY] `frontend/src/main.tsx`
- Thêm cụm route bọc trong `ProtectedRoute`:
  ```tsx
  <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
    <Route index element={<AdminOverviewPage />} />
    <Route path="users" element={<AdminUsersPage />} />
    <Route path="labs" element={<AdminLabsPage />} />
    <Route path="audit" element={<AdminAuditPage />} />
  </Route>
  ```

---

## Verification Plan

### Automated Tests
- Run `npm run build` inside `frontend/` to ensure no TypeScript or JSX compilation errors.

### Manual Verification
- Truy cập `/admin`, `/admin/users`, `/admin/labs`, `/admin/audit`. Kiểm tra active state ở Sidebar chuyển chính xác.
- Test nút Thu gọn/Mở rộng Sidebar.
