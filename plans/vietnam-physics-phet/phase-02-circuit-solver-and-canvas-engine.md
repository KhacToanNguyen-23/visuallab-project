# Phase 2: Physics Circuit Solver & Canvas 2D Renderer Engine

**Goal:** Xây dựng bộ giải thuật toán mạch điện Kirchhoff (Nodal Analysis Solver) và Engine Canvas 2D kéo thả linh kiện.

---

## Deliverables

1. **Kirchhoff Nodal Solver (`src/engine/physics/CircuitSolver.ts`)**:
   - Tự động lập ma trận hệ phương trình điện thế nút cho mạch điện bất kỳ.
   - Tính toán dòng điện $I$, điện thế $V$, công suất tiêu thụ $P$ trên từng linh kiện.
2. **Canvas 2D Engine (`src/engine/canvas/CanvasRenderer.ts`)**:
   - Render linh kiện (Pin, Điện trở, Bóng đèn, Công tắc, Dây dẫn) với style sắc nét.
   - Xử lý kéo thả (Drag & Drop), snapping điểm nối nút (node snapping).
   - Render animation hạt electron chạy trên dây dẫn theo chiều và vận tốc tỉ lệ thuận với $I$.

---

## Tasks

- [ ] Viết module `CircuitSolver.ts` giải ma trận điện thế nút (Modified Nodal Analysis).
- [ ] Xây dựng Canvas Renderer vẽ linh kiện và điểm nối grid.
- [ ] Xử lý event chuột/cảm ứng kéo thả linh kiện và nối dây.
- [ ] Tích hợp `requestAnimationFrame` render hoạt ảnh electron và độ sáng bóng đèn $P = I^2 R$.
