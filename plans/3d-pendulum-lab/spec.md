# Spec: 3D Simple Pendulum Simulation & Harmonic Motion (/lab/simple-pendulum & /test-pendulum)

**Date:** 2026-09-11
**Status:** Ready

---

## Problem Statement
Upgrade `PhetPendulumLab.tsx` to match the **Combo Phòng Lab** design standard: Three.js 3D physics rendering, Web Audio velocity pitch synthesis, zero decorative emojis, no-scroll viewport layout, and VisualLab CSS theme variable integration.

---

## User Stories

- **[P1]** As a high school physics student (Grade 11, Chapter 1), I want to interact with a 3D simple pendulum simulation in full screen without scrolling so that I can observe period $T = 2\pi\sqrt{l/g}$ and energy conservation $W = W_d + W_t$.
  Accepted when: Route `/test-pendulum` renders a Three.js 3D scene in `h-screen overflow-hidden` layout with zero emojis.

- **[P1]** As a student, I want to hear realistic velocity/oscillation audio feedback so that I can feel the momentum and frequency of the pendulum motion.
  Accepted when: Toggling audio synthesizes Web Audio pitch modulated by angular velocity $\dot{\theta}(t)$.

- **[P2]** As a teacher, I want to compare two pendulums with different lengths/masses side-by-side or log measurements into an experiment table.
  Accepted when: Tab controls provide Exploration, Measurement Table, Real-time Graph ($x, v, a$), and Screenshot Report features.

---

## Functional Requirements

1. FR-01: Three.js 3D scene with metallic support frame, brass pendulum sphere, hanging cord, 3D angle arc protractor, and raycaster mouse dragging.
2. FR-02: Web Audio API sine oscillator pitched dynamically based on angular velocity $\dot{\theta}(t)$ and natural frequency $\omega = \sqrt{g/l}$.
3. FR-03: Zero decorative emojis in all presets, labels, buttons, and tooltips.
4. FR-04: Strict No-Scroll Viewport Layout (`h-screen overflow-hidden flex flex-col`) with synchronized VisualLab CSS theme tokens.
5. FR-05: Real-time graphs for displacement $\alpha(t)$, angular velocity $\omega(t)$, and kinetic/potential energy.

---

## Non-Functional Requirements

- Performance: 60 FPS WebGL rendering without memory leaks on window resize.
- Zero Emojis: 100% text-based labels.
- Layout: 0px page scrollbar in full viewport.

---

## Success Criteria

- [ ] `npm run build` in `frontend/` completes cleanly with exit code 0.
- [ ] Route `/test-pendulum` and `/lab/simple-pendulum` render 3D Pendulum Lab with Web Audio synth and zero emojis.

---

## Out of Scope

- VR/AR headset spatial tracking (WebXR).

---

## Assumptions

- Uses existing `pendulum-engine.ts` physics integration logic or enhanced RK4 3D solver.
