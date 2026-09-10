# Brainstorm: Full Portal UI & Role Workspaces Redesign

**Date:** 2026-09-09

## Ideas Explored
- **Option 1: Complex Dev-style Pull Request Workflow:** Allow students to create experiment branches and pull requests. Dismissed because target users are pupils/students, not developers (violates KISS).
- **Option 2: Direct Simple Lab Submission + Activity Gamification:**
  - Simple Class Join via 6-character Code / Direct Invite Link.
  - Student Workspace with GitHub-style 365-day Contribution Heatmap Grid tracking daily lab activity (simulations run, parameters saved, homework submitted).
  - Teacher Workspace with Class Creation, Lab Assignment, and Matrix Grading Grid.
  - Admin Workspace for User Management and System Analytics.
  - Cisco-style flat academic LoginPage with Theme Toggle.

## User's Direction
The user selected Option 2.
- GitHub-style 365-day Contribution Graph tracking all lab activities (runs, data saves, homework submissions).
- Simple assignment workflow without PRs/branching.
- Class join via 6-character Code (`X7K9P2`) and Direct Invite Links (`/join?code=...`).
- Unified flat academic UI style (Cisco/PhET inspired) across all pages (LoginPage, Student Dashboard, Teacher Dashboard, Admin Panel).

## Open Questions
None. Workflow and UI aesthetics are fully aligned.

## Risks
- Contribution Graph performance: Ensuring backend/state aggregation is fast without heavy DB queries.
- Role switching & permissions: Ensuring clean separation of Student, Teacher, and Admin views.
