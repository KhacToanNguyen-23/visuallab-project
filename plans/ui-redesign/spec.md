# Spec: Visual Lab UI Redesign

**Date:** 2026-09-09
**Status:** Ready

---

## Problem Statement
The current interface feels overly generic ("too AI"), chaotic in its color palette, and somewhat childish due to unnecessary icons. It lacks the professional, "portal" or "academic" feel required for a visual lab, reducing the perceived quality and trustworthiness of the application.

---

## User Stories

- **[P1]** As a desktop user, I want the central canvas (lab area) to be the dominant element on the screen so that I can focus entirely on the algorithms/simulations.
  Accepted when: The canvas takes up the majority of the viewport, with side/bottom panels cleanly framing it.

- **[P1]** As a desktop user, I want to be able to collapse or hide control panels so that I can maximize the visual lab space when I don't need to tweak parameters.
  Accepted when: Panels have clear, intuitive toggle buttons to collapse them out of view.

- **[P1]** As a user, I want a clean, professional aesthetic (both Light and Dark modes) without glossy effects or childish icons so that the tool feels like a serious academic or enterprise portal.
  Accepted when: UI uses flat colors, high contrast, minimal outline icons, and strict typography.

- **[P2]** As a user, I want smooth transitions when toggling panels or switching themes so that the experience feels premium.
  Accepted when: Collapse/expand and theme switch actions animate cleanly without layout shifting glitches.

- **[P3]** _(out of scope — noted for future)_ Responsive mobile layout. The current priority is strictly Desktop.

---

## Functional Requirements

1. FR-01: Implement a collapsible sidebar/panel architecture framing a central full-height/full-width (remaining) canvas.
2. FR-02: Provide a global toggle for Light/Dark mode that switches CSS variables instantly.
3. FR-03: Remove all existing "glossy/neon" effects, glow filters, and overly colored/filled icons from the existing UI components.
4. FR-04: Implement a strict, minimalist color palette: Background (neutral), Surface (slightly offset from background), Text (high contrast), and a single Accent color for interactive states.

---

## Non-Functional Requirements

- Performance: UI transitions (collapse/expand, theme switch) must run at 60fps without triggering expensive DOM reflows unnecessarily (use CSS transforms where possible).
- Aesthetics: Must strictly adhere to a flat, professional design language inspired by Cisco/PhET.

---

## Success Criteria

- [ ] Desktop Layout: Canvas occupies > 70% of screen width when panels are open, and > 95% when collapsed.
- [ ] Theme Switcher: Light/Dark mode toggle correctly applies flat, focus-oriented color palettes.
- [ ] Visual Cleanup: 100% of glowing shadows, neon gradients, and "childish" filled icons are removed.

---

## Out of Scope

- Mobile/Tablet responsive reflows (forced stacking of panels). We assume a desktop viewport for this iteration.
- Changes to the underlying algorithm/simulation logic; this is purely a wrapper/UI redesign.

---

## Assumptions

- The current visual lab components (the canvas content itself) can be seamlessly embedded into a new wrapper layout without breaking.
