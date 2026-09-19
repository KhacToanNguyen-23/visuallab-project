# Phase 1: Physics Engine & Worksheet Schemas

## Objectives
- Tạo `frontend/src/components/simulations/momentum-collision/momentumCollisionEngine.ts`:
  - Mô phỏng va chạm 1D đàn hồi và mềm.
  - Tính toán thời gian chắn sáng qua cổng quang $\Delta t = d / v$ với $d = 0.02\text{ m}$.
  - Định nghĩa 3 nhiệm vụ đề bài độc lập (`DEFAULT_MOMENTUM_MISSIONS`):
    - Nhiệm vụ 1: Va chạm đàn hồi $m_1 = m_2 = 200\text{g}$, xe 2 đứng yên.
    - Nhiệm vụ 2: Va chạm đàn hồi $m_1 = 300\text{g}, m_2 = 150\text{g}$, xe 2 đứng yên.
    - Nhiệm vụ 3: Va chạm mềm $m_1 = 200\text{g}, m_2 = 200\text{g}$, xe 2 đứng yên.
  - Thuật toán chấm điểm 3 tầng (`evaluateMomentumTrials`): Thao tác $30\%$ + Độ chính xác bảo toàn $40\%$ + Trắc nghiệm $30\% \to 10.0$.
- Đăng ký `sim-momentum-collision` / `LAB_MOMENTUM_COLLISION` trong `frontend/src/utils/worksheetSchemas.ts`.
