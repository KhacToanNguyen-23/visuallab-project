# Phase 01: Redesign LandingPage.tsx Layout

**Objective:** Implement Hero Visual Split, live preview simulation box, academic trust metrics, and SVG thumbnails for experiment cards in `LandingPage.tsx`.

## Steps

1. Update `frontend/src/pages/LandingPage.tsx`:
   - Hero section into 2-column grid (`grid grid-cols-1 lg:grid-cols-12 gap-8 items-center`).
   - Left column: GDPT 2018 badge, Headline, Subtitle, CTA buttons, and 3 Trust Stat items (50+ Trường THPT tin dùng, 100% Chuẩn GDPT 2018, <1ms Độ trễ mô phỏng).
   - Right column: Live animated physics simulation preview card with CSS/SVG spring oscillation animation and parameter controls.
   - Experiment catalog section: 3-column grid of cards with embedded SVG thumbnails for Con lắc lò xo, Đo gia tốc rơi tự do MC-964, and Mạch RLC nối tiếp.
   - Apply CSS theme variables (`var(--bg-main)`, `var(--bg-panel)`, `var(--text-main)`, `var(--text-muted)`, `var(--border-color)`).
