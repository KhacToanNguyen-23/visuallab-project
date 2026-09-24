# Phase 1: SceneryStack Core & Fixed-Time Step Loop

## Objective
Tạo bộ khung cơ bản để chạy SceneryStack bên trong React Component.

## Proposed Changes
- `frontend/src/engine/scenerystack/SceneryRenderer.ts`: Tạo class quản lý Display, Scene, và vòng lặp `requestAnimationFrame`.
- `frontend/src/components/scenerystack/SceneryCanvas.tsx`: React component bọc canvas, nhận `SceneryRenderer`.

## Tests to Write First
- Test kiểm tra `SceneryCanvas` render thành công và không bị unmount liên tục.
