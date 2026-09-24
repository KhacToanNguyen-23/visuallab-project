# Brainstorm: phet-free-fall-lab

**Date:** 2026-09-23

## Ideas Explored
- Sử dụng React Three Fiber / Rapier (Kiến trúc hiện tại): Tối ưu cho game 3D, dễ code bằng JSX, nhưng kết quả vật lý bị damping, không chính xác tuyệt đối. Re-render nhiều.
- Sử dụng PhET SceneryStack lõi (Ý tưởng mới): WebGL Scene Graph thuần túy, properties qua `axon`. Dùng fixed time step tích phân RK4/Verlet cho độ chính xác vật lý tuyệt đối 100%.

## User's Direction
Người dùng chọn **PhET SceneryStack lõi** với mô hình Dual-layer Viewport (Tầng ngoài React Shell, Tầng lõi SceneryStack Canvas). Đồng bộ dữ liệu qua Zustand Bridge với cơ chế Event-Driven (chỉ đồng bộ khi có sự kiện đo lường, không đồng bộ từng frame). Các linh kiện như Cổng quang điện (Photogate) áp dụng ràng buộc (1D constraint) trượt trên trục của Giá đỡ.

## Open Questions
(Không có - Các điểm đều đã rõ ràng để viết spec).

## Risks
- Learning curve của `scenerystack` cao vì đây không phải thư viện dùng JSX, developer phải làm quen với mô hình OOP / Node Graph của `scenery`.
- Đồng bộ State giữa Zustand và Axon nếu không cẩn thận vẫn có nguy cơ rò rỉ bộ nhớ (Memory leak) do quên gỡ listener (`unlink()`).
