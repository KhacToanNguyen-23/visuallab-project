# Phase 2: 3D Three.js Studio & HUD Dock

## Objectives
- Tạo `frontend/src/components/simulations/induction/InductionWorkbench3D.tsx`:
  - Solenoid coil 3D với số vòng $N = 100, 200, 400$ cuộn đồng bóng loáng.
  - Thanh nam châm vĩnh cửu 3D (Cực N đỏ, Cực S xanh) hỗ trợ kéo thả chuột tự do bằng Raycaster / Drag plane hoặc chuyển động tự động mượt mà.
  - Đường sức từ 3D hiển thị trường từ của nam châm và cảm ứng từ.
  - Bóng đèn LED 3D phát sáng tỷ lệ với $|I_c|$.
  - Điện kế Galvanometer 3D/2D overlay với kim quay hiển thị độ lệch góc $\theta \propto I_c \in [-50\text{mA}, +50\text{mA}]$.
- Tạo `frontend/src/components/simulations/induction/InductionWorkbenchHudDock.tsx`:
  - Thanh chọn số vòng dây $N$ ($100, 200, 400$).
  - Nút Đảo Cực Nam Châm ("🔄 Đảo Cực N/S").
  - Các nút bước tự động: "▶ Đưa Vào Chậm", "⏩ Đưa Vào Nhanh", "◀ Rút Ra".
  - Nút "↺ Đặt Lại" và "+ Ghi Số Liệu".
