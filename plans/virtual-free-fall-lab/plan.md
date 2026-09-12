# Implementation Plan - Virtual Free Fall Lab

## Phase 1: Thử nghiệm Engine Vật lý
- [ ] Tạo rontend/src/engine/physics/free-fall-engine.ts.
- [ ] Viết logic tính toán tọa độ theo trục Y (y = 0.5 * g * t^2) theo mốc thời gian thực 60FPS.

## Phase 2: Dựng Giao Diện Lắp Ráp 2D
- [ ] Tạo rontend/src/components/simulation/PhetFreeFallLab.tsx.
- [ ] Dùng scenerystack để vẽ VERTICAL_STAND, viên bi và Nam châm.
- [ ] Bật cờ draggable=true cho 2 cảm biến PHOTOGATE_SENSOR chạy dọc trục Y.

## Phase 3: Đồng bộ Control Panel & Timer
- [ ] Viết UI cho bảng điều khiển 30% bên phải (chỉnh gia tốc $, khố lượng $).
- [ ] Đồng bộ DIGITAL_TIMER vào màn hình hiển thị.
