# Specification: Bài 5 - Đo Tốc Độ Truyền Âm (Ống Cộng Hưởng 3D WebGL Studio)

**Slug:** `sound-resonance-3d`  
**Brainstorm Reference:** `plans/reports/260914-sound-resonance-3d-brainstorm.md`  
**Standard Reference:** `visuallab-standards` (3D PARAMETER_STUDIO)  
**Curriculum Mapping:** SGK Vật Lý 11 (GDPT 2018) - Sóng Cơ & Sóng Âm (Sóng dừng trong cột không khí một đầu kín một đầu hở)

---

## 1. Problem Statement & Educational Objectives
Học sinh cần tiến hành thí nghiệm khảo sát hiện tượng sóng dừng trong cột không khí bên trong ống thủy tinh, xác định các vị trí cộng hưởng âm $L_1$ và $L_2$, từ đó tính toán bước sóng $\lambda = 2(L_2 - L_1)$ và tốc độ truyền âm trong không khí $v = \lambda \cdot f$.

---

## 2. User Stories & Acceptance Criteria

### P1: Core 3D Acoustics Studio & Physical Apparatus (Bắt buộc)
- **Giá thí nghiệm & Ống cộng hưởng 3D**:
  - Ống thủy tinh dài $100\text{cm}$ gắn trên giá đỡ có thước vạch chia milimet $0 \to 100\text{cm}$.
  - Cột nước bên trong ống có thể nâng/hạ bằng cách kéo bình dâng nước (bình thông nhau) hoặc thanh trượt mực nước.
  - Loa phát âm mini gắn trên miệng ống, kết nối với máy phát tần số `AUDIO_GENERATOR`.
  - Cảm biến microphone gắn tại miệng ống thu nhận cường độ âm (dB).
- **Tổng hợp âm thanh Web Audio API thời gian thực**:
  - Máy phát sóng sin tần số $f \in [100, 2000]\text{Hz}$ (mặc định $500\text{Hz}$).
  - Cường độ âm thanh phát ra từ loa tự động tăng vọt lên cực đại khi chiều dài cột không khí $L$ gần các vị trí cộng hưởng $L_1 \approx \frac{\lambda}{4}$ và $L_2 \approx \frac{3\lambda}{4}$.
  - Đồng hồ hiển thị mức cường độ âm (dB) đo đạc biên độ dao động thời gian thực.

### P2: Standing Wave Visualization & Particle Density Field (Trực quan hóa sóng dừng)
- **Hiệu ứng sóng dừng trong cột khí**:
  - Tùy chọn hiển thị đường bao sóng dừng (Bụng sóng ở miệng ống, Nút sóng tại mặt nước).
  - Tùy chọn hiển thị các hạt phân tử không khí dao động nén/dãn dọc theo phương truyền sóng.
  - Vạch chỉ thị các vị trí cộng hưởng $L_1, L_2$ trên thước đo.

### P3: Measurement Data Table, Calculation & Auto-Grading (Xử lý số liệu & Đánh giá)
- Nút "Đánh dấu vị trí cộng hưởng $L_1$" và "Đánh dấu vị trí cộng hưởng $L_2$".
- Tự động tính:
  - $\lambda = 2(L_2 - L_1)$
  - $v_{\text{thực nghiệm}} = \lambda \cdot f$
  - So sánh với $v_{\text{lý thuyết}} = 331.3 \sqrt{1 + \frac{t}{273}}\text{ (m/s)}$ theo nhiệt độ phòng $t = 25^\circ\text{C}$ ($v_{\text{lt}} \approx 346.3\text{ m/s}$).
  - Tính sai số tỉ đối $\% = \frac{|v_{\text{tn}} - v_{\text{lt}}|}{v_{\text{lt}}} \times 100\%$.
- Hỗ trợ lưu nhiều lần đo với các tần số khác nhau ($400\text{Hz}, 500\text{Hz}, 650\text{Hz}, 800\text{Hz}$).
- Tích hợp `ScreenshotCaptureModal` chụp ảnh báo cáo.

---

## 3. Success Criteria (Measurable)
1. **Âm thanh & Cộng hưởng**: Cường độ âm và kim đồng hồ dB đạt cực đại tại đúng sai số $\le \pm 1\text{cm}$ so với giá trị lý thuyết $L_1 = \lambda/4, L_2 = 3\lambda/4$.
2. **Đồ họa & Hiệu năng**: 3D Three.js chạy ổn định $60\text{ FPS}$, OrbitControls $360^\circ$, không gây rò rỉ bộ nhớ khi unmount.
3. **Tính chính xác vật lý**: Sai số tốc độ truyền âm $v$ tính được $\le 3\%$ khi học sinh chỉnh đúng đỉnh cộng hưởng.
