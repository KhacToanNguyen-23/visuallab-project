# Brainstorm: Trải Nghiệm Làm Bài Tập Thí Nghiệm Toàn Diện (Full-screen Lab Workbench Integration)

**Date:** 2026-09-15  
**Topic:** Tích hợp phòng thí nghiệm mô phỏng đầy đủ tính năng vào luồng làm bài của học sinh (Student Assignment Mode)

---

## 1. Vấn Đề Hiện Tại
- Khi học sinh bấm làm bài từ `/student/assignments`, hệ thống đang hiển thị giao diện mẫu thu nhỏ đơn giản (`StudentLabAssignmentView`) với canvas kích thước bé, thiếu các công cụ đo đạc nâng cao (thước đo di chuyển, đồng hồ bấm giây, cảm biến số liệu, đồ thị dao động, bảng điều khiển thông số đầy đủ).
- Học sinh không được trải nghiệm cảm giác thao tác trực tiếp trên phòng lab ảo chuyên nghiệp như trong Thư viện Lab (`/lab/*`).

---

## 2. Giải Pháp Đã Thống Nhất (Tùy Chọn A)
- **Không gian thực hành toàn màn hình (Full Lab Workbench)**:
  - Khi học sinh chọn bài tập, hệ thống điều hướng trực tiếp vào phòng lab tương tác chuyên sâu tương ứng với `labType` (Con lắc đơn, Con lắc lò xo, Đo tốc độ, Rơi tự do, Mạch điện, Khúc xạ ánh sáng, v.v.).
  - Toàn bộ công cụ (đồng hồ bấm giây, thước kẹp, cảm biến, đồ thị, âm thanh Tone.js) hoạt động 100% như trong thư viện lab.
- **Tùy chỉnh thông số theo đề bài**:
  - Học sinh tự thao tác điều chỉnh các thanh trượt thông số ($k, m, L, \theta, U, R$) trên bảng điều khiển phòng lab theo đúng thông số đề bài cá nhân của mình.
- **Drawer nộp bài tích hợp (Assignment Slide-over Drawer)**:
  - Trên thanh Header của phòng lab hiển thị banner đề bài cá nhân kèm nút bấm nổi bật **"📝 Ghi Chép & Nộp Bài"**.
  - Bấm nút sẽ mở Drawer bên phải để học sinh nhập số liệu thực nghiệm đo được, ghi chú giải thích và bấm **"Nộp bài & Nhận điểm AI"**.

---

## 3. Rủi Ro & Biện Pháp Giảm Thiểu
1. **Trạng thái URL & Điều hướng:**
   - *Rủi ro:* Học sinh vô tình F5 làm mất số liệu đang đo.
   - *Giải pháp:* Truyền `assignmentId` qua query params (ví dụ: `/lab/spring-mass?assignmentId=asg_123`) và lưu bản nháp số liệu tạm vào bộ nhớ state.
2. **Đồng bộ Route Lab:**
   - *Rủi ro:* Một số lab cũ chưa có wrapper header thống nhất.
   - *Giải pháp:* Tận dụng hệ thống `UniversalWorkbenchPage` hoặc component Drawer nộp bài nổi (`FloatingAssignmentSubmissionDrawer`) có thể gắn vào bất kỳ trang Lab nào.
