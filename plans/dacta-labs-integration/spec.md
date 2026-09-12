# Feature Spec: Standardized DacTa.md Lab Data Integration

**Status:** Draft / Brainstormed & Planned
**Date:** 2026-09-12
**Target Area:** `frontend/src/services/labService.ts`, `frontend/src/pages/CatalogPage.tsx`

## 1. Context & Purpose
Thay thế toàn bộ mảng dữ liệu lab mẫu (mock data) trên giao diện LandingPage, CatalogPage, và giao diện giao bài của Giáo viên bằng 14 bài thực hành chuẩn theo đúng tài liệu `DacTa.md` (SGK Vật Lý GDPT 2018 Lớp 10, 11, 12).

## 2. Requirements & Scope

### P1 — Essential Lab Data Standardization (Phải làm ngay)
- [ ] **Cập nhật `DEFAULT_PUBLIC_LABS` trong `src/services/labService.ts`**:
  - Chuẩn hóa 14 bài thực hành SGK Lớp 10 (Bài 6, 14, 21, 30, 38), Lớp 11 (Bài 5, 7, 12, 19, 21), Lớp 12 (Bài 3, 4, 7, 12).
  - Đính kèm tên bài chuẩn SGK, số trang, phân loại UI (Kéo thả vs Tham số), danh sách Tool IDs và route mô phỏng tương ứng.
- [ ] **Đồng bộ Trang Thư Viện (`CatalogPage.tsx`)**:
  - Đảm bảo các bộ lọc Khối Lớp (Lớp 10, Lớp 11, Lớp 12) và Chủ Đề (Cơ học, Điện học, Quang học, Nhiệt học) hiển thị chính xác các bài lab từ `labService`.

## 3. Success Criteria
- [ ] Màn hình Thư viện (`/thu-vien`) và Trang chủ (`/`) hiển thị đúng 14 bài thực hành chuẩn SGK GDPT 2018 từ `DacTa.md`.
- [ ] Học sinh và Giáo viên khi chọn bài lab sẽ chuyển tới đường dẫn mô phỏng tương ứng.
- [ ] Lệnh `npm run build` biên dịch thành công 0 lỗi.
