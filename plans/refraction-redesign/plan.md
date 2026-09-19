# Plan: Thiết Kế Lại Thí Nghiệm Khúc Xạ Ánh Sáng & Phản Xạ Toàn Phần (Refraction & Total Internal Reflection Lab)

**Mode:** Fast
**Risk:** normal — Standardized modular VirtualLab redesign following established Boyle-Mariotte, Induction, EMF & Internal R, and Specific Heat patterns.
**Spec:** `plans/refraction-redesign/spec.md`
**Target Route:** `http://localhost:5173/lab/refraction`

---

## 1. Overview
Redesign the Refraction & Total Internal Reflection virtual lab module according to SGK GDPT 2018 Physics 11 (Chủ đề Quang hình học - Khúc xạ và Phản xạ toàn phần), featuring a 3D Three.js semi-cylindrical lens optical studio with circular protractor disc, rotatable laser source, Fresnel ray intensities, empirical $\sin i - \sin r$ linear regression solver, and a 3-tab Wizard Worksheet with Mystery Medium identification and auto-grading.

---

## 2. Phase Breakdown

### [Phase 1: Engine & Missions](file:///d:/6_OJT/EduLab/plans/refraction-redesign/phase-01-engine-and-missions.md)
- Create `frontend/src/components/simulations/refraction/refractionEngine.ts`:
  - Snell's Law ($n_1 \sin i = n_2 \sin r$), Total Internal Reflection condition ($i \ge i_{\text{gh}} = \arcsin(n_2/n_1)$), Fresnel reflection coefficients.
  - Linear regression solver for $\sin i = n_{21} \cdot \sin r$.
  - 3 GDPT 2018 Missions (M1: Air $\to$ Crown Glass, M2: Crown Glass $\to$ Air TIR, M3: Mystery Medium $X$).
  - Auto-grading: Thao tác (3.0đ), Độ chính xác $\delta n \le 3\%$ (4.0đ), Trắc nghiệm (3.0đ).

### [Phase 2: 3D Semi-Cylinder Studio & HUD Dock](file:///d:/6_OJT/EduLab/plans/refraction-redesign/phase-02-3d-workbench-and-hud.md)
- Create `RefractionWorkbench3D.tsx`:
  - 3D circular optics protractor disc ($0 - 360^\circ$ markings).
  - Semi-cylindrical glass block (Khối bán nguyệt trụ quang học) with glass sheen and transparency.
  - Rotatable Laser emitter on circular track ($0^\circ \to 90^\circ$).
  - Glowing laser rays (Incident, Reflected, Refracted) with realistic Fresnel intensity and pulse.
- Create `RefractionWorkbenchHudDock.tsx`:
  - Medium selector ($n_1, n_2$), Direction switcher, Angle slider/stepper ($0^\circ \to 85^\circ$), Laser wavelength color picker, and "+ Ghi Số Liệu".

### [Phase 3: Wizard Worksheet & Submission Integration](file:///d:/6_OJT/EduLab/plans/refraction-redesign/phase-03-wizard-worksheet-and-submission.md)
- Create `RefractionLabWizardWorksheet.tsx`:
  - Tab 1: 3 Missions with card layout and direct record action.
  - Tab 2: Measurements table ($i, r, \sin i, \sin r$) & $\sin i - \sin r$ linear scatter plot with regression slope $n_{21}$ and $R^2$.
  - Tab 3: 3 GDPT 2018 multiple choice questions, scoreboard, observations, and EduLab submission.
- Create `RefractionLab.tsx` container and map to `/lab/refraction` in `main.tsx`.

---

## 3. Verification Plan
- Build test: `npm run build` in `frontend/` (0 TS errors).
- Functional verification:
  1. Open `/lab/refraction`.
  2. Rotate laser $\to$ verify Snell's law $r = \arcsin((n_1/n_2)\sin i)$.
  3. Switch to Medium $\to$ Air $\to$ verify Total Internal Reflection at $i \ge i_{\text{gh}}$.
  4. Complete 3 missions, verify $\sin i - \sin r$ plot, answer quiz and submit report.
