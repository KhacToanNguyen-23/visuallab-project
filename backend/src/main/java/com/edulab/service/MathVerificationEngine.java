package com.edulab.service;

public interface MathVerificationEngine {

    class MathCheckResult {
        private final boolean withinTolerance;
        private final double expectedValue;
        private final double actualValue;
        private final double relativeErrorPercent;
        private final double mathScore;

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

    MathCheckResult verifyPendulumPeriod(double lengthMeters, double studentPeriodSec, double tolerancePercent);
}
