# Plan: Total Icon & Emoji Removal for Academic Cleanliness

Mode: --hard
Risk: normal — Multi-file text refactoring across UI components without logic/schema changes.

---

## Overview
Remove all decorative emojis and colorful icons across all frontend pages and components.
Replace emoji headers with clean text badges (e.g. `[ADMIN]`, `[GIÁO VIÊN]`, `[HỌC SINH]`, `[ĐIỆN HỌC]`, `[CƠ HỌC]`) and retain only minimal monochrome functional symbols (`+`, `✕`, `→`, `←`, `‹`, `›`).

---

## Phase Breakdown

- [x] **Phase 1: Dashboard Components Icon Removal** (`plans/icon-cleanup/phase-01-dashboard-components.md`)
  - Clean `SidebarNav.tsx`, `PhETFilterBar.tsx`, `SimCard.tsx`, `RoleWorkspacePanel.tsx`, `GitHubContributionGraph.tsx`, `ClassJoinModal.tsx`.

- [x] **Phase 2: Main Pages Icon Removal** (`plans/icon-cleanup/phase-02-pages-cleanup.md`)
  - Clean `LoginPage.tsx`, `LandingPage.tsx`, `DashboardPage.tsx`, `LabWorkspace.jsx`.

---

## User Stories Covered
- **[P1]** Complete removal of emojis from all pages.
- **[P1]** Typography and text badges used for categories/roles.
- **[P2]** Minimal monochrome symbols retained for interactive utility buttons.

---

## Session Notes
**Last active:** 2026-09-09 16:54
**Phase in progress:** Completed
**Status:** All 2 phases implemented and verified cleanly with `npm run build` and `npm run lint`.

### Decisions made this session
- Removed 100% of decorative emojis (⚛️, ⚡, ⏱️, 👨‍🏫, 🎓, 🛡️, 🔍, 🔋, 🔥, 🚀, 🟢, 🏫, 📝, 💯, 📊, 👥) from all components and pages.
- Replaced with clean text badges (`[ADMIN]`, `[GIÁO VIÊN]`, `[HỌC SINH]`, `[ĐIỆN HỌC]`, `[CƠ HỌC]`, `[THCS]`).
- Retained only minimal monochrome functional control symbols (`+`, `✕`, `→`, `←`, `‹`, `›`).
