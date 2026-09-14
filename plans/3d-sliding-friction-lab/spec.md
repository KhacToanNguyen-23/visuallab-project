# Functional Spec: 3D Three.js Sliding Friction Lab Upgrade (Bài 21 SGK T83)

**Status:** Approved
**Slug:** 3d-sliding-friction-lab

## User Stories & Scope

### P1: 3D WebGL Physics Workbench & Contact Surface Flipping
- As a student/teacher, I want a 3D Three.js interactive workbench for Bài 21 so I can inspect the wooden block from any angle (360° orbit controls).
- As a student, I want to switch the contact surface between 3 materials according to SGK T83:
  1. Mặt Gỗ Nhẵn ($\mu = 0.25$)
  2. Mặt Nhựa Mica ($\mu = 0.15$)
  3. Mặt Cao Su Nhám ($\mu = 0.45$)
- As a student, I want to add slotted weights (50g, 100g, 200g) on top of the wooden block to vary the normal force $N = (m_{\text{gỗ}} + m_{\text{cân}}) \cdot g$.

### P2: Real-time 3D Force Vectors & Dynamometer Extension
- As a user, I want to see dynamic 3D force vectors ($\vec{F}_{\text{kéo}}, \vec{F}_{\text{ms}}, \vec{N}, \vec{P}$) with arrow lengths scaling proportional to force magnitude.
- As a user, I want the spring dynamometer to extend and show real-time force readings (Static friction peak $F_{ms0}$ jumping to dynamic friction $F_{ms}$).
- As a user, I want a real-time $F - t$ graph plotting friction force during motion.

### P3: Multi-surface Physics Sound Engine
- As a user, I want realistic audio for sliding friction matching the active surface material (Wood-Wood, Wood-Mica, Wood-Rubber).
- Audio intensity and pitch must scale dynamically with normal force $N$ and sliding speed $v$.

## Acceptance & Verification Criteria
- 100% replacement of flat 2D canvas in `SlidingFrictionLab.tsx` with a high-end 3D WebGL Three.js interactive simulation.
- `npm run build` in `frontend` compiles with 0 TypeScript / Vite errors.
