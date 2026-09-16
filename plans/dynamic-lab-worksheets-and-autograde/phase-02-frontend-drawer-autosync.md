# Phase 2: Frontend Dynamic Worksheet Drawer & Auto-Sync UI

**Story:** [P1] Dynamic Worksheet UI & 1-Click Auto-Sync

## Objectives
1. Refactor `FloatingAssignmentDrawer.tsx` & `StudentLabAssignmentView.tsx`:
   - Identify active `labType` / `labId` and look up corresponding schema from `worksheetSchemas.ts`.
   - Render personalized parameters banner dynamically (e.g. Distance $s = 0.5\text{m}$, Incline $\theta = 15^\circ$ for Speed Measurement, rather than hardcoded pendulum variables).
   - Render multi-row data table matching SGK GDPT 2018 (3-5 trial rows + Average row + Error $\Delta x$).
   - Add **"⚡ Tự động trích xuất số liệu từ thí nghiệm"** button:
     - Pulls active trials from telemetry store.
     - Automatically calculates mean $\bar{x}$ and estimated error.
     - Allows student to manually override or fine-tune any input cell.
   - Package structured JSON payload on submit: `{ rows: [...], summaryValues: { ... }, measuredResult: number }`.
