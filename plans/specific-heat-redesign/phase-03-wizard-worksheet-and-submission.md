# Phase 3: Wizard Worksheet & Export Wrapper (Đo Nhiệt Dung Riêng)

**Goal:** Xây dựng phiếu báo cáo 3-tab Wizard Worksheet, tích hợp trắc nghiệm GDPT 2018, chấm điểm tự động và xuất module chính.

## Deliverables
- `frontend/src/components/simulations/specific-heat/SpecificHeatLabWizardWorksheet.tsx`:
  - Tab 1: 3 Thẻ nhiệm vụ trực quan, huy hiệu trạng thái & nút ghi nhận số liệu.
  - Tab 2: Bảng số liệu ($m, P, t, T_1, T_2, \Delta T, c_{\text{đo}}, c_{\text{chuẩn}}, \delta\%$) và đồ thị đường nhiệt độ $T(t)$.
  - Tab 3: 3 câu trắc nghiệm GDPT 2018, bảng điểm tự động thang 10.0 và nộp bài EduLab.
- `frontend/src/components/simulations/specific-heat/SpecificHeatLab.tsx`: Component container điều phối toàn bộ luồng.
- `frontend/src/components/simulations/SpecificHeatLab.tsx`: Re-export từ `./specific-heat/SpecificHeatLab`.
