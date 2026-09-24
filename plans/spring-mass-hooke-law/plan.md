# Plan: Bài 38 — Đo Độ Cứng Của Lò Xo (Định Luật Hooke & Dao Động)

Mode: --fast
Risk: normal

## Architecture
- **Engine:** SceneryStack (2D Vector Canvas with interactive Draggables)
- **Physics ECS:** `HarmonicOscillatorSolver` simulating $m \ddot{y} + \gamma \dot{y} + k y = m g$, damping equilibrium and oscillation.
- **Components:** Procedural parametric `SpringView` (coils stretch dynamically), `WeightHangerView` (stackable weights: 50g–300g), `StandView` with mm ruler & needle pointer.

## Phases
- [x] **Phase 1: Physics Engine & Models**
  - Implement `SpringComponent.ts` (stiffness $k$, natural length $l_0$, damping $\gamma$).
  - Implement `HarmonicOscillatorSolver.ts` for dynamic spring-mass oscillation & equilibrium.
- [x] **Phase 2: SceneryStack Visual Views**
  - Implement `SpringView.ts` (procedural coil spring using Kite `Shape`).
  - Implement `WeightHangerView.ts` (hanger hook + stackable weights).
- [x] **Phase 3: Scene & State Store**
  - Create `SpringMassScene.ts` managing spring, hanger, and hanging weights.
  - Create `useSpringMassStore.ts` for recording $m$, $P = mg$, $\Delta l$, and calculating $k = P / \Delta l$.
- [x] **Phase 4: Lab Page Assembly & Routing**
  - Create `SpringDataTablePanel.tsx` and `SpringMassLab.tsx`.
  - Wire into `CurriculumLabPage.tsx` for `sim-spring-mass`.
