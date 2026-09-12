# Brainstorm: 3D WebGL Sound Lab Interface & No-Scroll UI Layout

**Date:** 2026-09-11

## Ideas Explored

- **Option A: 3D Sound Resonance Tube Lab (Bài 5 - Trang 22 SGK Vật lý 11)**
  - Dựng mô hình 3D Ống cộng hưởng `RESONANCE_TUBE` và Loa phát âm thanh `AUDIO_GENERATOR` bằng `Three.js`.
  - Tích hợp `Tone.js` phát âm thanh sóng sine chuẩn Hz ($f = 100\text{Hz} - 2000\text{Hz}$) tương tác trực tiếp với độ cao cột nước trong ống 3D.
  - *Đánh giá:* Áp dụng xuất sắc thư viện âm thanh `Tone.js` + `Three.js` đã thống nhất.

- **Option B: 3D Free-Fall Physics Stand with Audio Feedback (Bài 14 - Trang 57 SGK Vật lý 10)**
  - Dựng giá đỡ 3D Three.js với âm thanh ngắt nam châm điện và âm thanh ngắt cổng quang điện.

## User's Direction
- Chọn **Option A (3D Sound Resonance Lab - Bài 5 SGK Vật lý 11)**.
- **Chuẩn hóa Giao diện (UI Guidelines)**:
  1. **Layout Không cần cuộn (No-Scroll Viewport)**: Vừa vặn 100% màn hình (`h-screen overflow-hidden`), Sidebar bên phải xếp gọn gàng không bắt người dùng cuộn chuột.
  2. **Style đồng bộ Web**: Sử dụng CSS theme variables (`var(--bg-panel)`, `var(--bg-main)`, `var(--border-color)`), gỡ bỏ 100% emoji trang trí.
  3. **Vật lý & Âm thanh chuẩn xác**: Tích hợp `Tone.js` phát âm tần theo Hz thực tế và tính tốc độ truyền âm $v = \lambda \cdot f \approx 340\text{ m/s}$.

## Open Questions
1. Nút bật/tắt âm thanh (Mute/Unmute) có cần cảnh báo trình duyệt autostart audio policy không? -> Có, hiển thị nút "Bật Máy Phát Tần Số" để tuân thủ Web Audio API policy.
