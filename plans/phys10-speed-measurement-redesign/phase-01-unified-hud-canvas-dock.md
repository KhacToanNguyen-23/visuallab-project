# Phase 1: Unified Canvas HUD Dock & No-Scroll Viewport

**Parent Plan:** `plans/phys10-speed-measurement-redesign/plan.md`  
**Stories Covered:** P1 (Unified HUD dock, no-scroll viewport, quick controls)

---

## Objectives
1. Implement `SpeedWorkbenchHudDock.tsx`:
   - High-contrast Digital LCD Screen displaying measured time $\Delta t$ ($0.001\text{s}$) with live Counting / Ready status indicators.
   - Large, thumb-friendly **Thả Bi (Start)** and **Đặt Lại (Reset)** buttons placed directly under the canvas.
   - Compact horizontal sliders for Track Angle $\alpha$ ($5^\circ - 30^\circ$) and Gate positions ($s_E, s_F$).
   - Quick cable toggle buttons (Cổng E $\rightarrow$ Ngõ A, Cổng F $\rightarrow$ Ngõ B).
2. Refactor `SpeedMeasurementLab.tsx` layout:
   - Assemble Canvas + HUD Dock in left column, ensuring the whole apparatus fits comfortably on desktop/laptop viewports without scrolling.

---

## Deliverables
- `frontend/src/components/simulations/speed-measurement/SpeedWorkbenchHudDock.tsx`
- Refactored `SpeedMeasurementLab.tsx`

---

## Verification
- User can trigger ball release and reset without scrolling down the page.
- Sliders and cable toggles update canvas physics state immediately.
