# Phase 3: Student Lab Execution & Auto-Grading Flow

**Goal:** Implement Student Join Class flow, Parametric Lab Assignment page (embedding PhET simulation with locked assigned parameters), Answer Submission form, and Grade Result View.

---

## Tasks to Complete

### 1. Student Join Class Modal (`JoinClassModal.tsx`)
- Input field for 6-character Class Code.
- Validation API call to join class.
- Toast feedback and redirection to enrolled class list.

### 2. Student Assignment Detail & Lab View (`StudentLabAssignmentView.tsx`)
- Load personalized `StudentAssignmentInstance` parameters for the logged-in student.
- Display assigned parameter values prominently (e.g., "Chiều dài con lắc được giao: $L = 1.25\text{m}$, Góc lệch ban đầu: $\theta_0 = 15^\circ$").
- Pass these parameters into the interactive PhET Pendulum Lab simulation component (`PhetPendulumLab.tsx`).

### 3. Answer Submission & Grading View (`SubmissionForm.tsx` & `GradeResultView.tsx`)
- Form inputs:
  - Measured Period $T$ (seconds).
  - Calculated gravity $g$ ($\text{m/s}^2$).
  - Step-by-step explanation / calculation steps text area.
- Submit button triggers `/api/submissions` API.
- Results view displays:
  - Math Accuracy breakdown (Target value vs Submitted value, % Error).
  - Groq AI Pedagogical Review card (Reasoning score, Misconceptions identified, Teacher/AI advice).

---

## File Ownership
- `[NEW]` [JoinClassModal.tsx](file:///d:/6_OJT/EduLab/frontend/src/components/class/JoinClassModal.tsx)
- `[NEW]` [StudentAssignmentsPage.tsx](file:///d:/6_OJT/EduLab/frontend/src/pages/StudentAssignmentsPage.tsx)
- `[NEW]` [StudentLabAssignmentView.tsx](file:///d:/6_OJT/EduLab/frontend/src/components/assignment/StudentLabAssignmentView.tsx)
- `[NEW]` [GradeResultView.tsx](file:///d:/6_OJT/EduLab/frontend/src/components/assignment/GradeResultView.tsx)
- `[MODIFY]` [PhetPendulumLab.tsx](file:///d:/6_OJT/EduLab/frontend/src/components/simulation/PhetPendulumLab.tsx) (support locked preset parameter props from assignment)

---

## Verification
- End-to-end Student flow: Enter Class Code $\rightarrow$ Join $\rightarrow$ View Assignment with unique numbers $\rightarrow$ Submit answers $\rightarrow$ Receive Groq AI feedback instantly.
