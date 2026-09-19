# Brainstorm: Thiết Kế Lại Thí Nghiệm Đo Nhiệt Dung Riêng (Specific Heat Lab)

**Date:** 2026-09-18
**Curriculum:** SGK GDPT 2018 Vật Lý 12 - Chủ đề Nhiệt Học (Đo nhiệt dung riêng)
**Standards:** `/visuallab-standards`

## Ideas Explored
1. **2D Canvas vs 3D Three.js**: Quyết định chọn 3D Three.js Studio với bình nhiệt lượng kế 2 lớp trong suốt, dây mayso nung nhiệt phát sáng, que khuấy cơ học và que đo nhiệt độ số.
2. **Khảo sát đa chất lỏng**: Nước tinh khiết ($c = 4180\text{ J/(kg}\cdot\text{K)}$), Cồn Ethanol ($c = 2440\text{ J/(kg}\cdot\text{K)}$), Dầu thực vật ($c = 2000\text{ J/(kg}\cdot\text{K)}$).
3. **Tính năng an toàn & thực tế**: Thêm que khuấy cơ học tăng đều nhiệt và tự động ngắt nhiệt bảo vệ khi chất lỏng chạm điểm sôi ($100^\circ\text{C}$ cho nước, $78^\circ\text{C}$ cho cồn, $200^\circ\text{C}$ cho dầu).
4. **Quy trình 3-Tab Wizard**: 1. Nhiệm Vụ, 2. Số Liệu (bảng + đồ thị $T(t)$), 3. Nộp Bài (Trắc nghiệm + Bảng điểm thang 10.0 + Nộp EduLab).

## User's Direction
- Sử dụng mô hình 3D Three.js với bình nhiệt lượng kế, que khuấy cơ học quay đều và tự động ngắt khi sôi.
- Hỗ trợ khảo sát 3 chất lỏng: Nước, Cồn, Dầu thực vật.
- Tự do tùy chỉnh công suất $P$ (W), khối lượng chất lỏng $m$ (kg), thời gian đun $t$ (s).
- Hệ thống chấm điểm tự động GDPT 2018 và nộp bài đồng bộ.

## Open Questions for Planning
1. Thiết kế module chia tách: `specificHeatEngine.ts`, `SpecificHeatWorkbench3D.tsx`, `SpecificHeatWorkbenchHudDock.tsx`, `SpecificHeatLabWizardWorksheet.tsx`, `SpecificHeatLab.tsx`.
2. Giữ nguyên route `/lab/specific-heat` và cấu trúc export cho học sinh / giáo viên.

## Risks
1. Hiệu năng render 3D Three.js và animation hạt bọt khí / que khuấy quay vòng $\rightarrow$ Tối ưu bộ nhớ, clean unmount đúng chuẩn.
2. Đồng bộ thời gian thực giữa timer đun và cập nhật nhiệt độ $T$ $\rightarrow$ Sử dụng `performance.now()` hoặc clock chính xác trong engine.
