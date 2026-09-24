# Phase 2: SVG Asset Loader & 2.5D Canvas Apparatus Renderer

**File:** `plans/2d-workbench-sandbox/phase-02-svg-asset-loader-renderer.md`  
**Story Mapping:** `workbench-sandbox-toolbox-drag-drop` [P1]  

---

## 1. Objective
Xây dựng module nạp tài nguyên vector SVG (`AssetManager`) và bộ kết xuất Canvas 2D (`WorkbenchRenderer`) hiển thị dụng cụ độ nét cao 60 FPS, vẽ lưới toạ độ, chỉ thị snap glow khi rê gần cổng và hỗ trợ lò xo co dãn chân thực.

---

## 2. Proposed Changes

### `frontend/src/engine/workbench/AssetManager.ts` [NEW]
- Preload và cache toàn bộ file SVG trong `frontend/src/assets/apparatus/`.
- Cung cấp hàm `getAsset(id: string): HTMLImageElement | null`.
- Tự động tạo vector fallback (dùng Canvas Path đơn giản) nếu một file SVG cụ thể chưa được tải về máy, đảm bảo ứng dụng không bao giờ bị lỗi màn hình trắng.

### `frontend/src/engine/workbench/WorkbenchRenderer.ts` [NEW]
- Quản lý vòng lặp `requestAnimationFrame`.
- Phương thức `drawGrid(width, height, cellSize = 20)`.
- Phương thức `drawApparatus(apparatus: ApparatusInstance, isSelected: boolean)`.
  - Đối với Lò xo (`HELICAL_SPRING`): Tách vẽ khuyên trên, thân cuộn lò xo co dãn theo `scaleY = (restLength + deltaL) / restLength`, móc dưới trượt theo tọa độ đuôi lò xo.
  - Đối với Quả cân (`MASS_WEIGHT`): Vẽ thân quả cân dập nổi gram, vẽ móc trên và khuyên đáy.
  - Đối với Giá đỡ (`VERTICAL_STAND`): Vẽ đế gang, thanh inox có vạch chia cm và khớp kẹp.
- Phương thức `drawSnapIndicators(candidatePort: ApparatusPort | null)`.

---

## 3. Verification Criteria
- Canvas đạt $60\text{ FPS}$ liên tục khi vẽ tối thiểu 15 dụng cụ cùng lúc.
- Lò xo co dãn mượt mà không làm méo hình dáng khuyên trên và móc dưới.
- Hiển thị viền sáng xanh (magnetic snap glow) rõ ràng khi đưa quả cân vào bán kính $25\text{px}$ quanh móc lò xo.
