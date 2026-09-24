# Plan: OOP & Interface Apparatus Refactoring (Theo DacTa.md)

Mode: --fast
Risk: normal

## Architecture
- **Contracts Layer:** `frontend/src/engine/scenerystack/core/contracts/` (`IApparatus`, `IMeasuringTool`, `ISensorDevice`, `IPhysicsBody`, `IMechanicalBase`).
- **Base Class Layer:** `BaseApparatus.ts` encapsulating common SceneryStack node dragging, bounds, and `SnapPort` registration.
- **Concrete Layer:** Stand, InclinedPlane, Spring, WeightHanger, Photogate, Cart, SteelBall.
- **Execution:** Unified ECS dynamic registry in `UniversalSandboxScene.ts` and Curriculum Scenes.

## Phases
- [ ] **Phase 1: Core Contracts & BaseApparatus**
  - Create `IApparatus.ts` and physics trait interfaces based on `DacTa.md`.
  - Implement `BaseApparatus.ts` managing Scenery node, drag handlers, and snap ports.
- [ ] **Phase 2: Refactor Concrete Mechanics & Sensors**
  - Implement `StandApparatus.ts`, `InclinedPlaneApparatus.ts`, `SpringApparatus.ts`, `WeightApparatus.ts`, `PhotogateApparatus.ts`, `CartApparatus.ts`, `BallApparatus.ts`.
- [ ] **Phase 3: Universal Sandbox Polymorphic Engine**
  - Refactor `UniversalSandboxScene.ts` to instantiate and step apparatus polymorphically without switch-case boilerplate.
- [ ] **Phase 4: Verification & Build Check**
  - Verify `UniversalWorkbenchPage.tsx` and the 3 Curriculum Labs.
  - Run `npm run build` to guarantee 100% clean compilation.
