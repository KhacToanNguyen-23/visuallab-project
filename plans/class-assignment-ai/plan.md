# Implementation Plan: Class Management, Parametric Lab Assignments & Groq AI Auto-Grading

**Date:** 2026-09-10  
**Status:** Completed  
**Mode:** --hard  
**Risk:** high-risk — Adds database entities (Class, Enrollment, Assignment, StudentInstance, Submission), Groq external AI API integration, and classroom security permissions.  
**Spec:** [spec.md](file:///d:/6_OJT/EduLab/plans/class-assignment-ai/spec.md)  

---

## Session Notes
<!-- Updated by cook automatically — do not edit manually -->

**Last active:** 2026-09-10 13:42  
**Phase in progress:** Completed all 3 phases  
**Status:** All unit tests, backend Spring Boot compilation, and TypeScript build passed cleanly.  

### Decisions made this session
- Implemented Hybrid Grading Model: 70% Math Engine Accuracy (Backend Java) + 30% Groq AI Pedagogical Review (Llama 3).
- Implemented reproducible parameter randomization per student via seeded random derived from student ID.
- Built complete UI flow for Teacher (Class Code generation, Assignment creation, Gradebook Roster) and Student (Join Class Code, Lab Execution, Instant AI Feedback).

---

## Architecture Overview

```
 ┌────────────────────────────────────────────────────────────────────────┐
 │                              Frontend UI                               │
 ├────────────────────────────┬───────────────────────────────────────────┤
 │ Teacher View:              │ Student View:                             │
 │ • Create & Manage Classes  │ • Join Class via Code                     │
 │ • Generate Class Code      │ • View Lab Assignment                     │
 │ • Create Parametric Lab    │ • Interactive PhET Lab + Parametric Data  │
 │   Assignments              │ • Submit Answers & Reasoning              │
 │ • Class Roster & Gradebook │ • Real-time AI + Math Grade Report        │
 └─────────────┬──────────────┴─────────────────────────────┬─────────────┘
               │                                            │
               │ REST API                                   │ REST API
               ▼                                            ▼
 ┌────────────────────────────────────────────────────────────────────────┐
 │                      Backend Spring Boot (Java)                        │
 ├────────────────────────────────────────────────────────────────────────┤
 │ • ClassService & EnrollmentService (Class Code generator & validator) │
 │ • AssignmentService & SeededParamGenerator (Randomized per student)    │
 │ • MathVerificationEngine (Ground Truth calculation + Tolerance ±3%)   │
 │ • GroqAIService (Spring RestTemplate / WebClient → Groq Llama API)     │
 └────────────────────────────────────┬───────────────────────────────────┘
                                      │
                                      ▼
                      ┌───────────────────────────────┐
                      │    Groq Cloud API (Llama 3)   │
                      │ • Qualitative Feedback        │
                      │ • Misconception Diagnosis     │
                      │ • Step-by-Step Score          │
                      └───────────────────────────────┘
```

---

## Implementation Phases

### Phase 1: Data Model & Backend Core Engine [COMPLETED]
**File:** [phase-01-backend-core-and-groq.md](file:///d:/6_OJT/EduLab/plans/class-assignment-ai/phase-01-backend-core-and-groq.md)
- JPA Entities: `Classroom`, `ClassEnrollment`, `Assignment`, `StudentAssignmentInstance`, `AssignmentSubmission`.
- Repositories & Controllers for Classroom CRUD and Class Code validation.
- `MathVerificationEngine` for ground-truth calculation (Pendulum formula $T = 2\pi\sqrt{L/g}$ with ±3% relative error tolerance).
- `GroqAIService` using RestTemplate to call Groq API (`llama-3.3-70b-versatile`) with structured JSON prompts.

### Phase 2: Teacher Management & Class/Assignment UI [COMPLETED]
**File:** [phase-02-teacher-dashboard-and-assignments.md](file:///d:/6_OJT/EduLab/plans/class-assignment-ai/phase-02-teacher-dashboard-and-assignments.md)
- Frontend API service client (`classService.ts`, `assignmentService.ts`).
- Teacher Class Management Page: Create Class modal, Class Code display & copy button.
- Assignment Creation Modal: Lab selector, problem description, parameter bounds ($L \in [0.5, 2.0]$, etc.), target variables.
- Class Roster & Gradebook View: Student list, submission status badge, detailed result drawer with Groq feedback.

### Phase 3: Student Lab Execution & Auto-Grading Flow [COMPLETED]
**File:** [phase-03-student-lab-execution-and-autograding.md](file:///d:/6_OJT/EduLab/plans/class-assignment-ai/phase-03-student-lab-execution-and-autograding.md)
- Join Class Modal for students (Class Code input).
- Student Assignment Detail Page: Loads personalized lab parameters, syncs parameters with PhET Pendulum Lab simulation.
- Answer Submission Form: Numerical answer inputs + explanation step area + submit button.
- Grade Result Modal/View: Shows breakdown of Math Accuracy (Pass/Fail + Error %), Groq AI Score, and AI Pedagogical Suggestions.
