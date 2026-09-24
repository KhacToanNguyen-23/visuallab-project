# Interaction Engine & Physics State Plan

**Mode:** --fast
**Risk:** normal — multi-file (useLabStore, BaseEntity3D, CanvasWorkspace), testable, no data risk.

## Phase 01: State Management (Zustand)
Update the core state to support simulation tracking.

### File Ownership
- `frontend/src/store/useLabStore.ts`

### Implementation
1. Add `isSimulating?: boolean` to `LabEntity` interface.
2. Add `updateEntityState: (id: string, updates: Partial<LabEntity>) => void` to `useLabStore` to allow toggling this state without touching `config`.
3. Add a global action `resetSimulation: () => void` that loops through all entities, sets `isSimulating = false`, and restores their current position to `initialTransform`.

---

## Phase 02: Physics Engine Binding
Map the Zustand state to Rapier's physics engine dynamically.

### File Ownership
- `frontend/src/components/lab/BaseEntity3D.tsx`

### Implementation
1. Read `entity.isSimulating` inside `BaseEntity3D`.
2. Use a `useEffect` hook to call `bodyRef.current.setBodyType(type, true)` when `isSimulating` changes.
   - If `true` -> `0` (Dynamic)
   - If `false` -> `2` (KinematicPositionBased)
3. Ensure the initial spawn sets `bodyType = 2`.
4. Inside the drag handler, if `isSimulating` is true, temporarily set to kinematic and restore to dynamic on drop (already partially implemented, just needs fine-tuning).

---

## Phase 03: Control UI
Provide user controls to toggle the simulation state.

### File Ownership
- `frontend/src/components/lab/tools/SteelBall3D.tsx`
- `frontend/src/pages/lab/SandboxLab.tsx`

### Implementation
1. **Tool Control:** In `SteelBall3D`, wrap the mesh with `<Html>` from `@react-three/drei` to render a small "Thả" (Release) button positioned slightly above the ball. Clicking it calls `updateEntityState(entity.id, { isSimulating: true })`.
2. **Global Control:** In `SandboxLab.tsx`, add a prominent "Làm lại" (Reset) button next to "Lưu bài" that triggers `resetSimulation()`.
