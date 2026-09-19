# Functional Specification: Dual-Mode Architecture (Assignment vs Sandbox Mode)

## 1. Overview & Objective
Thiết kế và triển khai kiến trúc Dual-Mode cho toàn bộ các phòng thí nghiệm ảo trong EduLab:
1. **Assignment Mode (`/student/assignment/:assignmentId/lab`)**: Dành riêng cho học sinh làm bài tập được giáo viên giao.
   - Nhận thông số cá nhân hóa (`studentParams`).
   - Tự động lưu tiến độ làm bài (Auto-Save Draft theo `assignmentId`) — F5 không mất số liệu hay câu trả lời.
   - Khi nộp bài sẽ gửi điểm số và số liệu trực tiếp vào hệ thống giáo viên (`submissions`).
2. **Sandbox Mode (`/lab/:labSlug`)**: Dành cho người dùng tự do (học sinh tự học, giáo viên giảng bài, khách vãng lai).
   - Cho phép tự do tùy biến tham số hoặc dùng mặc định.
   - Tự chấm điểm tức thì trên client để tự đánh giá năng lực, không lưu vào backend CSDL.
   - Đặt lại (Reset) hoặc F5 sẽ làm mới thí nghiệm về ban đầu.

---

## 2. User Stories & Acceptance Criteria

### P1: Auto-Save Draft & Persistence for Assignment Mode
- **As a** học sinh làm bài tập được giao,
- **I want** hệ thống tự động lưu các phép đo đạc và câu trả lời trắc nghiệm theo `assignmentId`,
- **So that** khi tải lại trang (F5) hoặc rớt mạng, tôi không bị mất dữ liệu đã làm.
- **Acceptance Criteria**:
  1. Khi ở chế độ bài tập, mọi thay đổi số liệu trong bảng thực nghiệm và câu trả lời trắc nghiệm được auto-save vào `edulab_draft_${assignmentId}`.
  2. Khi F5, giao diện khôi phục chính xác 100% số liệu đã đo và câu trả lời đã chọn.
  3. Khi chuyển sang bài tập khác (`assignmentId` khác), dữ liệu của bài cũ không bị hiển thị nhầm sang bài mới.

### P1: Direct Submission Sync from Lab Workbench
- **As a** học sinh,
- **I want** khi bấm nộp bài trong phòng thí nghiệm, kết quả được đồng bộ tức thì vào ngăn nộp bài và CSDL của giáo viên,
- **So that** tôi không phải mở lại ngăn nộp bài để bấm lần thứ hai một cách rườm rà.
- **Acceptance Criteria**:
  1. Bấm nộp bài trên bảng worksheet sẽ gọi API lưu `submissions` và cập nhật giao diện nộp bài thành công.
  2. Ngăn nộp bài hiển thị trạng thái `ĐÃ NỘP BÀI` kèm điểm số chi tiết.

### P2: Sandbox Mode Independent Experience
- **As a** giáo viên hoặc học sinh tự học mở bài lab từ thư viện (`/lab/:labSlug`),
- **I want** trải nghiệm mô phỏng toàn màn hình không bị vướng các thanh banner nộp bài,
- **So that** tôi có thể tự do thí nghiệm, giảng dạy và tự chấm điểm nhanh.
- **Acceptance Criteria**:
  1. Khi truy cập `/lab/:labSlug`, không xuất hiện banner giao bài và không gửi bài lên `submissions`.
  2. Điểm số được hiển thị trực tiếp tại chỗ để người dùng xem phản hồi sư phạm.

---

## 3. Technical Requirements
- **Context/Hook**: Tạo `useLabModeContext` hoặc hook `useLabPersistence(labId, assignmentId)` xử lý việc lưu/tải draft.
- **Key Schema**: `edulab_draft_${assignmentId}` chứa `{ rows, trials, quizAnswers, gradeResult, timestamp }`.
- **Clean Separation**: Khi `assignmentId` không tồn tại (chế độ Sandbox), không ghi vào draft storage của bài tập.
