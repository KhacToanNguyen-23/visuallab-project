# Implementation Plan: 3D Sound & Resonance Tube Lab (Bài 5 SGK Vật Lý 11)

Mode: --fast
Risk: normal — Interactive 3D & Web Audio simulation component with zero database schema changes.
Spec: plans/3d-sound-lab/spec.md

---

## Overview
Develop `SoundResonanceLab.tsx` (`/test-sound`) for Lesson 5 Page 22 SGK Physics 11. Combine **Three.js** (3D glass resonance tube, adjustable water column height $L$, speaker) and **Tone.js / Web Audio API** (sine wave pitch generator at user-selected frequency $f$). Enforce a strict **no-scroll fit-to-viewport layout** (`h-screen overflow-hidden`), zero decorative emojis, and VisualLab CSS theme variable styling (`var(--bg-panel)`, `var(--bg-main)`, `var(--border-color)`).

---

## Phase 1: 3D Three.js Scene & Audio Frequency Synthesizer (`SoundResonanceLab.tsx`)
- [NEW] `frontend/src/components/simulation/SoundResonanceLab.tsx`
  - Render Three.js 3D glass tube (`RESONANCE_TUBE`), adjustable water height plane $L$ ($0\text{cm} \le L \le 100\text{cm}$), and 3D speaker `AUDIO_GENERATOR`.
  - Tương tác âm thanh Web Audio API / Tone.js:
    - Generate pure sine wave at frequency $f$ ($100\text{Hz} \le f \le 2000\text{Hz}$).
    - Calculate acoustic resonance condition: when column length $L \approx \frac{\lambda}{4} = \frac{v}{4f}$ (with $v \approx 340 \text{ m/s}$), amplify resonance audio volume and display peak amplitude.
  - Calculate speed of sound $v = 2(L_2 - L_1) \cdot f \approx 340 \text{ m/s}$.

---

## Phase 2: No-Scroll Layout & Route Integration (`main.tsx`)
- [NEW] `frontend/src/components/simulation/SoundResonanceLab.tsx`
  - Fit layout 100% inside `h-screen overflow-hidden`:
    - Top Header bar: Title, back button, theme toggle, mute/unmute toggle.
    - Left Area: 3D Three.js interactive viewport (`flex-1 h-full`).
    - Right Area: Control sidebar (`w-80 h-full overflow-hidden flex flex-col justify-between`).
  - [MODIFY] `frontend/src/main.tsx`
    - Add route `<Route path="/test-sound" element={<SoundResonanceLab />} />`.
  - [MODIFY] `frontend/src/services/labService.ts`
    - Update `11-b5` route target to `/test-sound`.

---

## Phase 3: Build Verification & Testing
- Verification:
  - Run `npm run build` in `frontend/` to confirm clean compilation with zero TypeScript errors.
