# Phase 1: Draggable Photogate View

## Objective
Enable vertical dragging for `PhotogateView` using Scenery's `DragListener`.

## Tasks
1. Import `DragListener` from `scenerystack/scenery`.
2. Add a `DragListener` to `PhotogateView`.
3. On drag, compute the new `y` coordinate (reverse the scaling from pixels to meters: `yMath = (this.y - 50) / 400`).
4. Update the `KinematicComponent.yProperty.value` of the model.

## P1 Coverage
- "Dùng chuột kéo trượt cổng quang E và F lên/xuống dọc theo giá đỡ"
