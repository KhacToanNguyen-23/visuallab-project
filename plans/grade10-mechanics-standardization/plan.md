# Implementation Plan: Grade 10 Mechanics Labs Standardization & Filtered Toolbox

**Directory:** plans/grade10-mechanics-standardization/  
**Mode:** Standard  
**Risk: normal — multi-file frontend simulation logic, SVG assets, and UI drawer filtering; no auth/schema/infra risk**  
**Spec Reference:** [plans/grade10-mechanics-standardization/spec.md](file:///d:/Project/FptProject/visuallab-project/plans/grade10-mechanics-standardization/spec.md)  
**Brainstorm Report:** [plans/reports/260922-grade10-mechanics-standardization-brainstorm.md](file:///d:/Project/FptProject/visuallab-project/plans/reports/260922-grade10-mechanics-standardization-brainstorm.md)

---

## Architecture Overview
1. **ToolboxDrawer Filtering:** `ToolboxDrawer.tsx` nhận danh sách `allowedToolIds?: string[]`. Khi chạy ở `/lab/curriculum/:labId`, chỉ hiển thị đúng các dụng cụ có trong `scenario.toolIds` từ `DacTa.md`. Khi ở `/workbench` (Sandbox), hiển thị toàn bộ 30+ dụng cụ.
2. **Mechanics Kinematics & Collision Solver:** Mở rộng `EulerCromerSolver` thành bộ giải động học và va chạm tổng quát cho 5 bài Cơ học Lớp 10 (máng nghiêng $a = g\sin\alpha$, rơi tự do $h = \frac{1}{2}gt^2$, ma sát trượt $F_{ms} = \mu N$, va chạm đệm khí $p = p'$, và lò xo Hooke).
3. **High-Resolution SVG Sprites:** Bổ sung vector SVG chất lượng cao cho `AIR_TRACK_BASE`, `GLIDER_CAR`, `ELECTROMAGNET`, `WOODEN_BLOCK`, `SPRING_BALANCE` trong `AssetManager.ts` và `WorkbenchRenderer.ts`.
4. **DataTablePanel Telemetry & Auto-Grading:** Tự động bắt tín hiệu ngắt từ cổng quang và lực kế để đổ số liệu thực nghiệm vào bảng đo, tính sai số và chấm điểm 3 cột ($30\% + 40\% + 30\%$).

---

## Phase Breakdown

- [ ] **Phase 1:** Toolbox Drawer Filtering (`phase-01-toolbox-drawer-filtering.md`)
  - Lọc dụng cụ theo `scenario.toolIds` ở Guided Lab, mở toàn bộ ở Sandbox.
- [ ] **Phase 2:** Mechanics Kinematics & Collision Solver (`phase-02-mechanics-kinematics-solver.md`)
  - Mô phỏng lăn máng nghiêng, ngắt rơi tự do, kéo ma sát trượt, và va chạm đệm khí.
- [ ] **Phase 3:** High-Resolution SVG Sprites (`phase-03-svg-assets-mechanics.md`)
  - Render SVG sắc nét cho các dụng cụ cơ học mới kèm snap ports chuẩn.
- [ ] **Phase 4:** Telemetry Sync & 3-Tier Auto-Grading (`phase-04-telemetry-auto-grading.md`)
  - Đồng bộ số liệu đo vào `DataTablePanel` và chấm điểm 5 bài Cơ học Lớp 10.
