# Phase 4: Interactive Workbench UI, Toolbox & Measurement Tools

**File:** `plans/2d-workbench-sandbox/phase-04-interactive-workbench-ui.md`  
**Story Mapping:** `workbench-measurement-tools-ruler-stopwatch` [P2], `workbench-simulation-controls-slowmo-pause` [P2]  

---

## 1. Objective
Xây dựng giao diện React 19 + Tailwind CSS bao quanh Canvas: Khay đồ nghề (Toolbox Drawer), Thanh điều khiển mô phỏng (Play/Pause/Slow-mo/Reset), Thước đo milimét di động và Đồng hồ bấm giây hiện số.

---

## 2. Proposed Changes

### `frontend/src/components/workbench/ToolboxDrawer.tsx` [NEW]
- Danh mục tab thiết bị: Cơ học, Điện học, Quang học.
- Card dụng cụ kèm icon vector và tên chuẩn tiếng Việt (`VERTICAL_STAND`, `HELICAL_SPRING`, `MASS_WEIGHT_SET`, `SPRING_BALANCE`).
- Hỗ trợ kéo (Drag) linh kiện từ khay và thả (Drop) vào mặt bàn Canvas.

### `frontend/src/components/workbench/SimulationControls.tsx` [NEW]
- Nút Play / Pause vòng lặp thời gian thực.
- Nút tốc độ mô phỏng: 1.0x, 0.5x (Slow-motion), 0.2x.
- Nút Reset vị trí và trạng thái ban đầu.
- Nút bật/tắt Lưới toạ độ (Grid) và Thước đo (Ruler).

### `frontend/src/components/workbench/WorkbenchCanvas.tsx` [NEW]
- Quản lý sự kiện chuột và cảm ứng: `onPointerDown`, `onPointerMove`, `onPointerUp`.
- Cập nhật vị trí dụng cụ đang được kéo, gọi `ConstraintManager.findNearestCompatiblePort` để hiển thị glow snap.

---

## 3. Verification Criteria
- Kéo dụng cụ từ Toolbox thả vào Canvas đặt đúng tọa độ chuột khi nhả.
- Thao tác Play/Pause và Slow-motion 0.5x làm chậm tốc độ dao động của lò xo mượt mà, không bị khựng.
- Nút Thước đo hiển thị thước milimét di động trên mặt bàn, có thể kéo đến sát lò xo để đọc vạch chia.
