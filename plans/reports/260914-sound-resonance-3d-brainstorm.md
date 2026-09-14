# Brainstorm: Nâng cấp Bài 5 - Đo Tốc Độ Truyền Âm (Ống Cộng Hưởng 3D WebGL)

**Date:** 2026-09-14  
**Topic:** SGK Vật Lý 11 - Sóng Âm & Sóng Dừng trong Cột Không Khí (Bài 5)  
**Standard:** `visuallab-standards` (3D PARAMETER_STUDIO)

---

## Ideas Explored
1. **Option A (Chosen): 3D Acoustics Studio (Three.js + Web Audio API + Real-Time Standing Wave Field)**:
   - Ống thủy tinh chia vạch milimet trong suốt $0 \to 100\text{cm}$ gắn trên giá đỡ phòng lab.
   - Bình dâng nước thông nhau có thể kéo lên/xuống mượt mà để điều chỉnh chiều dài cột không khí $L$.
   - Máy phát tần số kỹ thuật số (`AUDIO_GENERATOR`) phát sóng sin $100\text{Hz} - 2000\text{Hz}$ với màn hình LCD hiển thị tần số.
   - Loa mini phát âm ở miệng ống + Cảm biến Micro đo cường độ âm (dB).
   - Mô phỏng sóng dừng trực quan: hiển thị bụng sóng/nút sóng hoặc các phân tử khí dao động nén/dãn.
   - Web Audio API tự động vang to cực đại (Resonance Peak) khi qua vị trí $L_1 = \lambda/4, L_2 = 3\lambda/4$.
   - Bảng số liệu đo $L_1, L_2$, tính $\lambda = 2(L_2 - L_1)$, tính $v = \lambda \cdot f$, so sánh với tốc độ truyền âm lý thuyết theo nhiệt độ phòng $t^\circ\text{C}$ và tính sai số $\%$.
2. **Option B: 2D Interactive Physics Workbench**:
   - Mặt cắt phẳng 2D tối giản, đồ thị dao động 2D. Bị loại vì thiếu tính trực quan không gian và trải nghiệm âm học sống động của EduLab.

---

## User's Direction
- Lựa chọn **Phương Án A**: 3D Acoustics Studio với đầy đủ tương tác 3D, tổng hợp âm thanh Web Audio API thời gian thực và mô phỏng trực quan sóng dừng trong cột không khí.

---

## Open Questions & Parameters
1. Dải tần số âm thanh mặc định: $f \in [200, 1000]\text{Hz}$ (Mặc định: $500\text{Hz}$).
2. Nhiệt độ môi trường phòng lab: $t = 25^\circ\text{C} \implies v_{\text{lý thuyết}} \approx 346.3\text{ m/s}$.
3. Chiều dài ống cộng hưởng: $100\text{cm}$ ($1\text{m}$).

---

## Risks & Mitigations
1. **AudioContext Autoplay Policy**: Yêu cầu người dùng bấm nút "Bật Máy Phát Âm" hoặc tương tác trước khi khởi động `AudioContext`.
2. **WebGL Resource Disposal**: Đảm bảo dọn dẹp đầy đủ `renderer.dispose()`, `audioCtx.close()`, `cancelAnimationFrame` khi unmount.
