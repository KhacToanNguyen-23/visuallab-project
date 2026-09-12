# Phase 3: Code Splitting (Lazy Load) & Kiểm Thử Biên Dịch

## Focus
Áp dụng `React.lazy()` + `React.Suspense` trong `src/main.tsx` để tối ưu Bundle Size ban đầu. Thêm `LabErrorBoundary.tsx` cho các bài lab. Kiểm thử `npm run build` đảm bảo không có lỗi TypeScript hay gãy đường dẫn.

## File Changes
- **NEW** `frontend/src/components/common/LabErrorBoundary.tsx` (Component hứng lỗi WebGL/Physics runtime)
- **MODIFY** `frontend/src/main.tsx` (Chuyển đổi các import tĩnh của bài lab & sub-pages sang `React.lazy()` kèm `Suspense fallback`)

## Steps
1. Tạo `LabErrorBoundary.tsx` hiển thị UI thông báo lỗi kèm nút reload lab khi canvas/physics crash.
2. Cập nhật `src/main.tsx` bọc các Route Lab trong `<Suspense fallback={<LoadingSpinner />}>`.
3. Chạy `npm run build` trong `frontend/` để kiểm tra biên dịch TypeScript toàn bộ dự án.

## Verification
- Chạy `npm run build` trong thư mục `frontend` và xác nhận kết quả thành công (Exit Code 0).
