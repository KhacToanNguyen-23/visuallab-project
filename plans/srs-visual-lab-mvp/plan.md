# Implementation Plan: VisualLab SRS MVP — Quy Trình 5 Bước & 3 Bài Thí Nghiệm Chuẩn GDPT 2018

**Date:** 2026-09-08  
**Mode:** --hard  
**Risk:** normal — Multi-file React 5-step workflow components + Spring Boot APIs for 3 K-12 GDPT 2018 physics simulations  
**Spec:** [`plans/srs-visual-lab-mvp/spec.md`](file:///d:/6_OJT/EduLab/plans/srs-visual-lab-mvp/spec.md)  

---

## Architecture Overview

Hệ thống triển khai chuẩn 100% theo tài liệu `SRS_VisualLab_MVP.doc`:
1. **Frontend (React 18 + TypeScript + Canvas 2D + Chart.js)**:
   - **`StepWorkflowContainer.tsx`**: Điều hướng 5 bước thực hành (1. Lý thuyết $\rightarrow$ 2. Khay dụng cụ $\rightarrow$ 3. Canvas tương tác $\rightarrow$ 4. Bảng số liệu & Đồ thị $\rightarrow$ 5. Báo cáo PDF).
   - **Simulations Module**:
     - **Bài 1 (Lớp 10)**: Đo gia tốc rơi tự do $g$ (Bi sắt, cổng quang điện $E_1, E_2$, đồng hồ MC-964).
     - **Bài 2 (Lớp 11)**: Đo suất điện động $\mathcal{E}$ và điện trở trong $r$ (Pin, biến trở con chạy, Vôn kế, Ampe kế, khóa K).
     - **Bài 3 (Lớp 12)**: Đo nhiệt dung riêng $c$ của nước (Nhiệt lượng kế, Oát kế, nhiệt kế điện tử, cốc chia độ).
   - **Data & Graphing Engine**: Tự động tính giá trị trung bình $\bar{A}$, sai số tuyệt đối $\Delta A$, sai số tỉ đối $\delta\%$ và vẽ đồ thị xu hướng ($s - t^2$ và $U - I$).

2. **Backend (Java Spring Boot REST API)**:
   - **`CurriculumRepository` / `CurriculumService`**: Cập nhật danh mục bài học chuẩn SRS cho Lớp 10, Lớp 11 và Lớp 12.
   - **`ReportService` / `ReportController`**: API hỗ trợ lưu và tải dữ liệu báo cáo thực hành của học sinh.

---

## Implementation Phases

- [Phase 1: Sequential 5-Step Lab Workflow UI](./phase-01-sequential-5-step-lab-workflow-ui.md)
  - Khởi tạo giao diện thanh tiến trình 5 bước thực hành tuần tự và khay chọn dụng cụ.
- [Phase 2: Grade 10 Free Fall Acceleration Sim (VL10.DH.TH.01)](./phase-02-grade-10-free-fall-acceleration-sim.md)
  - Mô phỏng thí nghiệm đo $g$ với nam châm điện, cổng quang điện và đồng hồ hiện số MC-964.
- [Phase 3: Grade 11 EMF & Internal Resistance Sim (VL11.DC.TH.01)](./phase-03-grade-11-emf-and-internal-resistance-sim.md)
  - Mô phỏng thí nghiệm đo suất điện động $\mathcal{E}$ và điện trở trong $r$ của nguồn pin với biến trở con chạy.
- [Phase 4: Grade 12 Specific Heat Capacity Sim (VL12.ND.TH.01)](./phase-04-grade-12-specific-heat-capacity-sim.md)
  - Mô phỏng thí nghiệm đo nhiệt dung riêng $c$ của nước với nhiệt lượng kế và oát kế.
- [Phase 5: Data Table, Automatic Graphing & PDF Report Exporter](./phase-05-data-table-graphing-and-pdf-report.md)
  - Hoàn thiện bảng số liệu tự động tính sai số, đồ thị trực quan và xuất file PDF bản tường trình A4.

---

## File Ownership & Phase Mapping

| Phase | Core Files / Components | Coverage |
| :--- | :--- | :--- |
| **Phase 1** | `src/components/workflow/StepWorkflowContainer.tsx`, `src/components/workflow/EquipmentTray.tsx` | **[P1]** Workflow 5 bước |
| **Phase 2** | `src/engine/simulations/FreeFallSimulation.ts`, `src/components/simulations/FreeFallCanvas.tsx` | **[P1]** Bài Lớp 10 |
| **Phase 3** | `src/engine/simulations/EMFResistanceSimulation.ts`, `src/components/simulations/EMFCanvas.tsx` | **[P1]** Bài Lớp 11 |
| **Phase 4** | `src/engine/simulations/SpecificHeatSimulation.ts`, `src/components/simulations/HeatCanvas.tsx` | **[P1]** Bài Lớp 12 |
| **Phase 5** | `src/components/workflow/DataTableAndGraph.tsx`, `src/utils/pdfExport.ts` | **[P1]** Bảng số liệu, Đồ thị & PDF |
