# Phase 1: Sliding Friction 3D Direct Pointer Drag Controls

## Goal
Implement pointer drag interaction in `FrictionWorkbench3D.tsx`:
- Add `onPointerDown`, `onPointerMove`, `onPointerUp` listeners on the dynamometer handle ring.
- Dragging ring rightward increases pull force $F_{kéo}$.
- When $F_{kéo} \ge F_{ms0}$, wooden block moves smoothly with cursor position.
- Real-time soundEngine friction noise scaling with velocity and normal force $N$.

## Verification
- Run `npm run build` in `frontend/` to confirm 0 compilation errors.
