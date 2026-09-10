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
        assertEquals(100.0, result.getMathScore());
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
}
