# Phase 4: Main Lab Integration, Drawer Sync & Verification

## Mục Tiêu
1. Tạo container `frontend/src/components/simulations/boyle-mariotte/BoyleMariotteLab.tsx` kết hợp 3D Workbench và Wizard Worksheet trong bố cục 2 cột linh hoạt.
2. Cập nhật `FloatingAssignmentDrawer.tsx` để hỗ trợ nạp kết quả chấm điểm của `sim-boyle-mariotte`.
3. Kiểm tra toàn diện build frontend (`npm run build` / `tsc -b`) và xác minh luồng làm bài $\to$ nộp bài $\to$ hiển thị điểm.

## Nghiệm Thu
- Giao diện 3D và Wizard hoạt động mượt mà.
- Học sinh làm bài, chấm điểm ra kết quả và bấm nộp bài thành công lên hệ thống backend.
