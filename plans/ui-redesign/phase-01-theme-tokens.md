# Phase 1: Academic Theme Token System

## Goal
Establish a clean, flat CSS token system for Light and Dark themes, eliminating all glossy/neon/childish visual artifacts.

## File Changes
- **[NEW]** `frontend/src/context/ThemeContext.jsx` (Theme provider with light/dark toggle and localStorage persistence)
- **[MODIFY]** `frontend/src/index.css` (CSS variables for light/dark themes, flat borders, typography resets)
- **[MODIFY]** `frontend/src/App.jsx` (Wrap App in `ThemeProvider`)

## Verification
- Toggle light/dark mode and confirm CSS variables update instantly.
- Verify background colors, text contrast, and border colors in both modes.
