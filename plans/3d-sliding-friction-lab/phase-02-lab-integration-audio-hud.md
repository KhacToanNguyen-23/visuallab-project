# Phase 2: Lab Integration, Multi-surface Audio & Real-time HUD Data

## Goal
Update `SlidingFrictionLab.tsx`:
- Integrate `FrictionWorkbench3D` replacing old 2D canvas.
- Add surface material switch buttons (Mặt Gỗ, Mặt Mica, Mặt Cao Su).
- Implement multi-surface `soundEngine` physical audio (Gỗ-Gỗ sột soạt, Gỗ-Mica trơn êm, Gỗ-Cao su rít rít) scaling by normal force $N$ and velocity $v$.
- Connect real-time data recording for $F_{ms}$, $N$, and $\mu = F_{ms} / N$ in SGK GDPT 2018 table & graph.

## Verification
- Run `npm run build` in `frontend/` to confirm 0 compilation errors.
