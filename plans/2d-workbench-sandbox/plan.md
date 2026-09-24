# Implementation Plan: 2.5D Interactive Physics Workbench Sandbox (NOBOOK Style)

**Directory:** plans/2d-workbench-sandbox/  
**Mode:** --hard  
**Risk:** normal — multi-file frontend architecture addition (Canvas 2D + SVG assets + physics solver), testable, no auth/schema/infra risk  
**Spec Reference:** [plans/2d-workbench-sandbox/spec.md](file:///d:/Project/FptProject/visuallab-project/plans/2d-workbench-sandbox/spec.md)  
**Brainstorm Report:** [plans/reports/260922-2d-workbench-sandbox-brainstorm.md](file:///d:/Project/FptProject/visuallab-project/plans/reports/260922-2d-workbench-sandbox-brainstorm.md)  

---

## Architecture Overview

Chuyển đổi từ mô hình Three.js 3D rời rạc sang **Kiến trúc Bàn thí nghiệm 2.5D Canvas Sandbox (NOBOOK style)**:
1. **Core Data Model (`Apparatus-Port-Socket`):** Mỗi dụng cụ là 1 thực thể có tọa độ, thuộc tính vật lý và danh sách các cổng neo (Ports) có tọa độ offset và phân loại tương thích.
2. **Asset & Render Engine:** Nạp vector SVG độ nét cao vào Canvas 2D (drawImage), hỗ trợ lưới tọa độ, pan, zoom, và render biến dạng lò xo theo tỷ lệ $\Delta l$.
3. **Lõi Vật lý PhET (Euler-Cromer Numerical Integrator):** Giải chính xác hệ phương trình vi phân dao động đàn hồi có cản, tính ma sát trượt và gia tốc rơi.
4. **Interactive Sandbox Workbench UI:** Giao diện React 19 + Tailwind CSS gồm khay đồ nghề (Toolbox), Canvas tương tác kéo thả tự động hút (Magnetic Snap $R \le 25\text{px}$), thước đo, đồng hồ bấm giây và thanh điều khiển (Play/Pause/Slow-mo).
5. **Kịch bản Bài học SGK (Curriculum Scenario) & Auto-Grading:** Đóng gói Bài 38 Lớp 10 (Định luật Hooke) với bảng thu thập số liệu tự động và bộ chấm điểm 3 tiêu chí: Thao tác (30%) + Sai số (40%) + Báo cáo trắc nghiệm (30%).

---

## Phase Breakdown

- **[x] Phase 1:** Core Data Model & Port-Socket Architecture (`phase-01-apparatus-port-model.md`)
  - Maps to: `workbench-magnetic-port-snapping` [P1] (Status: PASSING)
- **[x] Phase 2:** SVG Asset Loader & 2.5D Canvas Apparatus Renderer (`phase-02-svg-asset-loader-renderer.md`)
  - Maps to: `workbench-sandbox-toolbox-drag-drop` [P1] (Status: PASSING)
- **[x] Phase 3:** Euler-Cromer Physics Engine & Constraint Solver (`phase-03-physics-euler-cromer-solver.md`)
  - Maps to: `workbench-euler-cromer-spring-oscillation` [P1] (Status: PASSING)
- **[x] Phase 4:** Interactive Workbench UI, Toolbox & Measurement Tools (`phase-04-interactive-workbench-ui.md`)
  - Maps to: `workbench-measurement-tools-ruler-stopwatch` [P2], `workbench-simulation-controls-slowmo-pause` [P2] (Status: PASSING)
- **[x] Phase 5:** Grade 10 Hooke's Law Curriculum Scenario & Auto-Grading (`phase-05-curriculum-hooke-autograde.md`)
  - Maps to: `curriculum-grade10-hooke-auto-grading` [P1] (Status: PASSING)

---

## Session Notes
<!-- Updated by cook automatically — do not edit manually -->

**Last active:** 2026-09-22 13:11
**Phase in progress:** COMPLETED
**Status:** All 5 phases implemented and verified. All 6 features passing.

### Decisions made this session
- Implemented `HookeLawScenario` preloading Stand, Hooke Spring, and Mass Weights tray with ruler.
- Built `DataTablePanel` computing dynamic force $F$, extension $\Delta l$, spring constant $k_i$, and average $\bar{k}$.
- Built `HookeAutoGrader` executing 3-tier scoring (30% Thao tác + 40% Sai số + 30% Báo cáo trắc nghiệm) with unit test passing 100/100.
- Registered `/lab/grade10/hooke` in `main.tsx` routing.

### Next immediate action
All phases completed. Final verification and summary walkthrough.

---

## Risks & Mitigations

1. **SVG Asset Loading Delay:**
   - *Risk:* Canvas render khi ảnh chưa tải xong gây chớp nháy hoặc crash.
   - *Mitigation:* `AssetManager` preload toàn bộ SVG trước khi mount Canvas và vẽ fallback vector nếu asset chưa load kịp.
2. **Euler-Cromer Numerical Stability:**
   - *Risk:* Kéo dãn lò xo quá mạnh dẫn tới tràn số hoặc dao động vô tận.
   - *Mitigation:* Cố định fixed timestep $dt = 0.016\text{s}$, áp dụng damping factor $\gamma \in [0.05, 0.2]$ và clamping biên độ cực đại $x_{\max} = 1.0\text{m}$.
3. **Snap Collision Conflicts:**
   - *Risk:* Nhiều cổng gần nhau dẫn tới hút sai vị trí.
   - *Mitigation:* Chỉ cho phép ghép đôi khi `port.type` tương thích và chọn cổng có khoảng cách Euclidean nhỏ nhất.
