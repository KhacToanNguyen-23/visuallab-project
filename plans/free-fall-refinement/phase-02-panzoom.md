# Phase 2: Add PanZoom & Air Resistance

## Objective
Enable full canvas navigation and simulate air resistance.

## Tasks
1. **PanZoom:** Attach `AnimatedPanZoomListener` from `scenerystack/scenery` to `FreeFallScene` or `SceneryCanvas` so the user can drag the entire view and scroll to zoom.
2. **Air Resistance:** Update `KinematicComponent.ts` to include `dragCoefficient`. Update `KinematicSolver.ts` to calculate $a = g - \frac{k}{m} \cdot v^2$.
3. **Settings Panel:** Provide a simple UI overlay to toggle/adjust the drag coefficient.
