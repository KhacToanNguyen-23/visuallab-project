# Specification: VisualLab 2.0 - Phase 1 (ECS & Properties Panel)

## Core Goal
Transform the hardcoded MVP into a robust Entity-Component-System (ECS). Implement a global selection state and a unified UI Properties Panel that allows real-time editing of physics parameters.

## User Stories
- **P1:** As a user, I can click on any object in the lab (e.g., Steel Ball) to select it, indicated by a visual highlight (Bounding Box/Outline).
- **P1:** As a user, when an object is selected, a "Properties Panel" appears on the right side of the screen.
- **P1:** As a user, I can use the Properties Panel to change the object's physical properties (Mass, Friction, Restitution, Color) and see the physics engine update immediately.
- **P2:** As a user, the camera is locked to a 2.5D Orthographic perspective to make the lab look flat but shaded, similar to Nobook.

## Success Criteria
1. Clicking an object updates `selectedEntityId` in `useLabStore`.
2. A generic `PropertiesPanel.tsx` component reads the selected entity's config and renders appropriate input fields.
3. Updating a value in the panel dispatches `updateEntityConfig`, which seamlessly updates the Rapier `RigidBody` properties (mass, friction, restitution).
4. The `PhysicsEnvironment` camera is switched to `OrthographicCamera` with appropriate zoom and locking.

## Technical Approach
1. Expand `LabEntity` config interface to standardize `mass`, `friction`, `restitution`, and `color`.
2. Wrap `BaseEntity3D` meshes in an `<Outlines>` or custom shader when `selected === true`.
3. Build the React+Tailwind `PropertiesPanel` overlay on the right side of `SandboxLab.tsx`.
