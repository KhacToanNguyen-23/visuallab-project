# Brainstorm: Bài 21 (SGK T83) - Đo Hệ Số Ma Sát Trượt (3D Studio WebGL)

**Date:** 2026-09-14

## Ideas Explored
- **Option A: 2D Interactive Physics Workbench**: 2D Canvas with force vectors, microscopic asperity view, material surfaces, 60 FPS smooth rendering.
- **Option B: 3D Studio WebGL (Selected)**: 3D Three.js laboratory with PBR wooden block, 3D spring dynamometer (lực kế lò xo 3D), weights stacking, interchangeable surfaces (Wood, Glass, Aluminum, Rubber), 3D dynamic force vectors, and $360^\circ$ OrbitControls camera.
- **Option C: Hybrid Dual-View**: Split-screen 2D mechanics canvas + 3D miniature widget.

## User's Direction
- The user selected **Option B (3D Studio WebGL)** to achieve high realism, beautiful 3D physics apparatus, and clear visualization of sliding motion and friction forces.

## Key Features & Visual Standards (VisualLab Standards)
1. **3D Interactive Physics Apparatus**:
   - Laboratory workbench table with interchangeable test surfaces (Gỗ, Kính, Nhôm, Cao su).
   - High-precision 3D wooden block with realistic PBR wood grain.
   - Stackable slotted weights ($50\text{g}, 100\text{g}, 200\text{g}$).
   - 3D Spring Dynamometer with physical spring extension and clear Newton scale markings.
   - 3D Vector arrows for Normal Force $\vec{N}$, Gravity $\vec{P}$, Pulling Force $\vec{F}_{\text{kéo}}$, and Sliding Friction $\vec{F}_{\text{ms}}$.
2. **Physics Simulation**:
   - Friction model: Static friction threshold $F_{\text{ms, max}} = \mu_s N$ before transition to kinetic friction $F_{\text{ms}} = \mu_k N$.
   - Real-time data table recording $(N, F_{\text{ms}}, \mu)$ and $F_{\text{ms}} - N$ linear regression graph.
3. **Pedagogy & UI**:
   - HUD control panel with pull trigger, reset, surface selector, weight modifier, and automated average $\mu$ calculation.

## Open Questions
- None. Requirements are clear and aligned with SGK GDPT 2018 Vật lý 10.

## Risks
- OrbitControls interfering with weight drag-and-drop: solved by dedicated HUD slider/stepper or raycasting drag plane.
