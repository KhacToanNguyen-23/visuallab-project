# Plan: Admin Portal Implementation

**Mode:** --auto  
**Risk:** normal — multi-component React UI refactor, zero-emoji cleanup, high-density table view  
**Date:** 2026-09-09  
**Spec:** [spec.md](file:///d:/Project/FptProject/visuallab-project/plans/admin-portal/spec.md)  
**Report:** [brainstorm report](file:///d:/Project/FptProject/visuallab-project/plans/reports/260909-admin-portal-brainstorm.md)  

---

## High-Level Architecture Overview

Enhance the Admin Workspace inside `frontend/src/components/dashboard/RoleWorkspacePanel.tsx` with a full-width, zero-emoji, high-density table layout providing 3 main administrative tabs:

```
[Admin Workspace Portal]
   ├── Tab 1: Quản Lý Người Dùng & Cấp Tài Khoản (User & Role Provisioning)
   ├── Tab 2: Quản Lý Kho Bài Lab Áo Mẫu (Simple Lab Catalog Management)
   └── Tab 3: Thống Kê & Nhật Ký Hoạt Động (Analytics & System Audit Log)
```

---

## Implementation Phases

### Phase 1: User & Role Provisioning Table (`phase-01-user-role-provisioning.md`)
- **Target File:** `RoleWorkspacePanel.tsx`
- **Key Features:** Teacher creation/provisioning form (Name, Email, School), high-density user table, role switcher (`STUDENT`, `TEACHER`, `ADMIN`), account status toggle (`[Hoạt động]` / `[Đã khóa]`).
- **Stories Covered:** [P1] `admin-provision-teacher`, [P1] `admin-user-role-table`

### Phase 2: Simple Virtual Lab Catalog Table (`phase-02-simple-lab-catalog.md`)
- **Target File:** `RoleWorkspacePanel.tsx`
- **Key Features:** High-density table listing preset lab modules with Physics Domain text badges (`[ĐIỆN HỌC]`, `[CƠ HỌC]`, etc.), Route path, and visibility toggle (`[Hiển thị]` / `[Ẩn]`).
- **Stories Covered:** [P1] `admin-lab-catalog-table`

### Phase 3: Analytics Metrics & Real-time Audit Log (`phase-03-metrics-audit-log.md`)
- **Target File:** `RoleWorkspacePanel.tsx`
- **Key Features:** Platform metrics cards + live Audit Log table recording system actions with timestamps.
- **Stories Covered:** [P1] `admin-metrics-audit-log`

---

## Verification Plan

### Automated Build Verification
- Run `npm run build` inside `frontend/` to confirm zero TypeScript compilation errors.

### Visual & Functional Verification
- Verify Admin can create Teacher accounts directly.
- Verify role changes and lock/unlock toggles reflect instantly in the user table.
- Confirm zero emojis appear anywhere in the Admin view.
