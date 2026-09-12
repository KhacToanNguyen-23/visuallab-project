# Brainstorm: Redesign Bài Thực Hành Rơi Tự Do (Free Fall Lab)

**Date:** 2026-09-11

## Ideas Explored

- **Option A: Full 3D WebGL (Chỉnh sửa từ giao diện hiện tại)**
  - Dữ lại mô hình 3D Three.js nhưng dọn dẹp các banner sci-fi/emoji.
  - *Đánh giá:* Vẫn hơi nặng, góc nhìn 3D có thể gây khó thao tác chỉnh khoảng cách cổng quang điện chính xác.

- **Option B: 2D Interactive Physics Stand (Hệ mô phỏng 2D phẳng chuẩn SGK & PhET)**
  - Mô phỏng giá đỡ thẳng đứng `VERTICAL_STAND` kèm thước milimét góc nhìn chính diện.
  - Học sinh trượt cổng quang điện `PHOTOGATE_SENSOR` trên thước để chọn độ cao $h$ (ví dụ: $0.2\text{m}, 0.4\text{m}, 0.6\text{m}, 0.8\text{m}$).
  - Công tắc ngắt nam châm điện `ELECTROMAGNET` thả bi thép `STEEL_BALL` rơi tự do.
  - Đồng hồ đo hiện số `DIGITAL_TIMER` hiển thị chính xác $t_A, t_B, \Delta t$ để tính $g = \frac{2h}{t^2} \approx 9.81\text{ m/s}^2$.
  - *Đánh giá:* Cực kỳ gần gũi với bài thực hành SGK Vật lý 10 (Trang 57), dễ dùng, độ chính xác vật lý 100%.

## User's Direction
- Chọn **Option B (2D Interactive Physics Stand chuẩn SGK & PhET)**.
- **Tiêu chuẩn thiết kế**:
  1. Giao diện đồng bộ với VisualLab (sử dụng CSS theme variables Light/Dark, không dùng emoji trang trí).
  2. Vật lý chuẩn xác: Tính toán gia tốc $g \approx 9.80 - 9.81\text{ m/s}^2$ có sai số ngẫu nhiên thực nghiệm $1 - 2\%$.
  3. Thao tác 5 bước sư phạm chuẩn SGK: Bố trí $h$ ➔ Gắn bi ➔ Thả vật ➔ Đọc đồng hồ ➔ Ghi bảng số liệu & Tính sai số.

## Open Questions
1. Có giữ tính năng thử nghiệm trong môi trường Chân không (tắt lực cản không khí cho lông chim / quả táo) bên cạnh bài thực hành chuẩn SGK không? -> Có, dạng công tắc phụ.

## Risks
1. Cần đảm bảo thuật toán đồng hồ đo $t$ tính đúng $t = \sqrt{\frac{2h}{g}}$ với $g = 9.807\text{ m/s}^2$, không để ra kết quả sai lệch như $81.69\text{ m/s}^2$.
