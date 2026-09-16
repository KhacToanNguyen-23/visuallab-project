# Brainstorm: Tái Cấu Trúc Mô Phỏng Cảm Ứng Điện Từ & Định Luật Faraday - Lenz (Induction Lab)

**Date:** 2026-09-16  
**Module:** `/lab/induction` (SGK Vật lý 12 GDPT 2018 / Bài Hiện tượng cảm ứng điện từ)  
**Standard:** `/visuallab-standards` (Tương tự Boyle - Mariotte & Latent Heat)

---

## 1. Ideas Explored
- **Option A (2D Canvas only)**: Giữ nguyên Canvas 2D nhưng nâng cấp đồ họa. (Bỏ qua do không đem lại trải nghiệm trực quan sống động về không gian từ trường 3D).
- **Option B (3D Studio Three.js + Draggable Magnet + Hybrid Galvanometer & Digital LED Meter)**:
  - Thanh nam châm 3D (Cực N đỏ, Cực S xanh) có thể kéo thả chuột tự do hoặc bấm nút bước chạy tự động.
  - Cuộn dây ống Solenoid hiển thị số vòng $N = 100, 200, 400$ vòng.
  - Hiển thị đồng thời: Điện kế Galvanometer kim lệch âm/dương tức thời $\propto \frac{\Delta \Phi}{\Delta t}$ + Đồng hồ LED hiển thị $e_c$ (mV) + Đèn LED sáng theo cường độ dòng cảm ứng.
  - Đường sức từ 3D động hiển thị mật độ từ thông $\Phi$.
  - Wizard Worksheet 3 bước: 3 nhiệm vụ đề bài, bảng số liệu thực nghiệm, tính toán định luật Faraday/Lenz, ô nhận xét với gợi ý nhanh, 3 câu trắc nghiệm SGK.
  - Hệ thống chấm điểm 3 tầng (3-4-3) chỉ kích hoạt khi bấm Nộp bài, kèm đồng bộ Drawer bài tập.

---

## 2. User's Direction
- Kết hợp cả 2 hình thức hiển thị: Điện kế Galvanometer kim lệch âm/dương và Màn hình LED kỹ thuật số kèm đèn LED.
- Hỗ trợ kéo thả chuột tự do thanh nam châm qua lại trong lòng cuộn dây để quan sát trực tiếp hiện tượng.

---

## 3. Physical Models & Formulas
- **Từ thông qua cuộn dây $N$ vòng**:
  $$\Phi(x) = N \cdot B(x) \cdot S = N \cdot \frac{\mu_0 M}{2 (x^2 + R^2)^{3/2}} \cdot \pi R^2$$
- **Suất điện động cảm ứng (Định luật Faraday & Lenz)**:
  $$e_c = -\frac{d\Phi}{dt} = -N \cdot \frac{d\Phi_1}{dx} \cdot \frac{dx}{dt} = -N \cdot \frac{d\Phi_1}{dx} \cdot v$$
- **Dòng điện cảm ứng qua điện trở cuộn dây + điện kế ($R_{\text{total}}$)**:
  $$I_c = \frac{e_c}{R_{\text{total}}}$$

---

## 4. Key Missions (3 Nhiệm Vụ Đề Bài)
1. **Nhiệm vụ 1**: Đưa cực Bắc (N) vào cuộn dây ở vận tốc chậm ($v = 0.5\text{ m/s}, N = 200$) $\to$ Kim điện kế lệch âm/dương và ghi nhận $e_{c1}$.
2. **Nhiệm vụ 2**: Đưa cực Bắc (N) vào cuộn dây ở vận tốc nhanh ($v = 1.5\text{ m/s}, N = 200$) $\to$ Độ lệch kim điện kế và $e_{c2}$ tăng tỉ lệ thuận với tốc độ biến thiên từ thông.
3. **Nhiệm vụ 3**: Đổi đầu cực Nam (S) đưa vào hoặc rút cực Bắc (N) ra xa cuộn dây $\to$ Kim điện kế đảo chiều theo định luật Lenz.

---

## 5. Risks & Mitigations
- **Mouse Dragging Velocity Estimation**: Khi kéo chuột tự do, cần tính đạo hàm vị trí theo thời gian $v = \frac{\Delta x}{\Delta t}$ với bộ lọc làm mượt (low-pass filter / moving average) để kim điện kế không bị giật cục.
- **Three.js DragControls vs OrbitControls**: Phải disable OrbitControls khi con trỏ đang drag thanh nam châm để tránh xung đột thao tác xoay camera.
