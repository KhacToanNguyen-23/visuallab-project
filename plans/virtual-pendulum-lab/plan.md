# Implementation Plan - Virtual Physics Laboratory (Pendulum Lab Upgrade)

Biến bài Con Lắc Đơn thành một Virtual Physics Laboratory thực sự có tính tương tác trực tiếp, khám phá, thử nghiệm, dự đoán và trực quan hóa Vật Lý theo tiêu chuẩn PhET Interactive Simulations và GDPT 2018.

## Risk Classification
Risk: normal — nâng cấp toàn diện Virtual Physics Laboratory cho Con Lắc Đơn trên frontend.

## Proposed Changes

### 1. Physics Engine Architecture
- **[NEW] `frontend/src/engine/physics/pendulum-engine.ts`**:
  - Numerical Integration: Semi-Implicit Euler cho phương trình phi tuyến \(\theta'' = -\frac{g}{L}\sin\theta - \frac{b}{m L^2}\dot{\theta}\).
  - Tách biệt Physics Coordinate (SI units: m, kg, s, J, rad, N) với Screen Coordinate (Pixels).
  - Tính toán năng lượng \(E_p, E_k, E_{\text{total}}\) và các vector lực \(\vec{F}_g, \vec{T}, \vec{F}_{\text{net}}\), vận tốc \(\vec{v}\), gia tốc \(\vec{a}\).

### 2. Virtual Laboratory UI & Interactive Modes
- **[MODIFY] `frontend/src/components/simulation/PhetPendulumLab.tsx`**:
  - **Tương tác trực tiếp**: Cho phép kéo chuột trực tiếp trên Canvas để kéo lệch quả nặng.
  - **Trực quan hóa Lực & Động Học**: Checkbox hiển thị Vector Lực, Vector Vận tốc/Gia tốc, Bảng Năng Lượng Realtime (Potential vs Kinetic), Vệt Quỹ Đạo (Trajectory).
  - **Môi trường Trọng Trường**: 🌍 Earth (9.81 m/s²), 🌙 Moon (1.62 m/s²), 🔴 Mars (3.71 m/s²), Custom.
  - **Chế độ So Sánh (Two Pendulums)**: Chạy song song Con lắc A & B để kiểm chứng ảnh hưởng của m và L.
  - **Chế độ Dự Đoán (Prediction Step)**: Đặt giả thuyết trước khi bấm chạy thực nghiệm.
  - **Chế độ Đồ Thị & Thử Thách (Graph & Challenges)**: Đồ thị \(T^2\) vs \(L\), thử thách tạo \(T = 2.0\text{s}\).

## Verification Plan
- Chạy `npm run build` để kiểm tra TypeScript compilation.
- Mở `http://localhost:5173/pendulum-phet-lab` bằng browser agent, test các tính năng kéo thả trực tiếp, bật vector lực, bật bảng năng lượng, đổi chế độ So Sánh và Dự Đoán.
