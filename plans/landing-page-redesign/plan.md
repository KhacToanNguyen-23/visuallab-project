# Plan: Visual & High-Trust Landing Page Redesign

**Date:** 2026-09-10
**Mode:** --fast
**Risk:** normal — UI enhancement for public landing page

---

## Overview

Redesign `LandingPage.tsx` with a 2-column Hero Visual Split layout featuring a live animated physics simulation preview box, academic trust metrics (50+ THPT Schools, 100% GDPT 2018, <1ms Latency), and visual SVG thumbnails for experiment cards.

---

## Proposed Phases

- [file:///d:/Project/FptProject/visuallab-project/plans/landing-page-redesign/phase-01-redesign.md](phase-01-redesign.md): Redesign `LandingPage.tsx` with Hero visual split, preview box, trust metrics, and SVG card thumbnails
- [file:///d:/Project/FptProject/visuallab-project/plans/landing-page-redesign/phase-02-verification.md](phase-02-verification.md): Run build verification (`npm run build`) and update `feature_list.json`

---

## File Ownership

| Phase | Files Touched |
| ----- | ------------- |
| Phase 01 | `frontend/src/pages/LandingPage.tsx` |
| Phase 02 | Automated build verification |

---

## Verification Plan

### Automated Verification
- `cd frontend && npm run build` (Must complete with exit code 0)

### Manual Verification
- Open `LandingPage.tsx` -> verify 2-column Hero split with animated spring simulation box.
- Verify trust metrics (50+ Trường THPT, 100% GDPT 2018, <1ms Độ trễ).
- Verify 3 experiment cards render SVG visual thumbnails cleanly across light and dark themes.
