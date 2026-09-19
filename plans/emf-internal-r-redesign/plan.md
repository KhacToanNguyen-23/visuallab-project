# Plan: Thiết Kế Lại Thí Nghiệm Đo Suất Điện Động & Điện Trở Trong (EMF & Internal Resistance Lab)

**Mode:** Fast
**Risk:** normal — Standardized modular VirtualLab redesign following established Boyle-Mariotte, Induction, Sliding Friction & Specific Heat patterns.
**Spec:** `plans/emf-internal-r-redesign/spec.md`
**Target Route:** `http://localhost:5173/lab/emf-internal-r`

---

## 1. Overview
Redesign the EMF & Internal Resistance virtual lab module according to SGK GDPT 2018 Physics 11 (Dòng điện không đổi - Đo suất điện động và điện trở trong của nguồn điện), featuring a 3D Three.js circuit workbench (battery box, rheostat slider, switch, analog/digital meters), dynamic linear regression solver ($U = \mathcal{E} - I \cdot r$), and 3-tab Wizard Worksheet with GDPT 2018 quiz and auto-grading.

---

## 2. Phase Breakdown

### [Phase 1: Engine & Missions](file:///d:/6_OJT/EduLab/plans/emf-internal-r-redesign/phase-01-engine-and-missions.md)
- Create `frontend/src/components/simulations/emf-internal-r/emfInternalREngine.ts`.
- Model: $I = \frac{\mathcal{E}}{R + r}, U = I \cdot R = \mathcal{E} - I \cdot r$.
- Linear Regression Solver: calculates slope $a = -r$, intercept $b = \mathcal{E}$, and $R^2$.
- 3 GDPT 2018 Missions:
  - M1: Đo Pin đơn 1.5V ($\mathcal{E} = 1.5\text{V}, r = 0.5\Omega$).
  - M2: Đo Bộ 2 Pin nối tiếp 3.0V ($\mathcal{E} = 3.0\text{V}, r = 1.0\Omega$).
  - M3: Đo Pin cũ nội trở lớn ($r \ge 2.5\Omega$).
- Auto-grading: Thao tác (3.0đ), Độ chính xác $\delta\mathcal{E}, \delta r$ (4.0đ), Trắc nghiệm (3.0đ).

### [Phase 2: 3D Workbench & HUD Dock](file:///d:/6_OJT/EduLab/plans/emf-internal-r-redesign/phase-02-3d-workbench-and-hud.md)
- Create `EmfInternalRWorkbench3D.tsx`:
  - 3D Battery Box with 1xAA, 2xAA series, or 9V battery options.
  - Interactive Rheostat (Biến trở con chạy) with draggable slider handle.
  - Knife switch (Khóa K) toggling circuit state with glowing wire current animation.
  - Voltmeter and Ammeter with dual Analog Dial (kim quay) and Digital LED readout modes.
- Create `EmfInternalRWorkbenchHudDock.tsx`:
  - Source switcher, Rheostat resistance slider ($2\Omega - 100\Omega$), Switch toggle, Meter display mode toggle, and "+ Ghi Số Liệu" button.

### [Phase 3: Wizard Worksheet & Export Wrapper](file:///d:/6_OJT/EduLab/plans/emf-internal-r-redesign/phase-03-wizard-worksheet-and-submission.md)
- Create `EmfInternalRLabWizardWorksheet.tsx`:
  - Tab 1: 3 Missions with card layout and direct record action.
  - Tab 2: Measurements table ($R, I, U$) & interactive $U-I$ scatter plot with linear extrapolation line $U = \mathcal{E} - I \cdot r$.
  - Tab 3: 3 GDPT 2018 multiple choice questions, scoreboard, student observation note, and EduLab submission.
- Create `EmfInternalRLab.tsx` container and map to `/lab/emf-internal-r` in `main.tsx`.

---

## 3. Verification Plan
- Build test: `npm run build` in `frontend/` (0 TS errors).
- Functional verification:
  1. Open `/lab/emf-internal-r`.
  2. Toggle switch, adjust rheostat slider $\rightarrow$ Record M1.
  3. Switch to 2x Battery series $\rightarrow$ Record M2.
  4. Switch to Old Battery $\rightarrow$ Record M3.
  5. Check data table, linear regression graph ($U = \mathcal{E} - I \cdot r$), complete quiz & submit report.
