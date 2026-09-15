# Phase 3: Eyepiece Loupe & Vernier Crosshair HUD

**Goal:** Xây dựng thị kính phóng đại đo vi trắc (Measuring Eyepiece Loupe) và đồ thị cường độ sóng $I(x)$.

## 1. Scope & Deliverables
- Eyepiece Loupe HUD:
  - Khung tròn thị kính mô phỏng góc nhìn qua kính hiển vi đo (Measuring Microscope $10\times$).
  - Vạch chia milimet vi trắc Vernier siêu mịn ($\pm 0.01\text{mm}$).
  - Sợi chỉ chữ thập (Crosshair màu đỏ/vàng) có thể kéo rê trực tiếp bằng chuột hoặc xoay núm vi trắc vi chỉnh.
  - Nút bấm nhanh "Bắt Vị Trí Vân 1 ($x_1$)" và "Bắt Vị Trí Vân 6 ($x_6$)" $\rightarrow$ tính $\Delta x = |x_6 - x_1|$, $i_{\text{exp}} = \frac{\Delta x}{5}$.
- Intensity Distribution Graph $I(x)$:
  - Biểu đồ hàm $\cos^2$ thời gian thực $I(x) = I_0 \cos^2\left(\frac{\pi a x}{\lambda D}\right)$ đồng bộ hoàn hảo với hệ vân trên thị kính.
