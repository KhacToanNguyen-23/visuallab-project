# Brainstorm: Phòng Thực Hành Ảo Đo Tốc Độ Vật Chuyển Động (Vật Lý 10 - Bài 6)

**Date:** 2026-09-12
**Slug:** `phys10-speed-measurement-lab`
**Curriculum Standard:** SGK Vật lý 10 - GDPT 2018 (Chương II: Động học - Bài 6)
**UI Matrix Standard:** `DRAGGABLE_WORKBENCH` (HTML5 Canvas 2D + Kinematics Physics Engine)

---

## 1. Ideas Explored
- **Phương án 1: Bàn thí nghiệm 2D Canvas Kéo Thả Tự Do (Free-form Interactive Workbench)**
  - Học sinh tự do kéo máng nghiêng, điều chỉnh góc nghiêng $\alpha$, kéo trượt 2 cổng quang điện $E, F$ dọc theo thước chia vạch trên máng để đổi quãng đường $s = |s_F - s_E|$.
  - Cơ chế cắm dây tín hiệu ảo từ Cổng E/F cắm vào ngõ Cổng A/B trên Đồng hồ hiện số `DIGITAL_TIMER`.
  - Mô phỏng chuyển động lăn 60 FPS chân thực: $a = g \cdot \sin\alpha$, đồng hồ đếm thời gian chính xác tới $0.001\text{s}$ kèm nhiễu ngẫu nhiên thực tế ($\pm 0.002\text{s}$).

- **Phương án 2: Tích hợp 2 Chế độ Thí nghiệm Chuẩn SGK GDPT 2018 (Dual-Mode SGK Lab)**
  - **Chế độ 1 (Đo tốc độ trung bình):** Đo thời gian viên bi đi giữa 2 cổng quang $E$ và $F$ ($v_{tb} = \frac{s}{\Delta t}$).
  - **Chế độ 2 (Đo tốc độ tức thời):** Đo thời gian viên bi chắn qua 1 cổng quang $E$ ($v = \frac{d}{\Delta t_E}$ với $d$ là đường kính bi).
  - Bảng báo cáo thu hoạch và tính toán sai số $\bar{v} \pm \Delta v$ chuẩn SGK.

---

## 2. User's Direction & Decisions
- **Giao diện & Tương tác:** Học sinh tự kéo thả máng nghiêng, đặt 2 cổng quang $E, F$ với khoảng cách tùy chỉnh trên thước chia độ, đấu dây cáp vào đồng hồ đo hiện số.
- **Phương thức ghi nhận số liệu:** Học sinh trực tiếp quan sát chỉ số trên màn hình đồng hồ hiện số `DIGITAL_TIMER`, tự ghi chép số liệu vào Bảng Báo Cáo Thí Nghiệm (Worksheet) để tự tính toán giá trị trung bình $\bar{v}$ và sai số $\Delta v$.
- **Chế độ thí nghiệm:** Tích hợp cả 2 chế độ (Đo tốc độ trung bình + Đo tốc độ tức thời qua đường kính bi $d$) chuyển đổi linh hoạt qua Tab.
- **Quy chuẩn chấm điểm (Auto-Grading Formula):** Tuân thủ tuyệt đối cấu trúc 3 phần của `visuallab-standards`:
  $$\text{Tổng Điểm} = \text{Thao tác (30\%)} + \text{Sai số & Tính toán (40\%)} + \text{Trắc nghiệm thu hoạch (30\%)}$$

---

## 3. Tool IDs Chuẩn Hóa Theo VisualLab Standards
- `INCLINED_TRACK`: Máng nghiêng kèm thước đo mm (chỉnh góc nghiêng $0^\circ - 30^\circ$).
- `PHOTOGATE_SENSOR` (2 cổng: E và F): Cổng quang điện cảm biến hồng ngoại.
- `DIGITAL_TIMER`: Đồng hồ đo thời gian hiện số ($0.001\text{s}$), các chế độ đo $A \leftrightarrow B$ và $\text{MODE A}$.
- `STEEL_BALL`: Viên bi thép có đường kính $d = 2.00\text{cm} = 0.020\text{m}$.
- `SIGNAL_CABLE`: Dây nối tín hiệu từ cổng quang vào đồng hồ số.

---

## 4. Open Questions & Technical Considerations
- Cần đảm bảo animation lăn bi đạt 60 FPS trên Canvas và tự động ngắt/bật chốt chặn giữ bi ở đỉnh máng.
- Sai số ngẫu nhiên của bộ đếm thời gian được điều tiết ở mức $\approx \pm 0.002\text{s}$ để phản ánh thí nghiệm thực tế nhưng vẫn đảm bảo học sinh tính sai số đúng ngưỡng $\le 5\%$.
- Dọn dẹp tài nguyên (Clean Unmount `cancelAnimationFrame`) theo quy chuẩn EduLab.

---

## 5. Risks
- **Rủi ro UX khi nối dây:** Thao tác nối dây giữa cổng quang và đồng hồ số nếu quá khắt khe có thể khiến học sinh bị kẹt. *Giải pháp:* Cung cấp hướng dẫn trực quan (highlight ngõ cắm) và phản hồi trạng thái rõ ràng (`isWiringComplete`).
- **Rủi ro tính toán sai số của học sinh:** Học sinh có thể nhầm lẫn giữa sai số tuyệt đối dụng cụ và sai số ngẫu nhiên trung bình. *Giải pháp:* Bảng báo cáo cung cấp công thức gợi ý và kiểm tra từng ô giá trị.
