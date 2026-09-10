# Phase 3: Full-Screen Lab Refactor

## User Stories Covered
- **[P1]** As a Student, I want the lab experiment to open in a full-screen view...
- **[P2]** As a Student, I want to use the lab without logging in...

## Architecture & Approach
Extract the mockup lab currently in `App.jsx` into a dedicated `LabWorkspace.jsx` page. Ensure it handles its own internal header (with the "Exit" button) and implements the 70/30 split. Add a dummy "Save Progress" button that triggers an alert or mock login modal (to satisfy the guest access requirement).

## Steps
1. Create `frontend/src/pages/LabWorkspace.jsx`.
2. Move the contents of `App.jsx` (the simulation and control panel) into this file.
3. Hook up the "Exit" or "Back" button to use `useNavigate()` to return to `/`.
4. Ensure the lab fits strictly within `100vh` without page scrolling.
