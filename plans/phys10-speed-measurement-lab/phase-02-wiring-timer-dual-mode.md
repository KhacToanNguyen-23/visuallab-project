# Phase 2: Signal Cable Wiring & Digital Timer State Machine

**Parent Plan:** `plans/phys10-speed-measurement-lab/plan.md`  
**Stories Covered:** P1 (Signal cable wiring, dual mode timer behavior, jitter simulation), P2 (Visual cable hints)

---

## Objectives
1. Implement `DigitalTimerPanel.tsx` mimicking standard school digital stopwatch ($0.001\text{s}$ resolution).
2. Support Dual Modes:
   - **Mode 1 (Tốc độ trung bình):** Mode switch set to $A \leftrightarrow B$. Timer starts when ball cuts Gate E and stops when ball cuts Gate F.
   - **Mode 2 (Tốc độ tức thời):** Mode switch set to $\text{MODE A}$. Timer measures the pulse duration $\Delta t_E$ when ball body ($d = 2\text{cm}$) blocks Gate E.
3. Build virtual cable wiring interaction: Click-to-connect or drag cable endpoints between Gate E/F and Timer Ports A/B.
4. Integrate realistic physical jitter ($\pm 0.002\text{s}$) to reflect real-world experimental tolerances.

---

## Deliverables
- `frontend/src/components/simulations/speed-measurement/DigitalTimerPanel.tsx`
- Wiring state manager and event emitter bridge in `SpeedMeasurementLab.tsx`

---

## Verification
- Wiring Gate E to Port A and Gate F to Port B completes the circuit validation (`isWiringCorrect === true`).
- In Mode 1 ($A \leftrightarrow B$), timer triggers at gate E and stops at gate F, displaying $\Delta t$.
- In Mode 2 ($\text{MODE A}$), timer triggers on leading edge and stops on trailing edge of Gate E.
- Reset button clears timer display back to `0.000s`.
