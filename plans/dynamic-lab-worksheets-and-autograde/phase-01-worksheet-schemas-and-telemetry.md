# Phase 1: Lab Worksheet Schemas & Workbench Telemetry Store

**Story:** [P1] Dynamic SGK GDPT 2018 Lab Report Registry

## Objectives
1. Create `frontend/src/utils/worksheetSchemas.ts`:
   - Registry mapping `lab_id` / `lab_type` (e.g. `sim-speed-measurement`, `sim-free-fall`, `sim-friction-coefficient`, `sim-hooke-law`, `sim-simple-pendulum`, `sim-sound-resonance`, etc.) to:
     - Lab Title & SGK Reference.
     - Table columns: `id`, `label`, `unit`, `isMeasured`, `isCalculated`, `formulaHint`.
     - Required summary outputs: e.g. $\bar{v}, \bar{g}, \mu, k, \bar{T}$.
     - Default parameter bounds for teacher assignment creator.
2. Create `frontend/src/context/LabTelemetryContext.tsx` or `useLabTelemetry` store:
   - Provide methods `recordTrial(trialData: Record<string, number | string>)` and `getRecentTrials(labId: string)`.
   - Store recent runs in memory / session storage so when a student conducts runs on the canvas/3D workbench, the trials are immediately queryable by the assignment drawer.
