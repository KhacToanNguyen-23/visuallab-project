# Phase 2: Mechanics Kinematics & Collision Solver

**File:** `plans/grade10-mechanics-standardization/phase-02-mechanics-kinematics-solver.md`

---

## 1. Objective
Xây dựng mô hình tính toán chuyển động thực tế cho 4 kịch bản cơ học còn lại của Lớp 10:
1. Máng nghiêng: $a = g\sin\alpha - \mu g\cos\alpha$, tính thời gian qua 2 cổng quang.
2. Rơi tự do: Thả từ nam châm điện $v = gt$, ngắt xung cổng quang $t = \sqrt{2h/g}$.
3. Ma sát trượt: Kéo khối gỗ nằm ngang $F_{ms} = \mu N$, lực kế hiển thị lực căng kim thực.
4. Va chạm đệm khí: 2 xe trượt trên đệm khí va chạm đàn hồi/mềm với vận tốc trước và sau đo bằng 2 cổng quang.

## 2. Changes
- `frontend/src/engine/physics/MechanicsKinematicsSolver.ts`: Bộ giải động học và va chạm 2D.
- Tích hợp vòng lặp cập nhật vị trí và vận tốc trong `Interactive2DWorkbench.tsx`.
