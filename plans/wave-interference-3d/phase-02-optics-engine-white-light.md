# Phase 2: Optics Interference Engine & White Light Synthesis

**Goal:** Hiện thực thuật toán giao thoa sóng ánh sáng chính xác và bộ tạo vân giao thoa đơn sắc + ánh sáng trắng.

## 1. Scope & Deliverables
- Wavelength-to-RGB Converter: Chuyển đổi bước sóng thực $\lambda \in [380, 780]\text{nm}$ sang mã màu RGB, HEX, HSL với đường cong nhạy cảm thị giác (CIE 1931).
- Monochromatic Interference Texture Generator:
  - Tính toán khoảng vân $i = \frac{\lambda D}{a}$.
  - Tọa độ các vân sáng: $x_k = k \cdot i$ ($k = 0, \pm 1, \pm 2...$).
  - Tọa độ các vân tối: $x'_k = (k + 0.5) \cdot i$.
  - Render texture vân sáng/tối sắc nét lên bề mặt `FRINGE_SCREEN` trong Three.js 3D.
- White Light Dispersion Superposition Engine:
  - Tổng hợp giao thoa của các dải phổ màu (Tím $400\text{nm}$, Lam $450\text{nm}$, Lục $520\text{nm}$, Vàng $580\text{nm}$, Cam $610\text{nm}$, Đỏ $680\text{nm}$).
  - Vân trung tâm $k=0$ trùng nhau tạo dải sáng trắng rực rỡ.
  - Các vân bậc $k \ge 1$ tán sắc từ trong ra ngoài (Tím ở trong, Đỏ ở ngoài).
