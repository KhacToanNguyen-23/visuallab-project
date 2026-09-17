# Phase 2: 3D Three.js Parameter Studio & HUD Dock

## Mục Tiêu
Tạo component `BoyleWorkbench3D.tsx` và thanh công cụ HUD `BoyleWorkbenchHudDock.tsx`.

## Chi Tiết Kỹ Thuật
- `BoyleWorkbench3D.tsx`:
  - Three.js Scene, Camera, OrbitControls, directional + ambient lights.
  - Xi lanh thủy tinh (CylinderGeometry trong suốt với MeshPhysicalMaterial / MeshStandardMaterial có transmission/opacity).
  - Vạch chia độ thể tích từ $10\text{ cm}^3$ đến $50\text{ cm}^3$.
  - Pít-tông kim loại với trục piston và tay nắm.
  - Đồng hồ áp kế 3D gắn trực tiếp vào đầu xi lanh với kim quay theo áp suất thực tế $p$.
  - Hiệu ứng hạt khí phân tử 3D (Points hoặc InstancedMesh Spheres) chuyển động nhiệt hỗn loạn và tự động giới hạn theo thể tích buồng chứa.
  - Cảm biến nhiệt độ điện tử hiển thị $25.0^\circ\text{C}$ (Isothermal).
- `BoyleWorkbenchHudDock.tsx`:
  - Thanh trượt điều chỉnh thể tích $V$ từ $10 \to 45\text{ cm}^3$.
  - Nút Nén từ từ (-5 cm³), Giãn từ từ (+5 cm³), Đặt lại ($40\text{ cm}^3$).
  - Nút "Ghi số liệu vào Phiếu thực hành".
  - Màn hình LED kỹ thuật số hiển thị $p$, $V$, $T$.
