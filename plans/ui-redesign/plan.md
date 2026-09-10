# Plan: Visual Lab UI Redesign

Mode: --hard
Risk: normal — Multi-file UI refactoring and layout wrapper redesign without auth/data/schema changes.

---

## Overview
Redesign the Visual Lab application UI from a generic/AI-like layout into a professional, academic enterprise portal inspired by Cisco and PhET.
Key features:
1. Flat academic color system supporting Light & Dark themes with crisp borders and focus-driven typography.
2. Academic Canvas workspace with collapsible enterprise panels (toggleable sidebars to maximize simulation space).
3. Professional Portal layout with crisp header, navigation, and theme toggle.

---

## Phase Breakdown

- [x] **Phase 1: Academic Theme Token System** (`plans/ui-redesign/phase-01-theme-tokens.md`)
  - Define CSS custom properties for Light/Dark modes in `index.css`.
  - Create `ThemeContext` to handle theme switching and persistence.
  - Remove all glossy/neon gradients and childish iconography styles.

- [x] **Phase 2: Academic Portal Layout & Header** (`plans/ui-redesign/phase-02-portal-layout.md`)
  - Redesign `PortalLayout` with clean Cisco-style navigation header, breadcrumbs, and Theme Toggle.
  - Update `LandingPage` to present a serious academic laboratory catalog aesthetic.

- [x] **Phase 3: Maximized Canvas & Collapsible Lab Workspace** (`plans/ui-redesign/phase-03-lab-workspace-redesign.md`)
  - Refactor `LabLayout` and `LabWorkspace` to feature a dominant central canvas (>70% width default, >95% when collapsed).
  - Implement smooth panel collapsible controls (Right sidebar / tasks panel).
  - Clean up playback controls and parameter sliders to be crisp, flat, and professional.

---

## User Stories Covered
- **[P1]** Dominant central canvas workspace.
- **[P1]** Collapsible control panels.
- **[P1]** Flat, high-contrast academic aesthetics (Light & Dark modes).
- **[P2]** Smooth panel toggling & theme transitions.

---

## Session Notes
**Last active:** 2026-09-09 16:33
**Phase in progress:** Completed
**Status:** All 3 phases implemented and verified cleanly with `npm run build`

### Decisions made this session
- Implemented Navy/Slate tones for Light mode and Zinc/Charcoal flat tones for Dark mode.
- Side panel collapses cleanly into a 48px icon rail to maximize canvas area up to >95%.
- TypeScript strict compatibility verified and build succeeds cleanly.
