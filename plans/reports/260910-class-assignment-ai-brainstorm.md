# Brainstorm: Class Management, Parameterized Assignment Generation, and Groq AI Hybrid Grading

**Date:** 2026-09-10

## Ideas Explored
- **Class Code Join Flow:** Unique short alphanumeric code generated for each class so students can easily join without manual invitations.
- **Assignment Generation Strategy:** Standardized template problem with randomized numerical parameters per student (e.g., pendulum length L, angle θ, mass m) to ensure fairness & equal difficulty while preventing direct copying.
- **Interactive Lab Integration (Option A):** Students execute experiments on PhET simulation components and fill in numerical answers + explanation steps in an assignment form.
- **Grading Mechanism (Hybrid Approach):**
  - Backend Spring Boot performs ground-truth calculation with a defined experimental tolerance (e.g. ±3-5%).
  - Groq AI (Llama 3 API) evaluates step-by-step reasoning, diagnoses physics misconceptions, and generates qualitative feedback.

## User's Direction
- Students join classes via **Class Code**.
- Free AI provider: **Groq API** (Llama 3 models for ultra-fast, low-latency execution).
- Assignment generation: **Parametric randomization** within the same core problem template.
- Submission: **Interactive Lab + Answer Form** (Option A).
- Grading: **Hybrid Model** (Backend math verification + Groq AI pedagogical feedback).

## Open Questions
- Exact Groq API key configuration method (environment variable `GROQ_API_KEY` vs DB setting).
- Resubmission policy for students (single final submission vs multiple attempt logs).

## Risks
- Groq API Rate limits if multiple students submit simultaneously (mitigated by prompt optimization & backend math pre-evaluation).
- Experimental measurement tolerance edge cases (mitigated by configuring tolerance per lab type).
