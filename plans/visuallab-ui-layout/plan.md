# Plan: VisualLab UI/UX Layout Architecture
Mode: --fast
Risk: normal — multi-file, testable, no auth/data/infra risk

**Date:** 2026-09-09
**Slug:** visuallab-ui-layout

## Overview
Implement the foundational routing and layout architecture for VisualLab, introducing a distinct "Educational Portal" (Landing Page) and a dedicated "Full-Screen Lab" view without global app shells, following the `spec.md`.

## Phases
- [x] Phase 1: Routing & Layout Shells
- [x] Phase 2: Portal Dashboard
- [x] Phase 3: Full-Screen Lab Refactor

## Session Notes
<!-- Updated by cook automatically — do not edit manually -->

**Last active:** 2026-09-09 12:54
**Phase in progress:** Completed
**Status:** passing-unverified

### Decisions made this session
- Implemented `react-router-dom` in `App.jsx`
- Extracted `PortalLayout` and `LabLayout` to properly split the UI shell.
- Moved the `App.jsx` mockup into `LabWorkspace.jsx` properly using React Router's `useNavigate` for the exit button.
- Committed all changes to git using `feat(ui): implement portal and fullscreen lab layouts`.

### Next immediate action
(Done)
