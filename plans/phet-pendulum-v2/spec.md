# Spec: Pendulum & Harmonic Oscillator Lab V2 (SceneryStack Integration)

**Date:** 2026-09-10
**Status:** Ready

---

## Problem Statement
The user wants to evaluate PhET's official open-source stack (`scenerystack`) by building a modern Pendulum & Simple Harmonic Motion (SHM) Lab v2 in EduLab without using external HTML iframes.

---

## User Stories

- **[P1]** As a student/teacher, I want to interact with a Pendulum Lab powered by `scenerystack` so that I can experience authentic PhET-style vector graphics and physics rendering in EduLab.
  Accepted when: `PhetPendulumLabV2.tsx` mounts a Scenery SceneGraph instance in a React container, rendering the bob, string, pivot, and controls using Scenery & Axon state.

- **[P1]** As a user, I want to control pendulum length, mass, gravity, and drag interactive bobs directly so that state syncs between Scenery nodes and React state.
  Accepted when: Dragging bob updates angle in real-time, and sliders update physical parameters deterministically.

- **[P2]** As a student, I want to compare `PhetPendulumLabV1` (custom Canvas) with `PhetPendulumLabV2` (`scenerystack`) side-by-side in EduLab.
  Accepted when: Both options are accessible or toggleable in the EduLab simulation interface.

---

## Functional Requirements

1. FR-01: Install `scenerystack` npm dependency in `frontend/package.json`.
2. FR-02: Create `PhetPendulumLabV2.tsx` component in `frontend/src/components/simulation/`.
3. FR-03: Implement Scenery Node SceneGraph with Pivot, Rod/String, Bob, Angle indicator, and Energy Bar overlays.
4. FR-04: Connect Axon `Property` / `NumberProperty` observables for state propagation.

---

## Non-Functional Requirements

- Performance: Maintain 60 FPS animation loop with Scenery's requestAnimationFrame.
- Reliability: Clean teardown of Scenery display on React component unmount to prevent memory leaks.

---

## Success Criteria

- [ ] `npm install scenerystack` completes cleanly.
- [ ] `PhetPendulumLabV2.tsx` builds without TypeScript or Vite bundle errors.
- [ ] Interactive pendulum renders and responds to drag and play/pause events via SceneryStack.

---

## Out of Scope

- Removing or altering existing V1 `PhetPendulumLab.tsx`.
