# Phase 3: Role Workspaces (Student, Teacher, Admin)

## Goal
Redesign `RoleWorkspacePanel.tsx` and `DashboardPage.tsx` to support full role workflows (Student, Teacher, Admin).

## File Changes
- **[MODIFY]** `frontend/src/components/dashboard/RoleWorkspacePanel.tsx` (Add role tabs, student heatmap, class invite modal, teacher grading table, admin metrics)
- **[MODIFY]** `frontend/src/pages/DashboardPage.tsx` (Integrate theme tokens and role-based panels)
- **[NEW]** `frontend/src/components/dashboard/ClassJoinModal.tsx` (Modal for students entering 6-char code)

## Verification
- Test role switching between Student, Teacher, and Admin demo accounts.
- Verify Class Join Code modal and Teacher Grading matrix.
