# Implementation Plan: Redesign Bài Thực Hành Đo Gia Tốc Rơi Tự Do (SGK Vật Lý 10)

Mode: --fast
Risk: normal — UI & Physics Simulation engine refactor for SRSWorkflowPage.tsx with zero database schema changes.
Spec: plans/free-fall-lab/spec.md

---

## Overview
Redesign `SRSWorkflowPage.tsx` (`/srs-lab`) into a clean, intuitive 2D PhET-style Interactive Lab according to Lesson 14 (Page 57 SGK Physics 10) & `DacTa.md` specifications. Fix non-physical acceleration value ($81.691 \text{ m/s}^2 \to 9.807 \pm 0.15 \text{ m/s}^2$), remove all decorative emojis and sci-fi banners, implement precision drag/slider adjustment of photogate height $h$, real-time 60 FPS animation, digital timer readout, experimental measurement table ($N = 1..5$), and PDF/print report generation.

---

## Phase 1: Engine Physics Math & State Model (`SRSWorkflowPage.tsx`)
- [MODIFY] `frontend/src/pages/SRSWorkflowPage.tsx`
  - Fix free-fall physics equation:
    $$t = \sqrt{\frac{2h}{g_{0}}} \quad \text{with } g_{0} = 9.807 \text{ m/s}^2$$
  - Introduce realistic random measurement error ($\pm 0.5 - 1.5\%$) to emulate physical MC-964 digital timer variance.
  - Calculate experimental free-fall acceleration $g = \frac{2h}{t^2}$, yielding accurate results around $9.81 \text{ m/s}^2$.

---

## Phase 2: Clean Academic 2D Interactive Canvas & UI Controls (`SRSWorkflowPage.tsx`)
- [MODIFY] `frontend/src/pages/SRSWorkflowPage.tsx`
  - Replace 3D WebGL view with clean 2D Interactive Physics Stand:
    - Vertical stand `VERTICAL_STAND` with millimeter scale ruler.
    - Electromagnet `ELECTROMAGNET` holding steel ball `STEEL_BALL` at top.
    - Photogate sensor `PHOTOGATE_SENSOR` with drag/slider height control ($0.2\text{m} \le h \le 0.8\text{m}$).
    - Digital timer `DIGITAL_TIMER` displaying $t_A, t_B, \Delta t$.
  - Remove all decorative emojis (`🍎`, `🏀`, `🎯`, `🪶`, `⚡`) and sci-fi banners.
  - Apply VisualLab CSS Theme Variables (`var(--bg-panel)`, `var(--bg-main)`, `var(--border-color)`, `var(--text-main)`).
  - Implement 5-step guided workflow:
    1. Chọn độ cao $h$
    2. Gắn bi thép
    3. Thả rơi
    4. Đọc đồng hồ
    5. Ghi bảng số liệu & Xuất báo cáo

---

## Phase 3: Build Verification & Testing
- Verification:
  - Run `npm run build` in `frontend/` to confirm zero compilation or type errors.
