# Phase 1: Routing & Layout Shells

## User Stories Covered
- **[P1]** As a Student, I want the lab experiment to open in a full-screen view (hiding all website navigation) so that I can focus 100% on the simulation and its controls.

## Architecture & Approach
We will introduce `react-router-dom` in `main.jsx` and `App.jsx`.
We need two distinct layouts:
1. `PortalLayout.jsx`: Includes a global Header (Logo, Auth button) and Footer. Used for the Landing Page and browsing.
2. `LabLayout.jsx`: A completely empty shell (no header/footer) that takes up `100vh` and `100vw`. Used exclusively for `/labs/:id`.

## Steps
1. Create `frontend/src/layouts/PortalLayout.jsx` with a simple Header.
2. Create `frontend/src/layouts/LabLayout.jsx` wrapping `{children}` in a `min-h-screen` container.
3. Update `frontend/src/App.jsx` to define routes:
   - `/` -> uses `PortalLayout` (maps to a `LandingPage` component).
   - `/labs/:id` -> uses `LabLayout` (maps to a `LabWorkspace` component).
