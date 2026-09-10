package com.edulab.service;

import org.springframework.stereotype.Service;

@Service
public class MathVerificationEngine {

    public static class MathCheckResult {
        private boolean withinTolerance;
        private double expectedValue;
        private double actualValue;
        private double relativeErrorPercent;
        private double mathScore;

        public MathCheckResult(boolean withinTolerance, double expectedValue, double actualValue, double relativeErrorPercent, double mathScore) {
            this.withinTolerance = withinTolerance;
            this.expectedValue = expectedValue;
            this.actualValue = actualValue;
            this.relativeErrorPercent = relativeErrorPercent;
            this.mathScore = mathScore;
        }

        public boolean isWithinTolerance() {
            return withinTolerance;
        }

        public double getExpectedValue() {
            return expectedValue;
        }

        public double getActualValue() {
            return actualValue;
        }

        public double getRelativeErrorPercent() {
            return relativeErrorPercent;
        }

        public double getMathScore() {
            return mathScore;
        }
    }

    /**
     * Verifies Pendulum Period T = 2 * PI * sqrt(L / g)
     */
    public MathCheckResult verifyPendulumPeriod(double lengthMeters, double studentPeriodSec, double tolerancePercent) {
        double g = 9.81; // standard gravity acceleration m/s^2
        double expectedPeriod = 2.0 * Math.PI * Math.sqrt(lengthMeters / g);

        double absError = Math.abs(studentPeriodSec - expectedPeriod);
        double relativeErrorPercent = (absError / expectedPeriod) * 100.0;

        boolean withinTolerance = relativeErrorPercent <= tolerancePercent;
        double mathScore = withinTolerance ? 100.0 : Math.max(0.0, 100.0 - (relativeErrorPercent - tolerancePercent) * 10.0);
        if (!withinTolerance && relativeErrorPercent > 20.0) {
            mathScore = 0.0;
        }

        return new MathCheckResult(withinTolerance, expectedPeriod, studentPeriodSec, relativeErrorPercent, Math.round(mathScore * 10.0) / 10.0);
    }
}
