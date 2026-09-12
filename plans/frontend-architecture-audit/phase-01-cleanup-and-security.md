# Phase 1: Dọn Dẹp File Rác & Vá Lỗi Phân Quyền Role Gate

## Focus
Xóa sạch 5 file `.jsx` rác & mồ côi (`App.jsx`, `main.jsx`, `LabLayout.jsx`, `PortalLayout.jsx`, `LabWorkspace.jsx`) cùng các file asset thừa (`react.svg`, `vite.svg`, `App.css`). Nâng cấp `ProtectedRoute.tsx` hỗ trợ kiểm tra `allowedRoles`.

## File Changes
- **DELETE** `frontend/src/App.jsx`
- **DELETE** `frontend/src/main.jsx`
- **DELETE** `frontend/src/layouts/LabLayout.jsx`
- **DELETE** `frontend/src/layouts/PortalLayout.jsx`
- **DELETE** `frontend/src/pages/LabWorkspace.jsx`
- **DELETE** `frontend/src/assets/react.svg`
- **DELETE** `frontend/src/assets/vite.svg`
- **DELETE** `frontend/src/App.css`
- **MODIFY** `frontend/src/routes/ProtectedRoute.tsx` (Thêm logic kiểm tra `allowedRoles` theo `user.role` từ `AuthContext`)
- **MODIFY** `frontend/src/main.tsx` (Đính kèm prop `allowedRoles={['ADMIN']}`, `allowedRoles={['TEACHER']}`, `allowedRoles={['STUDENT']}` cho các nhóm Route tương ứng)

## Steps
1. Xóa các tệp dư thừa / mồ côi đã liệt kê.
2. Cập nhật `ProtectedRoute.tsx`:
   ```tsx
   interface ProtectedRouteProps {
     children: React.ReactNode;
     allowedRoles?: ('ADMIN' | 'TEACHER' | 'STUDENT')[];
   }
   ```
   Nếu `allowedRoles` được cung cấp và `user.role` không nằm trong danh sách, chuyển hướng về trang dashboard tương ứng với vai trò của người dùng hoặc `/login`.
3. Cập nhật `src/main.tsx` bọc các route `/admin/*`, `/teacher/*`, `/student/*` với `allowedRoles`.

## Verification
- Kiểm tra file hệ thống đảm bảo các tệp `.jsx` bị xóa hoàn toàn.
- Kiểm tra code `ProtectedRoute.tsx` đảm bảo logic phân quyền đúng spec.
