# Spec: Phòng Thực Hành Ảo Đo Tốc Độ Vật Chuyển Động (Vật Lý 10 - Bài 6)

**Date:** 2026-09-12  
**Status:** Ready  
**Module Standard:** `DRAGGABLE_WORKBENCH` (HTML5 Canvas 2D)  
**Curriculum Mapping:** SGK Vật Lý 10 GDPT 2018 - Chương II: Động Học - Bài 6 (Trang 28)

---

## Problem Statement
Cung cấp môi trường thí nghiệm ảo trực quan chuẩn SGK Vật lý 10 GDPT 2018 giúp học sinh thao tác lắp ráp máng nghiêng, cổng quang điện và đồng hồ đo hiện số để đo tốc độ trung bình và tốc độ tức thời của viên bi, đồng thời tự ghi nhận số liệu và đánh giá sai số qua hệ thống chấm điểm tự động chuẩn 3 thành phần.

---

## User Stories

<!-- P1 = MVP (must ship), P2 = nice-to-have, P3 = future/out-of-scope -->

- **[P1]** As a student, I want to drag and position the inclined track (`INCLINED_TRACK`), 2 photogate sensors (`PHOTOGATE_SENSOR`), digital timer (`DIGITAL_TIMER`), and steel ball (`STEEL_BALL`) on a 2D interactive workbench so that I can set up a realistic physics apparatus.
  Accepted when: The components can be arranged on the canvas, snap to valid positions, and allow adjusting the angle of inclination $\alpha$ ($0^\circ - 30^\circ$) and photogate positions $s_E, s_F$.

- **[P1]** As a student, I want to connect signal cables from photogates E and F to the digital timer inputs (Mode $A \leftrightarrow B$ and Mode $A$) so that the timer receives trigger pulses when the ball passes through the gates.
  Accepted when: Connecting cables updates `isWiringCorrect` and enables timer counting when releasing the ball.

- **[P1]** As a student, I want to switch between two experimental tabs: **"Đo Tốc Độ Trung Bình"** ($v_{tb} = s / \Delta t$) and **"Đo Tốc Độ Tức Thời"** ($v = d / \Delta t_E$) so that I can practice both standard SGK experiment setups.
  Accepted when: Switching tabs switches the timer operational mode and updates theoretical formulas and worksheet structure.

- **[P1]** As a student, I want to release the steel ball and observe its 60 FPS rolling motion down the track while the digital timer captures time $\Delta t$ to $0.001\text{s}$ with realistic physical jitter ($\pm 0.002\text{s}$).
  Accepted when: The ball rolls smoothly following $a = g \cdot \sin\alpha$, triggers optical sensors, and displays measured time on the digital timer panel.

- **[P1]** As a student, I want to read the digital timer display, manually input 3 to 5 trials into the interactive worksheet, compute $\bar{v}$ and uncertainty $\Delta v$, and answer 3 post-lab comprehension questions for automatic grading.
  Accepted when: The auto-grading algorithm computes:
  $$\text{Total Score} = \text{Operation (30\%)} + \text{Accuracy (40\%)} + \text{Quiz (30\%)}$$
  and outputs detailed feedback with score breakdown.

- **[P2]** As a student, I want visual hints and cable snap helpers so that I can easily recognize proper port connections without getting stuck.
  Accepted when: Hovering near a valid socket highlights connector points with cyan glow.

- **[P3]** Real-time kinematic velocity-time $v(t)$ and position-time $s(t)$ graph plotting widget.

---

## Functional Requirements

1. **FR-01 (Component Palette & Tool IDs):**
   - Provide standard components in toolbox: `INCLINED_TRACK`, `PHOTOGATE_SENSOR` (2 units), `DIGITAL_TIMER`, `STEEL_BALL`, `SIGNAL_CABLE`.
   - Tool IDs and metadata adhere to `visuallab-standards`.

