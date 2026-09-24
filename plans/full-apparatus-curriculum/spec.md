# Specification: Full Apparatus Ecosystem & 16 Curriculum Labs (SGK GDPT 2018)

## 1. Problem Statement & Scope
Hệ thống Virtual Physics Lab của VisualLab cần mở rộng đầy đủ **16 bài thực hành SGK GDPT 2018** (Lớp 10, Lớp 11, Lớp 12) cùng toàn bộ **25+ dụng cụ thí nghiệm chuẩn hóa (Tool IDs)** theo đúng `DacTa.md` và `data.sql`. Tất cả dụng cụ phải tuân thủ chuẩn OOP Contract (`BaseApparatus`, `IApparatus`), có port-based snapping, tương tác mượt mà và tự động chấm điểm theo công thức sai số.

---

## 2. User Stories & Priority

### P1 — Core Mechanics & Universal Sandbox Expansion (Must-Have)
- **US1.1:** Hoàn thiện 5 bài thực hành Lớp 10 (Rơi tự do, Đo tốc độ máng nghiêng, Ma sát trượt, Va chạm đệm khí, Định luật Hooke).
- **US1.2:** Thêm các dụng cụ cơ học mới: `SPRING_BALANCE` (Lực kế lò xo), `WOODEN_BLOCK` (Khối gỗ), `AIR_TRACK_BASE` & `GLIDER_CAR` (Máng đệm khí & xe trượt).
- **US1.3:** Tích hợp trực tiếp vào `UniversalSandboxScene` và `WorkbenchPalette`.

### P1 — Electromagnetism & DC Circuits (Must-Have)
- **US2.1:** Hoàn thiện bài thực hành Bài 19 (Đo $E$ & $r$ nguồn pin), Mạch DC Định luật Ohm, Bài 12 (Cảm ứng điện từ).
- **US2.2:** Xây dựng các dụng cụ mạch điện: `DC_POWER_SUPPLY`, `VOLTMETER_DC`, `AMMETER_DC`, `RHEOSTAT_VARIABLE`, `CIRCUIT_SWITCH`, `BAR_MAGNET`, `INDUCTION_COIL`, `GALVANOMETER_G`.
- **US2.3:** Hỗ trợ cơ chế nối dây (Wire Snapping / Port-to-Port Binding) và Kirchhoff Differential Solver.

### P2 — Optics, Waves & Acoustics (High Priority)
- **US3.1:** Hoàn thiện bài thực hành Bài 12 (Giao thoa Y-âng), Bài 21 (Khúc xạ & Chiết suất), Bài 5 (Tốc độ truyền âm / Ống cộng hưởng).
- **US3.2:** Dụng cụ: `LASER_SOURCE_RGB`, `YOUNG_DOUBLE_SLIT`, `FRINGE_SCREEN`, `CALIPER_CROSSHAIR`, `GLASS_HALF_CYLINDER`, `RESONANCE_TUBE`, `AUDIO_GENERATOR`.

### P2 — Thermodynamics & Gas Laws (High Priority)
- **US4.1:** Hoàn thiện bài thực hành Bài 3 (Nhiệt dung riêng), Bài 4 (Nhiệt nóng chảy đá), Bài 7 (Đẳng nhiệt Boyle - Mariotte).
- **US4.2:** Dụng cụ: `CALORIMETER_CUP`, `HEATING_COIL`, `DIGITAL_THERMOMETER`, `GAS_CYLINDER_PISTON`, `PRESSURE_GAUGE`.

### P3 — Auto-Grading & Telemetry Integration
- **US5.1:** Đảm bảo tất cả 16 bài thí nghiệm đều có schema trong `worksheetSchemas.ts` và tính điểm theo công thức chuẩn:
  $$\text{Tổng Điểm} = \text{Thao Tác (30\%)} + \text{Sai Số (40\%)} + \text{Báo Cáo (30\%)}$$

---

## 3. Technical Architecture & OOP Contracts

```
frontend/src/engine/scenerystack/apparatus/
├── base/
│   ├── IApparatus.ts            // Core Interfaces (IMeasuringTool, ICircuit, IOptics, IThermal)
│   ├── BaseApparatus.ts         // Abstract Base Class with Node, Snapping, State
│   └── ApparatusFactory.ts      // Factory creating apparatus from Tool IDs
├── mechanics/                   // Cơ học & Chuyển động
│   ├── StandApparatus.ts / StandView.ts
│   ├── InclinedPlaneApparatus.ts / InclinedPlaneView.ts
│   ├── SpringApparatus.ts / SpringView.ts
│   ├── WeightApparatus.ts / WeightHangerView.ts
│   ├── CartApparatus.ts / CartView.ts
│   ├── BallApparatus.ts / MassObjectView.ts
│   ├── FrictionBlockApparatus.ts / FrictionBlockView.ts [NEW]
│   └── AirTrackApparatus.ts / GliderView.ts [NEW]
├── circuits/                    // Điện & Mạch điện
│   ├── PowerSupplyApparatus.ts / PowerSupplyView.ts [NEW]
│   ├── MultimeterApparatus.ts / MeterView.ts [NEW]
│   ├── RheostatApparatus.ts / RheostatView.ts [NEW]
│   ├── SwitchApparatus.ts / SwitchView.ts [NEW]
│   ├── InductionCoilApparatus.ts / CoilView.ts [NEW]
│   └── MagnetApparatus.ts / MagnetView.ts [NEW]
├── optics/                      // Quang học & Sóng ánh sáng
│   ├── LaserApparatus.ts / LaserView.ts [NEW]
│   ├── SlitApparatus.ts / SlitView.ts [NEW]
│   ├── ScreenApparatus.ts / ScreenView.ts [NEW]
│   ├── CaliperApparatus.ts / CaliperView.ts [NEW]
│   └── RefractorApparatus.ts / RefractorView.ts [NEW]
├── thermal/                     // Nhiệt học & Chất khí
│   ├── CalorimeterApparatus.ts / CalorimeterView.ts [NEW]
│   ├── GasPistonApparatus.ts / GasPistonView.ts [NEW]
│   └── PressureGaugeApparatus.ts / GaugeView.ts [NEW]
└── acoustics/                   // Âm học & Sóng âm
    └── ResonanceTubeApparatus.ts / ResonanceTubeView.ts [NEW]
```

---

## 4. Acceptance Criteria & Verification

1. **Bộ Dụng Cụ Đầy Đủ:** 100% 25+ Tool IDs trong `DacTa.md` được khởi tạo thành công qua `ApparatusFactory.create(toolId)`.
2. **16 Bài Thực Hành SGK:** 16 Route bài thực hành `/lab/:labSlug` hoạt động trơn tru, hiển thị bảng số liệu, điều khiển vật lý thời gian thực.
3. **TypeScript & Build:** `npm run build` không có bất kỳ lỗi linter/type error nào.
4. **Auto-Grading:** Hỗ trợ tính sai số $\text{Error} \le 5\%$ cho kết quả thực nghiệm.
