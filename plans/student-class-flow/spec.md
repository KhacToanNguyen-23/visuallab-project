# Spec: Student Class Join Flow, Toast Notifications & Direct Assignment Navigation

**Date:** 2026-09-10  
**Status:** Draft  

---

## Problem Statement
Students need clear toast feedback when joining a class via Class Code, explicit duplicate prevention if they try to join the same class twice, and intuitive navigation from an enrolled class card into its lab assignments.

---

## User Stories

- **[P1]** As a Student, I want to receive a Toast notification upon joining a class so that I know my join request succeeded.  
  *Accepted when:* Joining a valid Class Code shows a green success toast "🎉 Bạn đã gia nhập lớp [Tên lớp] thành công!".

- **[P1]** As a Student, I want the system to block duplicate joins and inform me if I enter a code for a class I'm already in so that I don't confuse my enrollments.  
  *Accepted when:* Submitting an already-joined code displays a warning toast "⚠️ Bạn đã tham gia lớp học này từ trước!".

- **[P1]** As a Student, I want to click on an enrolled Class card on my dashboard so that I can see the lab assignments for that class.  
  *Accepted when:* Clicking a class card opens `/student-assignments` filtered to that class.

- **[P1]** As a Student, I want to click a lab assignment from the list so that I am navigated into the interactive simulation to complete my homework.  
  *Accepted when:* Clicking a lab assignment opens `StudentLabAssignmentView` with assigned lab parameters.

- **[P1]** As a Teacher, I want to view my class roster to see all enrolled students and their assignment scores.  
  *Accepted when:* Teacher roster table displays real-time student list.

---

## Functional Requirements

1. **FR-01 (Toast Feedback):** `ClassJoinModal` displays dynamic Toast notifications based on backend response (Success: green, Already Enrolled: yellow/amber, Not Found: red).
2. **FR-02 (Backend Duplicate Validation):** `ClassroomService.joinClassByCode` checks `existsByClassIdAndStudentId`. If true, returns `400 Bad Request` or custom status with message `"Bạn đã tham gia lớp học này từ trước!"`.
3. **FR-03 (Class Card Click Navigation):** Clicking an enrolled class card on Dashboard calls `navigate('/student-assignments?classId=' + enr.classId)`.
4. **FR-04 (Assignment Selection & Execution):** `StudentAssignmentsPage` auto-selects the class specified in URL query `classId` and lists its assignments. Clicking an assignment opens `StudentLabAssignmentView`.

---

## Success Criteria

- [ ] Joining a new class shows green success toast.
- [ ] Joining an existing class shows warning toast "Bạn đã tham gia lớp học này từ trước!".
- [ ] Clicking a class card opens the assignment list for that class.
- [ ] Selecting an assignment opens the PhET lab experiment with custom parameters.
