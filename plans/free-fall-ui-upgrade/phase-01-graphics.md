# Phase 1: Realistic Apparatus Graphics (Scenery)

## Objective
Enhance the 2D Canvas graphics using Scenery's capabilities to simulate a real physics lab environment.

## Tasks
1. **Background Stand & Ruler:** Create `StandView.ts` inheriting from `Node`. Draw a vertical gray rectangle (stand) and tick marks every $0.1m$ from $y=0$ to $y=1.0m$. Add this to `FreeFallScene`.
2. **Steel Ball:** Update `MassObjectView.ts` to use a radial gradient (`RadialGradient` from `scenerystack/scenery`) instead of a flat blue color, giving it a metallic steel look.
3. **Photogate:** Refine `PhotogateView.ts` to look more like a mechanical bracket rather than a simple red rectangle.

## P1 Coverage
- "Thấy đồ họa dụng cụ giống thật (bi thép, giá đỡ có thước mm)"
