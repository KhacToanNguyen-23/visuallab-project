# Phase 2: 3D Three.js Studio & HUD Dock

## Objectives
- Tạo `frontend/src/components/simulations/momentum-collision/MomentumWorkbench3D.tsx`:
  - Máng đệm không khí 3D (Air Track) bằng nhôm phay sáng bóng kèm vạch milimet.
  - 2 Xe trượt ($G_1, G_2$) với cờ chắn sáng $d = 2\text{ cm}$, gắn quả cân theo $m_1, m_2$.
  - 2 Cổng quang điện $S_1, S_2$ phát tia laser hồng ngoại cắt ngang.
  - Lò xo phóng xe tùy chỉnh lực nén ở đầu máng.
  - Đồng hồ thời gian kỹ thuật số LED 3D hiển thị $\Delta t_1, \Delta t_2$ trực tiếp trên mặt bàn 3D.
  - Hoạt cảnh va chạm đàn hồi / mềm 60 FPS.
- Tạo `frontend/src/components/simulations/momentum-collision/MomentumWorkbenchHudDock.tsx`:
  - Chọn khối lượng $m_1, m_2 \in [100\text{g}, 300\text{g}]$.
  - Chuyển đổi kiểu va chạm: "⚡ Đàn Hồi (Elastic)" / "🧲 Mềm (Inelastic)".
  - Thanh trượt lực nén lò xo / vận tốc phóng ($v_0 \in [0.5, 2.0]\text{ m/s}$).
  - Nút "▶ Phóng Xe 1", "↺ Đặt Lại", "+ Ghi Số Liệu".
