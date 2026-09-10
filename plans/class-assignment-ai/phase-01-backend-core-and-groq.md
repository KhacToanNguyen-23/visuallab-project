# Phase 1: Data Model & Backend Core Engine

**Goal:** Establish JPA Entities, Repositories, Math Verification Engine, and Groq AI Integration Service in Spring Boot.

---

## Tasks to Complete

### 1. Database Entities & DTOs
- Create `Classroom.java`: `id`, `name`, `description`, `code` (6-char unique), `teacherId`, `createdAt`.
- Create `ClassEnrollment.java`: `id`, `classId`, `studentId`, `enrolledAt`.
- Create `Assignment.java`: `id`, `classId`, `title`, `description`, `labType` (e.g. `PENDULUM`), `paramBoundsJson`, `targetFormula`, `tolerancePercent` (default 3.0), `teacherId`, `createdAt`.
- Create `StudentAssignmentInstance.java`: `id`, `assignmentId`, `studentId`, `generatedParamsJson`, `createdAt`.
- Create `AssignmentSubmission.java`: `id`, `instanceId`, `studentId`, `submittedAnswersJson`, `explanation`, `mathScore`, `aiScore`, `totalScore`, `aiFeedback`, `submittedAt`.

### 2. Math Verification Engine (`MathVerificationEngine.java`)
- Implement evaluation logic for lab formulas (e.g. Pendulum period $T = 2\pi\sqrt{L/g}$).
- Compare student's numerical answer against computed ground-truth value.
- Return `MathCheckResult` (isWithinTolerance, relativeErrorPercentage, expectedValue, actualValue).

### 3. Groq AI Service (`GroqAIService.java`)
- Read `groq.api-key` from `application.yml` (fallback to mock response if key is not present).
- Endpoint: `https://api.groq.com/openai/v1/chat/completions` (Llama-3.3-70b-versatile).
- Construct system prompt:
  - Role: Senior Physics Educator & Evaluator.
  - Inputs: Problem statement, assigned parameters, student numerical answer, student step-by-step reasoning, ground truth evaluation.
  - Output format: JSON `{ "reasoningScore": 85, "misconceptions": [...], "pedagogicalFeedback": "...", "suggestions": "..." }`.

### 4. REST Controllers
- `ClassroomController.java`: POST `/api/classes` (create), GET `/api/classes/teacher/{teacherId}`, POST `/api/classes/join` (code validation & enrollment), GET `/api/classes/student/{studentId}`.
- `AssignmentController.java`: POST `/api/assignments` (create assignment), GET `/api/assignments/class/{classId}`, GET `/api/assignments/{id}/student-instance`.

---

## File Ownership
- `[NEW]` [Classroom.java](file:///d:/6_OJT/EduLab/backend/src/main/java/com/edulab/model/Classroom.java)
- `[NEW]` [ClassEnrollment.java](file:///d:/6_OJT/EduLab/backend/src/main/java/com/edulab/model/ClassEnrollment.java)
- `[NEW]` [Assignment.java](file:///d:/6_OJT/EduLab/backend/src/main/java/com/edulab/model/Assignment.java)
- `[NEW]` [StudentAssignmentInstance.java](file:///d:/6_OJT/EduLab/backend/src/main/java/com/edulab/model/StudentAssignmentInstance.java)
- `[NEW]` [AssignmentSubmission.java](file:///d:/6_OJT/EduLab/backend/src/main/java/com/edulab/model/AssignmentSubmission.java)
- `[NEW]` [MathVerificationEngine.java](file:///d:/6_OJT/EduLab/backend/src/main/java/com/edulab/service/MathVerificationEngine.java)
- `[NEW]` [GroqAIService.java](file:///d:/6_OJT/EduLab/backend/src/main/java/com/edulab/service/GroqAIService.java)
- `[NEW]` [ClassroomController.java](file:///d:/6_OJT/EduLab/backend/src/main/java/com/edulab/controller/ClassroomController.java)
- `[NEW]` [AssignmentController.java](file:///d:/6_OJT/EduLab/backend/src/main/java/com/edulab/controller/AssignmentController.java)

---

## Verification
- Unit Test: `MathVerificationEngineTest.java` (verify tolerance ±3% calculation).
- Integration test for Class Code generation (ensure no duplicate 6-character codes).
