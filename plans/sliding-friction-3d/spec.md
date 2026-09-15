# Spec: Bài 21 (SGK T83) - Đo Hệ Số Ma Sát Trượt (3D WebGL Virtual Lab)

## Context & Problem Statement
The existing `SlidingFrictionLab.tsx` is a simplistic 2D canvas with flat rectangles and lacks clear visual cues for friction forces, surface textures, and physical motion. To meet VisualLab standards and GDPT 2018 curriculum requirements, this module will be upgraded to an interactive 3D WebGL physics simulation using Three.js.

---

## User Stories

### P1: 3D Scene & Physical Apparatus (Must Have)
- **As a student/teacher**, I want to view a realistic 3D laboratory bench with a wooden block, stackable slotted weights, and a spring dynamometer so that the experiment looks authentic to real lab equipment.
- **Acceptance Criteria**:
  - 3D Wooden block with realistic PBR texture and mass $m_0 = 0.2\text{kg}$ (200g).
  - Stackable weight discs (+50g, +100g, +200g) that visually sit on top of the wooden block.
  - 3D Spring Dynamometer (lực kế lò xo) with visible spring extension and readable Newton needle indicator.
  - 3D Table surface with interchangeable textures: Gỗ ($\mu=0.25$), Kính ($\mu=0.15$), Nhôm ($\mu=0.35$), Cao su/Nhám ($\mu=0.60$).
  - OrbitControls for $360^\circ$ inspection, pan, and zoom.

### P1: Dynamic 3D Force Vectors (Must Have)
- **As a student**, I want to see dynamic 3D force vector arrows attached to the center of mass of the block so that I understand all forces in equilibrium during steady sliding motion.
- **Acceptance Criteria**:
  - Vector $\vec{P}$ (Gravity, downwards, length proportional to $(m_0 + m_{\text{added}})g$).
  - Vector $\vec{N}$ (Normal force, upwards, equal in magnitude to $P$).
  - Vector $\vec{F}_{\text{kéo}}$ (Pulling force, forward, equal to dynamometer force).
  - Vector $\vec{F}_{\text{ms}}$ (Sliding friction force, backwards, equal to $\mu N$).
  - Vectors dynamically update their length in real-time.

### P2: Motion & Measurements Table (Should Have)
- **As a student**, I want to trigger the pull animation, observe steady sliding motion, and record data points into the measurement table.
- **Acceptance Criteria**:
  - Smooth 60 FPS animation of block sliding across the table surface.
  - Dynamometer accurately measures $F_{\text{ms}} = \mu \times N$.
  - "Ghi Số Liệu" records $(N, F_{\text{ms}}, \mu)$ and automatically computes average $\mu$.
  - Data table and linear regression graph $(F_{\text{ms}} \text{ vs } N)$ embedded in the right sidebar.

---

## Non-Functional Requirements
- **Performance**: 60 FPS rendering on WebGL with shadow map optimizations.
- **VisualLab Standards**: Dark theme UI, clear typography, responsive layout, proper component unmount cleanup (`renderer.dispose()`, animation frame cancellation).
- **Route Compatibility**: Retains route `/lab/sliding-friction`.

---

## Technical Design Overview
- **Technology**: Three.js, OrbitControls, React 19, TypeScript, Lucide icons / custom SVG badges.
- **File**: `frontend/src/components/simulations/SlidingFrictionLab.tsx`.
