# Spec: Visual Lab Cards & Clean UI (No Grade Filter)

## Executive Summary
Upgrade the student Dashboard lab library view from text table rows to a visual Grid of Simulation Cards with images, removing the grade-level filter bar.

## User Stories

### P1: Visual Card Grid
- As a student, I want to see lab titles accompanied by preview images in a grid layout so that I can immediately identify the lab I want to perform.

### P1: Remove Grade Filter
- As a student, I want a clean search and subject filter without unnecessary grade-level (10, 11, 12) filters.

## Success Criteria
- Dashboard displays a responsive 3-4 column grid of `SimCard` components with preview images.
- Grade filter buttons (Lớp 10, Lớp 11, Lớp 12) removed from `PhETFilterBar` and `DashboardPage`.
- Clicking any card or its "Vào Thí Nghiệm" button opens the simulation page correctly.
