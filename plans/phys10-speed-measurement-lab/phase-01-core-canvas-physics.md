# Phase 1: 2D Canvas Workbench & Kinematic Physics Engine

**Parent Plan:** `plans/phys10-speed-measurement-lab/plan.md`  
**Stories Covered:** P1 (Draggable workbench, photogate positioning, smooth 60 FPS rolling motion)

---

## Objectives
1. Implement `SpeedWorkbenchCanvas.tsx` with high DPI HTML5 2D Canvas.
2. Render inclined plane `INCLINED_TRACK` with adjustable angle slider $\alpha \in [5^\circ, 30^\circ]$ and millimeter-spaced tick marks along the track length ($0 - 100\text{cm}$).
3. Implement interactive drag-and-drop for `PHOTOGATE_SENSOR` E and F with magnetic snapping to the ruler markings.
4. Implement physics rolling simulation with acceleration $a = g \cdot \sin\alpha$ ($g = 9.81\text{m/s}^2$) for `STEEL_BALL` ($d = 2\text{cm}$).
5. Add particle/optical sensor ray trigger detection when the ball crosses Gate E ($s_E$) and Gate F ($s_F$).

---

## Deliverables
- `frontend/src/components/simulations/speed-measurement/SpeedWorkbenchCanvas.tsx`
- `frontend/src/components/simulations/speed-measurement/speedLabEngine.ts` (Core physics formulas and types)

---

## Verification
- Canvas renders at 60 FPS without frame drops.
- Changing angle $\alpha$ updates the inclined slope smoothly.
- Dragging photogates moves them strictly along the track boundary.
- Releasing the ball simulates realistic accelerated rolling down the track and detects sensor crossing.
