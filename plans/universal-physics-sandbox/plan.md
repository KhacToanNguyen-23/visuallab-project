# Plan: Bàn Thí Nghiệm Tự Do (Universal Physics Sandbox)

Mode: --fast
Risk: normal

## Architecture
- **SnapEngine:** Port-Based Connection Manager with Euclidean distance testing & magnetic lerp.
- **Palette UI:** Hybrid categories (Cơ học, Cảm biến, Tải trọng, Tất cả) with search.
- **Universal Scene:** Dynamic ECS multi-entity registry coordinating `KinematicSolver`, `InclinedPlaneSolver`, `HarmonicOscillatorSolver`.

## Phases
- [x] **Phase 1: SnapEngine & Connection Types**
  - Create `SnapEngine.ts` and port definition interfaces.
- [x] **Phase 2: Palette Component**
  - Create `WorkbenchPalette.tsx` for adding equipment to the sandbox.
- [x] **Phase 3: Universal Sandbox Scene**
  - Create `UniversalSandboxScene.ts` with dynamic spawning, dragging, snapping, and solver linkage.
- [x] **Phase 4: Workbench Page & Routing**
  - Create `UniversalWorkbenchPage.tsx` and wire route `/workbench/universal` in `main.tsx`.
