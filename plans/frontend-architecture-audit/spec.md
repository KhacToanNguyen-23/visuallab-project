# Feature Spec: Frontend Industrial Architecture Refactoring & Optimization

**Status:** Draft / Brainstormed & Expanded
**Date:** 2026-09-11
**Target Area:** `frontend/src`

## 1. Context & Purpose
Tái cấu trúc và nâng cấp toàn bộ dự án Frontend (`frontend/src`) từ mức MVP lên Chuẩn Kiến trúc Công nghiệp (Production/Enterprise Grade). Loại bỏ hoàn toàn file rác, file fix cứng, gom cụm Layouts, vá lỗ hổng bảo mật phân quyền Role, đồng thời tối ưu hiệu năng tải trang (Code Splitting) và khả năng khôi phục lỗi (Error Boundaries).

## 2. Requirements & Scope

### P1 — Security & Essential Cleanup (Phải làm ngay)
- [ ] **Bảo mật phân quyền (Role Gate)**: Cập nhật `ProtectedRoute.tsx` hỗ trợ kiểm tra `allowedRoles?: ('ADMIN' | 'TEACHER' | 'STUDENT')[]`. Chuyển hướng người dùng không đúng Role về trang phù hợp thay vì cho phép truy cập tự do.
- [ ] **Xóa file rác & mồ côi (Junk Cleanup)**:
  - Xóa `src/App.jsx` & `src/main.jsx`.
  - Xóa `src/layouts/LabLayout.jsx`, `src/layouts/PortalLayout.jsx`, `src/pages/LabWorkspace.jsx`.
  - Xóa `src/assets/react.svg`, `src/assets/vite.svg`, `src/App.css`.
- [ ] **Loại bỏ URL fix cứng (API Config)**:
  - Tạo `src/config/api.ts` quản lý `API_BASE_URL` lấy từ `import.meta.env.VITE_API_URL || 'http://localhost:8080/api'`.
  - Cập nhật `AuthContext.tsx`, `assignmentService.ts`, `classService.ts`, `labService.ts` sử dụng `API_BASE_URL`.

### P2 — Architectural Refactoring & Optimization (Nâng cấp kiến trúc & Tối ưu)
- [ ] **Tạo HTTP Client tập trung (`src/services/apiClient.ts`)**: Tự động đính kèm Token từ LocalStorage và xử lý lỗi HTTP.
- [ ] **Tái cấu trúc Layouts**:
  - Di chuyển `AdminLayout.tsx`, `TeacherLayout.tsx`, `StudentLayout.tsx` từ `src/components/...` về `src/layouts/`.
  - Cập nhật các đường dẫn `import` tương ứng trong `src/main.tsx`.
- [ ] **Thống nhất cấu trúc thư mục Component**:
  - Hợp nhất `src/components/simulation` và `src/components/simulations` thành `src/components/simulations`.
- [ ] **Code Splitting (Hiệu năng tải trang)**:
  - Sử dụng `React.lazy()` + `React.Suspense` cho các Route Lab nặng và Sub-Pages trong `src/main.tsx`.
- [ ] **Error Boundaries (Bảo vệ ứng dụng)**:
  - Tạo `LabErrorBoundary.tsx` bao bọc các bài lab 3D/Canvas để ngăn ngừa hiện tượng màn hình trắng (White Screen of Death) khi xẩy ra lỗi WebGL/Physics.

## 3. Success Criteria
- [ ] Dự án build thành công (`npm run build`) không có lỗi TypeScript hoặc missing file imports.
- [ ] Học sinh (`STUDENT`) gõ `/admin` bị chặn và đẩy về `/student` hoặc `/login`.
- [ ] Không còn bất kỳ file `.jsx` hay file mồ côi nào trong `src/`.
- [ ] Không còn đường dẫn `http://localhost:8080` bị fix cứng rải rác trong `src/services` hay `src/context`.
- [ ] Tệp JS Bundle ban đầu giảm dung lượng nhờ Lazy Loading các bài lab.
