# Phase 1: Engine & Missions (Đo Suất Điện Động & Điện Trở Trong)

**Goal:** Triển khai mô hình mạch điện, bộ giải hồi quy tuyến tính $U = \mathcal{E} - I \cdot r$, 3 nhiệm vụ GDPT 2018 và hệ thống chấm điểm tự động.

## Deliverables
- `frontend/src/components/simulations/emf-internal-r/emfInternalREngine.ts`:
  - `POWER_SOURCE_PRESETS`:
    - `battery_1x`: Pin đơn $\mathcal{E} = 1.50\text{V}, r = 0.50\Omega$.
    - `battery_2x`: Bộ 2 Pin nối tiếp $\mathcal{E} = 3.00\text{V}, r = 1.00\Omega$.
    - `battery_old`: Pin cũ $\mathcal{E} = 1.45\text{V}, r = 2.80\Omega$.
  - `computeCircuitState`: Tính $I = \frac{\mathcal{E}}{R + r}, U = I \cdot R$ kèm nhiễu cảm biến $\pm 1\%$.
  - `computeLinearRegression`: Hồi quy tuyến tính từ danh sách điểm $(I_i, U_i) \implies a = -r, b = \mathcal{E}, R^2$.
  - `evaluateEmfInternalRReport`: Chấm điểm Thao tác (3.0đ), Độ chính xác (4.0đ), Trắc nghiệm (3.0đ).
