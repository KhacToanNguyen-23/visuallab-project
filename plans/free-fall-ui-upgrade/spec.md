# Spec: Free Fall UI & Auto-Record Table

**Date:** 2026-09-23
**Status:** Ready

---

## Problem Statement
The current Free Fall lab has the physics engine in place but lacks the educational UI (realistic apparatus) and the Data Table required by the curriculum to analyze results.

---

## User Stories

- **[P1]** As a học sinh, I want to thấy đồ họa dụng cụ giống thật (bi thép, giá đỡ có thước mm) so that có cảm giác đang làm thí nghiệm vật lý thật.
  Accepted when: `MassObjectView` uses radial gradient for a metallic look, and a background stand with ruler ticks is visible.

- **[P1]** As a học sinh, I want to bảng số liệu tự động ghi lại kết quả sau mỗi lần thả so that tôi không phải bấm tay hay chép tay.
  Accepted when: The right-hand panel of `FreeFallLab.tsx` displays a table mapping over `measurements` from `useFreeFallStore`.

- **[P2]** As a học sinh, I want to có nút "Xóa dữ liệu" so that tôi có thể làm lại bài đo đạc từ đầu nếu muốn.
  Accepted when: Clicking "Xóa dữ liệu" empties the store's measurement array.

---

## Functional Requirements

1. FR-01: Update `MassObjectView` graphic (gradient circle).
2. FR-02: Create `StandAndRulerView` as a static background node in `FreeFallScene`.
3. FR-03: Create a `DataTable` React component in `FreeFallLab.tsx` mapping `[s, t, g]` values.
4. FR-04: Ensure $g$ is auto-calculated correctly as $g = \frac{2s}{t^2}$.

---

## Success Criteria

- [ ] Đồ họa: Có thước đo và bi kim loại.
- [ ] Bảng số liệu: Thả bi 3 lần thì bảng hiện 3 hàng số liệu.

---

## Out of Scope
- Không làm đồ thị tự động (vẽ đồ thị sẽ là bài tập riêng hoặc thêm ở Phase sau).
