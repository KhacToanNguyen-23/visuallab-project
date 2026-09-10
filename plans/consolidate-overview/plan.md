# Plan: Consolidate Overview Pages into Class Management

**Date:** 2026-09-10
**Mode:** --fast
**Risk:** normal — UI navigation consolidation for Student and Teacher workspaces

---

## Overview

Consolidate the low-density standalone Overview pages into Class Management (`/student/classes`, `/teacher/classes`) by placing compact mini KPI stat banners at the top of the Class Management tables and removing dedicated "Tổng Quan" sidebar tabs.

---

## Proposed Phases

- [file:///d:/Project/FptProject/visuallab-project/plans/consolidate-overview/phase-01-consolidation.md](phase-01-consolidation.md): Remove Overview tabs from Student and Teacher sidebars, add mini KPI banners to `StudentClassesPage.tsx` and `TeacherClassesPage.tsx`, and update default redirects
- [file:///d:/Project/FptProject/visuallab-project/plans/consolidate-overview/phase-02-verification.md](phase-02-verification.md): Run build verification (`npm run build`) and update `feature_list.json`

---

## File Ownership

| Phase | Files Touched |
| ----- | ------------- |
| Phase 01 | `frontend/src/components/student/StudentSidebar.tsx`, `frontend/src/pages/student/StudentClassesPage.tsx`, `frontend/src/components/teacher/TeacherSidebar.tsx`, `frontend/src/pages/teacher/TeacherClassesPage.tsx`, `frontend/src/App.tsx` |
| Phase 02 | Automated build verification |

---

## Verification Plan

### Automated Verification
- `cd frontend && npm run build` (Must complete with exit code 0)

### Manual Verification
- Log in as Student -> verify page lands directly on `/student/classes` with compact 4-stat KPI mini banner at the top, without "Tổng Quan Cá Nhân" tab in sidebar.
- Log in as Teacher -> verify page lands directly on `/teacher/classes` with compact 4-stat KPI mini banner at the top, without "Tổng Quan" tab in sidebar.
