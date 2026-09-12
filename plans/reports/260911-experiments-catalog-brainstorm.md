# Brainstorm: Comprehensive Experiments Catalog Page (Trang Tổng Hợp Bài Thí Nghiệm)

**Date:** 2026-09-11

## Ideas Explored
- **Option A (Grid Bento Layout + Filter Bar)**: Thẻ bài học dạng Grid 3-4 cột với thanh bộ lọc trên đầu.
- **Option B (Sidebar Tree View + Filter by Grade/Chapter)**: Cấu trúc Sidebar phân lớp (Lớp 10, 11, 12) & các Chương bài học theo tài liệu `DacTa.md`, kết hợp ô tìm kiếm từ khóa và lưới bài thí nghiệm tương ứng bên phải.

## User's Direction
- **Lựa chọn:** Phương án B (Sidebar Tree View).
- **Tiêu chí lọc:** Lọc theo Khối Lớp (Lớp 10, 11, 12) và lọc theo Chương bài học.
- **Tài liệu nguồn:** `DacTa.md` (chứa 14 bài thực hành Vật lý chuẩn SGK 2018).
- **Yêu cầu kết nối:** Dữ liệu thật từ API Backend `GET /api/curriculum/topics`, KHÔNG sử dụng mock data cứng trong UI.

## Open Questions
1. Khi Backend offline hoặc không có dữ liệu cho 1 chương cụ thể, giao diện hiển thị trạng thái "Chưa có bài thí nghiệm cho chương này" hay tự động hiển thị các bài thí nghiệm mặc định?
2. Nút "Xem tất cả bài thí nghiệm" ở Landing Page chuyển hướng trực tiếp sang đường dẫn `/thu-vien`.

## Risks
1. Dữ liệu trả về từ API backend `/api/curriculum/topics` có thể chưa phân lớp/phân chương đủ 14 bài như `DacTa.md` -> Cần transformer/mapper khớp `gradeLevel` và `subjectArea` linh hoạt.
2. Responsive layout trên thiết bị di động (Mobile screen) khi dùng Sidebar Tree View.
