# Spec: Virtual Free Fall Lab (Rơi tự do - Lớp 10)

**Slug:** virtual-free-fall-lab
**Status:** APPROVED
**Created:** 2026-09-11

## 1. Overview
Thiết kế và xây dựng Phòng thực hành ảo cho **Bài 14 (Lớp 10): Đo gia tốc rơi tự do**, bám sát tài liệu DacTa.md. Giao diện tuân thủ kiến trúc 70/30 (Simulation / Control Panel) hiện có và sử dụng thư viện scenerystack để render.

## 2. Standardized UI Components (Từ DacTa.md)
Phải khởi tạo các dụng cụ sau trên Canvas:
- VERTICAL_STAND: Giá đỡ thẳng đứng có thước chia milimet.
- ELECTROMAGNET: Nam châm điện gắn trên giá, dùng để giữ/thả bi.
- PHOTOGATE_SENSOR: Cổng quang điện (Cổng E và F) kéo thả lên xuống.
- STEEL_BALL: Viên bi thép (0.05kg).
- DIGITAL_TIMER: Đồng hồ đo thời gian hiện số, kết nối với cổng E và F.

## 3. Chế độ tương tác (KÉO THẢ)
1. Lắp ráp: Học sinh kéo PHOTOGATE_SENSOR dọc theo VERTICAL_STAND.
2. Kích hoạt: Bấm nút ngắt điện ELECTROMAGNET.
3. Mô phỏng: Bi STEEL_BALL rơi tự do. 
4. Đo lường: DIGITAL_TIMER chốt thời gian qua 2 cổng.

## 4. Technical Architecture
- Engine: frontend/src/engine/physics/free-fall-engine.ts
- UI: frontend/src/components/simulation/PhetFreeFallLab.tsx
