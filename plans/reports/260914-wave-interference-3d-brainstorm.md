# Brainstorm: Nâng Cấp Phòng Thí Nghiệm Giao Thoa Ánh Sáng (Khe Y-âng) 3D Chuẩn GDPT 2018

**Date:** 2026-09-14  
**Feature Slug:** `wave-interference-3d`  
**Route:** `/lab/wave-interference`

---

## 1. Ideas Explored

1. **Không gian 3D Băng quang học (Optical Bench 3D Studio)**:
   - Mô phỏng băng quang học chuẩn phòng lab vật lý với ray trượt chia độ chính xác (mm).
   - 3 khối dụng cụ chính có thể dịch chuyển: Nguồn Laser/Ánh sáng trắng (`LASER_SOURCE_RGB`), Bản khe kép Y-âng (`YOUNG_DOUBLE_SLIT`), Màn quan sát kèm thị kính phóng đại (`FRINGE_SCREEN`).
   - Hiệu ứng chùm tia sáng 3D (Volumetric Light Rays) phát ra từ nguồn tới 2 khe và giao thoa trên màn.

2. **Chế độ Nguồn sáng Đơn sắc & Ánh sáng Trắng (Monochromatic vs White Light)**:
   - *Đơn sắc*: Thanh trượt bước sóng $\lambda \in [380, 780]\text{nm}$, tự động đổi màu tia laser và màu hệ vân (Đỏ, Cam, Vàng, Lục, Lam, Chàm, Tím).
   - *Ánh sáng trắng*: Hệ vân tán sắc cầu vồng thực tế với vân sáng trung tâm màu trắng và các dải quang phổ bậc $k = 1, 2, 3...$ xếp chồng liên tục.

3. **Công cụ Đo Vi trắc Thị kính Phóng đại (Eyepiece HUD + Micrometer Crosshair)**:
   - Kính hiển vi đo (Measuring Microscope HUD) phóng đại cận cảnh các vạch vân sáng/tối.
   - Sợi chỉ chữ thập (Crosshair) điều khiển bằng núm vặn vi trắc hoặc phím mũi tên để bắt toạ độ vân $x_1, x_6$, tự động tính khoảng vân $i = \frac{\Delta x}{n}$.
   - Thước kẹp vi trắc đo khoảng cách khe $a \in [0.15, 1.00]\text{mm}$ và khoảng cách màn $D \in [0.5, 2.5]\text{m}$.

4. **Đồ thị Phân bố Cường độ Sáng $I(x)$ (Wave Intensity Graph)**:
   - Biểu đồ thời gian thực mô tả phân bố cường độ sáng $I(x) = I_0 \cos^2\left(\frac{\pi a x}{\lambda D}\right)$ đồng bộ với hệ vân giao thoa thực tế.

5. **Bảng Số Liệu Thực Nghiệm & Tự Động Chấm Điểm 3-Tier (Auto-Grading)**:
   - Bảng ghi 5 lần đo theo chuẩn SGK GDPT 2018.
   - Tính giá trị trung bình $\bar{i}, \bar{\lambda}$ và sai số $\Delta\lambda$.
   - Chấm điểm 3-Tier: Thao tác (30%) + Độ chính xác/Sai số $\le 5\%$ (40%) + Báo cáo trắc nghiệm (30%).

---

## 2. User's Direction

- **Mô hình**: Không gian 3D tương tác quang học Three.js PBR Studio kết hợp Thị kính phóng đại (Eyepiece HUD) và thước kẹp vi trắc.
- **Tương tác cốt lõi**: Kéo trượt điều chỉnh linh hoạt $\lambda$ (bước sóng), $a$ (khoảng cách 2 khe), $D$ (khoảng cách từ khe đến màn).
- **Tính năng quang học**: Hỗ trợ chuyển đổi linh hoạt giữa giao thoa đơn sắc (Monochromatic) và giao thoa ánh sáng trắng (White Light).
- **Hỗ trợ học thuật**: Bổ sung đồ thị cường độ sóng $I(x)$, bảng số liệu đo đạc chuẩn SGK và hệ thống tự động chấm điểm theo chuẩn VisualLab.

---

## 3. Open Questions (for $bb-plan)

1. Thuật toán render phổ ánh sáng trắng 2D/3D (tính tích phân màu RGB cho quang phổ liên tục $380 - 780\text{nm}$).
2. Tối ưu camera OrbitControls kết hợp Focus Mode vào màn quan sát / thị kính.

---

## 4. Risks & Mitigations

- **Rủi ro hiệu năng Three.js/Canvas**: Render nhiều dải vân quang phổ ánh sáng trắng có thể gây giảm FPS.  
  $\rightarrow$ *Giải pháp*: Sử dụng Canvas Texture 1D/2D nội suy màu chuyển sắc siêu tốc kết hợp Three.js MeshStandardMaterial.
- **Độ chính xác phép đo**: Sai số hiển thị trên thị kính cần khớp $100\%$ với công thức vật lý lý thuyết $i = \frac{\lambda D}{a}$.
