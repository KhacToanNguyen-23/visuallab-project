# Spec: Student Workspace Redesign (SaaS Layout)

**Date:** 2026-09-10
**Status:** Ready

---

## Problem Statement
Trang cá nhân Học sinh trước đó gộp chung việc xem bài thí nghiệm công khai với việc làm bài tập được giao, gây rối mắt và thiếu sự phân định rõ ràng giữa Thư viện công khai và Không gian học tập cá nhân. Việc xây dựng cụm Route riêng (`/student/*`), Slide-over Drawer tham gia lớp bằng mã và theo dõi lịch sử kết quả chấm điểm giúp tối ưu trải nghiệm học tập SaaS.

---

## User Stories

- **[P1]** As a Student, I want a full-width Student SaaS layout with a collapsible left sidebar and route-based navigation (`/student`, `/student/classes`, `/student/assignments`, `/student/history`) with zero icons so that I can manage my classes, assignments, and grades with maximum screen space.
  Accepted when: The layout spans full width, sidebar renders active state per URL route, and logged-in STUDENT role auto-redirects from `/dashboard` to `/student`.

- **[P1]** As a Student, I want to view my enrolled classes in a full-width table and join new classes via a Join Class Slide-over Drawer by entering a 6-character code from my teacher.
  Accepted when: Clicking "+ Tham gia lớp bằng mã" opens a right slide-over drawer, submitting a valid code adds the class to my enrolled list with toast feedback.

- **[P1]** As a Student, I want to view assigned physics lab homework, launch the interactive lab, and submit my experiment report to my teacher.
  Accepted when: Clicking an assignment on `/student/assignments` opens the assignment detail drawer, allows launching the simulation, and submitting the report updates the status to "Đã nộp bài".

- **[P2]** As a Student, I want to view my practice history, scores, and teacher comments on `/student/history`.
  Accepted when: Table displays completed labs, teacher score (e.g. 9.5/10), and teacher feedback comments clearly.

---

## Functional Requirements

1. **FR-01 (Student Layout Architecture):**
   - Create `StudentLayout`, `StudentSidebar`, `StudentHeader` without decorative icons/emojis.
   - Left Sidebar items: Overview (`/student`), My Classes (`/student/classes`), Assignments (`/student/assignments`), History & Scores (`/student/history`).
   - Auto-redirect STUDENT role from `/dashboard` to `/student`.

2. **FR-02 (Classes & Join Class Drawer - `/student/classes`):**
   - Full-width data table: Class Name, Teacher Name, Join Code (mono font), Enrolled Date, Actions.
   - Slide-over Drawer for entering 6-character join code.

3. **FR-03 (Assignments & Lab Submission - `/student/assignments`):**
   - Full-width table: Lab Title, Class Name, Teacher Name, Due Date, Status (Not Started, In Progress, Submitted).
   - Detail Drawer with instructions and launch simulation link.

4. **FR-04 (Practice History & Feedback - `/student/history`):**
   - Table of submitted lab reports, score breakdown, and teacher feedback.

---

## Non-Functional Requirements

- **UI/UX Consistency:** Zero decorative icons/emojis; soft corner radius (`6px` - `8px`), clean borders, dark/light theme compatibility.
- **Performance:** Instant drawer response and smooth route transitions.

---

## Success Criteria

- [ ] Full-width layout created for all student routes (`/student/*`).
- [ ] Auto-redirection for STUDENT role from `/dashboard` to `/student`.
- [ ] Join Class Slide-over Drawer implemented smoothly.
- [ ] Assignment submission flow and score history accessible without icons.

---

## Out of Scope

- Backend DB schema changes (reuses AuthContext and client state contracts).