2. **FR-02 (2D Canvas Workbench Engine):**
   - Render 60 FPS animation loop with `requestAnimationFrame` and clean unmount cancellation.
   - Support track inclination adjustment $\alpha \in [5^\circ, 30^\circ]$.
   - Draggable photogate sensors along the track ruler with millimeter-level scale coordinates ($s_E, s_F \in [0, 100]\text{cm}$).

3. **FR-03 (Wiring & Circuit State):**
   - Signal cable connections from Photogate E $\rightarrow$ Port A, Photogate F $\rightarrow$ Port B.
   - Validation flag `isCorrectAssembly` checked before ball release.

4. **FR-04 (Kinematics Physics Solver):**
   - Ball acceleration: $a = g \sin\alpha$ (where $g = 9.81\text{m/s}^2$).
   - In Mode 1 (Average Speed):
     - Time interval between gate E and gate F: $\Delta t = \sqrt{\frac{2 s_F}{a}} - \sqrt{\frac{2 s_E}{a}} + \epsilon_{\text{jitter}}$.
     - Average speed: $v_{tb} = \frac{|s_F - s_E|}{\Delta t}$.
   - In Mode 2 (Instantaneous Speed):
     - Time gate E is blocked by ball diameter $d = 0.02\text{m}$: $\Delta t_E = \frac{d}{\sqrt{2 a s_E}} + \epsilon_{\text{jitter}}$.
     - Instantaneous speed: $v = \frac{d}{\Delta t_E}$.

5. **FR-05 (Manual Input Worksheet & Auto-Grading):**
   - 5-row measurement table for $s$ (or $d$) and $t$ readings.
   - Calculation fields for average time $\bar{t}$, average speed $\bar{v}$, and absolute uncertainty $\Delta v$.
   - Auto-grading criteria:
     - **30% Thao tác:** Correct wiring, valid sensor placement ($s \ge 20\text{cm}$), $\ge 3$ recorded trials.
     - **40% Độ chính xác & Sai số:** Evaluated using $\text{Error} = \frac{|v_{\text{student}} - v_{\text{theo}}|}{v_{\text{theo}}} \times 100\%$. Full score if $\text{Error} \le 5\%$, scaled linearly up to $20\%$.
     - **30% Báo cáo trắc nghiệm:** 3 multiple choice questions evaluating understanding of systematic vs. random errors and speed formulas.

---

## Non-Functional Requirements

- **Performance:** Rendering frame rate must maintain stable $\ge 55$ FPS on modern browsers; no memory leaks during repeated ball releases.
- **Responsiveness:** Full layout adapts cleanly to desktop and tablet viewports ($W \ge 1024\text{px}$).
- **State Cleanup:** Strict cleanup of animation frames, timer intervals, and event listeners on component unmount.
- **Architectural Conformance:** Follows EduLab theme variables (`var(--bg-main)`, `var(--bg-panel)`, `var(--accent-primary)`, `var(--border-color)`).

---

## Success Criteria

- [ ] Interactive 2D Canvas renders track, 2 photogates, timer, and ball rolling animation at 60 FPS.
- [ ] Both Mode 1 (Tốc độ trung bình) and Mode 2 (Tốc độ tức thời) operational with distinct formulas and timer behavior.
- [ ] Digital timer accurately displays $\Delta t$ to 3 decimal places ($0.001\text{s}$) with realistic measurement jitter.
- [ ] Worksheet allows manual entry of $\ge 3$ trials and correctly grades students based on the 30-40-30 scoring rubric.
- [ ] 3 post-lab multiple-choice quiz questions included with automated validation.

---

## Out of Scope

- 3D WebGL / Three.js perspective (handled by 2D Draggable Workbench as per standard).
- Complex air drag friction dynamics (negligible for steel ball on low-friction inclined track at school scale).

---

## Assumptions

- Steel ball has fixed calibrated diameter $d = 2.00\text{cm} = 0.020\text{m}$.
- Standard gravitational acceleration $g = 9.81\text{m/s}^2$ at school lab standard conditions.

---

## [NEEDS CLARIFICATION]

*(No unresolved blocking items)*
