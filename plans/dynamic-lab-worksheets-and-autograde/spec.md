# Spec: Dynamic Lab Worksheets, Auto-Sync Telemetry & Multi-Formula Auto-Grading

**Date:** 2026-09-15
**Status:** Ready

---

## Problem Statement
Currently in EduLab, assignments across all 14 physics labs use a hardcoded Simple Pendulum prompt (`mass`, `length`, `angle`), do not sync experimental measurements recorded inside the lab workbench into the submission report, and the backend only executes a single pendulum formula verifier (`verifyPendulumPeriod`) to grade every lab submission. This causes major pedagogical inaccuracy and prevents students from submitting authentic SGK GDPT 2018 lab reports.

---

## User Stories

<!-- P1 = MVP (must ship), P2 = nice-to-have, P3 = future/out-of-scope -->

- **[P1]** As a **Teacher**, I want to assign homework for any specific physics lab with appropriate lab-specific parameter bounds (e.g. Distance $s \in [0.2m, 0.8m]$ for Speed Measurement, Drop Height $h \in [0.5m, 1.5m]$ for Free Fall) so that each student receives a realistic, anti-cheat personalized problem prompt.
  - Accepted when: Creating an assignment for a selected lab generates param bounds and instances tailored to that lab's physics equations.

- **[P1]** As a **Student**, I want my assignment worksheet modal to render the exact SGK GDPT 2018 data table schema for that lab (columns, units, trial rows, calculated averages, and uncertainty) with a 1-click **"⚡ Trích xuất số liệu từ bài làm"** button so that I don't have to manually re-type numbers from the workbench.
  - Accepted when: Clicking the button populates the worksheet table with trial runs captured from the workbench simulation session.

- **[P1]** As a **Student**, I want my submission to be graded by a lab-specific math verification algorithm in the backend and receive instant detailed feedback from Groq AI on both my calculation accuracy and my reasoning.
  - Accepted when: `MathVerificationEngine` routes to the appropriate formula (e.g. `verifySpeedMeasurement`, `verifyFreeFall`, `verifySlidingFriction`, etc.) and outputs a mathematical score $(0-10)$ combined with AI reasoning feedback $(70\% \text{ Math} + 30\% \text{ AI})$.

- **[P2]** As a **Student**, I want to be able to manually edit any cell in the synchronized data table to correct manual recording errors or practice calculating standard deviations.
  - Accepted when: All table cells remain editable inputs before submission.

---

## Functional Requirements

1. **FR-01 (Lab Worksheet Registry & Schemas):** Define standardized lab worksheet schemas in frontend (`frontend/src/utils/worksheetSchemas.ts`) for all core SGK GDPT 2018 labs (Bài 6 Đo tốc độ, Bài 14 Rơi tự do, Bài 21 Ma sát trượt, Bài 38 Hooke, Bài 7 Con lắc đơn, Bài 5 Cộng hưởng âm, etc.) with table headers, units, formula labels, and required calculated fields.
2. **FR-02 (Telemetry Bridge in Virtual Workbench):** Provide a telemetry store/hook (`useLabTelemetry` / simulation callback) so when students perform experimental runs (e.g. photogate sensor timer, spring stretch measurement), trials are logged into the active session.
3. **FR-03 (Auto-Sync Action):** In `AssignmentSubmissionModal`, clicking "⚡ Trích xuất số liệu từ bài làm" copies active telemetry trials into the worksheet data table.
4. **FR-04 (Multi-Formula Math Verification Engine):** Refactor backend `MathVerificationEngine.java` to support multiple lab types (`LAB_SPEED_MEASUREMENT`, `LAB_FREE_FALL`, `LAB_SLIDING_FRICTION`, `LAB_SPRING_HOOKE`, `LAB_SIMPLE_PENDULUM`, `LAB_SOUND_RESONANCE`, etc.).
5. **FR-05 (Dynamic Assignment Generation):** Update `AssignmentServiceImpl.java` to generate personalized student instances matching the target lab's parameter bounds rather than hardcoded pendulum variables.
6. **FR-06 (Groq AI Context Enrichment):** Pass lab title, lab type, empirical table data, and calculation steps to `GroqAIService` to generate pedagogically precise feedback and suggestions for improvement.

---

## Non-Functional Requirements

- **Performance:** Worksheet auto-sync and table population takes $< 50\text{ms}$. Math verification & AI grading completes within $< 3\text{s}$.
- **Accuracy:** Mathematical verification tolerance is configurable per lab (default $3\%-5\%$ tolerance to reflect instrument precision).
- **Usability:** Responsive, clean dark-mode UI adhering to EduLab design standards with rich visual indicators (badges, formulas, error delta $\Delta$).

---

## Success Criteria

- [ ] Teacher assignment creator assigns lab-specific parameters for any of the 14 SGK GDPT 2018 labs.
- [ ] Student worksheet renders custom table columns matching the assigned lab (e.g., $s, t_1, t_2, t_3, \bar{t}, v$ for Speed Measurement).
- [ ] "⚡ Trích xuất số liệu" instantly populates measured values from workbench simulation into the worksheet table.
- [ ] Backend calculates mathematical correctness according to the selected lab's physics formula and combines with AI reasoning score.

---

## Out of Scope

- Printing PDF certificates of lab completion (deferred to teacher export module).
- Real-time multiplayer collaborative worksheet editing.

---

## Assumptions

- Each simulation workbench emits trial records with standard keys (`trialIndex`, `measuredValues`, `calculatedValues`).
- Backend receives a structured JSON payload of submitted table rows and calculation summaries in `submittedAnswersJson`.
