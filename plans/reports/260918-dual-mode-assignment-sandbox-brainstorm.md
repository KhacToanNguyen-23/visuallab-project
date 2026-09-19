# Brainstorm: Dual-Mode Architecture (Assignment Mode vs Free Sandbox Mode)

**Date:** 2026-09-18

## 1. Challenge & Context
EduLab phục vụ hai nhóm đối tượng với nhu cầu khác nhau:
1. **Học sinh làm bài tập được giao (`/student/assignment/:assignmentId/lab`)**: Cần lưu vết quá trình thực hành, thông số cá nhân hóa $m_1, m_2, \alpha...$, tự động lưu nháp (`auto-save draft`) khi F5 không mất dữ liệu, và nộp bài lên hệ thống giáo viên.
2. **Người dùng tự do / Khám phá thư viện (`/lab/:labSlug`)**: Học sinh, giáo viên, khách vãng lai trải nghiệm thí nghiệm ảo tùy biến, tự chấm điểm xem năng lực bản thân, reset linh hoạt, không lưu bài vào CSDL submission.

## 2. Ideas Explored
1. **Option A: Gộp chung và dùng chung localStorage**:
   - Gây lỗi lẫn dữ liệu (stale data) giữa các bài tập hoặc giữa chế độ tự do và bài tập được giao.
2. **Option B: Dual-Mode Architecture với Key Persistence theo `assignmentId` (Được chọn)**:
   - Phân định rõ chế độ hoạt động thông qua context hoặc props (`isAssignmentMode`).
   - Gán namespace persistence chuẩn `edulab_draft_${assignmentId}`.
   - Chế độ tự do dùng pure React state / session state, không ghi đè bài tập của học sinh.

## 3. User's Direction
- Đồng ý phân chia kiến trúc thành 2 chế độ rõ rệt: **Assignment Mode** (có lưu nháp, F5 giữ nguyên, nộp bài giáo viên) và **Sandbox Mode** (khám phá tự do, tự chấm điểm, reset trắng khi F5).

## 4. Open Questions
1. Có cần hỗ trợ đồng bộ nháp lên backend API (`/api/submissions/draft`) hay chỉ cần `localStorage` theo `assignmentId` trước khi nộp chính thức?
2. Khi học sinh đã nộp bài thành công, giao diện lab có chuyển sang chế độ xem lại (Read-only Review Mode) kèm điểm số đã chấm không?

## 5. Risks
- Các component lab cũ (Speed, Induction, Momentum...) cần chuẩn hóa interface props nhận `assignmentId` và `initialParams`.
