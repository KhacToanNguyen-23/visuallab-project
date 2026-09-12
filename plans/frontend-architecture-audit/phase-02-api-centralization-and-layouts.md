# Phase 2: Tập Trung Hóa API Config & Tái Cấu Trúc Layouts

## Focus
Loại bỏ hoàn toàn các chuỗi URL `http://localhost:8080/api` bị hardcode rải rác. Tạo `src/config/api.ts`. Chuyển tất cả tệp Layout về thư mục `src/layouts/` và hợp nhất thư mục `components/simulations`.

## File Changes
- **NEW** `frontend/src/config/api.ts` (Khai báo `API_BASE_URL` dùng `import.meta.env.VITE_API_URL || 'http://localhost:8080/api'`)
- **MODIFY** `frontend/src/context/AuthContext.tsx` (Dùng `API_BASE_URL`)
- **MODIFY** `frontend/src/services/assignmentService.ts` (Dùng `API_BASE_URL`)
- **MODIFY** `frontend/src/services/classService.ts` (Dùng `API_BASE_URL`)
- **MODIFY** `frontend/src/services/labService.ts` (Dùng `API_BASE_URL`)
- **MOVE** `frontend/src/components/admin/AdminLayout.tsx` → `frontend/src/layouts/AdminLayout.tsx`
- **MOVE** `frontend/src/components/teacher/TeacherLayout.tsx` → `frontend/src/layouts/TeacherLayout.tsx`
- **MOVE** `frontend/src/components/student/StudentLayout.tsx` → `frontend/src/layouts/StudentLayout.tsx`
- **MOVE** các file trong `frontend/src/components/simulation/` → `frontend/src/components/simulations/`
- **MODIFY** `frontend/src/main.tsx` (Cập nhật các đường dẫn import mới)

## Steps
1. Tạo `src/config/api.ts` chứa hằng số `API_BASE_URL`.
2. Thay thế tất cả các chuỗi `http://localhost:8080/api` trong `AuthContext.tsx` và 3 file services.
3. Di chuyển 3 tệp Layout về `src/layouts/`.
4. Gom các component từ `src/components/simulation/` vào `src/components/simulations/` và xóa thư mục số ít.
5. Cập nhật các câu lệnh `import` trong `src/main.tsx` và các tệp liên quan.

## Verification
- Kiểm tra không còn chuỗi `http://localhost:8080` bị fix cứng rải rác trong `src/services` hay `src/context`.
- Kiểm tra các import đường dẫn mới chính xác.
