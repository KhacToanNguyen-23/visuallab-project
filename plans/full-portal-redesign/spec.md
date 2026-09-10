# Spec: Full Portal UI & Role Workspaces Redesign

**Date:** 2026-09-09
**Status:** Ready

---

## Problem Statement
The application currently has a redesigned core Lab Workspace and Landing Page, but lacks a unified, professional academic portal UI across all remaining pages (LoginPage, Student Workspace, Teacher Workspace, Admin Panel). Furthermore, student engagement needs gamification without adding complex developer workflows.

---

## User Stories

- **[P1]** As a student, I want to view my GitHub-style 365-day Contribution Graph on my profile so that I can see a visual summary of my daily lab engagement and activity.
  Accepted when: The profile header renders a 53-week heatmap grid coloring days based on lab activity counts (0 = neutral, 1+ = shades of green).

- **[P1]** As a student, I want to join a class using a 6-character invite code or a direct invite link so that I can access my teacher's assigned lab homework easily.
  Accepted when: Entering a valid code or navigating to `/join?code=X7K9P2` adds the student to the target class roster.

- **[P1]** As a teacher, I want to create classes, generate invite codes, assign lab homework with deadlines, and grade student submissions so that I can manage my physics lab curriculum efficiently.
  Accepted when: Teacher dashboard provides Class Creation, Lab Assignment creation, and a Grading Table displaying student data tables and inputting scores.

- **[P1]** As an admin, I want a flat academic dashboard to view system stats (users, active classes, lab runs) and manage user accounts so that I can oversee the platform.
  Accepted when: Admin view displays high-level analytics cards and user management table.

- **[P1]** As any user, I want a clean, Cisco-style LoginPage supporting Light & Dark themes so that logging in feels seamless and trustworthy.
  Accepted when: LoginPage uses flat cards, high-contrast typography, and integrates the global theme switcher.

---

## Functional Requirements

1. FR-01: Redesign `LoginPage.tsx` with Cisco-style flat academic cards, Email/Google auth UI, and Light/Dark theme toggle.
2. FR-02: Implement `StudentDashboard` with a GitHub-style 365-day Activity Heatmap, Joined Classes list, and Assigned Tasks list with status tags (Chưa làm, Đã nộp, Đã chấm).
3. FR-03: Implement `TeacherDashboard` with 3 main sections: Lớp học (Create class / Invite code), Giao bài tập (Select lab, deadline, instructions), and Chấm điểm (Grading matrix).
4. FR-04: Implement `AdminDashboard` with System Metrics cards and User Management table.
5. FR-05: Ensure all dashboards use the established CSS variable theme system (`var(--bg-main)`, `var(--bg-panel)`, `var(--border-color)`, `var(--text-main)`).

---

## Non-Functional Requirements

- Aesthetics: Strict flat academic design language across all role dashboards.
- Responsiveness: Desktop priority with high readability.

---

## Success Criteria

- [ ] All 4 major pages (LoginPage, Student Dashboard, Teacher Dashboard, Admin Dashboard) adopt the flat academic theme.
- [ ] Student Profile renders a working 365-day GitHub-style contribution grid component.
- [ ] Teacher can view class invite codes and grade student lab answers.

---

## Out of Scope

- Real-time video conferencing inside the portal.
- Complex git branching / PR workflows.

---

## Assumptions

- Mock data or API integration can back the dashboards seamlessly.
