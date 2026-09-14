# Brainstorm: 3D Three.js Sliding Friction Lab Upgrade (Bài 21 SGK T83)

**Date:** 2026-09-12
**Slug:** 3d-sliding-friction-lab

## Ideas Explored
1. **2D Canvas Polish (Dismissed)**: Enhancing existing 2D canvas with texture overlays. Dismissed because it lacks 360° spatial immersion, cannot flip 3D block surfaces (Wood, Mica, Rubber), and remains visually flat and unengaging for high school students.
2. **3D Three.js WebGL Interactive Physics Workbench (Selected)**: Build a full 3D WebGL physics lab simulation for Bài 21 SGK T83 matching the high standards of Bài 6 3D Speed Measurement Lab.

## User's Direction
The user selected **Approach A (3D Three.js WebGL Interactive Lab)**:
- Full 3D Three.js environment with 360° camera orbit controls.
- 3D Rectangular Wooden Block with 3 flip-switchable contact surfaces:
  1. Mặt Gỗ Nhẵn ($\mu \approx 0.25$)
  2. Mặt Nhựa Mica Trơn ($\mu \approx 0.15$)
  3. Mặt Cao Su Nhám ($\mu \approx 0.45$)
- Stackable 3D slotted chrome weights (50g, 100g, 200g) on top of the block.
- 3D Spring Dynamometer with transparent casing, internal coiled spring, and real-time pointer indicator.
- Dynamic 3D Force Vectors ($\vec{F}_{kéo}, \vec{F}_{ms}, \vec{N}, \vec{P}$) rendered at block center of mass.
- Multi-surface realistic Web Audio API sound synthesis with friction pitch & volume scaling by normal force $N$ and sliding velocity $v$.

## Open Questions
- Ensure smooth animation transition from Static Friction Peak ($F_{ms0}$) to Dynamic Sliding Friction ($F_{ms}$).

## Risks
- Maintain 60 FPS Three.js rendering performance with dynamic vector arrows and texture maps.
