# Phase 4: Teacher Assignment Generation & Groq AI Reasoning Feedback

**Story:** [P1] Dynamic Parameter Assignment & AI Feedback

## Objectives
1. Refactor `AssignmentServiceImpl.java`:
   - Support arbitrary parameter keys inside `paramBoundsJson` (e.g. `{ "distanceMin": 0.3, "distanceMax": 0.8, "angleMin": 10, "angleMax": 20 }` for speed measurement, `{ "heightMin": 0.5, "heightMax": 1.5 }` for free fall).
   - Dynamically iterate over keys in `paramBoundsJson` and generate pseudorandom student values with deterministic seed `studentId.hashCode()`.
2. Refactor `SubmissionServiceImpl.java` & `GroqAIServiceImpl.java`:
   - Pass lab title, lab type, empirical table data, target formulas, and student explanation to Groq AI prompt.
   - Enforce JSON response format: `{ "aiReasoningScore": 8.5, "strengths": "...", "improvements": "...", "physicsConceptFeedback": "..." }`.
   - Calculate final total score: $70\% \text{ Math} + 30\% \text{ AI}$.
