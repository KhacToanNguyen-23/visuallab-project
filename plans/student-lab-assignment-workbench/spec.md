# Functional Specification: Tích Hợp Phòng Lab Toàn Màn Hình Khi Học Sinh Làm Bài Tập

**Directory:** `plans/student-lab-assignment-workbench/`  
**Status:** Draft  
**Author:** Antigravity  
**Created:** 2026-09-15  

---

## 1. Mục Tiêu & Bối Cảnh
Thay thế giao diện làm bài thu nhỏ bằng trải nghiệm phòng thí nghiệm mô phỏng toàn màn hình chuẩn (Full Interactive Lab Workbench). Học sinh tự do thao tác mọi dụng cụ đo đạc, chủ động tùy chỉnh thông số theo đề bài cá nhân, và nộp kết quả trực tiếp qua Slide-over Drawer thuận tiện.

---

## 2. Yêu Cầu Chức Năng (Functional Requirements)

### FR-01: Điều hướng làm bài trực tiếp tới Full Lab Workbench (P1)
- Khi học sinh bấm **"Làm & Nộp bài"** tại `/student/assignments`:
  - Hệ thống lấy thông tin bài tập (`assignmentId`) và cá nhân hóa đề bài (`instanceId`).
  - Điều hướng tới URL phòng lab tương ứng kèm tham số truy vấn: `[labRoute]?assignmentId=[asgId]`.
  - Giữ lại nút quay về danh sách bài tập (`/student/assignments`).

### FR-02: Banner Đề Bài & Nút Mở Drawer Nộp Bài (P1)
- Khi phòng Lab được mở ở chế độ làm bài (`assignmentId` tồn tại trong URL):
  - Hiển thị thanh Top Banner nổi bật: `[BÀI THỰC HÀNH: Tên bài] - Đề bài của bạn: [Thông số mục tiêu]`.
  - Hiển thị nút bấm cố định nổi bật: **"📝 Ghi Chép & Nộp Bài"** (kèm badge màu deadline xanh/đỏ).
  - Bấm nút sẽ kích hoạt Drawer trượt ra từ bên phải màn hình mà không làm gián đoạn hay reset mô phỏng thí nghiệm đang chạy.

### FR-03: Thao Tác Thí Nghiệm & Tự Tùy Chỉnh Thông Số (P1)
- Học sinh có đầy đủ 100% công cụ thực hành:
  - Đồng hồ bấm giây, thước đo di chuyển, cảm biến, đồ thị dao động, âm thanh mô phỏng.
  - Bảng điều khiển thông số cho phép học sinh tự kéo thanh trượt / nhập số liệu để cài đặt đúng thông số đề bài cá nhân (ví dụ: $L = 1.8m, \theta = 9^\circ$ hoặc $k = 50 N/m, m = 200g$).

### FR-04: Drawer Nộp Báo Cáo & Chấm Điểm Tự Động (P1)
- Drawer hiển thị:
  - Tóm tắt đề bài cá nhân & công thức vật lý mục tiêu.
  - Ô nhập số liệu đo đạc thực nghiệm (ví dụ: Chu kỳ đo được $T$).
  - Ô nhập diễn giải cách làm / phân tích sai số.
  - Nút **"Nộp Bài & Nhận Điểm"**: gọi API `/api/submissions` và hiển thị kết quả chấm điểm toán học + nhận xét AI ngay trong Drawer.

---

## 3. Tiêu Chí Nghiệm Thu (Success Criteria)
1. Học sinh bấm "Làm bài" được đưa đến phòng Lab toàn diện với đầy đủ công cụ của bài Lab đó.
2. Mô phỏng lab chạy mượt mà 60 FPS, không bị giật lag khi mở Drawer nộp bài.
3. Học sinh tự tùy chỉnh được thông số theo đề bài và gửi báo cáo chấm điểm thành công.
