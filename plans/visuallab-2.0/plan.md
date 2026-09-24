# VisualLab 2.0 - Phase 1 Plan

**Mode:** --fast
**Risk:** normal — multi-file UI change (Zustand, BaseEntity3D, SandboxLab, PropertiesPanel), testable, no data risk.

## Phase 01: Core Selection State
Add `selectedEntityId` to Zustand to track what the user is currently editing.

### File Ownership
- `frontend/src/store/useLabStore.ts`

### Implementation
1. Add `selectedEntityId: string | null` to `LabState`.
2. Add action `setSelectedEntity(id: string | null)`.
3. Clear `selectedEntityId` on `clearState` or when clicking empty space.

---

## Phase 02: 2.5D Camera & Object Selection
Lock the camera to 2D perspective and make objects clickable.

### File Ownership
- `frontend/src/components/lab/PhysicsEnvironment.tsx`
- `frontend/src/components/lab/BaseEntity3D.tsx`

### Implementation
1. In `PhysicsEnvironment.tsx`, change `OrthographicCamera` position to look straight down Z-axis (`position={[0, 0, 50]}`, `zoom={40}`) and disable rotation in `OrbitControls`.
2. In `BaseEntity3D.tsx`, add `onClick` to the `<group>` to call `setSelectedEntity(entity.id)`.
3. Wrap the group in `<Outlines>` from `@react-three/drei` if `selectedEntityId === entity.id` to show a glowing border.

---

## Phase 03: Properties Panel UI
Build the right-side panel to edit the physics values.

### File Ownership
- `frontend/src/components/lab/PropertiesPanel.tsx` (NEW)
- `frontend/src/pages/lab/SandboxLab.tsx`

### Implementation
1. Create `PropertiesPanel.tsx` that reads `selectedEntityId` and fetches the `entity`.
2. Render input fields for `mass`, `friction`, `restitution`, and `color`.
3. Attach `onChange` handlers to `updateEntityConfig`.
4. In `SandboxLab.tsx`, render `<PropertiesPanel />` inside the main view, positioned absolutely on the right side.
