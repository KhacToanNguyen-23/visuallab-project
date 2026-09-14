# Plan: Nâng Cấp Phòng Thí Nghiệm Giao Thoa Ánh Sáng (Khe Y-âng) 3D Chuẩn GDPT 2018

**Date:** 2026-09-14  
**Feature:** `wave-interference-3d`  
**Spec:** `plans/wave-interference-3d/spec.md`  
**Mode:** `--auto`  
**Risk:** normal — 3D WebGL UI & physics optics engine upgrade, zero auth/schema risk

---

## 1. Executive Summary

Chuyển đổi toàn diện bài thực hành **Bài 12: Đo bước sóng ánh sáng bằng phương pháp giao thoa (Khe Y-âng)** (SGK Vật lý 11 GDPT 2018) tại `/lab/wave-interference` thành phòng thí nghiệm 3D Three.js PBR Studio tương tác cao theo chuẩn `visuallab-standards` (`PARAMETER_STUDIO` + `OPTICS_SLIT` + `OPTICS_SCREEN`). 

---

## 2. Architecture & Tech Stack

- **3D Graphics**: Three.js WebGL with PBR Materials, dynamic Laser Beam Cylinder, Optical Bench Rail with millimeter scale, 3 movable optical riders (`LASER_SOURCE_RGB`, `YOUNG_DOUBLE_SLIT`, `FRINGE_SCREEN`).
- **Optics Interference Engine**:
  - Exact wave physics: $i = \frac{\lambda D}{a}$, $x_k = k \cdot i$, $I(x) = I_0 \cos^2\left(\frac{\pi a x}{\lambda D}\right)$.
  - Dynamic Color Converter: Exact wavelength $\lambda \in [380, 780]\text{nm} \rightarrow \text{RGB}$ interpolation.
  - White Light Superposition Engine: Multi-spectrum dispersion synthesis with white central fringe ($k=0$) and continuous rainbow fringes ($k=1, 2, 3$).
- **Eyepiece Measuring Microscope HUD (Thị kính vi trắc)**:
  - 2D Canvas magnification overlay ($5\times / 10\times$).
  - Draggable & dial-steered crosshair with Vernier micrometer reading ($\pm 0.01\text{mm}$).
  - One-click record to data sheet ($x_1, x_6 \rightarrow \Delta x \rightarrow i$).
- **Data Recording & 3-Tier Auto-Grading**:
  - 5 measurement trials table with mean $\bar{i}, \bar{\lambda}$, error $\Delta\lambda$, relative error $\delta\lambda\%$.
  - 3-Tier score: 30% Operation + 40% Accuracy (error $\le 5\%$) + 30% Quiz.

---

## 3. Implementation Phases

- [x] **Phase 1**: Three.js 3D Optical Bench Scene (Optical rail, laser, slit holder, screen, laser beam, OrbitControls)
- [x] **Phase 2**: Optics Engine & White Light Synthesis ($\lambda, a, D$ physics calculation, monochromatic laser color, white light dispersion)
- [x] **Phase 3**: Eyepiece Loupe & Vernier Crosshair HUD (2D magnified eyepiece HUD, micrometer knob, crosshair coordinate tracker, Intensity graph $I(x)$)
- [x] **Phase 4**: 5-Step Experimental Workflow & Auto-Grading (Step-by-step guidance, 5-trial data table, auto-grading 3-tier, UI header & collapsible menu)

---

## Session Notes
<!-- Updated by cook automatically — do not edit manually -->

**Last active:** 2026-09-14 14:30  
**Phase in progress:** Complete (All 4 phases)  
**Status:** Completed and verified with 0 build errors.

### Decisions made this session
- Built full 3D PBR optical bench studio with dynamic ray cone from double slit to movable screen.
- Implemented dual mode: Laser monochromatic with continuous $\lambda \in [380, 780]\text{nm}$ and White light continuous dispersion synthesis.
- Built interactive 10x Eyepiece Measuring Microscope HUD with draggable crosshair, micrometer step dials, and real-time $I(x) = I_0 \cos^2(\pi a x / \lambda D)$ plot.
- Implemented 5-trial measurement table, statistical analysis ($\bar{i}, \bar{\lambda}, \delta\%$), and 3-Tier auto-grading (30% Operation + 40% Accuracy $\le 5\%$ + 30% Quiz).

### Next immediate action
- Ready for student and teacher practice on `http://localhost:5173/lab/wave-interference`.

---

## 4. Verification Plan

- Run `npm run build` with zero TypeScript warnings/errors.
- Verify 60 FPS smooth camera rotation and real-time fringe responsiveness.
- Verify exact physical values ($i = \lambda D / a$) matching theoretical calculations.
- Test White Light dispersion rendering and Eyepiece crosshair micrometer reading.
- Verify 3-tier grading calculation on submission.
