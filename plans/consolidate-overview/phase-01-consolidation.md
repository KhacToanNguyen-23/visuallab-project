# Phase 01: Consolidate Overview into Class Management

**Objective:** Consolidate Overview pages into `StudentClassesPage.tsx` and `TeacherClassesPage.tsx`, removing "Tổng Quan" sidebar tabs.

## Steps

1. In `StudentSidebar.tsx`:
   - Remove "Tổng Quan Cá Nhân" menu item (`/student`).
   - Make "Lớp Học Của Tôi" (`/student/classes`) the top active menu item.
2. In `StudentClassesPage.tsx`:
   - Add compact 4-card mini KPI summary bar at the top (Lớp tham gia, Bài cần nộp, Bài hoàn thành, Điểm TB).
3. In `TeacherSidebar.tsx`:
   - Remove "Tổng Quan" menu item (`/teacher`).
   - Make "Quản Lý Lớp Học" (`/teacher/classes`) the top active menu item.
4. In `TeacherClassesPage.tsx`:
   - Add compact 4-card mini KPI summary bar at the top (Lớp đang dạy, Tổng học sinh, Bài tập mở, Bài chờ chấm).
5. In `App.tsx` (or route definitions):
   - Ensure `/student` redirects to `/student/classes` and `/teacher` redirects to `/teacher/classes`.
