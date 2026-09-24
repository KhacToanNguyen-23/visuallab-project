# Plan: Dual Constraint Physics Snapping Engine (POINT_ANCHOR & LINEAR_RAIL)

Mode: --fast
Risk: normal — Nâng cấp SnapEngine hỗ trợ đồng thời điểm neo cố định (Anchor) và ray trượt 1 chiều (Rail Constraint) mà không phá vỡ tương thích ngược.

## Mục tiêu
1. **Nâng cấp `SnapEngine.ts`**:
   - Mở rộng kiểu dữ liệu cổng: `POINT_ANCHOR` và `LINEAR_RAIL`.
   - Hỗ trợ chiếu vuông góc (Orthogonal Projection) của điểm chuột/tọa độ lên đoạn thẳng ray $[P_1, P_2]$.
   - Khóa góc xoay $\theta$ theo vector ray khi đã snap.
   - Thêm các loại cổng mới cho Điện (`PIN_POS`, `PIN_NEG`), Nhiệt (`CUP_INNER`, `PROBE_TIP`), và Khí (`CYLINDER_CHAMBER`, `PISTON_HEAD`).
2. **Cập nhật các Concrete Apparatuses**:
   - `InclinedPlaneApparatus` / `AirTrackApparatus`: Định nghĩa rãnh trượt `LINEAR_RAIL` từ chân dốc đến đỉnh dốc.
   - `PhotogateApparatus`: Chân kẹp `RAIL_CLAMP` trượt dọc theo rãnh máng $s \in [0, 1]$.
   - `SpringApparatus`, `StandApparatus`, `WeightApparatus`: Ghép nối qua `POINT_ANCHOR`.
   - `GasPistonApparatus`: Pít-tông trượt dọc theo trục xy-lanh `LINEAR_RAIL`.
3. **Tích hợp Tương tác Kéo Thả (Drag & Snap Pipeline)**:
   - Khi kéo thiết bị con đang snap trên ray, giới hạn chuyển động 1D dọc theo ray.
   - Hiển thị phản hồi thị giác: Vòng tròn bắt dính (Snap Halo) khi di chuột vào vùng bắt dính.

---

## Các Phase Triển Khai Chi Tiết

- [x] **Phase 1: Core SnapEngine 2.0 Math & Types**
  - Cập nhật `SnapPort`, `SnapConstraintType`, `SnapResult`.
  - Viết thuật toán chiếu điểm lên đoạn thẳng `projectPointToSegment(p, a, b)` và tính khoảng cách cực tiểu.
- [x] **Phase 2: Apparatus SnapPort Declarations**
  - Khai báo điểm neo và ray trượt trong `StandApparatus`, `InclinedPlaneApparatus`, `AirTrackApparatus`, `PhotogateApparatus`, `SpringApparatus`, `WeightApparatus`.
- [x] **Phase 3: Sandbox & Lab Scene Interactive Snapping**
  - Cập nhật logic `onDrag` trong `UniversalSandboxScene` và các bài lab cụ thể để xử lý `LINEAR_RAIL` sliding mượt mà và tự động xoay góc ray.
- [x] **Phase 4: Verification & Build Check**
  - Chạy `npm run build` và kiểm thử thành công (0 errors).

---

## Session Notes
**Status:** Completed All Phases. 100% build clean.

