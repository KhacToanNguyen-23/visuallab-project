# Phase 2: React Data Table & State Binding

## Objective
Build a dynamic React table that auto-updates when measurements are pushed to `useFreeFallStore`.

## Tasks
1. Update `FreeFallLab.tsx` to include a right-hand panel (split layout: 2/3 canvas, 1/3 UI).
2. Read `measurements` from `useFreeFallStore`.
3. Render a `<table>` iterating over `measurements`, displaying $s$, $t$, and calculating $g = 2s / t^2$.
4. Add a "Xóa dữ liệu" button hooked to a new `clearMeasurements()` action in `useFreeFallStore`.

## P1 & P2 Coverage
- "Bảng số liệu tự động ghi lại kết quả sau mỗi lần thả"
- "Có nút 'Xóa dữ liệu'"
