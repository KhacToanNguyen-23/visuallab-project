# Phase 4: Thermodynamics & Gas Laws (Nhiệt dung riêng, Nóng chảy, Boyle - Mariotte)

## 1. Dụng cụ cần phát triển (OOP Classes & Views)
- `CalorimeterApparatus.ts`: Bình xốp nhiệt lượng kế 2 vỏ cách nhiệt.
- `HeatingCoilApparatus.ts`: Dây điện trở gia nhiệt $P = 10 - 50\text{W}$.
- `DigitalThermometerApparatus.ts`: Nhiệt kế hiện số độ phân giải $0.1^\circ\text{C}$.
- `GasPistonApparatus.ts`: Xy-lanh nén khí có pít-tông trượt.
- `PressureGaugeApparatus.ts`: Áp kế cơ học đo áp suất khí.

## 2. Các Lab Triển Khai
- `SpecificHeatLab.tsx` (`sim-specific-heat`): Đo nhiệt dung riêng của nước $c = \frac{Pt}{m\Delta T}$.
- `LatentHeatLab.tsx` (`sim-latent-heat`): Đo nhiệt nóng chảy của nước đá $L = \frac{Q}{m}$.
- `BoyleMariotteLab.tsx` (`sim-boyle-mariotte`): Định luật Boyle - Mariotte $p \cdot V = \text{const}$.
