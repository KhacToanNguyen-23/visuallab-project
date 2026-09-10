# Phase 2: Teacher Management & Class/Assignment UI

**Goal:** Build Teacher Class Management, Class Code generation UI, Assignment creation with lab parameters, and Class Roster/Gradebook view.

---

## Tasks to Complete

### 1. Frontend Types & API Client Services
- Create `src/types/class.ts` & `src/types/assignment.ts` for Classroom, Enrollment, Assignment, StudentInstance, Submission models.
- Create `src/services/classService.ts` for class CRUD & joining.
- Create `src/services/assignmentService.ts` for assignment creation & submission management.

### 2. Teacher Class Management Dashboard (`TeacherClassesPage.tsx`)
- Display grid/list of teacher's created classes.
- Modal to create a new class (Title, Description).
- Display Class Code prominently with a "Copy Code" button and QR code preview.

### 3. Assignment Creation Modal (`CreateAssignmentModal.tsx`)
- Form to pick target Lab (e.g. Pendulum Lab).
- Input fields for:
  - Assignment Title & Instructions.
  - Parameter bounds (e.g. Length $L$ min/max, initial angle $\theta$ min/max).
  - Target questions/variables to answer.
  - Measurement tolerance percentage (default 3%).

### 4. Class Roster & Gradebook View (`ClassRosterView.tsx`)
- Table displaying all enrolled students.
- Columns: Student Name, Email, Status (Not Submitted / Graded), Math Score, AI Score, Total Score.
- Inspection Drawer: Click on a student to see their assigned parameters, submitted values, step-by-step reasoning, and Groq AI feedback.

---

## File Ownership
- `[NEW]` [class.ts](file:///d:/6_OJT/EduLab/frontend/src/types/class.ts)
- `[NEW]` [assignment.ts](file:///d:/6_OJT/EduLab/frontend/src/types/assignment.ts)
- `[NEW]` [classService.ts](file:///d:/6_OJT/EduLab/frontend/src/services/classService.ts)
- `[NEW]` [assignmentService.ts](file:///d:/6_OJT/EduLab/frontend/src/services/assignmentService.ts)
- `[NEW]` [TeacherClassesPage.tsx](file:///d:/6_OJT/EduLab/frontend/src/pages/TeacherClassesPage.tsx)
- `[NEW]` [CreateClassModal.tsx](file:///d:/6_OJT/EduLab/frontend/src/components/class/CreateClassModal.tsx)
- `[NEW]` [CreateAssignmentModal.tsx](file:///d:/6_OJT/EduLab/frontend/src/components/assignment/CreateAssignmentModal.tsx)
- `[NEW]` [ClassRosterView.tsx](file:///d:/6_OJT/EduLab/frontend/src/components/class/ClassRosterView.tsx)

---

## Verification
- UI layout testing for Teacher Dashboard.
- Copy Class Code functionality validation.
- Form validation on Assignment Creation Modal.
