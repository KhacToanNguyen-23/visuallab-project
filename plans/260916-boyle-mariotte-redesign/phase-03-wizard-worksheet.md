# Phase 3: 3-Step Wizard Worksheet & 3-Tier Auto-Grading Engine

## Mục Tiêu
Tạo component `BoyleLabWizardWorksheet.tsx` hỗ trợ thu thập dữ liệu, vẽ đồ thị kép và tự động chấm điểm theo tiêu chuẩn `visuallab-standards`.

## Chi Tiết Kỹ Thuật
- **Bước 1 (Chuẩn bị & Dụng cụ)**:
  - Giới thiệu mục tiêu bài học SGK Vật lý 12.
  - Interactive Checklist kiểm tra độ kín xi lanh, kết nối áp kế, ổn định nhiệt độ.
- **Bước 2 (Thu thập số liệu & Sai số)**:
  - Bảng đo $N \ge 4$ lần: $V, p$, tự động tính $p \cdot V$, $1/V$, sai số tuyệt đối.
  - Hỗ trợ nút đồng bộ trực tiếp từ thanh HUD 3D hoặc nhập dữ liệu thủ công.
  - Thống kê trung bình $\overline{pV}$, sai số tuyệt đối $\overline{\Delta(pV)}$, sai số tỉ đối $\delta(pV)\%$.
- **Bước 3 (Đồ thị & Trắc nghiệm báo cáo)**:
  - Đồ thị 1: $p$ theo $V$ (đường cong Hyperbole).
  - Đồ thị 2: $p$ theo $1/V$ (đường thẳng đi qua gốc tọa độ $O$).
  - 3 câu trắc nghiệm SGK GDPT 2018 (Chủ đề Khí lý tưởng - Đẳng nhiệt).
  - Khối tổng kết đánh giá 3 tầng (Thao tác 3đ, Sai số 4đ, Trắc nghiệm 3đ $\to$ Tổng 10đ).
  - Nút "Mở Phiếu Nộp Bài" kích hoạt ngăn kéo `FloatingAssignmentDrawer`.
