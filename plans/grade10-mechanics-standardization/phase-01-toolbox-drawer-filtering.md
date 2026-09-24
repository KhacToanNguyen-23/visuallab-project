# Phase 1: Toolbox Drawer Filtering

**File:** `plans/grade10-mechanics-standardization/phase-01-toolbox-drawer-filtering.md`  
**Story Mapping:** Guided Lab toolbox scoping

---

## 1. Objective
Cập nhật `ToolboxDrawer.tsx` và `Interactive2DWorkbench.tsx` để hỗ trợ prop `allowedToolIds?: string[]`.
- Khi ở chế độ Guided Lab (`/lab/curriculum/:labId`): Chỉ hiển thị các dụng cụ trong `scenario.toolIds` từ `DacTa.md`.
- Khi ở chế độ Sandbox (`/workbench`): Hiển thị đầy đủ tất cả dụng cụ.

## 2. Changes
- `frontend/src/components/workbench/ToolboxDrawer.tsx`: Lọc `APPARATUS_TEMPLATES` theo `allowedToolIds`.
- `frontend/src/components/workbench/Interactive2DWorkbench.tsx`: Nhận và truyền `allowedToolIds` xuống `ToolboxDrawer`.
- `frontend/src/pages/CurriculumLabPage.tsx`: Truyền `scenario.toolIds` vào `Interactive2DWorkbench`.

## 3. Verification
- Mở `/lab/curriculum/sim-free-fall`: Hộp dụng cụ chỉ chứa 5 dụng cụ theo `DacTa.md`.
- Mở `/workbench`: Hộp dụng cụ mở toàn bộ.
