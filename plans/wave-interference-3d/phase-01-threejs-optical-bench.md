# Phase 1: Three.js 3D Optical Bench Scene Setup

**Goal:** Xây dựng không gian 3D Băng Quang Học (Optical Bench 3D Studio) với đầy đủ dụng cụ PBR và chùm tia Laser theo chuẩn `visuallab-standards`.

## 1. Scope & Deliverables
- Three.js Scene, Perspective Camera, Studio Lighting (Key, Fill, Rim lights), and OrbitControls with clamped angles.
- Băng quang học (Rail) bằng nhôm anode màu xám đen với các vạch chia milimet $0 - 2000\text{mm}$.
- 3 khối dụng cụ chính trượt trên ray:
  1. `LASER_SOURCE_RGB`: Hộp phát laser kèm nút nguồn, công tắc On/Off, đèn báo LED.
  2. `YOUNG_DOUBLE_SLIT`: Khung giữ bản kính khe kép Y-âng với thước xoay căn chỉnh góc.
  3. `FRINGE_SCREEN`: Màn quan sát màu trắng mờ có thể dịch chuyển dọc ray $D \in [0.5, 2.5]\text{m}$.
- Chùm tia Laser 3D (Cylinder / Cone Mesh with Additive Blending Material) phát từ nguồn qua 2 khe và loe rộng tới màn hứng.
- Clean unmount: Hủy toàn bộ WebGL renderer, textures, geometries, animation loops khi component unmount.
