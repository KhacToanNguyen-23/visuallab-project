# Brainstorm: VisualLab SRS MVP - Cấu Trúc 5 Bước & 3 Bài Thí Nghiệm Chuẩn GDPT 2018

**Date:** 2026-09-08

## Ideas Explored

1. **Giao diện 5 Bước Tuần tự (Sequential 5-Step Workflow)**:
   - Bước 1: Mục tiêu & Lý thuyết
   - Bước 2: Chuẩn bị & Chọn dụng cụ (Khay dụng cụ, kiểm tra đúng/sai)
   - Bước 3: Tiến hành thí nghiệm (Canvas 2D tương tác)
   - Bước 4: Ghi & Xử lý số liệu (Bảng số liệu SGK + Tự động tính trung bình/sai số + Vẽ đồ thị)
   - Bước 5: Kết luận & Nộp bài

2. **3 Bài Thực Hành Chuẩn SRS (Mục 5 - Kết Nối Tri Thức)**:
   - **Bài Lớp 10 (VL10.DH.TH.01)**: Đo gia tốc rơi tự do $g$ (Bi sắt, nam châm điện, 2 cổng quang điện, đồng hồ hiện số MC-964).
   - **Bài Lớp 11 (VL11.DC.TH.01)**: Đo suất điện động $\mathcal{E}$ và điện trở trong $r$ của nguồn pin (Biến trở con chạy, Ampe kế, Von kế, khóa K).
   - **Bài Lớp 12 (VL12.ND.TH.01)**: Đo nhiệt dung riêng $c$ của nước (Nhiệt lượng kế, Oát kế, nhiệt kế điện tử, biến thế nguồn).

## User's Direction

- Tập trung hoàn thiện **Option A (Module 3 - Cốt lõi Simulation chuẩn SRS)**:
  - Tích hợp Quy trình 5 bước thực hành chuẩn sư phạm.
  - Xây dựng 3 bài thực hành SGK môn Vật Lý 10, 11, 12 chuẩn Thông tư 32/2018 & 39/2021.

## Open Questions

1. Xử lý sai số ngẫu nhiên: Cần công thức tính ngẫu nhiên $\Delta A$ và sai số dụng cụ $\Delta_{dc}$ tự động trong Bảng số liệu.
2. Vẽ đồ thị tự động: Dùng Canvas 2D hay thư viện Chart.js cho đồ thị $s - t^2$ và $U - I$?

## Risks

1. **Tính chính xác của mô phỏng 3 bài mới**: Cần đảm bảo thuật toán rơi tự do $s = \frac{1}{2}gt^2$, định luật Ohm mạch chứa nguồn $U = \mathcal{E} - I \cdot r$, và truyền nhiệt $Q = m \cdot c \cdot \Delta T$ chính xác tuyệt đối.
