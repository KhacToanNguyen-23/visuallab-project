# Brainstorm: VisualLab UI/UX Layout Architecture

**Date:** 2026-09-09

## Ideas Explored
- **Option A (App-like Sidebar):** A single-page dashboard where a fixed sidebar shows the curriculum tree, and labs open inline. Dismissed because it can feel cramped and less immersive for complex labs.
- **Option B (Educational Portal & Full-Screen Lab):** A distinct Landing Page with a massive search bar and Grade cards (10, 11, 12). Clicking a lab triggers a full-screen takeover, hiding all navigation to maximize focus. Chosen direction.
- **Login Flow:** Forced login at the Landing Page vs Guest Access. Explored allowing free exploration, with login only required when saving progress. Chosen direction.

## User's Direction
The user strongly prefers a clean, uncluttered, and intuitive interface that aligns with the Vietnamese physics curriculum. They chose **Option B (Educational Portal)**, specifically emphasizing that the lab must "pop up and cover the entire screen" (che kín) for maximum immersion. They also want users to freely access labs without logging in, only prompting for login when the user actively tries to save their progress.

## Open Questions
- None. The layout architecture is clear enough to proceed to planning.

## Risks
- **Frontend Complexity:** Managing the state between the public portal (Vite/React Router) and the isolated full-screen lab view without jarring page reloads.
- **Responsiveness in Full-Screen:** Ensuring the 70/30 split (Simulation vs Control Panel) looks good on both 13-inch laptops and large monitors when running in full-screen mode.
