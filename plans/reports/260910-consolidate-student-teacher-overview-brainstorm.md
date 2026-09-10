# Brainstorm: Consolidate Overview Pages into Class Management

**Date:** 2026-09-10

## Ideas Explored
- **Option 1 (Consolidate KPI widgets into Class Management page & remove standalone Overview tab):** Remove empty Overview tab from Student & Teacher sidebars, make Class Management (`/student/classes`, `/teacher/classes`) the default workspace root, and render a compact horizontal KPI stat banner on top of the classes table. (Selected).
- **Option 2 (Consolidate into Assignments page):** Make Assignments the root page. (Dismissed: Class Management is the structural entry point).
- **Option 3 (Right Floating Panel):** Permanent right panel for stats. (Dismissed: reduces main table width unnecessarily).

## User's Direction
- Remove dedicated "Tổng Quan" tabs from both Student and Teacher sidebars.
- Show mini KPI summary widgets directly above the Class Management table.
- Eliminate empty, low-density overview pages.

## Open Questions
- None. Option 1 explicitly chosen by user.

## Risks
- Ensure smooth route redirect from `/student` -> `/student/classes` and `/teacher` -> `/teacher/classes`.
