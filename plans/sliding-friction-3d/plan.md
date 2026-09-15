# Implementation Plan: Bài 21 (SGK T83) - Đo Hệ Số Ma Sát Trượt (3D WebGL)

**Spec Reference:** `plans/sliding-friction-3d/spec.md`  
**Mode:** Fast  
**Risk:** normal — Component upgrade within `SlidingFrictionLab.tsx`, no backend schema changes.

---

## Proposed Changes

### Component: `SlidingFrictionLab.tsx`

#### [MODIFY] [SlidingFrictionLab.tsx](file:///d:/6_OJT/EduLab/frontend/src/components/simulations/SlidingFrictionLab.tsx)
1. **Three.js 3D Physics Scene & Studio Lighting**:
   - Initialize WebGLRenderer (ACESFilmicToneMapping, PCFSoftShadowMap), PerspectiveCamera, OrbitControls ($360^\circ$ inspection).
   - Laboratory workbench with interchangeable surface planes:
     - 🌲 Gỗ tự nhiên ($\mu = 0.25$)
     - 🪟 Kính mờ phẳng ($\mu = 0.15$)
     - 🛡️ Hợp kim nhôm ($\mu = 0.35$)
     - ⬛ Cao su / Nhám ($\mu = 0.60$)
2. **Realistic 3D Apparatus & Materials**:
   - 3D Wooden block with realistic PBR wood grain ($m_0 = 0.2\text{kg}$).
   - Stackable weights (+50g, +100g, +200g) placed dynamically on top of the block.
   - 3D Spring Dynamometer (lực kế lò xo) with mechanical casing, extended coiled spring, and live needle showing exact pulling force.
   - Nylon pulling string connecting dynamometer hook to the wooden block.
3. **3D Real-Time Dynamic Force Vectors**:
   - $\vec{P}$ (Gravity, downwards, orange/red arrow, scaled by $(m_0 + m_{\text{added}})g$).
   - $\vec{N}$ (Normal force, upwards, cyan arrow).
   - $\vec{F}_{\text{kéo}}$ (Pulling force, forward, purple arrow).
   - $\vec{F}_{\text{ms}}$ (Friction force, backwards, amber arrow).
   - Vector toggle button in HUD.
4. **Interactive Controls & Data Collection**:
   - Steady sliding pull animation with smooth 60 FPS update.
   - Data table recording trials: $(N, F_{\text{ms}}, \mu)$ and live average $\mu$ calculation.
   - Linear regression graph $(F_{\text{ms}} - N)$ using `DataTableAndGraph`.
   - Clean component unmount resource cleanup.

---

## Verification Plan
1. **Automated Build**: Run `npm run build` in `frontend/` to ensure zero compilation or type errors.
2. **Visual Verification**: Navigate to `/lab/sliding-friction` on `http://localhost:5173/lab/sliding-friction`, test:
   - $360^\circ$ camera rotation with OrbitControls.
   - Adding/removing weights (+50g to +400g) and verifying force vector lengths change proportionally.
   - Switching surface materials (Gỗ, Kính, Nhôm, Cao su) and checking calculated $\mu$.
   - Pulling the block and verifying dynamometer needle + data table recording.
