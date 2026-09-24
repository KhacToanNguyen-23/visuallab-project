# Phase 1: Fix Physics & Falling Animation

## Objective
Correct the physics calculation to match $g = \frac{2s}{t^2}$ and fix the falling animation.

## Tasks
1. **Lock Gate 1:** Fix Gate 1 at $y = 0.05$ (right below the drop point so $v \approx 0$). Disable its DragListener in `FreeFallScene`.
2. **Fix Drop Animation:** In `FreeFallScene.ts`, do not set `isDropping = false` when passing Gate 2. Stop the simulation only when $y > 1.2m$ (ball falls off the screen).
3. **Data Recording:** Only call `addMeasurement` when Gate 2 is triggered, not when the ball stops.
