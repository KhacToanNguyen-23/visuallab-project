package com.edulab.service;

import com.edulab.service.impl.MathVerificationEngineImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class MathVerificationEngineTest {

    private MathVerificationEngine mathEngine;

    @BeforeEach
    public void setUp() {
        mathEngine = new MathVerificationEngineImpl();
    }

    @Test
    public void testPendulumPeriodCalculationWithinTolerance() {
        // Given L = 1.0m, g = 9.81 m/s^2 -> T = 2 * pi * sqrt(1.0 / 9.81) = 2.006s
        double length = 1.0;
        double studentSubmittedPeriod = 2.01; // Close to 2.006s
        double tolerancePercent = 3.0; // 3%

        MathVerificationEngine.MathCheckResult result = mathEngine.verifyPendulumPeriod(length, studentSubmittedPeriod, tolerancePercent);

        assertTrue(result.isWithinTolerance());
        assertTrue(result.getRelativeErrorPercent() < 3.0);
        assertEquals(10.0, result.getMathScore());
    }

    @Test
    public void testPendulumPeriodCalculationOutsideTolerance() {
        double length = 1.0;
        double studentSubmittedPeriod = 3.5; // Incorrect value
        double tolerancePercent = 3.0;

        MathVerificationEngine.MathCheckResult result = mathEngine.verifyPendulumPeriod(length, studentSubmittedPeriod, tolerancePercent);

        assertFalse(result.isWithinTolerance());
        assertTrue(result.getRelativeErrorPercent() > 3.0);
        assertEquals(0.0, result.getMathScore());
    }

    @Test
    public void testSpeedMeasurementVerification() {
        String params = "{\"distance\": 0.5, \"angle\": 10.0}";
        // a = 9.81 * sin(10 deg) = 1.703 m/s^2 -> t = sqrt(2 * 0.5 / 1.703) = 0.766s -> v = 0.5 / 0.766 = 0.652 m/s
        String answers = "{\"measuredResult\": 0.65, \"tAvg\": 0.766}";

        MathVerificationEngine.MathCheckResult result = mathEngine.verifySubmission("LAB_SPEED_MEASUREMENT", params, answers, 5.0);
        assertTrue(result.isWithinTolerance());
        assertEquals(10.0, result.getMathScore());
    }

    @Test
    public void testFreeFallVerification() {
        String params = "{\"height\": 1.0}";
        String answers = "{\"measuredResult\": 9.80, \"g\": 9.80}";

        MathVerificationEngine.MathCheckResult result = mathEngine.verifySubmission("LAB_FREE_FALL", params, answers, 3.0);
        assertTrue(result.isWithinTolerance());
        assertEquals(10.0, result.getMathScore());
    }

    @Test
    public void testHookeLawVerification() {
        String params = "{\"kDefault\": 50.0}";
        String answers = "{\"measuredResult\": 50.5, \"k\": 50.5}";

        MathVerificationEngine.MathCheckResult result = mathEngine.verifySubmission("LAB_SPRING_HOOKE", params, answers, 3.0);
        assertTrue(result.isWithinTolerance());
        assertEquals(10.0, result.getMathScore());
    }
}
