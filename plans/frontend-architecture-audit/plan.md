# Plan: Frontend Architecture Refactoring & Security Hardening

**Mode:** fast
**Risk:** normal — touches auth route protection, API configuration, layout file locations, and orphan file cleanup

## Overview
Kế hoạch tái cấu trúc toàn diện thư mục `frontend/src` nhằm đạt chuẩn kiến trúc công nghiệp: xóa bỏ file rác `.jsx`, vá lỗ hổng phân quyền Role trên Route, gom API configuration tập trung, tái bố trí Layouts và áp dụng Code Splitting (`React.lazy`).

---

## Phases

### Phase 1: Dọn Dẹp File Rác & Bổ Sung Phân Quyền Role Gate (P1)
- **File:** `plans/frontend-architecture-audit/phase-01-cleanup-and-security.md`
- **Mục tiêu:** Xóa bỏ 5 file `.jsx` rác & 3 file asset dư thừa. Cập nhật `ProtectedRoute.tsx` hỗ trợ `allowedRoles` để ngăn `STUDENT` truy cập trái phép trang Admin/Teacher.

### Phase 2: Tập Trung Hóa API Config & Tái Cấu Trúc Layouts (P2)
- **File:** `plans/frontend-architecture-audit/phase-02-api-centralization-and-layouts.md`
- **Mục tiêu:** Tạo `src/config/api.ts` quản lý `API_BASE_URL` tập trung. Chuyển `AdminLayout`, `TeacherLayout`, `StudentLayout` về `src/layouts/` và gom thư mục `components/simulations`.

### Phase 3: Code Splitting (Lazy Load) & Kiểm Thử Biên Dịch (P2)
- **File:** `plans/frontend-architecture-audit/phase-03-code-splitting-and-verification.md`
- **Mục tiêu:** Áp dụng `React.lazy()` + `React.Suspense` trong `src/main.tsx` để tối ưu dung lượng Bundle ban đầu. Kiểm thử biên dịch `npm run build` thành công 100%.

---

## Verification Plan
- Chạy `npm run build` trong `frontend/` để kiểm tra biên dịch TypeScript.
- Kiểm tra lại danh sách file trong `src/` đảm bảo không còn file `.jsx` rác nào.
