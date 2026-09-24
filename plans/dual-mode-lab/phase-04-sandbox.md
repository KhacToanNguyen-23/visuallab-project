# Phase 4: Sandbox Workbench

## Goal
Ghép nối các thành phần (State, Physics, UI Tools) thành một giao diện phòng thí nghiệm tự do hoàn chỉnh (Sandbox).

## Stories Covered
- **[P1]** As a Học sinh, I want to truy cập Sandbox Lab với thanh công cụ đầy đủ 30 dụng cụ.

## File Ownership
- Workspace UI: `frontend/src/pages/lab/SandboxLab.tsx`
- Toolbar: `frontend/src/components/lab/SidebarToolbar.tsx`
- Canvas Container: `frontend/src/components/lab/CanvasWorkspace.tsx`

## Proposed Changes
1. **Layout**
   - Left Sidebar/Bottom Bar: Hiển thị icon của 30 dụng cụ (được phân loại).
   - Main Area: Vùng CanvasWorkspace chiếm toàn màn hình.
2. **Drag & Drop to Add**
   - Kéo icon từ toolbar thả vào CanvasWorkspace → gọi `useLabStore().addEntity(toolId, dropPosition)`.
   - Workspace lắng nghe state và render component `<ToolRegistry type={toolId} />` tại tọa độ đó.
3. **Save/Load Logic**
   - Nút "Save": Serialize Zustand state → POST `/api/sandbox/save`.
   - Nút "Load": GET `/api/sandbox/{id}` → Deserialize vào Zustand state.

## Tests to Write First
- Drag/Drop interaction test (cách component thêm vào Zustand store khi drop).
