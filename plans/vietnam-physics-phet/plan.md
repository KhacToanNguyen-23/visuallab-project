# Implementation Plan: Nền tảng Thí nghiệm Vật lý Tương tác EduLab (PhET Việt Nam)

**Date:** 2026-09-08  
**Mode:** --hard  
**Risk:** normal — Multi-file React/Canvas frontend + Spring Boot backend implementation for interactive physics simulation platform  
**Spec:** [`plans/vietnam-physics-phet/spec.md`](file:///d:/6_OJT/EduLab/plans/vietnam-physics-phet/spec.md)  

---

## Architecture Overview

Hệ thống bao gồm 2 phần chính:
1. **Frontend (React 18 + TypeScript + Canvas 2D / SVG Engine)**:
   - **Canvas Interactive Layer**: Xử lý event kéo thả linh kiện, hít điểm nối (snapping), nối dây dẫn, render dòng hạt electron và hiệu ứng độ sáng bóng đèn ở 60 FPS.
   - **Physics Solver Engine**: Module TypeScript thuần giải hệ phương trình Kirchhoff (Nodal Analysis Matrix Solver) để tính toán cường độ dòng điện $I$ và điện thế $V$ tại mọi nút trong mạch.
   - **UI & Control Panel**: Bảng điều khiển sliders (điện áp, điện trở), các công cụ đo lường (Ampe kế, Von kế), nút Play/Pause/Reset.
   - **Sharing & Export Module**: Chụp ảnh Canvas (PNG/SVG) và mã hóa Base64 URL parameter.

2. **Backend (Java Spring Boot REST API)**:
   - Cung cấp API danh mục bài thí nghiệm theo chương trình GDPT 2018.
   - Lưu trữ và tải các cấu hình bài thí nghiệm mẫu (Presets).

---

## Implementation Phases

- [Phase 1: Project Setup & Java Spring Boot Backend API](./phase-01-project-setup-and-backend.md)
  - Khởi tạo Spring Boot API và cấu hình danh mục bài học GDPT 2018 (Cơ, Nhiệt, Điện, Quang).
- [Phase 2: Physics Circuit Solver & Canvas 2D Renderer Engine](./phase-02-circuit-solver-and-canvas-engine.md)
  - Triển khai thuật toán Kirchhoff Nodal Analysis Solver và Engine Canvas 2D tương tác.
- [Phase 3: React UI Component & Interactive Control Panel](./phase-03-react-ui-and-control-panel.md)
  - Xây dựng giao diện React cho bảng linh kiện, công cụ đo lường (Ampe kế, Von kế) và bảng sliders.
- [Phase 4: Export PNG/SVG & State Sharing via URL](./phase-04-export-and-url-sharing.md)
  - Tích hợp tính năng chụp ảnh Canvas và encode/decode state ra URL query parameter.

---

## File Ownership & Phase Mapping

| Phase | Core Files / Components | Coverage |
| :--- | :--- | :--- |
| **Phase 1** | `backend/src/main/java/...`, `package.json`, `src/types/` | Framework setup & API |
| **Phase 2** | `src/engine/physics/CircuitSolver.ts`, `src/engine/canvas/CanvasRenderer.ts` | **[P1]** Circuit Solver & Simulation |
| **Phase 3** | `src/components/circuit/CircuitWorkspace.tsx`, `src/components/controls/` | **[P1]** Interactive Controls & Tools |
| **Phase 4** | `src/utils/exportImage.ts`, `src/utils/urlState.ts` | **[P3]** Export PNG & URL Sharing |

---

## Risks & Mitigations

1. **Rủi ro tính toán mạch điện phức tạp (Short circuit / Singular matrix)**:
   - *Khắc phục*: Thêm điện trở trong nhỏ ($R_{internal} = 10^{-4} \Omega$) cho pin và dây nối để tránh ma trận suy biến khi ngắn mạch.
2. **Sụt giảm FPS khi render dòng electron**:
   - *Khắc phục*: Sử dụng Offscreen Canvas / Layering Canvas (tách layer sơ đồ tĩnh và layer hạt electron động).
