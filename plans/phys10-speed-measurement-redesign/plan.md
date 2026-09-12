# Plan: Tối Ưu UX/UI HUD Dock & Wizard Worksheet (Vật Lý 10 - Bài 6)

**Date:** 2026-09-12  
**Spec:** `plans/phys10-speed-measurement-redesign/spec.md`  
**Mode:** hard  
**Status:** Completed  
**Risk:** normal — frontend UI layout refactoring and worksheet wizard enhancement, no breaking schema/auth changes.

---

## Architecture & Component Refactoring

```
frontend/src/components/simulations/speed-measurement/
  ├── SpeedMeasurementLab.tsx       # Main Lab Layout (No-scroll grid, active tab sync)
  ├── SpeedWorkbenchCanvas.tsx      # High DPI 2D Canvas + Interactive Photogate Draggers
  ├── SpeedWorkbenchHudDock.tsx     # (NEW) Unified Compact HUD Dock (LCD Timer, Play/Reset, Sliders, Cable badges)
  ├── SpeedLabWizardWorksheet.tsx   # (NEW) 3-Step Guided Wizard (Step 1: Data, Step 2: Formulas, Step 3: Quiz & Grade)
  └── speedLabEngine.ts             # Physics calculations & 3-tier Auto-grading
```

---

## Phase Breakdown

- [x] **Phase 1: Unified Canvas HUD Dock & No-Scroll Viewport** (`phase-01-unified-hud-canvas-dock.md`)
  - Created `SpeedWorkbenchHudDock.tsx` combining:
    - LCD Digital display ($0.001\text{s}$) with live Counting LED.
    - Prominent "Thả Bi (Start)" and "Đặt Lại (Reset)" buttons right under canvas.
    - Inline compact sliders for Angle $\alpha$ and Gate positions.
    - Signal cable status toggles with clear badges.
  - Refactored `SpeedMeasurementLab.tsx` into a responsive 2-column, no-scroll viewport layout.

- [x] **Phase 2: 3-Step Wizard Worksheet with Formula Guides & Auto-Fill** (`phase-02-wizard-step-worksheet.md`)
  - Created `SpeedLabWizardWorksheet.tsx`:
    - **Step 1 (Thu thập số liệu):** 3-5 trial rows, visual completion badges, "+ Ghi số (Auto-fill)" button.
    - **Step 2 (Xử lý & Sai số):** Interactive formula cards with math formatting ($\bar{t} = \frac{\sum t_i}{N}$, $\bar{v} = \frac{s}{\bar{t}}$), manual inputs, and quick calculation sample.
    - **Step 3 (Trắc nghiệm & Chấm điểm):** 3 comprehension questions, automated 30/40/30 scoring with detailed feedback banner.

---

## Session Notes
<!-- Updated by cook automatically — do not edit manually -->

**Last active:** 2026-09-12 13:38  
**Phase in progress:** Redesign complete  
**Status:** All components refactored, HUD Dock and Wizard Worksheet verified with clean Vite build.
