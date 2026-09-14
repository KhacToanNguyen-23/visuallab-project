# Spec: Bài 12 - Thí Nghiệm Đo Bước Sóng Ánh Sáng Bằng Khe Y-âng (3D Optical Bench)

**Date:** 2026-09-14  
**Status:** Ready  
**Standard:** VisualLab GDPT 2018 (`PARAMETER_STUDIO` + `OPTICS_SLIT` + `OPTICS_SCREEN`)

---

## 1. Problem Statement

Học sinh THPT học bài Giao thoa ánh sáng (Bài 12 SGK Vật lý 11 GDPT 2018) thường gặp khó khăn khi hình dung đường truyền tia sáng trong không gian 3D, sự phụ thuộc của khoảng vân $i$ vào bước sóng $\lambda$, khoảng cách khe $a$, và khoảng cách màn $D$, cũng như sự khác biệt phức tạp giữa giao thoa đơn sắc và giao thoa ánh sáng trắng (tán sắc). Mô-đun này cung cấp phòng thí nghiệm 3D Three.js PBR Studio tương tác cao với kính hiển vi đo vi trắc (Vernier Eyepiece HUD) giúp đo đạc chính xác bước sóng $\lambda$ và tự động chấm điểm bài thực hành.

---

## 2. User Stories

### [P1] - Tính năng cốt lõi (MVP)
- **[P1]** As a student, I want to observe a realistic 3D optical bench with laser source, double slit slide, and screen, so that I understand the physical apparatus setup.
  - *Acceptance criteria*: 3D scene renders smoothly at $\ge 50$ FPS with OrbitControls camera, glowing laser beam, and movable optical components along the rail.
- **[P1]** As a student, I want to adjust wavelength $\lambda$ ($380 - 780\text{nm}$), slit separation $a$ ($0.15 - 1.00\text{mm}$), and screen distance $D$ ($0.5 - 2.5\text{m}$), so that I observe immediate changes in fringe spacing $i = \frac{\lambda D}{a}$.
  - *Acceptance criteria*: Real-time update of fringe pattern on the 3D screen texture and measurement HUD without lag ($< 16\text{ms}$).
- **[P1]** As a student, I want an Eyepiece Microscope HUD with a movable crosshair and vernier scale, so that I can accurately locate fringe positions $x_1$ and $x_6$ to calculate $\Delta x$ and $i$.
  - *Acceptance criteria*: Precision crosshair with digital micrometer reading ($0.01\text{mm}$ resolution) and auto-calculation of experimental $i$ and $\lambda$.
- **[P1]** As a student, I want to toggle between Monochromatic Laser and White Light (Ánh sáng trắng), so that I can observe the colorful rainbow interference pattern with white central fringe.
  - *Acceptance criteria*: White light mode renders continuous visible spectrum interference based on wave superposition physics.

### [P2] - Nâng cao & Phân tích chuyên sâu
- **[P2]** As a student, I want to view a real-time Light Intensity Graph $I(x) = I_0 \cos^2\left(\frac{\pi a x}{\lambda D}\right)$ synced with the fringe pattern, so that I connect physical observations to wave theory.
  - *Acceptance criteria*: Interactive 2D graph with peak markers at bright fringes and zero-points at dark fringes.
- **[P2]** As a student/teacher, I want an interactive 5-trial experimental data table and 3-Tier auto-grading evaluation (Operation 30%, Error $\le 5\%$ 40%, Quiz 30%), so that I can submit lab reports directly.
  - *Acceptance criteria*: Complete data recording sheet with automatic mean, standard deviation, relative error $\delta\lambda$, and auto-scoring.

---

## 3. Functional Requirements

- **FR-01**: Three.js 3D optical bench rail with millimeter markings, laser housing, double-slit holder, and movable projection screen.
- **FR-02**: Laser color dynamic wavelength converter converting $\lambda \in [380, 780]\text{nm}$ to accurate RGB/HEX values.
- **FR-03**: Double slit parameter adjustment: $a \in [0.15, 1.00]\text{mm}$ (step $0.05\text{mm}$), slit width $b \in [0.02, 0.08]\text{mm}$.
- **FR-04**: Screen distance adjustment: $D \in [0.50, 2.50]\text{m}$ (step $0.05\text{m}$).
- **FR-05**: White Light Spectrum Shader/Canvas engine rendering continuous dispersion fringes.
- **FR-06**: Eyepiece Loupe / Measuring Microscope HUD with draggable/knob-controlled crosshair and vernier micrometer scale.
- **FR-07**: Real-time intensity profile graph $I(x)$ with toggleable theoretical envelope.
- **FR-08**: 5-step experimental workflow table recording $(a, D, x_1, x_6, \Delta x, i_{\text{exp}}, \lambda_{\text{exp}}, \text{Error}\%)$.
- **FR-09**: Auto-grading system compliant with VisualLab standards: 30% Operation + 40% Accuracy ($\le 5\%$ error) + 30% Quiz.

---

## 4. Non-Functional Requirements

- **Performance**: 60 FPS rendering on standard browser with Three.js WebGL; parameter changes react in $< 16\text{ms}$.
- **Accuracy**: Calculations of fringe spacing $i = \frac{\lambda D}{a}$ mathematically exact with $< 0.01\%$ numerical error.
- **Clean Unmount**: Disposes all Three.js geometries, materials, textures, and requestAnimationFrame loops cleanly.
- **Responsive UI**: Sidebar and HUD adapt to 1080p, 720p, and mobile/tablet viewport sizes.

---

## 5. Success Criteria

- [ ] Interactive 3D scene renders optical bench with laser, double slit, and fringe screen.
- [ ] Changing $\lambda, a, D$ dynamically updates fringe width $i$ with mathematical accuracy.
- [ ] White light mode accurately displays rainbow dispersion fringes with white central fringe.
- [ ] Measuring microscope HUD allows measuring fringe spacing with micrometer crosshair.
- [ ] Auto-grading correctly grades student trials and validates error $\le 5\%$.
- [ ] Zero TypeScript errors and clean `npm run build`.

---

## 6. Out of Scope

- Thin-film interference (vân tròn Newton / màng mỏng xà phòng) — reserved for future advanced optics module.
- 3D diffraction through single slit (nhiễu xạ khe đơn Fraunhofer) as standalone lab.

---

## 7. Assumptions

- Browser supports WebGL 2.0 / Three.js standard rendering.
- User interacts via mouse/touch controls for rotating 3D scene and sliding optical components.
