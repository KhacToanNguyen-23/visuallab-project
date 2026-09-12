# Phase 2: Magnetic Snap-Port Engine & Multi-domain Solvers

**Plan:** [`plans/universal-physics-workbench/plan.md`](file:///d:/6_OJT/EduLab/plans/universal-physics-workbench/plan.md)  
**Spec Story:** P1-US2 & P1-US3 (Kết nối từ tính Snap-Port & Mô phỏng 3 môn)

---

## 🎯 Phase Goal
Phát triển động cơ bắt dính từ tính `SnapPortManager` ($<15\text{px}$) và 3 bộ giải lý thuyết (Mechanics, Electrical, Optics) để tính toán tương tác vật lý khi lắp ráp linh kiện.

---

## 🛠️ Proposed Changes

### Frontend Engines & Utilities

#### [NEW] [SnapPortManager.ts](file:///d:/6_OJT/EduLab/frontend/src/components/workbench/SnapPortManager.ts)
- Định nghĩa điểm bắt dính `SnapPort`: Tọa độ $(x, y)$, loại cổng (`SPRING_HOOK`, `MASS_LOOP`, `CIRCUIT_TERMINAL`, `OPTIC_SURFACE`).
- Thuật toán kiểm tra khoảng cách Euclidian: Khi $<15\text{px}$, hiển thị vòng sáng xanh lá gợi ý hút dính và nối tự động khi nhả chuột.

#### [NEW] [PhysicsSolverManager.ts](file:///d:/6_OJT/EduLab/frontend/src/components/workbench/PhysicsSolverManager.ts)
- *Cơ học*: Tích phân dao động ghép nối tiếp/song song lò xo và quả nặng $m$.
- *Điện học*: Thuật toán Nodal Analysis tính điện áp $V$, dòng điện $I$ và trạng thái bật sáng của bóng đèn.
- *Quang học*: Thuật toán Ray Tracing tính đường đi của tia laser qua mặt phân cách thấu kính/gương theo Định luật Snell ($n_1 \sin i = n_2 \sin r$).

---

## 🧪 Verification Criteria

- [ ] Kéo móc quả nặng vào lò xo: Lò xo giãn đúng tỷ lệ $\Delta L = \frac{mg}{k}$.
- [ ] Khép kín mạch Pin + Bóng đèn + Dây điện: Bóng đèn phát sáng chuẩn power.
- [ ] Bật Đèn Laser chiếu qua Thấu kính: Tia sáng bẻ góc khúc xạ chính xác.
