# Phase 3: Euler-Cromer Physics Engine & Constraint Solver

**File:** `plans/2d-workbench-sandbox/phase-03-physics-euler-cromer-solver.md`  
**Story Mapping:** `workbench-euler-cromer-spring-oscillation` [P1]  

---

## 1. Objective
Tích hợp lõi vi phân Euler-Cromer / Verlet chuẩn từ mô hình toán học PhET (`masses-and-springs`) để tính toán dao động điều hòa có cản của lò xo, độ dãn tĩnh theo Định luật Hooke, lực căng dây và trọng lực.

---

## 2. Proposed Changes

### `frontend/src/engine/physics/EulerCromerSolver.ts` [NEW]
- Thuật toán tích phân số:
  $$a(t) = \frac{-k \cdot x(t) - \gamma \cdot v(t) + m \cdot g}{m}$$
  $$v(t + \Delta t) = v(t) + a(t) \cdot \Delta t$$
  $$x(t + \Delta t) = x(t) + v(t + \Delta t) \cdot \Delta t$$
  với $g = 9.8\text{m/s}^2$, fixed step $\Delta t = 0.016\text{s}$, hệ số cản không khí $\gamma = 0.08$.
- Khả năng xử lý hệ nhiều quả cân nối tiếp:
  $$m_{\text{tổng}} = \sum_{i=1}^n m_i$$
  Lò xo dãn tĩnh về vị trí cân bằng: $\Delta l = \frac{m_{\text{tổng}} \cdot g}{k}$.
- Tính toán lực đàn hồi tác dụng lên lực kế: $F = k \cdot \Delta l = m_{\text{tổng}} \cdot g$.

---

## 3. Verification Criteria
- Khi treo quả cân $m = 0.1\text{kg}$ lên lò xo $k = 50\text{N/m}$:
  - Độ dãn tĩnh lý thuyết: $\Delta l = \frac{0.1 \times 9.8}{50} = 0.0196\text{m} = 1.96\text{cm}$.
  - Sai số số học của bộ giải $\le 0.1\%$.
- Dao động tắt dần êm dịu, không bị phân kỳ năng lượng (divergence) sau $300\text{s}$ mô phỏng liên tục.
