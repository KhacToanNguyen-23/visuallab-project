# Implementation Plan: Dual-Mode Architecture (Assignment Mode vs Free Sandbox Mode)

**Mode:** normal  
**Risk:** normal — Client-side persistence hook, draft restoration on F5, and bidirectional submission sync without breaking sandbox experience.

---

## 1. Executive Summary
Xây dựng kiến trúc phân tách rõ 2 chế độ vận hành trong EduLab:
- **Assignment Mode (`/student/assignment/:assignmentId/lab`)**: Tự động lưu bản nháp (`auto-save draft`) theo key `edulab_draft_${assignmentId}`, khôi phục 100% dữ liệu thực nghiệm và trắc nghiệm khi tải lại trang (F5), đồng bộ điểm số và nộp bài trực tiếp vào hệ thống giáo viên.
- **Sandbox Mode (`/lab/:labSlug`)**: Phòng thí nghiệm mở, tự do khám phá, tự chấm điểm xem kết quả tại chỗ, không lưu đè bài tập của học sinh.

---

## 2. Phase Breakdown

| Phase | Mục tiêu | Trọng tâm kỹ thuật |
| :--- | :--- | :--- |
| **Phase 1** | **Unified Lab Persistence & Mode Hook** | Xây dựng hook `useLabPersistence({ labId, assignmentId, mode })` quản lý auto-save, restore draft khi F5, và clear draft khi nộp bài thành công. |
| **Phase 2** | **Lab Worksheets Dual-Mode Integration** | Tích hợp hook vào các bảng tính/worksheet của các phòng thí nghiệm (Refraction, Induction, Speed, Momentum, Boyle, Latent Heat...) để tự động nạp draft và nộp bài 1-click. |
| **Phase 3** | **Drawer & Workbench Bidirectional Sync** | Kết nối sự kiện giữa Simulation Lab và `FloatingAssignmentDrawer`, hiển thị trạng thái chính xác (Chưa làm $\to$ Đang làm dở $\to$ Đã nộp bài). |

---

## 3. Verification Plan
- **Automated**: `npm run build` và TypeScript compile check pass 100%.
- **Manual Flow Testing**:
  1. Mở bài tập được giao `/student/assignment/:assignmentId/lab` $\to$ Thao tác đo đạc 3 điểm $\to$ Bấm F5 $\to$ Bảng số liệu được giữ nguyên 100%.
  2. Mở `/lab/refraction` từ thư viện $\to$ Đo đạc $\to$ Bấm F5 $\to$ Trở về trạng thái ban đầu sạch sẽ (không lưu rác).
  3. Bấm "Nộp bài" trên bài lab $\to$ Drawer cập nhật điểm số và chuyển sang trạng thái "ĐÃ NỘP BÀI".
