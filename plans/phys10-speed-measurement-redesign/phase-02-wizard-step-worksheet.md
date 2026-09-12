# Phase 2: 3-Step Wizard Worksheet with Formula Guides & Auto-Fill

**Parent Plan:** `plans/phys10-speed-measurement-redesign/plan.md`  
**Stories Covered:** P1 (3-step wizard, auto-fill button, formula guide cards, auto-grading)

---

## Objectives
1. Implement `SpeedLabWizardWorksheet.tsx` with 3 guided steps:
   - **Header Progress Pills:** Step 1 (Thu thập số liệu) $\rightarrow$ Step 2 (Tính toán & Sai số) $\rightarrow$ Step 3 (Trắc nghiệm & Chấm điểm).
   - **Step 1 (Thu thập số liệu):**
     - Table of 3-5 trial rows.
     - "Lấy số từ đồng hồ vào dòng" (Auto-fill) button to quickly record the current timer reading $\Delta t$ into the active trial row.
     - Next button unlocks once $\ge 3$ valid trials are entered.
   - **Step 2 (Xử lý & Sai số):**
     - Formula guide card: $\bar{t} = \frac{t_1 + t_2 + t_3}{3}$ and $\bar{v} = \frac{s}{\bar{t}}$.
     - Calculation fields for average time $\bar{t}$, average velocity $\bar{v}$, and uncertainty $\Delta v$ with auto-check indicator.
   - **Step 3 (Trắc nghiệm & Chấm điểm):**
     - 3 multiple-choice questions.
     - "Nộp Báo Cáo & Chấm Điểm" button computing 3-tier score (30% Thao tác + 40% Sai số + 30% Trắc nghiệm).
     - Full result breakdown card with pedagogical feedback.

---

## Deliverables
- `frontend/src/components/simulations/speed-measurement/SpeedLabWizardWorksheet.tsx`

---

## Verification
- Step navigation is smooth and validated.
- Auto-fill correctly populates the next row with `displayTimeSec`.
- Auto-grading produces accurate 0-10 score with 3-tier breakdown.
