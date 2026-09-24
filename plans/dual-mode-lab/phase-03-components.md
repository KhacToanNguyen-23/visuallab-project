# Phase 3: Base Component Library (UI + Physics Mapped)

## Goal
Tạo các UI Component cho 30 dụng cụ (đã chuẩn hóa Tool IDs), mỗi component có render UI riêng và tự động mount physics body vào Matter.js world.

## Stories Covered
- **[P1]** As a Học sinh, I want to kéo thả các dụng cụ vào workspace (Guided/Sandbox).

## File Ownership
- Component Registry: `frontend/src/components/lab/tools/ToolRegistry.ts`
- Base Tool UI: `frontend/src/components/lab/tools/*.tsx` (ví dụ: `SteelBall3D.tsx`, `InclinedTrack3D.tsx`)

## Proposed Changes
1. **Component Registry Mapping**
   - Ánh xạ `ToolID` (vd: `STEEL_BALL`) sang Component React (`<SteelBall3D />`) chứa `<RigidBody>`.
2. **Implement Core Tools (MVP subset)**
   - Cơ học: `STEEL_BALL` (SphereCollider), `WOODEN_BLOCK` (CuboidCollider), `INCLINED_TRACK` (Static CuboidCollider rotated).
   - Đo lường: `DIGITAL_TIMER`, `PHOTOGATE_SENSOR` (sensor collider, trigger collision event).
3. **Physics Sync Wrapper**
   - Không cần dùng custom sync hook, sử dụng trực tiếp cơ chế `<RigidBody>` của `@react-three/rapier`.

## Tests to Write First
- Đảm bảo ToolRegistry trả về đúng Component cho từng Tool ID hợp lệ.
- Test mount/unmount component tự động add/remove collider khỏi Rapier World.
