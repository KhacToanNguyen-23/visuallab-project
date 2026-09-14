# Implementation Plan: Tone.js & Web Audio Integration for VisualLab

**Date:** 2026-09-12  
**Spec:** `plans/tonejs-audio/spec.md`  
**Mode:** Fast  
**Risk:** normal — adds Web Audio API sound engine & Mute toggle state  

---

## 🎯 Architectural Overview

Xây dựng hệ thống **Audio Engine (Web Audio API & Tone.js)** nhẹ nhàng, không gây nặng bundle, với 3 thành phần chính:
1. `soundEngine.ts` (`src/utils/soundEngine.ts`): Module xử lý âm thanh tổng hợp (Click, Beep, Friction Noise, Collision Clack, Resonance Tone 500Hz, Gas Hiss, Field Hum).
2. `Header.tsx` & `AudioContext` (`src/context/AudioContext.tsx`): Quản lý trạng thái Bật/Tắt âm thanh toàn cục (Global Mute Toggle 1-click) dành cho Giáo viên.
3. Tích hợp hiệu ứng âm thanh tương tác vào các phòng lab.

---

## 📅 Execution Phases

- [ ] **Phase 1: Lightweight Web Audio Synthesizer Engine** (`src/utils/soundEngine.ts`)
- [ ] **Phase 2: Global Audio Context & Header Mute Toggle** (`src/context/AudioContext.tsx`, `src/components/header/Header.tsx`)
- [ ] **Phase 3: Lab Interactivity Audio Integration** (Tích hợp âm thanh vào các phòng lab)
