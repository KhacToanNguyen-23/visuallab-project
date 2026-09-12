# Implementation Plan: Universal Physics Workbench (PhET SceneryStack Sandbox)

**Spec:** [`plans/universal-physics-workbench/spec.md`](file:///d:/6_OJT/EduLab/plans/universal-physics-workbench/spec.md)  
**Report:** [`plans/reports/260911-lab-workbench-brainstorm.md`](file:///d:/6_OJT/EduLab/plans/reports/260911-lab-workbench-brainstorm.md)  
**Mode:** `--fast`  
**Risk:** normal — Multi-file React/SceneryStack frontend page & sandbox components, no database schema breaking changes.

---

## High-Level Architecture

Xây dựng hệ thống **Bàn Thí Nghiệm Vật Lý Tự Do (Universal Physics Workbench)** theo kiến trúc PhET SceneryStack Hybrid Standard:

1. **Phase 1: Core Workbench Layout & Scenery Palette (`phase-01-core-workbench-and-palette.md`)**
   - Khung giao diện `/workbench/universal` với thanh công cụ Palette bên trái phân loại 3 môn (Cơ - Điện - Quang).
   - Canvas SceneryStack `Display` kích thước linh hoạt, cho phép kéo thả rải các vật thể linh kiện lên bàn thí nghiệm.

2. **Phase 2: Magnetic Snap-Port Engine & Multi-domain Solvers (`phase-02-snapport-and-multi-domain-solvers.md`)**
   - Hệ thống phát hiện điểm kết nối từ tính (`SnapPort`) khi khoảng cách $<15\text{px}$.
   - Tích hợp 3 Physics Solvers nhẹ: Cơ học (Spring-Mass Chain), Điện học (Mạch DC Nodal Analysis), Quang học (Ray Tracing Snell's Law).

3. **Phase 3: Measurement Tools, Routing & Snapshot Export (`phase-03-routing-and-snapshot-export.md`)**
   - Công cụ đo đạc: Thước đo $cm$, Thước đo góc 360°, Vôn kế, Ampe kế.
   - Nút **📸 Chụp Ảnh & Lưu Kho** kết hợp Cloudinary Storage API.
   - Cập nhật điều hướng `labRoutes.ts`, `main.tsx` và `DashboardPage.tsx`.

---

## Phase Breakdown & Execution Order

- [`phase-01-core-workbench-and-palette.md`](file:///d:/6_OJT/EduLab/plans/universal-physics-workbench/phase-01-core-workbench-and-palette.md): Khung Palette & Canvas DragDrop SceneryStack.
- [`phase-02-snapport-and-multi-domain-solvers.md`](file:///d:/6_OJT/EduLab/plans/universal-physics-workbench/phase-02-snapport-and-multi-domain-solvers.md): Động cơ từ tính SnapPort & 3 Physics Solvers.
- [`phase-03-routing-and-snapshot-export.md`](file:///d:/6_OJT/EduLab/plans/universal-physics-workbench/phase-03-routing-and-snapshot-export.md): Dụng cụ đo, Routing & Lưu Kho.
