# Spec: PhET-Inspired Dashboard Navigation & Filter Redesign

**Date:** 2026-09-09  
**Status:** Draft  

---

## 1. Overview & Objective

Nâng cấp trang **Dashboard (`DashboardPage.tsx`)** của EduLab theo mô hình tổ chức thông tin học liệu đỉnh cao của **PhET Interactive Simulations (University of Colorado)**:
- **Phân loại rõ ràng cho Giáo viên & Học sinh**: Phù hợp mục tiêu từng vai trò (Học sinh tập trung luyện tập/khám phá; Giáo viên tập trung bài giảng, bộ công cụ sư phạm, đề bài thực hành).
- **Bộ lọc đa chiều bám sát PhET & GDPT 2018**:
  - Theo **Khối lớp** (`Lớp 10`, `Lớp 11`, `Lớp 12`, `THCS`).
  - Theo **Chuyên đề Vật lý** (`Điện & Từ`, `Cơ học & Dao động`, `Nhiệt học`, `Quang học & Sóng`).
  - Theo **Loại thí nghiệm** (`Mô phỏng 2D`, `Thực hành SGK 5 bước`, `Đề bài thực hành`).
- **Thanh tìm kiếm thời gian thực (Real-time Search)**: Tìm kiếm mô phỏng theo từ khóa nhanh chóng.
- **Phân định rõ ràng góc Làm việc cá nhân (Personal Workspace)**: Xem bài thí nghiệm đã lưu, báo cáo A4 nộp/chấm điểm.

---

## 2. User Stories & Acceptance Criteria

- **[P1] Bộ lọc & Tìm kiếm mượt mà (PhET Navigation style)**:
  - Chọn khối lớp/chuyên đề filter danh sách bài thí nghiệm ngay tức thì.
  - Tìm kiếm theo tên bài học (VD: "Định luật Ohm", "Rơi tự do", "Nhiệt dung").
- **[P1] Trải nghiệm cá nhân hóa theo Role**:
  - **Giáo viên**: Hiển thị phím tắt "Tạo bài thực hành mẫu", "Bộ công cụ trình chiếu trên lớp".
  - **Học sinh**: Hiển thị "Tiến độ học tập", "Bài thực hành gần đây", "Tải báo cáo PDF A4".
- **[P2] Bento Grid phân loại môn học phong cách PhET**:
  - Các thẻ mô phỏng có badge phân loại lớp, biểu tượng tương tác, nút "Chạy Mô Phỏng" và "Xem Bài Hướng Dẫn".

---

## 3. Technical Implementation

- **Frontend (`DashboardPage.tsx`)**:
  - Thêm Toolbar bộ lọc: Search Input, Grade Level Filter Tabs, Subject Filter Chips.
  - Component `SimCard.tsx` chuẩn visual PhET (Thumbnails, Badge, Action buttons).
  - Component `TeacherQuickTools.tsx` và `StudentProgressPanel.tsx` cá nhân hóa theo `user.role`.
