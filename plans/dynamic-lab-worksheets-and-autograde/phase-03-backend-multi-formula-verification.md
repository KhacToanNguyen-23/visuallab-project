# Phase 3: Backend Multi-Formula Math Verification Engine

**Story:** [P1] Lab-Specific Deterministic Math Verification

## Objectives
1. Refactor `MathVerificationEngine.java` and `MathVerificationEngineImpl.java`:
   - Replace single-method interface with unified verification dispatcher:
     `MathCheckResult verifySubmission(String labType, String generatedParamsJson, String submittedAnswersJson, double tolerancePercent)`
   - Implement dedicated physics calculation formulas:
     - `verifySpeedMeasurement`: $v = s / t$.
     - `verifyFreeFall`: $g = 2h / t^2 \approx 9.81\text{ m/s}^2$.
     - `verifySlidingFriction`: $\mu = F_{pull} / (m \cdot g)$.
     - `verifyHookeLaw`: $k = (m \cdot g) / \Delta l$.
     - `verifySimplePendulum`: $T = 2\pi\sqrt{l/g}$.
     - `verifySoundResonance`: $v = \lambda \cdot f \approx 340\text{ m/s}$.
     - `verifyEmfInternalR`: $E = U + I \cdot r$.
     - Generic physics expression fallback.
2. Update unit tests in `MathVerificationEngineTest.java` to test all lab formulas under various tolerance thresholds.
