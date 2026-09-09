# Implementation Plan - PhET Tools Integration & Vietnam Practical Lab Builder

Tái sử dụng các công cụ tương tác từ mô phỏng PhET (HTML5 / Canvas / React controls) để đóng gói thành **Bài Thực Hành Vật Lý Chuẩn GDPT 2018** cho học sinh Việt Nam.

## Scope Challenge & Risk Classification

```
# Scope Challenge:
#   Exists?     → Đã có Dashboard PhET và Viewer HTML5 / Wave Lab đơn lẻ.
#   Minimum?    → Xây dựng khung "Vietnam Practical Lab Shell" bao bọc công cụ PhET (Thước, Đồng hồ, Ampe kế, Nút điều khiển) + Hệ thống 5 Bước thực hành + Phiếu Báo Cáo Chấm Điểm.
#   Complexity? → Normal (Multi-component: LabWrapper, StepGuide, ReportSheet, Storage).
#
Risk: normal — bổ sung bộ wrapper bài thực hành Việt Nam kết hợp dụng cụ PhET trên frontend.
```

## User Review Required

> [!IMPORTANT]
> - Hệ thống sẽ giữ nguyên phần mô phỏng PhET core (Canvas / HTML5 iframe) để đảm bảo độ chính xác vật lý.
> - Xây dựng lớp vỏ (Wrapper) tiếng Việt xung quanh gồm: **Thanh Hướng Dẫn 5 Bước (Step Tracker)**, **Thước/Đồng Hồ Đo (Virtual Tools)**, và **Phiếu Báo Cáo Học Sinh (Digital Lab Worksheet)** với thuật toán tự động chấm điểm sai số.

## Proposed Changes

### Frontend Components

#### [NEW] [phet-vietnam-lab-wrapper.tsx](file:///d:/6_OJT/EduLab/frontend/src/components/simulation/PhetVietnamLabWrapper.tsx)
- Đóng gói 1 bài PhET bất kỳ (ví dụ: *Định luật Ohm* hoặc *Mạch điện DC*) vào khung thực hành Việt Nam.
- Tích hợp 5 bước chuẩn SGK Việt Nam:
  1. **Mục tiêu & Dụng cụ**: Đọc yêu cầu bài thực hành & danh sách linh kiện.
  2. **Lắp ráp & Cấu hình**: Thao tác lắp mạch / chỉnh thông số trên công cụ PhET.
  3. **Thu thập dữ liệu**: Kéo thước / đọc Ampe kế & điền vào Bảng Số Liệu (Data Table).
  4. **Xử lý số liệu**: Tính toán giá trị trung bình & sai số \(\overline{R}, \Delta R\).
  5. **Đánh giá & Nộp bài**: Tự động chấm điểm bài làm của học sinh.

#### [NEW] [VietnameseLabWorksheet.tsx](file:///d:/6_OJT/EduLab/frontend/src/components/simulation/VietnameseLabWorksheet.tsx)
- Bảng báo cáo số liệu thực hành trực quan dành cho học sinh Việt Nam (Nhập các lần đo \(U_1, I_1, U_2, I_2...\), tự động vẽ đồ thị hoặc tính toán).

#### [MODIFY] [DashboardPage.tsx](file:///d:/6_OJT/EduLab/frontend/src/pages/DashboardPage.tsx)
- Gán nhãn các bài thí nghiệm PhET có tích hợp **"Bài Thực Hành SGK Việt Nam"** để học sinh/giáo viên bấm vào làm bài.

---

## Verification Plan

### Manual Verification
- Mở `http://localhost:5173/dashboard`, chọn bài **"Thực Hành Đo Điện Trở R (Định Luật Ohm SGK Lớp 11)"**.
- Điền bảng số liệu 3 lần đo \(U, I\), bấm **"Nộp Báo Cáo"** và kiểm tra kết quả chấm điểm sai số tự động.
