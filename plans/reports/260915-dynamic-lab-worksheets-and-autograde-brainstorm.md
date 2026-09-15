# Brainstorm: Dynamic Lab Worksheets, Auto-Sync Telemetry & Multi-Formula Auto-Grading

**Date:** 2026-09-15

## Challenge
Currently, all physics labs in EduLab share a single hardcoded assignment template and submission flow (Simple Pendulum parameters: `mass`, `length`, `angle` and formula: `verifyPendulumPeriod`). When students open any assignment (e.g., [LỚP 10] Bài 6: Đo Tốc Độ Vật Chuyển Động Thẳng), the assignment prompt displays irrelevant pendulum parameters instead of lab-specific values ($s, t, v$), does not automatically sync experimental measurement tables from the virtual workbench, and backend auto-grading only computes pendulum formulas for all submissions.

## Ideas Explored
1. **Single generic table with key-value pairs:** Students type generic parameter names and values. (Dismissed: Not aligned with SGK GDPT 2018 standard lab report templates).
2. **Dynamic SGK Worksheet Templates + Workbench Auto-Sync (Selected):**
   - Each physics lab has a dedicated report schema matching SGK GDPT 2018 (columns, units, trial rows, calculated averages, and uncertainty).
   - "⚡ Trích xuất số liệu từ bài làm" (Auto-sync) button automatically extracts empirical trial runs from the active simulation state into the worksheet table.
   - Students can manually edit, adjust, or fill in values.
3. **Multi-Formula Math Verification Engine in Spring Boot:**
   - Instead of only `verifyPendulumPeriod`, create modular verifiers for all SGK labs (`verifySpeedMeasurement`, `verifyFreeFall`, `verifySlidingFriction`, `verifyHookeLaw`, `verifySoundResonance`, etc.).
   - Compute math accuracy score ($0-10$) based on lab-specific tolerance and empirical formulas.
4. **Hybrid Scoring Engine (70% Math Engine + 30% Groq AI Reasoning):**
   - Combines deterministic numerical verification of student trial data with Groq Llama 3 pedagogical assessment on the student's written analysis and error explanations.

## User's Direction
- Dedicated lab report templates according to SGK GDPT 2018 for each simulation.
- Include a 1-click "Tự động trích xuất số liệu từ thí nghiệm vừa làm" (Auto-sync) button.
- Teacher assignments automatically randomize parameter bounds specific to that selected lab (e.g. $s \in [0.2m, 0.8m]$ for speed measurement).
- Hybrid grading evaluating both experimental calculation accuracy and AI pedagogical reasoning.

## Open Questions for Planning ($bb-plan)
1. How should simulation state be stored in frontend context so that any active lab workbench exposes standard telemetry data (`trials: [{ ... }]`) to the worksheet drawer?
2. How to map existing 14 SGK GDPT 2018 labs to their corresponding math verification formulas in backend `MathVerificationEngine`?

## Risks
1. **Data format mismatch between different simulations:** Each simulation engine (2D Canvas, 3D Three.js, PhET) must publish trial data in a normalized telemetry interface.
2. **Floating-point rounding differences:** Math verification engine must enforce reasonable tolerance percentages ($3-5\%$) to accommodate measurement instrument uncertainty (ruler resolution, photogate timer precision).
