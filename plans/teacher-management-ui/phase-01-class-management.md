# Phase 1: Class Roster & Join Code Generator

**Spec Stories:** [P1] `teacher-create-class`, [P1] `teacher-invite-students`

---

## File Changes

#### [MODIFY] [RoleWorkspacePanel.tsx](file:///d:/Project/FptProject/visuallab-project/frontend/src/components/dashboard/RoleWorkspacePanel.tsx)
- Refactor Teacher workspace tab state (`classes`, `catalog`, `assign`, `grading`).
- Implement Class Creation form with random 6-character Join Code generator.
- Add Class Card list displaying class name, join code, student count, and quick "Copy Invite Link" action.
- Add expandable student roster modal/drawer for each class.

---

## Verification Criteria
- [ ] Submitting the "Tạo Lớp Mới" form creates a new class card with a unique 6-character alphanumeric code.
- [ ] Clicking "Sao chép Link mời" copies `https://visuallab.edu.vn/join?code=XYZ` to clipboard and triggers feedback toast/alert.
