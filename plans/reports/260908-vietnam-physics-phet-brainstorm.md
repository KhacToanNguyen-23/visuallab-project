# Brainstorm: Nền tảng Thí nghiệm Vật lý Tương tác (PhET Việt Nam)

**Date:** 2026-09-08

## Ideas Explored

1. **Pure Canvas 2D Engine**: Tối ưu hiệu năng rendering cho các hệ mô phỏng nhiều hạt/đồ thị, chạy mượt trên thiết bị cấu hình thấp của học sinh.
2. **SVG Interactive Hybrid**: Dùng SVG cho các linh kiện có tính thẩm mỹ và tương tác cao (thấu kính, công tắc, pin), Canvas cho đồ thị và tia sáng/hạt.
3. **WebGL / 3D Simulation**: Đồ họa đẹp nhưng tăng độ phức tạp và yêu cầu phần cứng cao -> *Bỏ qua trong giai đoạn MVP*.
4. **Tích hợp Bài tập SGK GDPT 2018**: Mô phỏng đi kèm trực tiếp với các câu hỏi trắc nghiệm & tự luận theo bộ sách Kết nối tri thức, Cánh diều, Chân trời sáng tạo.

## User's Direction

- **Phạm vi đối tượng**: Học sinh Cấp 2 (THCS) và Cấp 3 (THPT) tại Việt Nam.
- **Công nghệ ưu tiên**: Canvas 2D & SVG tương tác nhẹ nhàng, mượt mà trên trình duyệt.
- **Nội dung chủ đề**: Xây dựng toàn bộ các chủ đề bám sát giáo trình Vật lý Việt Nam (Chương trình GDPT 2018).

## Open Questions

1. Cơ chế quản lý trạng thái bài thí nghiệm: Nên lưu dạng JSON preset hay hỗ trợ giáo viên tạo/chia sẻ link bài tập?
2. Bộ solver vật lý cho mạch điện: Dùng Kirchhoff circuit solver tổng quát hay thuật toán cây phân nhánh cho mạch phẳng?
3. Giao diện người dùng: Thiết kế dạng Bento Grid dashboard tổng hợp tất cả bài mô phỏng theo lớp hay phân chia theo chuyên đề?

## Risks

1. **Hiệu năng Canvas 2D khi render số lượng lớn đối tượng**: Cần áp dụng QuadTree hoặc Canvas layering (tách layer tĩnh và layer động).
2. **Tính chính xác của thuật toán vật lý**: Tránh lỗi tích phân sai số khi mô phỏng thời gian thực (cần dùng Verlet Integration thay cho Euler đơn giản).
3. **Độ tương thích thiết bị**: Nhiều học sinh dùng máy tính bảng hoặc điện thoại thông minh, cần tối ưu cảm ứng touch events ngoài chuột.
