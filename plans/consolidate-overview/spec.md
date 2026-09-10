# Spec: Consolidate Overview Pages into Class Management

**Date:** 2026-09-10
**Status:** Ready

---

## Problem Statement
The standalone "Tổng Quan" overview pages in both Student (`/student`) and Teacher (`/teacher`) workspaces only contained 4 KPI cards, creating redundant navigation tabs and low information density. Consolidating the KPI stat cards into compact mini banners at the top of Class Management pages (`/student/classes`, `/teacher/classes`) eliminates redundant tabs and streamlines the user workflow.

---

## User Stories

- **[P1]** As a Student, when I open my workspace, I want to land directly on my Enrolled Classes page with a compact KPI summary bar at the top so that I can immediately access my classes without an empty overview tab.
  Accepted when: Dedicated "Tổng Quan" tab is removed from Student sidebar, `/student` auto-navigates to `/student/classes`, and `StudentClassesPage.tsx` displays a compact top mini KPI banner.

- **[P1]** As a Teacher, when I open my workspace, I want to land directly on my Class Management page with a compact KPI summary bar at the top so that I can manage my classes immediately.
  Accepted when: Dedicated "Tổng Quan" tab is removed from Teacher sidebar, `/teacher` auto-navigates to `/teacher/classes`, and `TeacherClassesPage.tsx` displays a compact top mini KPI banner.

---

## Functional Requirements

1. FR-01: Remove "Tổng Quan Cá Nhân" tab from `StudentSidebar.tsx` and "Tổng Quan" tab from `TeacherSidebar.tsx`.
2. FR-02: Update Student and Teacher router paths (`App.tsx` or Layout components) so `/student` redirects to `/student/classes` and `/teacher` redirects to `/teacher/classes`.
3. FR-03: Render compact top mini KPI stat cards (4 metrics) inside `StudentClassesPage.tsx`.
4. FR-04: Render compact top mini KPI stat cards (4 metrics) inside `TeacherClassesPage.tsx`.
5. FR-05: Ensure clean production build (`npm run build`) with exit code 0.

---

## Non-Functional Requirements

- Performance: Zero added latency, instant page load.
- Design: High-density, iconless UI layout.

---

## Success Criteria

- [ ] "Tổng Quan" tabs removed from Student and Teacher sidebars.
- [ ] Direct navigation `/student` and `/teacher` land on class management with mini KPI banners.
- [ ] `npm run build` succeeds cleanly with exit code 0.

---

## Out of Scope

- Modifying Admin SaaS workspace navigation.
