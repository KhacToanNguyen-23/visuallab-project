package com.edulab.service.impl;

import com.edulab.service.MathVerificationEngine;
import org.springframework.stereotype.Service;

@Service
public class MathVerificationEngineImpl implements MathVerificationEngine {

    @Override
    public MathCheckResult verifyPendulumPeriod(double lengthMeters, double studentPeriodSec, double tolerancePercent) {
        double g = 9.81;
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
