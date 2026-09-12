# Plan: Phòng Thực Hành Ảo Đo Tốc Độ Vật Chuyển Động (Vật Lý 10 - Bài 6)

**Date:** 2026-09-12  
**Spec:** `plans/phys10-speed-measurement-lab/spec.md`  
**Mode:** hard  
**Status:** Completed  
**Risk:** normal — multi-file frontend simulation component with 2D Canvas physics, digital timer state machine, interactive worksheet, and 3-tier auto-grading.

---

## Architecture Overview

```
frontend/src/components/simulations/speed-measurement/
  ├── SpeedMeasurementLab.tsx       # Main Lab Shell (Tab navigation, layout, state bridge)
  ├── SpeedWorkbenchCanvas.tsx      # 2D Canvas Engine (Track, angle alpha, photogates E/F, rolling ball, cable visuals)
  ├── DigitalTimerPanel.tsx         # Digital Timer UI (0.001s resolution, Mode A<->B vs Mode A, trigger controls)
  ├── SpeedLabWorksheet.tsx         # Student Data Recording Worksheet & Post-lab Quiz
  └── speedLabEngine.ts             # Physics calculations, theoretical benchmarks, and 3-tier auto-grading
```

---

## Phase Breakdown

- [x] **Phase 1: 2D Canvas Workbench & Kinematic Physics Engine** (`phase-01-core-canvas-physics.md`)
  - Render inclined track (`INCLINED_TRACK`) with millimeter ruler and angle controller $\alpha \in [5^\circ, 30^\circ]$.
  - Draggable photogate sensors E and F (`PHOTOGATE_SENSOR`) with magnetic snapping onto track ruler.
  - Steel ball (`STEEL_BALL`) rolling mechanics at 60 FPS ($a = g \sin\alpha$), collision detection with sensor rays.

- [x] **Phase 2: Signal Cable Wiring & Digital Timer State Machine** (`phase-02-wiring-timer-dual-mode.md`)
  - Virtual cable connector points between photogates (E, F) and timer input jacks (A, B).
  - Digital timer component with real-time display ($0.001\text{s}$) and optical trigger listener.
  - Dual Mode support: **Mode 1 (Tốc độ trung bình)** ($A \leftrightarrow B$) & **Mode 2 (Tốc độ tức thời)** ($\text{Mode } A$).

- [x] **Phase 3: Interactive Worksheet, Auto-Grading & Routing** (`phase-03-worksheet-autograde-routing.md`)
  - 5-row manual measurement entry table for student observations.
  - Auto-calculation validation for $\bar{t}, \bar{v}, \Delta v$ and error threshold ($\le 5\%$).
  - 3-tier auto-grading engine: 30% Thao tác + 40% Độ chính xác + 30% Trắc nghiệm thu hoạch.
  - Register route `/lab/speed-measurement` in `frontend/src/main.tsx` with lazy loading & error boundary.

---

## Session Notes
<!-- Updated by cook automatically — do not edit manually -->

**Last active:** 2026-09-12 13:25  
**Phase in progress:** Completed all phases  
**Status:** All components implemented, tested with full Vite/TypeScript build, and verified.

### Decisions made this session
- Implemented high-performance 2D Canvas with 60 FPS requestAnimationFrame loop and proper cleanup on unmount.
- Conformed to `DRAGGABLE_WORKBENCH` standard from `visuallab-standards`.
- Integrated 3-tier auto-grading formula: 30% Operation + 40% Precision/Error + 30% Post-lab Quiz.
- Used zero-dependency inline SVGs to maintain minimal bundle weight and avoid unnecessary packages.
