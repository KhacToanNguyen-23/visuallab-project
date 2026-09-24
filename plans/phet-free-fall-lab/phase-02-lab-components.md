# Phase 2: Lab Components (Ball, Rail, Photogates)

## Objective
Xây dựng các vật thể Vật lý 10 sử dụng `scenery` và `axon`.

## Proposed Changes
- `frontend/src/engine/scenerystack/physics/FreeFallBall.ts`: Implement `IKinematicBody`. Dùng Verlet/Euler với dt = 0.016s để tính `y` và `v`.
- `frontend/src/engine/scenerystack/physics/Photogate.ts`: Implement `IConnectable` với `lockAxis: 'y'`. Emit sự kiện chặn tia khi Ball đi qua.
- `frontend/src/engine/scenerystack/physics/FreeFallScene.ts`: Khởi tạo và liên kết các linh kiện.
