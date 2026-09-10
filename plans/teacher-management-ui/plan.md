# Plan: Teacher Management UI & Zero-Emoji High-Density Redesign

**Mode:** --auto  
**Risk:** normal — multi-component React UI refactor, zero-emoji cleanup, high-density table view  
**Date:** 2026-09-09  
**Spec:** [spec.md](file:///d:/Project/FptProject/visuallab-project/plans/teacher-management-ui/spec.md)  
**Report:** [brainstorm report](file:///d:/Project/FptProject/visuallab-project/plans/reports/260909-teacher-management-ui-brainstorm.md)  

---

## High-Level Architecture Overview

Refactor the Teacher Portal into a high-density, flat data table UI (Option A) and strictly enforce a **Zero-Emoji / Zero-Icon Policy** across the entire application:

```
[System UI - Academic Flat Style]
   ├── Zero Emojis/Icons (Replace with [BADGE] text brackets)
   └── Teacher Portal (High-Density Table View)
        ├── Tab 1: Bảng Lớp Học & Mã Mời (Compact Class Table)
        ├── Tab 2: Bảng Kho Lab Mẫu (Compact Domain Catalog Table)
        ├── Tab 3: Form Giao Bài Tập (Compact Assignment Form)
        └── Tab 4: Sổ Điểm & Tiến Độ (Compact Matrix Grading Table)
```

---

## Implementation Phases

### Phase 1: Zero-Emoji Audit & Config Clean-up
- **Target Files:** `domainsConfig.ts`, `PhETFilterBar.tsx`, `RoleWorkspacePanel.tsx`, `SimCard.tsx`, `SidebarNav.tsx`
- **Actions:** Remove all emojis (`⚡`, `🚀`, `🌊`, `💡`, `📋`, `👁️`, `📌`, `🔥`, etc.). Replace with academic bracket text like `[ĐIỆN HỌC]`, `[CƠ HỌC]`, `[MẠCH DC]`.

### Phase 2: High-Density Flat Class & Catalog Tables
- **Target File:** `RoleWorkspacePanel.tsx`
- **Actions:** Convert Teacher Class view and Preset Lab Catalog view from bulky cards to compact data tables (`<table className="w-full text-left text-xs">`).

### Phase 3: High-Density Assignment Form & Grading Matrix
- **Target File:** `RoleWorkspacePanel.tsx`
- **Actions:** Compact assignment form, update grading matrix status badges to academic text tags (`[ĐÃ NỘP]`, `[ĐANG LÀM]`, `[CHƯA NỘP]`).

---

## Verification Plan

### Automated Build Verification
- Run `npm run build` inside `frontend/` to confirm zero TypeScript compilation errors.

### Visual Verification
- Ensure zero emojis appear on any page or tab.
- Confirm high-density table layout allows viewing 8-10 items per screen without excessive card padding.
