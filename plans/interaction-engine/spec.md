# Specification: Interaction Engine & Physics State

## Core Goal
Enable localized, object-specific physics simulation where objects remain fixed upon drop until explicitly released, allowing the user to assemble a stable experimental setup before starting the run.

## User Stories
- **P1:** As a user, when I drag a tool from the sidebar to the workspace, it stays exactly where I drop it (it does not fall to the ground).
- **P1:** As a user, I can click a "Thả" (Release) button on a movable object (e.g., Steel Ball) to make it fall and interact with the environment.
- **P2:** As a user, I can click a global "Làm lại" (Reset) button to instantly snap all objects back to their pre-release positions.
- **P2:** As a user, I can drag and move equipment (tracks, sensors) even while the simulation is running.

## Success Criteria
1. All dropped objects default to `KinematicPositionBased`.
2. A UI element (like a small floating button next to the ball, or a context menu) allows switching the ball to `Dynamic`.
3. The Reset button successfully reverts the ball to its original dropped position and resets its physics state to Kinematic.
4. No Rapier WASM crashes when flipping states rapidly.

## Technical Approach
1. Update `LabEntity` in `useLabStore` to include an `isSimulating: boolean` state.
2. In `BaseEntity3D`, bind the `isSimulating` state to `bodyRef.current.setBodyType()`.
   - `false` -> `KinematicPositionBased` (2)
   - `true` -> `Dynamic` (0)
3. Build a Context Menu or floating HTML overlay (using Drei's `<Html>`) for tools that support simulation (e.g. `isSimulatable: true`).
4. Build a global "Làm lại" button in `SandboxLab` that dispatches a reset action to `useLabStore`, setting `isSimulating` to false and restoring `initialTransform`.
