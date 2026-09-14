# Brainstorm: 16-Lab Direct Drag & Touch Interactive Physics Engine

**Date:** 2026-09-12
**Slug:** 16-labs-direct-drag-touch

## Ideas Explored
1. **Auto-play Buttons Only (Dismissed)**: Preset animated playback on button clicks. Dismissed because it feels static, non-interactive, and detached from real-world lab manipulation.
2. **Direct Touch & Drag Physical Manipulation (Selected)**: Replace static start buttons with direct pointer drag/touch controls across all 16 SGK GDPT 2018 labs:
   - Mechanics: Drag dynamometer ring, drag/release steel balls, pull/release springs, drag glider cars.
   - Thermodynamics: Drag piston handles up/down, drag ice blocks into calorimeters.
   - Electromagnetism: Drag bar magnets through induction coils, drag switch handles, drag banana plug wires.
   - Waves & Optics: Drag water column reservoirs, drag laser angles, drag caliper measuring jaws.
   - Pendulum & Sandbox: Drag pendulum bob to initial angle $\theta_0$, drag modular sandbox components.

## User's Direction
The user requested applying **Direct Mouse/Touch Drag Control** to **all 16 labs**:
- Eliminates passive "button-only" playback.
- Physical objects respond directly to cursor/touch dragging with real-time vector, graph, and audio feedback.

## Open Questions
- Provide fallback button controls (e.g. "Auto Pull" / "Reset") alongside manual drag for ease of use during teacher demonstrations.

## Risks
- Smooth pointer event handling (`PointerEvents` / Three.js `Raycaster` drag controls) across mouse and mobile touch screens.
