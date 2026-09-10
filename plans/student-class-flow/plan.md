# Implementation Plan: Student Class Join Toast, Duplicate Check & Navigation

**Date:** 2026-09-10  
**Mode:** --fast  
**Status:** Completed ✅  
**Risk:** normal — Toast notifications, duplicate join handling, and student class card routing.  
**Spec:** [spec.md](file:///d:/6_OJT/EduLab/plans/student-class-flow/spec.md)  

---

## Plan Overview

1. **Backend Duplicate Join Handling:**  
   In `ClassroomService.java`, when a student attempts to join an already-enrolled class, throw a distinct `IllegalStateException("ALREADY_ENROLLED:Bạn đã tham gia lớp học này từ trước!")`. Catch in `ClassroomController.java` and return `HTTP 409 Conflict` (or 400 Bad Request) with the message.

2. **Frontend Toast Notifications:**  
   Update `ClassJoinModal.tsx` and `RoleWorkspacePanel.tsx` to handle backend response codes. Show:
   - Green Toast: "🎉 Gia nhập lớp [Tên lớp] thành công!"
   - Yellow Toast: "⚠️ Bạn đã tham gia lớp học này từ trước!"
   - Red Toast: "❌ Mã lớp học không tồn tại!"

3. **Class Card Navigation Flow:**  
   When a student clicks an enrolled class card on `RoleWorkspacePanel.tsx`, navigate to `/student-assignments?classId=[classId]`. `StudentAssignmentsPage.tsx` parses `classId` from URL params, auto-selects that class, and lists its assignments. Clicking an assignment opens `StudentLabAssignmentView`.

---

## File Ownership Map

- `[MODIFY]` [ClassroomService.java](file:///d:/6_OJT/EduLab/backend/src/main/java/com/edulab/service/ClassroomService.java)
- `[MODIFY]` [ClassroomController.java](file:///d:/6_OJT/EduLab/backend/src/main/java/com/edulab/controller/ClassroomController.java)
- `[MODIFY]` [ClassJoinModal.tsx](file:///d:/6_OJT/EduLab/frontend/src/components/dashboard/ClassJoinModal.tsx)
- `[MODIFY]` [RoleWorkspacePanel.tsx](file:///d:/6_OJT/EduLab/frontend/src/components/dashboard/RoleWorkspacePanel.tsx)
- `[MODIFY]` [StudentAssignmentsPage.tsx](file:///d:/6_OJT/EduLab/frontend/src/pages/StudentAssignmentsPage.tsx)
