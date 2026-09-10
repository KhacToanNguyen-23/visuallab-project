# Plan: Full Portal UI & Role Workspaces Redesign

Mode: --hard
Risk: normal — Multi-file UI refactoring and new component additions without auth/data schema changes.

---

## Overview
Complete the UI redesign across the entire portal, aligning all pages with the Cisco/PhET flat academic design language.
Key features:
1. Cisco-style flat academic LoginPage with Theme Toggle.
2. GitHub-style 365-day Activity Heatmap Component (`GitHubContributionGraph.tsx`) tracking daily lab engagement.
3. Role-based Workspace Dashboards for Students (Class Join, Heatmap, Assigned Tasks), Teachers (Class Creation, 6-char Invite Code, Grading Table), and Admins (System Analytics & Account Management).

---

## Phase Breakdown

- [x] **Phase 1: Cisco Academic LoginPage** (`plans/full-portal-redesign/phase-01-cisco-login.md`)
  - Redesign `LoginPage.tsx` with flat academic cards, crisp typography, and integrated Theme Toggle.

- [x] **Phase 2: GitHub 365-Day Contribution Heatmap Component** (`plans/full-portal-redesign/phase-02-contribution-heatmap.md`)
  - Create `GitHubContributionGraph.tsx` SVG/CSS grid component.
  - Render 53-week 7-day activity grid with 4 intensity levels (green heatmap).

- [x] **Phase 3: Role Workspaces (Student, Teacher, Admin)** (`plans/full-portal-redesign/phase-03-role-dashboards.md`)
  - Redesign `RoleWorkspacePanel.tsx` and `DashboardPage.tsx` into responsive tabs based on User Role.
  - Student View: Profile with Contribution Heatmap, "+ Join Class" modal (code input), Task List.
  - Teacher View: Create Class (generates 6-char code `X7K9P2`), Assign Homework, Matrix Grading Grid.
  - Admin View: System analytics cards (total labs, active classes, user count) and User Management table.

---

## User Stories Covered
- **[P1]** Student 365-day Contribution Graph.
- **[P1]** 6-character Class Invite Code & Direct Invite Links.
- **[P1]** Teacher Class Creation & Grading Table.
- **[P1]** Admin Analytics & Account Management.
- **[P1]** Flat academic LoginPage with Theme Toggle.

---

## Session Notes
**Last active:** 2026-09-09 16:48
**Phase in progress:** Completed
**Status:** All 3 phases implemented and verified cleanly with `npm run build` and `npm run lint`.

### Decisions made this session
- Built `GitHubContributionGraph.tsx` displaying 53 weeks x 7 days activity matrix with summary stats.
- Created `ClassJoinModal.tsx` for 6-character class code input (`PHY12-A1`, `X7K9P2`) and shareable invite links.
- Redesigned `RoleWorkspacePanel.tsx` with clear tabs for Student, Teacher (Classes, Assign, Grading), and Admin.
- Redesigned `LoginPage.tsx` into flat Cisco-style card with integrated Theme Toggle.
