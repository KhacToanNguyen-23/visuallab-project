# Phase 1: Core Workbench Layout & Scenery Palette

**Plan:** [`plans/universal-physics-workbench/plan.md`](file:///d:/6_OJT/EduLab/plans/universal-physics-workbench/plan.md)  
**Spec Story:** P1-US1 (Kéo thả linh kiện từ Palette vào Canvas)

---

## 🎯 Phase Goal
Dựng giao diện Bàn Thí Nghiệm Tự Do `/workbench/universal` bao gồm Palette chọn dụng cụ bên trái (Cơ, Điện, Quang) và SceneryStack Canvas bên phải cho phép chọn kéo nhả linh kiện ra bàn thí nghiệm.

---

## 🛠️ Proposed Changes

### Frontend Components

#### [NEW] [WorkbenchPalette.tsx](file:///d:/6_OJT/EduLab/frontend/src/components/workbench/WorkbenchPalette.tsx)
- Sidebar chọn linh kiện theo 3 tab (Cơ học: Lò xo, Dây treo, Quả nặng; Điện học: Pin, Bóng đèn, Công tắc, Dây; Quang học: Đèn Laser, Thấu kính hội tụ, Thấu kính phân kỳ).
- Thẻ xem trước biểu tượng linh kiện PhET với nút "Thêm vào bàn".

#### [NEW] [SceneryUniversalWorkbench.tsx](file:///d:/6_OJT/EduLab/frontend/src/components/workbench/SceneryUniversalWorkbench.tsx)
- Container SceneryStack `Display` kết hợp `Node` quản lý danh sách vật thể động.
- Lắng nghe sự kiện thả linh kiện từ Palette để tạo `Node` tương ứng (SpringNode, MassNode, BatteryNode, BulbNode, LaserNode, LensNode).
- Hỗ trợ di chuyển tự do bằng `Scenery.DragListener`.

#### [NEW] [UniversalWorkbenchPage.tsx](file:///d:/6_OJT/EduLab/frontend/src/pages/UniversalWorkbenchPage.tsx)
- Trang điều hướng chính kết hợp Header thanh công cụ (Reset, Xóa hết, Chụp ảnh, Tùy chỉnh lưới).

---

## 🧪 Verification Criteria

- [ ] `npx tsc --noEmit` đạt 0 lỗi biên dịch.
- [ ] Chọn linh kiện từ Palette thêm thành công vào bàn làm việc SceneryStack.
