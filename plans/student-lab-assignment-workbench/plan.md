# Implementation Plan: Tích Hợp Phòng Lab Toàn Màn Hình Khi Học Sinh Làm Bài Tập

**Directory:** `plans/student-lab-assignment-workbench/`  
**Mode:** Hard  
**Risk:** normal — Tích hợp frontend router, full lab workbench và drawer nộp bài, sử dụng API submissions hiện có.  
**Date:** 2026-09-15  
**Spec Reference:** `plans/student-lab-assignment-workbench/spec.md`

---

## Architecture Overview

```
[StudentAssignmentsPage]
   ↓ Click "Làm bài"
[Navigate to /student/assignment/:id/run OR /lab/*?assignmentId=...]
   ↓
[Full Interactive Lab Workbench (60 FPS Canvas/Three.js + Controls)]
   ├── Top Assignment Header Banner (Tên bài, Đề bài cá nhân, Deadline Badge)
   ├── Full Lab Equipment (Thước, đồng hồ bấm giây, cảm biến, thanh trượt tinh chỉnh)
   └── [Floating / Topbar Trigger] → [Slide-over Submission Drawer]
                                          ├── Bảng nhập số liệu thực nghiệm
                                          ├── Giải thích / phân tích
                                          ├── Nút "Nộp bài & Chấm điểm AI"
                                          └── Kết quả điểm & nhận xét tức thì
```

---

## Phases

- [x] **Phase 01:** Tạo Component Slide-over Drawer Nộp Bài Nổi (`FloatingAssignmentDrawer.tsx`)
- [x] **Phase 02:** Tích Hợp Top Assignment Banner & Drawer vào Toàn Bộ Lab Workbench (`StudentLabAssignmentWorkbenchPage.tsx`, `AssignmentLabHeaderBanner.tsx`)
- [x] **Phase 03:** Cập Nhật Luồng Khởi Chạy Từ `StudentAssignmentsPage` & Kiểm Thử Toàn Diện

---

## File Ownership & Changes

### Frontend:
- `[NEW]` `frontend/src/components/assignment/FloatingAssignmentDrawer.tsx`
- `[NEW]` `frontend/src/components/assignment/AssignmentLabWrapper.tsx` (hoặc tích hợp query listener trên Lab routes)
- `[MODIFY]` `frontend/src/pages/student/StudentAssignmentsPage.tsx`
- `[MODIFY]` `frontend/src/components/student/SubmitAssignmentDrawer.tsx`
- `[MODIFY]` `frontend/src/main.tsx` (Thêm route `/student/assignment/:assignmentId/lab` hoặc bọc Lab Container)

---

## Risks & Mitigations

1. **Gián đoạn WebGL / Canvas khi mở Drawer:**
   - *Risk:* Khi mở Slide-over Drawer từ bên phải, nếu layout bị resize đột ngột có thể làm giật lag canvas.
   - *Mitigation:* Sử dụng Drawer dạng Overlay với backdrop mờ hoặc Slide-in không làm thay đổi kích thước DOM của Canvas/Three.js canvas.
2. **Mất số liệu khi học sinh đang làm thí nghiệm:**
   - *Risk:* Học sinh F5 trang hoặc vô tình bấm back.
   - *Mitigation:* Tự động lưu `draftAnswers` vào `sessionStorage` tạm thời theo `assignmentId`.
