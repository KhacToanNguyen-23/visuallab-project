# Plan: Thiết Kế Lại Thí Nghiệm Đo Nhiệt Dung Riêng (Specific Heat Lab)

**Mode:** Fast
**Risk:** normal — Standardized modular VirtualLab redesign following established Boyle-Mariotte, Induction & Sliding Friction patterns.
**Spec:** `plans/specific-heat-redesign/spec.md`
**Target Route:** `http://localhost:5173/lab/specific-heat`

---

## 1. Overview
Redesign the Specific Heat virtual lab module according to SGK GDPT 2018 Physics 12 (Nhiệt học - Đo nhiệt dung riêng của chất lỏng), featuring a 3D Three.js calorimeter studio, 3 liquid presets (Water, Ethanol, Oil), realistic heating curve with boil auto-shutoff, mechanical stirrer, and 3-tab Wizard Worksheet with GDPT 2018 quiz and auto-grading.

---

## 2. Phase Breakdown

### [Phase 1: Engine & Missions](file:///d:/6_OJT/EduLab/plans/specific-heat-redesign/phase-01-engine-and-missions.md)
- Create `frontend/src/components/simulations/specific-heat/specificHeatEngine.ts`.
- Model: $Q = P \cdot t = m \cdot c \cdot \Delta T \implies c = \frac{P \cdot t}{m \cdot \Delta T}$.
- 3 GDPT 2018 Missions:
  - M1: Đo nhiệt dung riêng của Nước ($m=0.2\text{kg}, P=50\text{W}, t=120\text{s}$).
  - M2: Khảo sát tăng công suất / khối lượng ($P=80\text{W}, m=0.3\text{kg}$).
  - M3: Đo nhiệt dung riêng của Cồn ($c \approx 2440$) hoặc Dầu ($c \approx 2000$).
- Auto-grading: Thao tác (3.0đ), Độ chính xác $\delta c$ (4.0đ), Trắc nghiệm (3.0đ).

### [Phase 2: 3D Workbench & HUD Dock](file:///d:/6_OJT/EduLab/plans/specific-heat-redesign/phase-02-3d-workbench-and-hud.md)
- Create `SpecificHeatWorkbench3D.tsx`:
  - 3D Calorimeter with transparent insulating double-layer vessel.
  - Heating coil with dynamic emissive glow proportional to power $P$.
  - Rotating stirrer propeller & rising bubble stream.
  - Digital timer, wattmeter, and digital thermometer readout.
  - Boil safety detection with automatic heat shutoff and warning toast.
- Create `SpecificHeatWorkbenchHudDock.tsx`:
  - Liquid selector (Water, Ethanol, Oil), mass slider ($0.1\text{kg} - 0.4\text{kg}$), power selector ($30\text{W} - 100\text{W}$), stirrer toggle, heat/stop/reset buttons, and "+ Ghi Số Liệu" button.

### [Phase 3: Wizard Worksheet & Export Wrapper](file:///d:/6_OJT/EduLab/plans/specific-heat-redesign/phase-03-wizard-worksheet-and-submission.md)
- Create `SpecificHeatLabWizardWorksheet.tsx`:
  - Tab 1: 3 Missions with card layout and direct record action.
  - Tab 2: Measurements table ($m, P, t, T_1, T_2, \Delta T, c_{\text{đo}}, c_{\text{chuẩn}}, \delta\%$) & temperature rise curve $T(t)$.
  - Tab 3: 3 GDPT 2018 multiple choice questions, scoreboard, student observation note, and EduLab submission.
- Create `SpecificHeatLab.tsx` container and re-export from `simulations/SpecificHeatLab.tsx`.

---

## 3. Verification Plan
- Build test: `npm run build` in `frontend/` (0 TS errors).
- Functional verification:
  1. Open `/lab/specific-heat`.
  2. Perform heating on Water $\rightarrow$ Record M1.
  3. Adjust power/mass $\rightarrow$ Record M2.
  4. Switch to Ethanol/Oil $\rightarrow$ Record M3.
  5. Check data table, temperature graph, complete quiz & submit report.
