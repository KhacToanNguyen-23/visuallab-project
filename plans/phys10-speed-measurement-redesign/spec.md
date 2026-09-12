# Spec: Tối Ưu UX/UI HUD Dock & Wizard Worksheet (Vật Lý 10 - Bài 6)

**Date:** 2026-09-12  
**Status:** Ready  
**Module Standard:** `DRAGGABLE_WORKBENCH` (Unified HUD Dock + 3-Step Wizard)  
**Curriculum Mapping:** SGK Vật Lý 10 GDPT 2018 - Chương II: Động Học - Bài 6 (Trang 28)

---

## Problem Statement
Cải tiến trải nghiệm người dùng của module thực hành ảo đo tốc độ: hợp nhất bảng điều khiển và đồng hồ số trực tiếp vào khung Canvas (HUD Floating Dock) để người học thao tác không cần cuộn trang, đồng thời chuyển đổi bảng báo cáo thành giao diện Wizard 3 bước kèm công thức trực quan, dễ hiểu.

---

## User Stories

<!-- P1 = MVP (must ship), P2 = nice-to-have, P3 = future/out-of-scope -->

- **[P1]** As a student, I want a unified HUD control dock pinned directly at the bottom of the workbench canvas showing the big green LCD timer, Start/Reset buttons, and quick angle/gate sliders so that I can see the ball rolling and trigger the controls in a single no-scroll viewport.
  Accepted when: The canvas and control dock fit comfortably in the main viewport, and clicking "Thả Bi" or "Đặt Lại" triggers instantly without scrolling.

- **[P1]** As a student, I want a 3-step Wizard report worksheet (**Step 1: Thu thập số liệu**, **Step 2: Tính toán & Sai số**, **Step 3: Trắc nghiệm & Chấm điểm**) with progress tabs so that I can easily complete the experiment step-by-step.
  Accepted when: The worksheet is organized into 3 navigable steps with progress indicators and validation before advancing.

- **[P1]** As a student, I want a "Lấy số từ đồng hồ (Auto-fill)" button in Step 1 so that I can easily transfer the latest measured $\Delta t$ into the current measurement row while still having the freedom to edit manually.
  Accepted when: Clicking the fill button populates the next empty trial row with the latest timer reading.

- **[P1]** As a student, I want explicit math formula cards in Step 2 ($\bar{t} = \frac{t_1+t_2+t_3}{3}$, $\bar{v} = \frac{s}{\bar{t}}$, $\Delta v = \dots$) with inline hints so that I understand exactly what formula to apply for calculation.
  Accepted when: Step 2 displays clear visual formula boxes above the calculation inputs.

- **[P1]** As a student, I want Step 3 to evaluate my submission using the standard 3-tier auto-grading formula (30% Thao tác + 40% Sai số + 30% Trắc nghiệm) and provide detailed feedback.
  Accepted when: Clicking "Nộp Báo Cáo" renders score breakdown out of 10.0 with clear guidance.

---

## Functional Requirements

1. **FR-01 (Unified Canvas HUD Dock):**
   - Position a sleek, glassmorphic HUD panel below/inside the canvas containing:
     - LCD Digital Stopwatch ($0.001\text{s}$) with live Counting & Sensor status LEDs.
     - "Thả Bi (Start)" and "Đặt Lại (Reset)" primary buttons.
     - Quick angle $\alpha$ and Gate position compact slider controls.
     - Signal cable toggle badges (Gate E $\rightarrow$ A, Gate F $\rightarrow$ B).

2. **FR-02 (3-Step Wizard Worksheet Component):**
   - **Step 1 (Thu thập số liệu):**
     - 3-5 trial measurement rows with visual completion status badge.
     - "Ghi nhận vào bảng" button to transfer current timer reading to the active trial row.
   - **Step 2 (Xử lý số liệu & Tính sai số):**
     - Formula breakdown card displaying $\bar{t} = \frac{\sum t_i}{N}$ and $\bar{v} = \frac{s}{\bar{t}}$.
     - Calculation inputs for $\bar{t}$, $\bar{v}$, $\Delta v$ with auto-check helper.
   - **Step 3 (Trắc nghiệm thu hoạch & Chấm điểm):**
     - 3 multiple-choice questions.
     - Final submission button triggering 30/40/30 auto-grading engine with pass/fail badge.

3. **FR-03 (No-Scroll Viewport Layout):**
   - 2-column desktop layout ($7 \times 5$ or $6 \times 6$ grid) where left column contains the full workbench + HUD dock, and right column houses the interactive Wizard card.

---

## Non-Functional Requirements

- **Responsive Viewport:** Zero required scrolling on screens $\ge 1280 \times 800\text{px}$.
- **Design Harmony:** Conforms to VisualLab Dark Theme tokens (`var(--bg-main)`, `var(--bg-panel)`, `var(--accent-primary)`, `var(--border-color)`).
- **TypeScript Strictness:** 100% type safety, zero build warnings, zero unnecessary external dependencies.

---

## Success Criteria

- [ ] Canvas workbench and controls fit in a unified view without vertical page scrolling.
- [ ] Worksheet is broken into 3 clear Wizard steps with breadcrumb step pills.
- [ ] Auto-fill button captures current timer reading into active trial row.
- [ ] Formula guides are clearly visible in Step 2.
- [ ] Auto-grading produces accurate 0-10 score with 3-tier breakdown.
