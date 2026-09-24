# Phase 2: Physics Core Engine (Rapier.js + R3F + Tone.js)

## Goal
Tạo lõi vật lý Rapier.js độc lập kết hợp với React Three Fiber (R3F) sử dụng Orthographic Camera để có góc nhìn 2.5D mượt mà. Tích hợp Tone.js cho âm thanh.

## Stories Covered
- **[P1]** As a Học sinh, I want to truy cập Sandbox Lab với thanh công cụ đầy đủ 30 dụng cụ so that tôi tự kéo thả, lắp ghép và tạo thí nghiệm theo ý mình.

## File Ownership
- Physics Wrapper: `frontend/src/components/lab/PhysicsEnvironment.tsx`
- Audio Engine: `frontend/src/services/soundEngine.ts` (Tone.js)
- Base Entity UI: `frontend/src/components/lab/BaseEntity3D.tsx`

## Proposed Changes
1. **R3F & Rapier Setup**
   - Tạo `<PhysicsEnvironment>` wrap bên ngoài `<Physics>` của `@react-three/rapier`.
   - Setup `<OrthographicCamera>` để hiển thị góc nhìn phẳng vuông góc từ trên xuống hoặc từ mặt bên.
2. **Entity-Component-System Bridge**
   - Dùng `<RigidBody>` bọc các `<mesh>` của Three.js. Rapier sẽ tự lo việc sync tọa độ xuống mesh mà không qua React state.
3. **Âm thanh vật lý (Tone.js)**
   - Lắng nghe event `onCollisionEnter` trên các RigidBody để gọi `soundEngine.playCollision(force)`.
4. **Draggable & Interactions**
   - Tích hợp `@use-gesture/react` hoặc `react-three/drei` (`<DragControls>`) để cho phép kéo thả vật lý trong môi trường 3D.

## Tests to Write First
- Đảm bảo PhysicsEnvironment render đúng OrthographicCamera.
- Test collision event có trigger hàm phát âm thanh Tone.js.
