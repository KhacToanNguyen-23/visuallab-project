# Spec: Bài thực hành Khảo sát chuyển động rơi tự do (Vật lý 10) - PhET Architecture

**Date:** 2026-09-23
**Status:** Ready

---

## Problem Statement
Xây dựng bài thí nghiệm Vật lý 10 (Sự rơi tự do) đảm bảo tính chân thực thị giác (skeuomorphism) và độ chính xác khoa học tuyệt đối (Vật lý được tính bằng tích phân 60FPS) thay vì hardcode. Dự án phải dùng kiến trúc chuẩn của PhET SceneryStack để có thể dùng làm lõi cho chế độ Sandbox (mở rộng sau này).

---

## User Stories

- **[P1]** As a Student, I want to kéo thả (slide) 2 cổng quang điện lên/xuống dọc theo giá đỡ milimet so that tôi có thể cài đặt khoảng cách đo `s` khác nhau.
  Accepted when: Cổng quang điện bị khóa (constraint) trượt 1D dọc thân giá đỡ, tọa độ y ánh xạ chính xác ra số mm trên thước.

- **[P1]** As a Student, I want to bấm nút nhả viên bi từ nam châm điện so that đồng hồ thời gian tự động đo lúc bi đi qua cổng 1 và cổng 2.
  Accepted when: Bi rơi bằng phương trình tích phân Euler/Verlet với `dt=0.016s` và `g=9.8 m/s^2`, đồng hồ hiển thị `t2 - t1` chính xác.

- **[P1]** As a Student, I want to tự động thấy dữ liệu (s, t) đổ vào bảng đo lường bên ngoài so that tôi có thể đối chiếu công thức `g = 2s / t^2`.
  Accepted when: Khi bi đi qua cổng 2, event bắn ra Zustand và bảng `@tanstack/react-table` hiện thêm 1 dòng dữ liệu mới.

- **[P2]** As a Student, I want to bật biểu đồ `s` theo `t^2` so that tôi thấy được đồ thị tuyến tính chứng minh rơi tự do là nhanh dần đều.
  Accepted when: Đồ thị uPlot/Recharts nhận dữ liệu từ bảng đo để vẽ tự động.

---

## Functional Requirements

1. FR-01: Tầng mô phỏng (Simulation Viewport) chỉ sử dụng 1 thẻ `<canvas>` duy nhất do `scenerystack/scenery` quản lý.
2. FR-02: Cổng quang điện (Photogate) implement interface `IConnectable` với `lockAxis: 'y'`.
3. FR-03: Viên bi implement `IKinematicBody` chạy vòng lặp `requestAnimationFrame` độc lập với React render cycle.
4. FR-04: Cầu nối dữ liệu sử dụng Zustand Store (`useLabStore`). `axon.Property` của đồng hồ đo chỉ `setStore` khi có sự kiện chặn tia hồng ngoại.

---

## Non-Functional Requirements

- Performance: Chạy mượt mà ở 60 FPS. React không bị re-render do sự thay đổi tọa độ `y` của viên bi.
- Accuracy: Sai số tính toán thời gian `t` phải `< 0.001s` so với công thức lý thuyết.

---

## Success Criteria

- [ ] Performance: Canvas render ở 60 FPS, React DevTools không ghi nhận re-render thừa.
- [ ] Logic: Thả bi ở 3 khoảng cách `s` khác nhau, bảng dữ liệu tự tính ra cột `g = 9.8 m/s^2` (sai số phụ thuộc dt).
- [ ] UI: Vật thể có độ bóng, chất liệu kim loại (skeuomorphism), không dùng thẻ DOM nổi (div/span) đè lên canvas ngoại trừ UI điều khiển.

---

## Out of Scope

- Lực cản không khí.
- Ma sát của thanh ray (vì rơi tự do).

---

## Assumptions

- `scenerystack` phiên bản hiện tại (>=3.0.0) hỗ trợ đầy đủ ESM và tương thích tốt với Vite build pipeline.
