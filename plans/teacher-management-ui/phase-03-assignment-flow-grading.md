# Phase 3: Lab Assignment Flow & Grading Progress Table

**Spec Stories:** [P1] `teacher-assign-lab`, [P1] `teacher-track-submissions`

---

## File Changes

#### [MODIFY] [RoleWorkspacePanel.tsx](file:///d:/Project/FptProject/visuallab-project/frontend/src/components/dashboard/RoleWorkspacePanel.tsx)
- Enhance "Giao Bài Tập" tab with a clean modal / form to select target class, choose preset lab from domain catalog, set due date, and write custom lab instructions.
- Enhance "Bảng Chấm Điểm" tab with a comprehensive student progress grid:
  - Display student name, assigned lab title, submission timestamp, status badge (`Chưa làm`, `Đang làm`, `Đã hoàn thành`), auto-grade score, and manual grade override input.
  - Add search & filter by Class name or Submission Status.

---

## Verification Criteria
- [ ] Submitting a lab assignment adds the task to the selected class's active homework list.
- [ ] Student completion statuses (`Chưa làm`, `Đang làm`, `Đã hoàn thành`) display with high contrast, theme-aware badges.
- [ ] Teachers can edit score values directly or click "Xem bài nộp" to inspect telemetry details.
