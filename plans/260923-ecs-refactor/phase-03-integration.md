# Phase 3: Integration & Cleanup

## Objective
Update the physics solver and scene to use the new ECS classes, then delete old files.

## Tasks
1. Refactor `KinematicSolver.ts` to accept `KinematicComponent[]`.
2. Refactor `FreeFallScene.ts` to compose the Models, Views, and run the Solver.
3. Delete `apparatus/mechanics/MassObject.ts`.
4. Delete `apparatus/sensors/Photogate.ts`.
5. Clean up `core/interfaces.ts` (remove legacy interfaces).
