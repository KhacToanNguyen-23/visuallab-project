# Plan: Bài 6 — Đo Tốc Độ Trên Máng Nghiêng (SGK Lớp 10)

Mode: --fast
Risk: normal

## Architecture
- **Engine:** SceneryStack (2D Canvas with PanZoom & DragListeners)
- **Physics ECS:** `InclinedPlaneSolver` calculating $a = g(\sin\alpha - \mu\cos\alpha)$, updating cart position along the track $s(t)$.
- **Components:** `CartView` with 10mm flag, `InclinedPlaneView` with angle adjuster ($0^\circ \to 45^\circ$), `RampPhotogateView` mounted along the ramp.

## Phases
- [x] **Phase 1: ECS Models & Physics Solver**
  - Create `CartModel` & `InclinedPlaneModel`.
  - Implement `InclinedPlaneSolver.ts` for 1D inclined motion with friction.
- [x] **Phase 2: SceneryStack Views**
  - Implement `CartView.ts` (cart with 4 wheels & vertical flag).
  - Implement `InclinedPlaneView.ts` (track with mm scale, pivot stand, angle control).
  - Adapt `RampPhotogateView.ts` that slides along track angle $\alpha$.
- [x] **Phase 3: Scene & State Store**
  - Create `SpeedMeasurementScene.ts` tying together the track, cart, and 2 photogates.
  - Create `useSpeedMeasurementStore.ts` for recording $s$, $t_1$, $t_2$, $v_{\text{tb}}$, $a_{\text{calc}}$.
- [x] **Phase 4: Page Assembly & Routing**
  - Create `frontend/src/pages/labs/SpeedMeasurementLab.tsx`.
  - Wire into `CurriculumLabPage.tsx` for `sim-speed-measurement`.
