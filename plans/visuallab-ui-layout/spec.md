# Spec: VisualLab UI/UX Layout Architecture

**Date:** 2026-09-09
**Status:** Ready

---

## Problem Statement
The VisualLab project needs a unified, intuitive, and uncluttered UI architecture that caters to Vietnamese high school students studying Physics. The layout must allow easy discovery of labs based on the textbook curriculum while providing a highly immersive, distraction-free environment during the actual experiments.

---

## User Stories

- **[P1]** As a Student, I want to browse labs grouped by Grade (10, 11, 12) and Chapters so that I can easily find the lab corresponding to my current school lesson.
  Accepted when: The Landing Page/Dashboard displays clear categories for Grades and Chapters.

- **[P1]** As a Student, I want to search for a lab by name directly from the Landing Page so that I can bypass the curriculum tree when I already know what I'm looking for.
  Accepted when: A prominent, working search bar exists on the Landing Page.

- **[P1]** As a Student, I want the lab experiment to open in a full-screen view (hiding all website navigation) so that I can focus 100% on the simulation and its controls.
  Accepted when: Launching a lab takes over the entire viewport; no global header/footer is visible until exited.

- **[P2]** As a Student, I want to use the lab without logging in, but be prompted to log in when I click "Save Progress" or "Submit" so that I can try before committing to an account.
  Accepted when: Guest access works for all simulations; login modal triggers only on save actions.

- **[P3]** _(out of scope — noted for future)_ As a Teacher, I want a Presentation Mode that scales up UI elements for projector displays.

---

## Functional Requirements

1. FR-01: **Landing Page Routing:** Root URL `/` must display the Educational Portal with Search Bar and Grade categories.
2. FR-02: **Full-Screen Lab View:** Lab URL `/labs/:id` must render without the global App Shell (no navbar/sidebar). It must implement a layout split (e.g., 70% simulation, 30% control panel).
3. FR-03: **Guest Access:** Protected routes must not block `/` or `/labs/:id` for unauthenticated users. Authentication state is only checked when making `POST` requests to save data.
4. FR-04: **Exit Mechanism:** The full-screen lab must have a clear "Exit/Back" button to return the user to the portal.

---

## Non-Functional Requirements

- Performance: Navigation from the portal to the full-screen lab must occur without a full page refresh (client-side routing, < 200ms).
- Usability: The lab's control panel must fit within a standard 768px height viewport without requiring the user to scroll away from the simulation canvas.

---

## Success Criteria

- [ ] Route structure successfully separates the Portal Layout from the Full-Screen Lab Layout.
- [ ] Unauthenticated users can successfully open and interact with a lab.
- [ ] Attempting to save lab progress triggers the Google OAuth login flow.

---

## Out of Scope

- Implementing the specific physics logic for individual labs (this spec only covers the layout architecture).
- Teacher dashboard and class management UI (to be specified separately).

---

## Assumptions

- We are using `react-router-dom` v6+ for client-side routing.
- The 70/30 split layout inside the lab is fixed (not floating/draggable) to maintain the "uncluttered" requirement.
