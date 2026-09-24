# Implementation Plan: Dual-Mode Virtual Physics Lab

Mode: --hard
Risk: normal — Multi-file architectural foundation (Zustand + Matter.js ECS) but isolated to the lab workbench, no destructive infra changes.

## Overview
Xây dựng nền tảng Virtual Physics Lab gồm 2 chế độ: Guided (Theo SGK) và Sandbox (Tự do). Áp dụng kiến trúc ECS (Entity-Component-System) phân tách hoàn toàn State Configuration (Zustand), Physics Simulation (Rapier.js) và UI Rendering (Three.js/React Three Fiber). Sử dụng Orthographic Camera để tạo cảm giác 2D phẳng dễ nhìn. Tích hợp Tone.js cho âm thanh vật lý.

## Phases

### Phase 1: Data Models & Persistence (Zustand + JSONB)
Thiết lập schema cơ sở dữ liệu để lưu trữ trạng thái JSONB và thiết lập Zustand store để quản lý cấu hình các entities.

### Phase 2: Physics Core Engine (Rapier.js + R3F + Tone.js)
Xây dựng Physics Loop bằng Rapier.js (@react-three/rapier) kết hợp môi trường 3D Orthographic của R3F. Tích hợp Tone.js lắng nghe sự kiện va chạm để phát âm thanh.

### Phase 3: Component Library (30 Tool IDs)
Xây dựng bộ thư viện 3D UI chuẩn hóa dựa trên danh sách 30 dụng cụ trong DacTa.md, map mỗi UI component với một cấu hình vật lý Rapier tương ứng.

### Phase 4: Sandbox Workbench
Phát triển phòng thực hành tự do (Sandbox): Toolbar chứa 30 dụng cụ, chức năng Drag & Drop vào 3D workspace, tương tác tự do giữa các dụng cụ.

### Phase 5: Guided Lab Engine & Auto-grading
Phát triển module học theo giáo trình: Step-by-step guidance, kiểm tra thao tác lắp đặt, và thuật toán tự động chấm điểm (Thao tác, Sai số).

## Risks
1. **Performance**: Kết hợp Three.js, Rapier và Tone.js có thể làm tăng bundle size và tốn RAM. Cần tối ưu R3F (dùng `<InstancedMesh>` nếu cần) và lazy load.
2. **2.5D Constraint**: Phải cấu hình Rapier để khóa trục Z ở một số dụng cụ cơ học để chúng không bị văng ra khỏi mặt phẳng nhìn của Orthographic Camera.

## Session Notes
<!-- Updated by cook automatically — do not edit manually -->

**Last active:** 2026-09-21 23:22
**Phase in progress:** phase-04-sandbox
**Status:** implemented — awaiting review

### Decisions made this session
- Đã tạo `SidebarToolbar.tsx` hỗ trợ kéo thả (sử dụng Native HTML5 Drag & Drop event `onDragStart`).
- Tạo `CanvasWorkspace.tsx` chứa `PhysicsEnvironment`. Xử lý event `onDrop` để tính toán tọa độ drop từ chuỗi pixel của DOM sang tọa độ world 3D của R3F (tính bù trừ theo tỉ lệ zoom 40 của OrthographicCamera).
- Tạo `SandboxLab.tsx` ráp nối mọi thứ lại với nhau, cung cấp giao diện chuẩn có thanh công cụ bên trái và vùng 3D to toàn màn hình bên phải, kèm 2 nút "Lưu Bài" và "Tải Lại" gọi đến `useLabStore`.

### Next immediate action
Chờ người dùng duyệt Phase 4 (Chế độ `--hard`). Sau khi duyệt, sẽ chuyển sang Phase 5 (Guided Lab Engine - Dành riêng cho giáo trình).
