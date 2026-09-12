# Feature Spec: 3D Sound & Resonance Tube Lab (Bài 5 SGK Vật Lý 11)

**Status:** Draft  
**Target Date:** 2026-09-11  

---

## Executive Summary
Phát triển bài thực hành **Đo tần số sóng âm & Tốc độ truyền âm bằng Ống cộng hưởng** (Bài 5 - Trang 22 SGK Vật lý 11). Sử dụng **Three.js** dựng hình mô phỏng 3D Ống cộng hưởng thủy tinh & Loa phát, kết hợp **Tone.js** phát âm thanh sóng âm thực tế theo tần số Hz. Giao diện được chuẩn hóa theo phong cách SaaS của VisualLab: **No-scroll viewport** (vừa vặn 1 màn hình, không cuộn), sử dụng CSS theme variables, và zero emoji trang trí.

---

## User Stories

### P1: No-Scroll Fit-to-Viewport Layout
- **As a** student or teacher,
- **I want** the 3D canvas and control sidebar to fit entirely within 100% of the screen height (`h-screen overflow-hidden`),
- **So that** I never have to scroll the page to access any sliders, audio toggles, or data readouts.

### P1: Three.js 3D View & Tone.js Audio Integration
- **As a** user,
- **I want** adjusting frequency $f$ (100Hz - 2000Hz) and water column level $L$ to generate real audio pitch via Tone.js and visual 3D water height adjustments in Three.js,
- **So that** I hear sound resonance when $L$ matches quarter-wavelength $\lambda/4$ condition.

### P2: Standard Physics Calculation & Report
- **As a** student,
- **I want** the system to calculate speed of sound $v = \lambda \cdot f \approx 340 \text{ m/s}$ based on resonance points $L_1$ and $L_2$,
- **So that** I can complete the experimental lab report accurately.

---

## Success Criteria

1. **No-Scroll Layout**:
   - Entire workspace fits inside `100vh` without page vertical scrollbars.
2. **Audio & 3D Simulation**:
   - `Tone.js` generates sine wave audio at user-selected frequency $f$.
   - Three.js renders 3D resonance tube, water column height slider, and audio generator speaker.
   - Calculates speed of sound $v = 2(L_2 - L_1) \cdot f \approx 340 \text{ m/s}$.
3. **Clean Visual Design**:
   - Zero decorative emojis, theme variables synchronized with light/dark mode.
