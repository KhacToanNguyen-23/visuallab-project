# Phase 1: Engine & Missions (Đo Nhiệt Dung Riêng)

**Goal:** Triển khai module vật lý, 3 nhiệm vụ GDPT 2018, hệ thống chấm điểm tự động và ngân hàng câu hỏi trắc nghiệm cho bài lab Đo nhiệt dung riêng.

## Deliverables
- `frontend/src/components/simulations/specific-heat/specificHeatEngine.ts`:
  - `LIQUID_PRESETS`:
    - `water`: $c = 4180\text{ J/(kg}\cdot\text{K)}$, màu xanh `#38bdf8`, điểm sôi $100^\circ\text{C}$.
    - `ethanol`: $c = 2440\text{ J/(kg}\cdot\text{K)}$, màu tím `#a855f7`, điểm sôi $78^\circ\text{C}$.
    - `oil`: $c = 2000\text{ J/(kg}\cdot\text{K)}$, màu vàng `#eab308`, điểm sôi $200^\circ\text{C}$.
  - `DEFAULT_SPECIFIC_HEAT_MISSIONS`:
    - M1: Đo nhiệt dung riêng Nước ($m=0.2\text{kg}, P=50\text{W}, t=120\text{s}$).
    - M2: Khảo sát tăng công suất / khối lượng ($P=80\text{W}, m=0.3\text{kg}$).
    - M3: Đo nhiệt dung riêng Cồn hoặc Dầu.
  - `computeHeatingStep`: Tính nhiệt độ tăng theo $P, t, m, c$ và thêm nhiễu cảm biến $\pm 1.5\%$.
  - `evaluateSpecificHeatReport`: Chấm điểm Thao tác (3.0đ), Độ chính xác (4.0đ), Trắc nghiệm (3.0đ).
