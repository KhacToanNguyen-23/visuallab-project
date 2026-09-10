# Phase 2: Physics Domain Catalog & Lab Picker

**Spec Stories:** [P1] `teacher-domain-catalog`

---

## File Changes

#### [MODIFY] [PhETFilterBar.tsx](file:///d:/Project/FptProject/visuallab-project/frontend/src/components/dashboard/PhETFilterBar.tsx)
- Update domain category tabs to match Physics Knowledge Domains:
  - ⚡ **Điện & Từ học**
  - 🚀 **Cơ học & Năng lượng**
  - 🌊 **Sóng & Nhiệt học**
  - 💡 **Quang học & Hiện đại**
- Remove rigid grade-level filtering in favor of Domain Knowledge focus.

#### [MODIFY] [RoleWorkspacePanel.tsx](file:///d:/Project/FptProject/visuallab-project/frontend/src/components/dashboard/RoleWorkspacePanel.tsx)
- Add "Kho Bài Lab Áo (Catalog)" tab in Teacher view.
- Render searchable grid of preset virtual labs grouped by Physics Domain.
- Add "Xem Trước Lab Áo" and "Giao cho Lớp" buttons on each lab card.

---

## Verification Criteria
- [ ] Filtering by Physics Domain chips dynamically filters virtual lab simulation cards.
- [ ] Clicking "Giao cho Lớp" on any lab card pre-fills the assignment modal with that specific simulation.
