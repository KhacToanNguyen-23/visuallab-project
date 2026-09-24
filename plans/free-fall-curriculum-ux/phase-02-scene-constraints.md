# Phase 2: Positional Constraints & Validation

## Objective
Enforce the minimum limits and overlap prevention constraints between Gate 1 and Gate 2.

## Tasks
1. Pass optional `minYProperty` and `maxYProperty` (or just functions) to `PhotogateView` so the DragListener can clamp the values before setting `yProperty`.
2. In `FreeFallScene`, configure Gate 1 to have `minY = 0.05` and `maxY = Gate2.y - 0.1`.
3. In `FreeFallScene`, configure Gate 2 to have `minY = Gate1.y + 0.1` and `maxY = 1.0`.

## P1 Coverage
- "Cổng E và F chỉ trượt theo trục Y, và E luôn cao hơn F ít nhất 10cm."
