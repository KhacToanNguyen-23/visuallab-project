# Brainstorm: Curriculum Spec Framework for VisualLab Physics Practicals

**Date:** 2026-09-10

## Ideas Explored
1. **Manual Lab Spec Authoring**: Writing every lab spec manually from scratch (Time-consuming, high overhead).
2. **Hardcoded Frontend Components**: Building separate custom React code for every single lab (High code duplication, hard to maintain).
3. **Curriculum Hierarchy + JSON-Driven Spec Engine (Selected Approach)**:
   - Structure curriculum by `Grade (Lớp) -> Topic (Chủ đề) -> Lab Lesson (Bài thực hành)`.
   - Create a standardized Lab Spec Document with JSON Schema contracts so developers can generate and implement remaining labs automatically.

## User's Direction
- The team has agreed on division of responsibilities:
  - User: Curriculum Spec Lead & Quality Control (QC/QA).
  - Teammate: Virtual Lab Engine Developer.
- AI generates the complete curriculum overview (Grades 10, 11, 12 GDPT 2018) along with standardized Lab Spec Schemas so the user doesn't have to manually write dozens of specs from scratch.

## Open Questions
- Specific SGK variant preference (Kết nối tri thức / Cánh diều / Chân trời sáng tạo) — the spec covers core experiments shared across all 3 SGK sets.

## Risks
- Developer implementation drifting from pedagogical goals if JSON schema constraints are ambiguous.
- Addressed by defining clear `successConditions` and `errorStateHandling` in every lab spec.
