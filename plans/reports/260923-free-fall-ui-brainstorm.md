# Brainstorm: Free Fall UI & Data Table Upgrade

**Date:** 2026-09-23

## Goal
Upgrade the Free Fall MVP to a realistic curriculum lab with real apparatus graphics and an auto-recording data table.

## Ideas Explored & Decisions
1. **Data Recording (Auto vs Manual)**
   - **Decision:** Auto-Record (Phương án 1).
   - **Reasoning:** Reduces friction. Whenever the ball passes Gate 2, `useFreeFallStore` adds the measurement array automatically. The React UI instantly renders the new row.

2. **Apparatus Graphics (SVG vs Canvas Primitives)**
   - **Decision:** Use high-fidelity SVG/Canvas shapes simulating real lab tools.
   - **Details:** 
     - *Steel Ball:* Draw a circle with a radial gradient to simulate metallic sheen.
     - *Photogate:* A U-shaped bracket graphic attached to a vertical pole.
     - *Stand & Ruler:* A static vertical background graphic with tick marks (milimetres) next to the fall path.

3. **Data Table Layout**
   - Place a responsive HTML/Tailwind table on the right-hand panel of `FreeFallLab.tsx`.
   - Columns: Lần thả (Trial), Quãng đường $s$ (m), Thời gian $t$ (s), Gia tốc $g$ ($m/s^2$).
   - A "Xóa dữ liệu" (Clear) button to reset the table.

## Risks
- Vertical alignment: The ruler graphic must exactly match the math coordinates ($y = 0$ to $y = 1.0$) mapped to 400 pixels so the visual $s$ matches the physical $s$.
