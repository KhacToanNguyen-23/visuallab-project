# Phase 01: Thí Nghiệm Con Lắc Lò Xo & Định Luật Hooke (`PhetSpringLab.tsx`)

**Goal:** Triển khai bộ thí nghiệm Con lắc lò xo hoàn chỉnh theo chuẩn PhET HTML5 với lõi vật lý `spring-engine.ts`.

---

## 🛠️ File Changes
1. **[NEW]** `frontend/src/engine/physics/spring-engine.ts`: Khởi tạo lõi vật lý dao động lò xo $m\ddot{x} + c\dot{x} + kx = mg$.
2. **[NEW]** `frontend/src/components/simulation/PhetSpringLab.tsx`: Giao diện 6 Tab sư phạm (`explore`, `compare`, `predict`, `measure`, `graph`, `challenge`), vẽ lò xo Canvas, bảng điều khiển ⚙️.

---

## 🔬 Từng Bước Thực Hiện
- Cài đặt `SpringEngine`: Cung cấp hàm `step(dt)`, `reset()`, getter/setter cho $k, m, g$, damping.
- Render Canvas: Vẽ lò xo xoắn zigzag 2D, quả cân gia tải $m$, vị trí cân bằng $O$, thước milimét.
- Bảng thông số persistent ⚙️: Điều chỉnh $k$ ($10-100\text{N/m}$), $m$ ($0.05-0.5\text{kg}$), gia tốc $g$ (Trái Đất, Mặt Trăng, Sao Hỏa).
- Bảng đo đạc & Đồ thị $x(t)$: Đo thời gian 10 dao động $10T \implies T = 2\pi\sqrt{m/k}$.

---

## 🧪 Kiểm Tra & Verification
- Test 1: $m = 0.1\text{kg}, k = 100\text{N/m} \implies T = 2\pi\sqrt{0.1/100} \approx 0.1987\text{s}$.
- Test 2: Đồ thị $x(t)$ là hình sin chuẩn mượt ở 60 FPS.
