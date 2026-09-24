# Phase 3: React Zustand Bridge & UI Shell

## Objective
Kết nối sự kiện từ Photogate sang Bảng dữ liệu React bằng Zustand mà không làm lag 60FPS.

## Proposed Changes
- `frontend/src/store/useFreeFallStore.ts`: Lưu trữ trạng thái `(s, t1, t2)`.
- Cập nhật `FreeFallScene.ts` để `link()` Property và gọi `useFreeFallStore.getState().addMeasurement(...)`.
- Tích hợp `@tanstack/react-table` hiển thị bảng số liệu.
