# Phase 1: Physics Engine & Worksheet Schemas

## Objectives
- Xây dựng module tính toán vật lý `frontend/src/components/simulations/induction/inductionLabEngine.ts`:
  - Mô phỏng từ trường nam châm $B(x)$, từ thông $\Phi(x) = N \cdot B(x) \cdot S$.
  - Tính toán suất điện động cảm ứng $e_c = -N \frac{d\Phi_1}{dx} v$ và cường độ dòng điện cảm ứng $I_c = \frac{e_c}{R}$.
  - Định nghĩa 3 nhiệm vụ đề bài độc lập (`DEFAULT_INDUCTION_MISSIONS`):
    - Nhiệm vụ 1: Đưa cực Bắc (N) vào cuộn dây ở tốc độ chậm ($v \approx 0.5\text{ m/s}, N = 200$).
    - Nhiệm vụ 2: Đưa cực Bắc (N) vào cuộn dây ở tốc độ nhanh ($v \approx 1.5\text{ m/s}, N = 200$) $\to$ Khảo sát $e_c \propto v$.
    - Nhiệm vụ 3: Đổi đầu cực Nam (S) hoặc rút cực Bắc (N) ra $\to$ Khảo sát sự đảo chiều dòng cảm ứng.
  - Thuật toán chấm điểm 3 tầng (`evaluateInductionTrials`): Thao tác $30\%$ + Độ chính xác $40\%$ + Trắc nghiệm $30\% \to 10.0$.
- Đăng ký `sim-induction` / `LAB_INDUCTION` trong `frontend/src/utils/worksheetSchemas.ts`.
