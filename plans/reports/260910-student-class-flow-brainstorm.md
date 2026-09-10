# Brainstorm: Student Class Join Flow, Duplicate Prevention, and Assignment Navigation

**Date:** 2026-09-10

## Ideas Explored
- **Toast Notifications:** Standard floating toast feedback (Success green, Duplicate warning yellow, Error red) instead of blocking modal popups.
- **Duplicate Join Handling:** Backend throws explicit `409 Conflict` ("Bạn đã tham gia lớp học này từ trước!") when student submits an already-enrolled Class Code.
- **Class Card Navigation:** Clicking an enrolled class card navigates directly to that class's assignment list, allowing 1-click transition into the interactive lab experiment.
- **Teacher Roster Inspection:** Teacher can view real-time enrolled student list with submission status & AI feedback breakdown.

## User's Direction
- **Toast Notification:** Use floating toast for join feedback.
- **Duplicate Check:** Explicit warning message when entering an already-joined code.
- **Student Navigation:** Click class card $\rightarrow$ show class assignments $\rightarrow$ click assignment $\rightarrow$ open lab.
- **Teacher View:** Teacher views class roster and student scores.

## Open Questions
- None.

## Risks
- None.
