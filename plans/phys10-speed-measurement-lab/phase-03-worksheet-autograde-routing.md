# Phase 3: Interactive Worksheet, Auto-Grading & Routing

**Parent Plan:** `plans/phys10-speed-measurement-lab/plan.md`  
**Stories Covered:** P1 (Manual data input, auto-grading 30/40/30, quiz evaluation, routing integration)

---

## Objectives
1. Implement `SpeedLabWorksheet.tsx`:
   - 5-row manual entry table for measured times $t_1, t_2, t_3, t_4, t_5$.
   - Calculation fields for average time $\bar{t}$, average velocity $\bar{v}$, absolute error $\overline{\Delta t}$, and total uncertainty $\Delta v$.
   - Post-lab comprehension quiz (3 questions on systematic/random errors, formula application).
2. Implement 3-Tier Auto-Grading Algorithm:
   - **Thao tác (30%):** Valid assembly (`isWiringCorrect`), proper distance $s \ge 20\text{cm}$, $\ge 3$ experimental trials performed.
   - **Sai số & Độ chính xác (40%):** Calculate $\text{Error} = \frac{|\bar{v}_{\text{student}} - \bar{v}_{\text{theory}}|}{\bar{v}_{\text{theory}}} \times 100\%$. Full points if $\le 5\%$, scaled linearly up to $20\%$.
   - **Trắc nghiệm (30%):** 10% per correct quiz question.
3. Integrate into routing:
   - Lazy load `SpeedMeasurementLab` in `frontend/src/main.tsx` at `/lab/speed-measurement`.
   - Add lab card entry into `CatalogPage.tsx` under Grade 10 - Kinematics.

---

## Deliverables
- `frontend/src/components/simulations/speed-measurement/SpeedLabWorksheet.tsx`
- `frontend/src/components/simulations/speed-measurement/SpeedMeasurementLab.tsx`
- Routing registration in `frontend/src/main.tsx` and catalog in `frontend/src/pages/CatalogPage.tsx`

---

## Verification
- Student can enter data rows and trigger grading.
- Auto-grader computes exact score breakdown (0-10 scale) and provides instant pedagogical feedback.
- Navigating to `/lab/speed-measurement` renders the complete lab smoothly inside `LabErrorBoundary`.
