# Spec: Total Icon & Emoji Removal for Academic Cleanliness

**Date:** 2026-09-09
**Status:** Ready

---

## Problem Statement
The application still contains decorative emojis and colorful icons across several components (cards, headers, role panels, navigation items), which makes the interface look informal or "childish" rather than an authoritative, Cisco-style academic portal.

---

## User Stories

- **[P1]** As a user, I want all decorative emojis and colorful icons removed from all pages so that the application presents a strict, high-contrast, text-first academic aesthetic.
  Accepted when: Zero emojis (⚛️, ⚡, ⏱️, 👨‍🏫, 🎓, 🛡️, 🔍, 🔋, 🔥, 🚀, 🟢, etc.) remain in the rendered UI.

- **[P1]** As a user, I want roles, categories, and tags to be displayed as clean text badges (e.g., `[GIÁO VIÊN]`, `[ADMIN]`, `[CƠ HỌC]`) so that information hierarchy is maintained purely through typography.
  Accepted when: Section headers and role indicators use flat text badges instead of emojis.

- **[P2]** As a user, I want basic functional UI controls (`+`, `✕`, `→`, `←`, `‹`, `›`) to remain minimal and monochrome so that utility navigation functions cleanly.
  Accepted when: Only monochrome functional symbols are used for interactive toggles and actions.

---

## Functional Requirements

1. FR-01: Remove all emojis and decorative icons from `LandingPage.tsx`, `LoginPage.tsx`, `DashboardPage.tsx`, `RoleWorkspacePanel.tsx`, `GitHubContributionGraph.tsx`, `SimCard.tsx`, `PhETFilterBar.tsx`, and `SidebarNav.tsx`.
2. FR-02: Replace emoji headers in `RoleWorkspacePanel` with clean text badges (`[ADMIN]`, `[GIÁO VIÊN]`, `[HỌC SINH]`).
3. FR-03: Replace emoji card icons in `SimCard` with clean subject badges (`[ĐIỆN HỌC]`, `[CƠ HỌC]`, `[QUANG HỌC]`, `[NHIỆT HỌC]`).
4. FR-04: Ensure all remaining buttons use text labels or minimal SVG/text symbols (`+`, `✕`, `→`).

---

## Success Criteria

- [ ] 0 emojis exist anywhere in frontend UI code across all pages.
- [ ] Typography and text badges cleanly demarcate all categories and roles.

---

## Out of Scope

- Changes to layout structure or underlying simulation logic.
