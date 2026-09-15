# Plan: Dynamic Lab Worksheets, Auto-Sync Telemetry & Multi-Formula Auto-Grading

Mode: --hard
Risk: normal — Multi-file fullstack enhancements, non-breaking database model, deterministic unit-tested scoring.

## Overview
Transform EduLab from a single hardcoded pendulum assignment flow into a comprehensive, dynamic lab worksheet system aligned with SGK GDPT 2018. The system introduces dynamic worksheet templates per lab, real-time telemetry auto-sync from virtual workbenches, lab-specific parameter generation, multi-formula math verification in Spring Boot, and enriched Groq AI reasoning grading.

## Phases

- [x] **[Phase 1: Lab Worksheet Schemas & Workbench Telemetry Store](file:///d:/6_OJT/EduLab/plans/dynamic-lab-worksheets-and-autograde/phase-01-worksheet-schemas-and-telemetry.md)**: Define SGK GDPT 2018 data table schemas (`worksheetSchemas.ts`) and telemetry logging hook/bridge (`telemetryStore.ts`) for simulation trial data.
- [x] **[Phase 2: Frontend Dynamic Worksheet Drawer & Auto-Sync UI](file:///d:/6_OJT/EduLab/plans/dynamic-lab-worksheets-and-autograde/phase-02-frontend-drawer-autosync.md)**: Upgrade `FloatingAssignmentDrawer.tsx` with dynamic tables, formula displays, and the 1-click "⚡ Trích xuất số liệu từ bài làm" button.
- [x] **[Phase 3: Backend Multi-Formula Math Verification Engine](file:///d:/6_OJT/EduLab/plans/dynamic-lab-worksheets-and-autograde/phase-03-backend-multi-formula-verification.md)**: Implement modular mathematical verifiers in `MathVerificationEngineImpl.java` for all 14 SGK physics labs with unit tests.
- [x] **[Phase 4: Teacher Assignment Generation & Groq AI Reasoning Feedback](file:///d:/6_OJT/EduLab/plans/dynamic-lab-worksheets-and-autograde/phase-04-teacher-assignment-and-groq-feedback.md)**: Upgrade `AssignmentServiceImpl.java` to randomize lab-specific parameters and enrich `GroqAIService.java` with structured lab context.

## Session Notes
<!-- Updated by cook automatically — do not edit manually -->

**Last active:** 2026-09-16 00:09
**Phase in progress:** All Phases Complete
**Status:** All 4 phases implemented, unit-tested and verified with 100% test pass rate.

### Decisions made this session
- Created standardized worksheet registry `worksheetSchemas.ts` for all core SGK GDPT 2018 physics labs with auto-calculating columns ($v = s/\bar{t}, g = 2h/\bar{t}^2, \mu = \bar{F}_{ms}/P, k = F/\Delta l, T = 2\pi\sqrt{l/g}, v = \lambda \cdot f$).
- Added 1-Click "⚡ Trích xuất số liệu từ bài làm" auto-sync button in `FloatingAssignmentDrawer.tsx`.
- Refactored `MathVerificationEngineImpl.java` and `SubmissionServiceImpl.java` to dynamically verify student lab submissions by physics formula.
- Dynamic parameter generator in `AssignmentServiceImpl.java` now parses arbitrary parameter bounds per assigned lab.

### Next immediate action
All phases completed successfully. Ready for user verification.

## Risks
1. **Diverse Telemetry Formats**: Simulations emit different keys (e.g. $s, t$ vs $h, t$ vs $m, \Delta l$). Solved with standardized normalized trial mapping in `worksheetSchemas.ts`.
2. **AI Grading Consistency**: Groq AI temperature should be set to $0.2$ for deterministic grading JSON output.
