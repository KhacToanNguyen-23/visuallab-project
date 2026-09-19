# Phase 2: 3D Workbench & HUD Dock (Đo Suất Điện Động & Điện Trở Trong)

**Goal:** Xây dựng bàn thí nghiệm 3D mạch điện Three.js và thanh điều khiển HUD Dock.

## Deliverables
- `frontend/src/components/simulations/emf-internal-r/EmfInternalRWorkbench3D.tsx`:
  - Hộp nguồn Pin 3D (Pin đơn 1.5V, Hộp 2 Pin 3.0V, Pin cũ).
  - Biến trở con chạy (Rheostat) 3D kèm con trượt có thể kéo bằng chuột.
  - Khóa K (Knife Switch) đóng/ngắt mạch điện.
  - Vôn kế & Ampe kế 3D với 2 chế độ: Kim vạch (Analog) & Hiện số (Digital LED).
  - Dây dẫn nhiều màu nối mạch phát sáng khi có dòng điện chạy qua.
- `frontend/src/components/simulations/emf-internal-r/EmfInternalRWorkbenchHudDock.tsx`:
  - Chọn loại nguồn Pin, Slider chỉnh biến trở ($2\Omega - 100\Omega$), Bật/Tắt Khóa K, Chuyển chế độ đồng hồ, Nút "+ Ghi Số Liệu".
