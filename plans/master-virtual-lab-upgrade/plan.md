# Master Plan: Realistic Immersive Virtual Lab Suite

**Mode:** fast
**Risk:** normal — touches public lab data services, canvas renderer, live graph panel, and grade result view

## Overview
Tổng kế hoạch triển khai nâng cấp toàn diện dự án VisualLab theo tất cả các yêu cầu đã được chốt:
1. **DacTa.md 14 Bài Lab**: Chuẩn hóa dữ liệu lab Lớp 10, 11, 12 trên Landing Page & Catalog.
2. **Realistic Engineering Equipment UI**: Nâng cấp hiệu ứng ánh kim loại, mặt kính phản quang & sợi đốt rực sáng cho bộ dụng cụ Canvas 2D.
3. **World-Class Interactive Enhancements**: Bổ sung đồ thị thời gian thực (Live Graphing) & Biểu đồ Radar Chart phân tích năng lực 3 chiều.

---

## Phases

### Phase 1: Tích Hợp 14 Bài Thực Hành Chuẩn DacTa.md (P1)
- **File:** `plans/master-virtual-lab-upgrade/phase-01-dacta-labs-and-fullscreen-shell.md`
- **Mục tiêu:** Cập nhật `src/services/labService.ts` với 14 bài thực hành chuẩn SGK GDPT 2018.

### Phase 2: Nâng Cấp Giao Diện Dụng Cụ Kỹ Thuật Chân Thực (P1)
- **File:** `plans/master-virtual-lab-upgrade/phase-02-realistic-equipment-ui.md`
- **Mục tiêu:** Viết lại hiệu ứng Metallic Gradients, Glass Sheen & Filament glow trong `CanvasRenderer.ts`.

### Phase 3: Đồ Thị Động Thời Gian Thực & Radar Chart Năng Lực (P1)
- **File:** `plans/master-virtual-lab-upgrade/phase-03-live-graphing-and-radar-chart.md`
- **Mục tiêu:** Nâng cấp `DataTableAndGraph.tsx` (Live SVG Graph) và `GradeResultView.tsx` (SVG Radar Chart).

---

## Verification Plan
- Chạy `npm run build` trong `frontend/` để kiểm tra biên dịch TypeScript toàn bộ dự án.
