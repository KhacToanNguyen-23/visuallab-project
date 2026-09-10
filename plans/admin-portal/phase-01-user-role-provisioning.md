# Phase 1: User & Role Provisioning Table

**Spec Stories:** [P1] `admin-provision-teacher`, [P1] `admin-user-role-table`

---

## File Changes

#### [MODIFY] [RoleWorkspacePanel.tsx](file:///d:/Project/FptProject/visuallab-project/frontend/src/components/dashboard/RoleWorkspacePanel.tsx)
- Add Teacher account creation form for Admin ("Tạo & Cấp Tài Khoản Giáo Viên").
- Refactor Admin user table to high-density data table (`<table className="w-full text-left text-xs">`).
- Add inline role switcher (`STUDENT`, `TEACHER`, `ADMIN`) and account status toggle (`Active` / `Suspended`).

---

## Verification Criteria
- [ ] Admin can fill out the Teacher provisioning form and see the new Teacher account (`[GIÁO VIÊN]`) added to the table immediately.
- [ ] Toggling a user's role or status updates the table row with clean academic text badges.
