# Spec: VisualLab SRS MVP — Quy Trình 5 Bước & 3 Bài Thí Nghiệm Chuẩn GDPT 2018

**Date:** 2026-09-08  
**Status:** Ready  

---

## Problem Statement

Đáp ứng 100% yêu cầu kỹ thuật trong tài liệu `SRS_VisualLab_MVP.doc` bằng cách xây dựng **Workflow 5 Bước Thực Hành Tuần Tự** chuẩn sư phạm và **3 Bài Thí Nghiệm Cốt Lõi** thuộc bộ sách *Kết nối tri thức với cuộc sống* (Vật lý 10, 11, 12).

---

## User Stories

### Quy trình 5 bước thực hành
- **[P1]** Là một học sinh, tôi muốn trải nghiệm bài thí nghiệm theo 5 bước tuần tự (1. Lý thuyết $\rightarrow$ 2. Chọn dụng cụ $\rightarrow$ 3. Tiến hành Canvas $\rightarrow$ 4. Xử lý số liệu $\rightarrow$ 5. Kết luận) để nắm chắc phương pháp nghiên cứu thực nghiệm.
  - *Acceptance Criteria:* Học sinh không được nhảy bước nếu chưa hoàn thành điều kiện bước trước; khay chọn dụng cụ báo lỗi nếu chọn sai thiết bị.

### 3 Bài thí nghiệm chuẩn SRS
- **[P1]** **Bài 1 (Lớp 10)**: Đo gia tốc rơi tự do $g$ bằng nam châm điện, bi sắt, 2 cổng quang điện và đồng hồ MC-964.
  - *Acceptance Criteria:* Thả bi sắt rơi qua 2 cổng quang điện $E_1, E_2$, đồng hồ MC-964 đo chính xác thời gian $\Delta t$; vẽ đồ thị $s - t^2$ và tự động tính $g = \bar{g} \pm \Delta g$.
- **[P1]** **Bài 2 (Lớp 11)**: Đo suất điện động $\mathcal{E}$ và điện trở trong $r$ của nguồn pin bằng biến trở con chạy, Ampe kế, Von kế và khóa K.
  - *Acceptance Criteria:* Thay đổi biến trở $R$, đo cặp số liệu $(U, I)$, vẽ đồ thị $U - I$ đường thẳng suy diễn cắt trục tung tại $\mathcal{E}$ và độ dốc là $r$.
- **[P1]** **Bài 3 (Lớp 12)**: Đo nhiệt dung riêng $c$ của nước bằng nhiệt lượng kế, oát kế, biến thế nguồn và nhiệt kế điện tử.
  - *Acceptance Criteria:* Tính nhiệt lượng tỏa ra $Q = P \cdot t$ và độ tăng nhiệt độ $\Delta T$, xác định nhiệt dung riêng $c = \frac{Q}{m \cdot \Delta T}$ đạt chuẩn SGK.

---

## Functional Requirements

### 1. Workflow 5 Bước Tuần tự
1. **FR-STEP-01**: Bước 1 - Lý thuyết: Hiển thị YCCĐ, công thức vật lý và câu hỏi trắc nghiệm đầu giờ.
2. **FR-STEP-02**: Bước 2 - Chọn dụng cụ: Khay chứa các dụng cụ thực tế theo Thông tư 39/2021/TT-BGDĐT. Học sinh kéo dụng cụ cần thiết vào bàn thí nghiệm.
3. **FR-STEP-03**: Bước 3 - Thao tác Canvas: Mô phỏng tương tác 60 FPS, hỗ trợ tạo sai số thực tế (Random error generation).
4. **FR-STEP-04**: Bước 4 - Ghi số liệu & Vẽ đồ thị: Bảng điền số liệu SGK, tự động tính giá trị trung bình $\bar{A}$, sai số tuyệt đối $\Delta A$ và vẽ đường biểu diễn.
5. **FR-STEP-05**: Bước 5 - Kết luận & Nộp bài: Viết nhận xét và xuất PDF báo cáo bản tường trình A4.

---

## Technical Architecture & Stack

- **Frontend**: React 18 + TypeScript + Canvas 2D Engine + Chart.js / Recharts.
- **Backend API**: Java Spring Boot 3-Layer Architecture (`CurriculumController`, `CurriculumService`, `CurriculumRepository`).
- **Data Models**: Cập nhật `ExperimentStep`, `EquipmentTool`, `ExperimentResult` models.

---

## Success Criteria

- [ ] Hoàn thành 5 bước thực hành tuần tự mượt mà.
- [ ] Triển khai đủ 3 bài thí nghiệm: Đo $g$ rơi tự do (Lớp 10), Đo $\mathcal{E}, r$ (Lớp 11), Đo nhiệt dung riêng $c$ (Lớp 12).
- [ ] Bảng số liệu tự động tính trung bình, sai số tuyệt đối $\Delta A$ và vẽ đồ thị tương ứng.
