# Functional Spec: 16-Lab Direct Drag & Touch Interactive Physics Engine

**Status:** Approved
**Slug:** 16-labs-direct-drag-touch

## User Stories & Scope

### P1: Direct Touch & Pointer Drag Mechanics for 100% 16 Labs
- Every lab simulation must allow direct mouse/touch drag manipulation on primary apparatus components.
- **Mechanics**:
  - `sliding-friction`: Drag 3D dynamometer ring directly across workbench to stretch spring and pull block.
  - `speed-measurement`: Drag bi steel up incline, drop by releasing pointer.
  - `free-fall`: Drag steel ball to electromagnet, click/tap to release.
  - `momentum-collision`: Drag glider car A to set initial launcher compression, release to launch collision.
  - `spring-mass`: Drag mass downwards to extend spring, release to vibrate.
- **Thermodynamics**:
  - `boyle-mariotte`: Drag piston handle up/down to compress/expand gas volume $V$.
  - `latent-heat`: Drag ice block into calorimeter water.
  - `specific-heat`: Drag heating element and dial knob.
- **Electromagnetism**:
  - `induction`: Drag magnet in/out of coil continuously; velocity drives induced EMF $e$.
  - `emf-internal-r`: Drag knife switch lever to close/open circuit; drag potentiometer slider.
  - `dc-circuit`: Drag banana plug leads to terminal posts.
- **Waves & Optics**:
  - `sound-resonance`: Drag water reservoir tube up/down to alter resonance column height.
  - `wave-interference`: Drag double caliper jaws over fringe pattern.
  - `refraction`: Drag laser pointer beam head to adjust angle of incidence $\alpha$.
- **Pendulum & Sandbox**:
  - `simple-pendulum`: Drag pendulum bob to initial angle $\theta_0$, release to swing.
  - `universal-workbench`: Drag modular physics components on sandbox grid.

### P2: Real-time Physics & Audio Feedback during Dragging
- Physical parameters (forces, velocities, angles, voltages, sound pitch/volume) update in real-time as the user drags.

## Acceptance Criteria
- 100% (16/16) labs support direct pointer/touch dragging.
- `npm run build` in `frontend` compiles cleanly with 0 errors.
