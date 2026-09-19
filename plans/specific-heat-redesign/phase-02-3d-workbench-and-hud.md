# Phase 2: 3D Workbench & HUD Dock (Đo Nhiệt Dung Riêng)

**Goal:** Xây dựng bàn thí nghiệm ảo 3D Three.js và thanh điều khiển HUD Dock.

## Deliverables
- `frontend/src/components/simulations/specific-heat/SpecificHeatWorkbench3D.tsx`:
  - Bình nhiệt lượng kế 3D 2 lớp cách nhiệt, nắp đậy trong suốt.
  - Que khuấy cơ học quay liên tục khi bật.
  - Dây mayso xoắn ốc nung đỏ cam tỉ lệ theo công suất $P$.
  - Hiệu ứng bọt khí lăn tăn, chất lỏng trong suốt theo màu của Nước / Cồn / Dầu.
  - Cảm biến nhiệt điện tử & đồng hồ đo điện năng.
  - Tự động ngắt nhiệt an toàn khi chạm điểm sôi.
- `frontend/src/components/simulations/specific-heat/SpecificHeatWorkbenchHudDock.tsx`:
  - Bộ chọn chất lỏng (Nước, Cồn, Dầu).
  - Tùy chỉnh khối lượng $m$ (100g - 400g) và công suất $P$ (30W - 100W).
  - Nút Bật/Tắt Que khuấy, Bắt đầu Đun / Dừng / Đặt lại.
  - Nút "+ Ghi Số Liệu".
