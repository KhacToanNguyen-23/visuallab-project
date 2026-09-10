# Spec: Class Management, Parametric Lab Assignment & Groq AI Auto-Grading

**Date:** 2026-09-10  
**Status:** Draft  

---

## Problem Statement
Teachers need a streamlined way to create classes, invite students via Class Codes, assign interactive lab-based homework with randomized problem parameters per student (to ensure fairness and prevent copying), and automatically evaluate student submissions using Groq AI and deterministic math verification.

---

## User Stories

<!-- P1 = MVP (must ship), P2 = nice-to-have, P3 = future/out-of-scope -->

- **[P1]** As a Teacher, I want to create a Class and get a unique Class Code so that students can easily join my class.  
  *Accepted when:* Teacher can create a class in UI and receive a 6-character alphanumeric code that students can input to join.

- **[P1]** As a Student, I want to join a Class using a Class Code so that I can see assignments given by my teacher.  
  *Accepted when:* Student enters valid code and is immediately listed in the teacher's class roster.

- **[P1]** As a Teacher, I want to create an assignment linked to a Lab (e.g. Pendulum Lab) with a base problem definition and parameter constraints so that each student gets a personalized variant.  
  *Accepted when:* Teacher saves assignment and student views their assignment with randomly generated parameter values within teacher-defined bounds.

- **[P1]** As a Student, I want to perform the lab experiment using my assigned parameters and submit numerical answers + explanation steps so that my work can be graded.  
  *Accepted when:* Student can submit answers and view real-time grading feedback upon submission.

- **[P1]** As the System (Backend + Groq AI), I want to grade student submissions using deterministic formula checks (with experimental tolerance ±3-5%) and Groq AI for qualitative feedback so that grades are accurate and fair.  
  *Accepted when:* Submissions are scored automatically with detailed breakdown (Math correctness + AI reasoning review) and stored in DB.

- **[P1]** As a Teacher, I want to view a class gradebook showing all students, their assigned parameter variants, submission statuses, and scores/AI feedback.  
  *Accepted when:* Teacher dashboard displays a table of enrolled students with detailed submission inspection modal.

- **[P2]** As a Teacher, I want to export class submission results to CSV/Excel so that I can log grades externally.  
  *Accepted when:* CSV export button downloads gradebook data.

- **[P3]** As a Teacher, I want to trigger auto-re-grading for a student submission if parameters or rubric change.  
  *(out of scope for MVP)*

---

## Functional Requirements

1. **FR-01 (Class Management):** Teacher can CRUD classes. Each class generates a unique 6-character uppercase code (e.g., `LAB892`).
2. **FR-02 (Student Enrollment):** Student can join class via Class Code. Backend validates code existence and prevents duplicate joins.
3. **FR-03 (Assignment Creation):** Teacher selects a lab type (e.g. `PENDULUM`), specifies problem prompt, variable parameters range (e.g. $L \in [0.5, 2.0]\text{m}$, $\theta \in [5^\circ, 30^\circ]$), ground-truth math formula, and total points.
4. **FR-04 (Parametric Problem Generation):** When student opens assignment for the first time, system deterministically generates and persists parameter values for that `(studentId, assignmentId)` tuple.
5. **FR-05 (Submission & Hybrid Grading Engine):**
   - Student submits numerical answer(s) + optional step-by-step reasoning.
   - Spring Boot Backend evaluates numerical answer against ground truth formula with configured tolerance (default ±3%).
   - Backend calls Groq API (`llama-3.3-70b-versatile` or `llama-3.1-8b-instant`) with system prompt, problem details, student parameters, ground truth, and student response.
   - Groq returns JSON payload with reasoning score, qualitative feedback, and key error diagnoses.
6. **FR-06 (Teacher Roster & Results View):** Teacher views real-time progress roster (Not Started, In Progress, Submitted, Graded) with student scores and Groq AI feedback summary.

---

## Non-Functional Requirements

- **Performance:** Groq AI evaluation response time < 3 seconds per submission.
- **Accuracy:** Math ground-truth checking 100% deterministic with zero LLM math hallucination risk.
- **Security:** Class Code lookup indexed and rate-limited. Student cannot view other students' assigned parameters or solutions.

---

## Success Criteria

- [ ] Teacher can create a class and generate a functional Class Code.
- [ ] Student can join class with Class Code in < 1 second.
- [ ] Each student receives unique, reproducible parameter numbers for the same lab assignment.
- [ ] Hybrid grading accurately scores student submissions and displays Groq AI qualitative feedback.
- [ ] Teacher dashboard lists all enrolled students and their assignment scores.

---

## Out of Scope

- Live real-time multiplayer simulation inside the same lab session.
- Voice/audio AI grading feedback.

---

## Assumptions

- Groq API Key is configured via `GROQ_API_KEY` in `application.yml` / system env.
- Student accounts and Teacher accounts exist within the EduLab Auth system (`ROLE_TEACHER`, `ROLE_STUDENT`).

---

## [NEEDS CLARIFICATION]

- [ ] Default tolerance for experimental lab measurements (suggested default: ±3% relative error).
