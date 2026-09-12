# Plan: 3D Simple Pendulum Simulation Upgrade (/lab/simple-pendulum & /test-pendulum)

Mode: --fast
Risk: normal — single component upgrade in PhetPendulumLab.tsx with WebGL 3D rendering and Web Audio pitch synth

---

## Overview

Upgrade `PhetPendulumLab.tsx` to match the **Combo Phòng Lab** design standard:
1. **Three.js 3D Physics Rendering**: Metallic support stand, brass pendulum sphere, hanging cord, 3D protractor angle arc, and raycaster mouse dragging.
2. **Web Audio API Velocity Pitch Synthesizer**: Audio pitch modulated by angular velocity $\dot{\theta}(t)$.
3. **Strict No-Scroll Viewport Layout**: `h-screen overflow-hidden flex flex-col`.
4. **Zero Decorative Emojis**: Clean text-based gravity presets (`Trái Đất (9.81 m/s²)`, `Mặt Trăng (1.62 m/s²)`, `Sao Hỏa (3.71 m/s²)`, `Sao Mộc (24.79 m/s²)`).
5. **VisualLab CSS Theme Variables**: Full synchronization with `var(--bg-main)`, `var(--bg-panel)`, `var(--border-color)`.
6. **Pedagogy Tools**: Tab controls for Khám Phá, Bảng Dữ Liệu, Đồ Thị Real-time ($x, v, a$), and Screenshot Report Capture.

---

## Proposed Changes

### Frontend / Simulation Components

#### [MODIFY] [PhetPendulumLab.tsx](file:///d:/Project/FptProject/visuallab-project/frontend/src/components/simulation/PhetPendulumLab.tsx)
- Re-architect layout into strict `h-screen overflow-hidden flex flex-col`.
- Build Three.js 3D scene (metallic stand, 3D pendulum sphere, cord mesh, 3D angle arc, 3D scale ruler).
- Add raycaster pointer events for direct 3D mouse dragging of the pendulum bob to set initial angle $\alpha_0$.
- Integrate Web Audio API sine oscillator pitched dynamically based on angular velocity $\dot{\theta}(t)$.
- Remove all decorative emojis (`🌍`, `🌙`, etc.) and replace with clean text badges.
- Synchronize UI styling with `var(--bg-main)`, `var(--bg-panel)`, `var(--border-color)`, `var(--accent-primary)`.
- Support 4 tabs: Khám phá, Bảng dữ liệu, Đồ thị real-time, Chụp báo cáo.

---

## Verification Plan

### Automated Tests
- Run `npm run build` in `frontend/` to ensure 0 TypeScript / build errors.

### Manual Verification
- Navigate to `http://localhost:5173/test-pendulum` and `http://localhost:5173/lab/simple-pendulum`.
- Verify full screen viewport without scrollbars (`h-screen overflow-hidden`).
- Drag the 3D pendulum bob to set angle $\alpha_0$ and release to observe 60 FPS 3D oscillation.
- Enable audio and verify pitch shifts with angular velocity.
- Check zero emojis across all UI elements.
