# Plan: 3D Three.js Sliding Friction Lab Upgrade (Bài 21 SGK T83)

Mode: --fast
Risk: normal — React Three.js WebGL simulation component upgrade for SlidingFrictionLab.tsx

## Summary
Upgrade Bài 21 (Đo Hệ Số Ma Sát Trượt) from a static 2D canvas to a high-end 3D Three.js WebGL interactive simulation with 3 contact surface materials (Wood, Mica, Rubber), 3D spring dynamometer, stackable weights, real-time 3D force vectors, and multi-surface friction sound synthesis.

## Phases
- **Phase 1**: `plans/3d-sliding-friction-lab/phase-01-3d-workbench-component.md` — Build `FrictionWorkbench3D.tsx` with Three.js scene, block textures, 3D weights, spring dynamometer, and 3D force vectors.
- **Phase 2**: `plans/3d-sliding-friction-lab/phase-02-lab-integration-audio-hud.md` — Integrate `FrictionWorkbench3D` into `SlidingFrictionLab.tsx` with surface switching controls, multi-surface audio synthesis, and real-time $F-t$ graph data recording.
