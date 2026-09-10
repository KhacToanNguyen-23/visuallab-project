# Phase 2: Simple Virtual Lab Catalog Table

**Spec Stories:** [P1] `admin-lab-catalog-table`

---

## File Changes

#### [MODIFY] [RoleWorkspacePanel.tsx](file:///d:/Project/FptProject/visuallab-project/frontend/src/components/dashboard/RoleWorkspacePanel.tsx)
- Add "Kho Bài Lab Áo (Admin Catalog)" tab in Admin view.
- Render high-density data table listing all preset simulations with Physics Domain badges (`[ĐIỆN HỌC]`, `[CƠ HỌC]`, etc.), Route path, and status (`[Hiển thị]` / `[Ẩn]`).
- Add toggle button to publish/unpublish lab modules.

---

## Verification Criteria
- [ ] Admin can view preset lab modules in a high-density table.
- [ ] Clicking `[Ẩn]` / `[Hiển thị]` updates lab module visibility status cleanly.
