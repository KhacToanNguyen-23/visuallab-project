# Spec: Visual & High-Trust Landing Page Redesign

**Date:** 2026-09-10
**Status:** Ready

---

## Problem Statement
The previous Landing Page layout was text-only and lacked visual appeal for students and academic prestige for educators. Redesigning the page with a 2-column Hero split featuring a live animated spring simulation preview, academic trust metrics, and visual SVG thumbnails for experiment cards creates an engaging, high-end experience.

---

## User Stories

- **[P1]** As a student visiting VisualLab, I want to see an interactive physics simulation preview on the Hero banner so that I am immediately engaged and understand how the simulations work.
  Accepted when: Hero right column renders an animated physics simulation preview box with live sliders and real-time output indicators.

- **[P1]** As an educator or student, I want to see academic trust metrics and GDPT 2018 badges so that I know the platform is standardized for Vietnamese THPT curriculum.
  Accepted when: Trust stat banner displays 50+ Schools, 100% GDPT 2018, and <1ms Latency stats cleanly below the headline.

- **[P1]** As a user browsing experiment cards, I want each card to feature a visual SVG thumbnail diagram of the experiment so that I can quickly recognize the topic.
  Accepted when: Experiment cards render SVG visual thumbnails (Spring Oscillation, Free Fall Photogate MC-964, RLC Waveform).

---

## Functional Requirements

1. FR-01: Update `LandingPage.tsx` Hero section into a 2-column Visual Split layout.
2. FR-02: Add Academic Trust Stat metrics banner (50+ Trường THPT, 100% GDPT 2018, <1ms Độ trễ).
3. FR-03: Render interactive live Physics Simulation Preview Box in Hero right column.
4. FR-04: Add visual SVG thumbnails to experiment catalog cards in `LandingPage.tsx`.
5. FR-05: Ensure clean production build (`npm run build`) without TypeScript or CSS errors.

---

## Non-Functional Requirements

- Performance: Page load time < 200ms, SVG graphics rendered inline without external network assets.
- Design: Strict adherence to high-end iconless design principles (no decorative emojis).

---

## Success Criteria

- [ ] Hero banner renders 2-column visual split with animated preview.
- [ ] Social proof metrics banner visible under Hero text.
- [ ] 3 catalog cards render SVG physics thumbnails.
- [ ] `npm run build` succeeds with exit code 0.

---

## Out of Scope

- Modifying backend APIs or simulation calculation engines.
