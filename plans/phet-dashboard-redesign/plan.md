# Implementation Plan: PhET-Style Dashboard Optimization for Students & Teachers

**Date:** 2026-09-09  
**Mode:** --hard  
**Risk:** normal — Touches Dashboard UI layout, filtering logic, search state, and role-based panels  
**Spec:** [`plans/phet-dashboard-redesign/spec.md`](file:///d:/6_OJT/EduLab/plans/phet-dashboard-redesign/spec.md)  

---

## 1. Executive Summary

Bản kế hoạch tối ưu hóa trang **Dashboard (`DashboardPage.tsx`)** tham khảo cấu trúc PhET Interactive Simulations:
1. **Thanh lọc & Tìm kiếm thông minh (PhET Navigation Bar)**: Tìm kiếm theo từ khóa + Lọc theo Khối lớp (6-12) & Chủ đề (Cơ, Nhiệt, Điện, Quang).
2. **Khu vực cá nhân hóa theo Vai trò (Role-based Workspace)**:
   - **Giáo viên**: Hiển thị góc "Tạo bài thực hành mẫu", "Bộ công cụ giảng dạy", "Danh sách học sinh nộp bài".
   - **Học sinh**: Hiển thị góc "Bài thí nghiệm gần đây", "Quy trình thực hành 5 bước SGK", "Báo cáo A4 đã xuất".
3. **Danh mục mô phỏng dạng PhET Grid**: Các thẻ mô phỏng có hình ảnh xem trước, nhãn khối lớp, nút "Khởi chạy" & nút "Xem hướng dẫn".

---

## 2. Implementation Phases

### Phase 1: PhET Simulation Card & Filter State Architecture
- **Files to create/modify**:
  - `frontend/src/components/dashboard/PhETFilterBar.tsx`: Thanh công cụ gồm Search input, Tabs Khối lớp, Chips Chủ đề.
  - `frontend/src/components/dashboard/SimCard.tsx`: Thẻ bài mô phỏng chuẩn PhET (Badge lớp, Hình ảnh minh họa, Nút chạy).

### Phase 2: Role-based Specialized Panels (Giáo viên vs Học sinh vs Admin)
- **Files to create/modify**:
  - `frontend/src/components/dashboard/RoleWorkspacePanel.tsx`: Component hiển thị thông tin quan trọng phù hợp với role của user đang đăng nhập.

### Phase 3: Dashboard Layout Assembly & Integration
- **Files to modify**:
  - `frontend/src/pages/DashboardPage.tsx`: Lắp ráp toàn bộ layout mới (Header -> Filter Bar -> Role Workspace Panel -> PhET Sim Grid).

---

## 3. Verification Plan

### Automated Verification:
- **Build Check**: Chạy `npm run build` kiểm tra TypeScript & JSX compilation.

### Manual / Visual Verification:
- Mở `http://localhost:5173/dashboard` dưới tài khoản Học sinh, Giáo viên và Admin để kiểm tra bộ lọc, tìm kiếm và khu vực cá nhân hóa hiển thị đúng mục tiêu từng role.
