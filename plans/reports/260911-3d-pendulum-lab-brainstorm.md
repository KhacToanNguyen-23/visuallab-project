# Brainstorm: 3D Pendulum Lab Combo Upgrade (/test-pendulum & /lab/simple-pendulum)

**Date:** 2026-09-11

## Ideas Explored
1. **SceneryStack 2D Pendulum**: Legacy 2D canvas pendulum with simple vector overlays.
2. **Three.js 3D Interactive Pendulum + Web Audio Pitch Synth**: Full 3D metallic stand, brass pendulum bob, arc angle scale, mouse drag interaction, Web Audio velocity swoosh/pitch, no-scroll layout, zero emojis, and VisualLab CSS theme tokens.

## User's Direction
The user confirmed applying the established **Combo Phòng Lab**: Three.js 3D rendering, Tone.js / Web Audio velocity pitch synthesis, zero emojis, no-scroll viewport layout (`h-screen overflow-hidden`), and VisualLab CSS theme variable styling.

## Open Questions
None. The design parameters, physics engine equations ($T = 2\pi\sqrt{l/g}$, energy conservation $W = W_d + W_t$), and UI layout are fully aligned.

## Risks
1. 3D Raycaster Dragging performance: Needs clean plane projection to ensure smooth angle dragging.
