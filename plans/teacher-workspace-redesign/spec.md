# Spec: Teacher Workspace Redesign (SaaS Layout)

**Date:** 2026-09-10
**Status:** Ready

---

## Problem Statement
Giao diện Giáo viên hiện tại nằm chung trong một thẻ Card thu nhỏ tại trang `/dashboard` gây hạn chế diện tích khi quản lý nhiều lớp học, giao bài tập và theo dõi sổ điểm tiến độ học sinh. Việc nâng cấp lên Full-width SaaS Layout với cụm Route riêng (`/teacher/*`), Slide-over Drawer tạo lớp & chấm bài trực tiếp giúp tối ưu hóa 100% không gian làm việc và đồng bộ đẳng cấp giao diện toàn hệ thống.

---

## User Stories

- **[P1]** As a Teacher, I want a dedicated full-width Teacher layout with a collapsible left sidebar and route-based navigation (`/teacher`, `/teacher/classes`, `/teacher/labs`, `/teacher/assign`, `/teacher/grading`) so that I can manage my classes, lab assignments, and student progress with maximum screen space.
  Accepted when: The layout spans full width, sidebar renders active state per URL route, and logged-in TEACHER users are automatically navigated from `/dashboard` to `/teacher`.

- **[P1]** As a Teacher, I want to manage my classes in a full-width table and create new classes via a Slide-over Drawer from the right edge so that the class table remains clean and uncluttered.
  Accepted when: Clicking "+ Tạo Lớp Mới" opens a right slide-over drawer, submitting creates the class with auto-generated join code, and context menu (`...`) allows copying invite links.

- **[P1]** As a Teacher, I want to view student submissions in a full-width grading matrix and grade submissions directly via a Slide-over Drawer without leaving the grading page.
  Accepted when: Clicking a student row on `/teacher/grading` slides in a grading drawer from the right edge, allowing score entry and comments update without page refresh or route navigation.

- **[P2]** As a Teacher, I want overview KPI stat cards on `/teacher` (Active Classes, Total Students, Assignments Open, Pending Submissions) so that I have instant visibility into my teaching workflow.
  Accepted when: Stat cards display clear numbers and quick action buttons on `/teacher`.

---

## Functional Requirements

1. **FR-01 (Teacher Layout Architecture):**
   - Create `TeacherLayout`, `TeacherSidebar`, `TeacherHeader` without decorative emojis/icons.
   - Left Sidebar items: Overview (`/teacher`), Classes (`/teacher/classes`), Lab Catalog (`/teacher/labs`), Assign (`/teacher/assign`), Grading (`/teacher/grading`).
   - Auto-redirect TEACHER role from `/dashboard` to `/teacher`.

2. **FR-02 (Class Management View - `/teacher/classes`):**
   - Page Header: Title "Quản Lý Lớp Học", Primary action button "+ Tạo Lớp Mới".
   - Full-width data table: Class Name, Join Code (mono font), Student Count, Assignments Count, Actions dropdown menu (`...`).
   - Slide-over Drawer for Class Creation with auto-generated code.

3. **FR-03 (Lab Catalog & Quick Assignment - `/teacher/labs` & `/teacher/assign`):**
   - Full-width physics lab catalog filtered by GDPT 2018 domain knowledge.
   - Quick "Giao Bài" action that launches assignment modal/drawer with class target & due date selection.

4. **FR-04 (In-place Grading Matrix & Drawer - `/teacher/grading`):**
   - Full-width grading table: Student Name, Class, Lab Title, Submission Timestamp, Status (COMPLETED / IN_PROGRESS / NOT_STARTED), Score.
   - Click student row -> Open right Slide-over Drawer for viewing lab lab report details, entering score, and saving teacher feedback without leaving the page.

---

## Non-Functional Requirements

- **UI/UX Consistency:** Zero decorative icons/emojis; soft corner radius (`6px` - `8px`), clean borders, dark/light theme compatibility matching Admin SaaS standard.
- **Performance:** Instant in-place drawer opens without page reload or external navigation latency.

---

## Success Criteria

- [ ] Full-width layout replaces legacy tabbed workspace for all teacher routes (`/teacher/*`).
- [ ] Automatic redirection for TEACHER role from `/dashboard` to `/teacher`.
- [ ] Class creation uses Slide-over Drawer cleanly.
- [ ] Student grading opens Slide-over Drawer in-place on `/teacher/grading` without leaving the page.
- [ ] All components are built with zero icons/emojis matching design rules.

---

## Out of Scope

- Backend database schema alterations (reuses existing AuthContext and teacher class states).

---

## Assumptions

- Uses `react-router-dom` (v7) and Tailwind CSS (v4) already in the project.
