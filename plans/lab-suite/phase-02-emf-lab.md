# Phase 02: Thí Nghiệm Đo Suất Điện Động E & Điện Trở Trong r (`PhetEmfLab.tsx`)

**Goal:** Triển khai bộ thí nghiệm Đo suất điện động $E$ và điện trở trong $r$ của nguồn Pin theo SGK Vật lý 11.

---

## 🛠️ File Changes
1. **[NEW]** `frontend/src/engine/physics/emf-engine.ts`: Bộ giải mạch DC $U = E - I \cdot r$ với biến trở $R$.
2. **[NEW]** `frontend/src/components/simulation/PhetEmfLab.tsx`: Giao diện 6 Tab sư phạm, vẽ sơ đồ mạch điện, Vôn kế/Ampe kế kim quay, cần gạt biến trở con chạy.

---

## 🔬 Từng Bước Thực Hiện
- Cài đặt `EMFEngine`: Tính $I = \frac{E}{R + r + R_A}$ và $U = E - I \cdot r$.
- Giao diện 6 Tab: `explore`, `compare`, `predict`, `measure`, `graph`, `challenge`.
- Cần gạt biến trở con chạy: Thay đổi $R$ từ $0 \rightarrow 100\Omega$.
- Đồ thị $U(I)$: Đường thẳng có tung độ gốc $E$ và độ dốc $-r$.

---

## 🧪 Kiểm Tra & Verification
- Test 1: Khi $R \rightarrow \infty$ (hở mạch), $I = 0 \implies U = E$.
- Test 2: Sai số tính $E, r$ từ đồ thị $U(I) \le 1.0\%$.
