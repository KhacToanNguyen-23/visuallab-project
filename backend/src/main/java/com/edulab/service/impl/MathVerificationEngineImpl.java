package com.edulab.service.impl;

import com.edulab.service.MathVerificationEngine;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

@Service
public class MathVerificationEngineImpl implements MathVerificationEngine {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public MathCheckResult verifySubmission(String labType, String generatedParamsJson, String submittedAnswersJson, double tolerancePercent) {
        double effectiveTolerance = tolerancePercent > 0 ? tolerancePercent : 5.0;

        JsonNode paramsNode = null;
        JsonNode answersNode = null;
        try {
            if (generatedParamsJson != null && !generatedParamsJson.isBlank()) {
                paramsNode = objectMapper.readTree(generatedParamsJson);
            }
            if (submittedAnswersJson != null && !submittedAnswersJson.isBlank()) {
                answersNode = objectMapper.readTree(submittedAnswersJson);
            }
        } catch (Exception ignored) {}

        String normLab = (labType != null ? labType.toUpperCase() : "");

        if (normLab.contains("SPEED") || normLab.contains("BÀI 6") || normLab.contains("SIM-SPEED-MEASUREMENT")) {
            return verifySpeed(paramsNode, answersNode, effectiveTolerance);
        } else if (normLab.contains("FREE_FALL") || normLab.contains("FALL") || normLab.contains("RƠI TỰ DO")) {
            return verifyFreeFall(paramsNode, answersNode, effectiveTolerance);
        } else if (normLab.contains("FRICTION") || normLab.contains("MA SÁT")) {
            return verifySlidingFriction(paramsNode, answersNode, effectiveTolerance);
        } else if (normLab.contains("HOOKE") || normLab.contains("LÒ XO") || normLab.contains("SPRING")) {
            return verifyHookeLaw(paramsNode, answersNode, effectiveTolerance);
        } else if (normLab.contains("SOUND") || normLab.contains("RESONANCE") || normLab.contains("CỘNG HƯỞNG")) {
            return verifySoundResonance(paramsNode, answersNode, effectiveTolerance);
        } else {
            // Default to Simple Pendulum / generic
            return verifyPendulum(paramsNode, answersNode, effectiveTolerance);
        }
    }

    private MathCheckResult verifySpeed(JsonNode params, JsonNode answers, double tolerancePercent) {
        // 0. Check if structured lab auto-grader already computed a verified totalScore
        if (answers != null && answers.has("totalScore") && answers.get("totalScore").asDouble() > 0) {
            double labScore = answers.get("totalScore").asDouble();
            double studentSpeed = extractAnswer(answers, "measuredResult", "measuredValue", "speed", "v", "studentAvgV");
            return new MathCheckResult(labScore >= 5.0, studentSpeed, studentSpeed, 0.0, labScore);
        }

        // 1. Check if student submitted structured table rows
        if (answers != null && answers.has("rows") && answers.get("rows").isArray() && answers.get("rows").size() > 0) {
            JsonNode rows = answers.get("rows");
            double sumExpected = 0.0;
            double sumActual = 0.0;
            int count = 0;

            for (JsonNode r : rows) {
                double dist = r.has("distance") ? r.get("distance").asDouble() : 0.0;
                double time = r.has("time") ? r.get("time").asDouble() : (r.has("timeSec") ? r.get("timeSec").asDouble() : 0.0);
                double speed = r.has("speed") ? r.get("speed").asDouble() : 0.0;

                if (dist > 0 && time > 0) {
                    double expectedRowSpeed = dist / time;
                    sumExpected += expectedRowSpeed;
                    sumActual += (speed > 0 ? speed : expectedRowSpeed);
                    count++;
                }
            }

            if (count > 0) {
                double avgExpected = sumExpected / count;
                double avgActual = sumActual / count;
                return evaluateScore(avgExpected, avgActual, tolerancePercent);
            }
        }

        // 2. Fallback to single value calculation
        double distance = extractParam(params, answers, "distance", 0.5);
        double time = extractAnswer(answers, "time", "timeSec", "tAvg", "t");
        double expectedSpeed = time > 0 ? distance / time : 1.0;
        double studentSpeed = extractAnswer(answers, "measuredResult", "measuredValue", "speed", "v");

        if (studentSpeed <= 0 && time > 0) {
            studentSpeed = distance / time;
        }

        if (studentSpeed <= 0) {
            return new MathCheckResult(false, expectedSpeed, 0, 100.0, 0.0);
        }

        return evaluateScore(expectedSpeed, studentSpeed, tolerancePercent);
    }

    private MathCheckResult verifyFreeFall(JsonNode params, JsonNode answers, double tolerancePercent) {
        double height = extractParam(params, answers, "height", "h", 1.0);
        double expectedG = 9.81;

        double studentG = extractAnswer(answers, "measuredResult", "measuredValue", "g");
        if (studentG <= 0) {
            double studentT = extractAnswer(answers, "tAvg", "t");
            if (studentT > 0) {
                studentG = (2 * height) / (studentT * studentT);
            }
        }

        if (studentG <= 0) {
            return new MathCheckResult(false, expectedG, 0, 100.0, 0.0);
        }

        return evaluateScore(expectedG, studentG, tolerancePercent);
    }

    private MathCheckResult verifySlidingFriction(JsonNode params, JsonNode answers, double tolerancePercent) {
        double mass = extractParam(params, answers, "mass", "m", 0.2);
        double expectedMu = 0.25; // Standard wood-table kinetic friction coefficient

        double studentMu = extractAnswer(answers, "measuredResult", "measuredValue", "mu");
        if (studentMu <= 0) {
            double fAvg = extractAnswer(answers, "fAvg", "f", "force");
            if (fAvg > 0 && mass > 0) {
                studentMu = fAvg / (mass * 9.81);
            }
        }

        if (studentMu <= 0) {
            return new MathCheckResult(false, expectedMu, 0, 100.0, 0.0);
        }

        return evaluateScore(expectedMu, studentMu, tolerancePercent);
    }

    private MathCheckResult verifyHookeLaw(JsonNode params, JsonNode answers, double tolerancePercent) {
        double expectedK = extractParam(params, answers, "kDefault", "k", 50.0);
        double studentK = extractAnswer(answers, "measuredResult", "measuredValue", "k");

        if (studentK <= 0) {
            double mass = extractAnswer(answers, "mass", "m");
            double deltaL = extractAnswer(answers, "deltaL", "dl");
            if (mass > 0 && deltaL > 0) {
                studentK = (mass * 9.81) / (deltaL / 100.0);
            }
        }

        if (studentK <= 0) {
            return new MathCheckResult(false, expectedK, 0, 100.0, 0.0);
        }

        return evaluateScore(expectedK, studentK, tolerancePercent);
    }

    private MathCheckResult verifySoundResonance(JsonNode params, JsonNode answers, double tolerancePercent) {
        double expectedSpeed = 340.0; // Speed of sound in air (m/s)
        double studentSpeed = extractAnswer(answers, "measuredResult", "measuredValue", "speed", "v");

        if (studentSpeed <= 0) {
            return new MathCheckResult(false, expectedSpeed, 0, 100.0, 0.0);
        }

        return evaluateScore(expectedSpeed, studentSpeed, tolerancePercent);
    }

    private MathCheckResult verifyPendulum(JsonNode params, JsonNode answers, double tolerancePercent) {
        double length = extractParam(params, answers, "length", "l", 1.0);
        double expectedPeriod = 2.0 * Math.PI * Math.sqrt(length / 9.81);

        double studentPeriod = extractAnswer(answers, "measuredResult", "measuredValue", "period", "measuredPeriod", "measuredT");
        if (studentPeriod <= 0) {
            studentPeriod = extractAnswer(answers, "tAvg", "time", "t");
        }

        if (studentPeriod <= 0) {
            return new MathCheckResult(false, expectedPeriod, 0, 100.0, 0.0);
        }

        return evaluateScore(expectedPeriod, studentPeriod, tolerancePercent);
    }

    @Override
    public MathCheckResult verifyPendulumPeriod(double lengthMeters, double studentPeriodSec, double tolerancePercent) {
        double g = 9.81;
        double expectedPeriod = 2.0 * Math.PI * Math.sqrt(lengthMeters / g);
        return evaluateScore(expectedPeriod, studentPeriodSec, tolerancePercent);
    }

    private MathCheckResult evaluateScore(double expected, double actual, double tolerancePercent) {
        double absError = Math.abs(actual - expected);
        double relativeErrorPercent = (absError / expected) * 100.0;

        boolean withinTolerance = relativeErrorPercent <= tolerancePercent;
        double mathScore = withinTolerance ? 10.0 : Math.max(0.0, 10.0 - (relativeErrorPercent - tolerancePercent) * 0.8);
        if (!withinTolerance && relativeErrorPercent > 35.0) {
            mathScore = 0.0;
        }

        return new MathCheckResult(
                withinTolerance,
                Math.round(expected * 1000.0) / 1000.0,
                Math.round(actual * 1000.0) / 1000.0,
                Math.round(relativeErrorPercent * 100.0) / 100.0,
                Math.round(mathScore * 10.0) / 10.0
        );
    }

    private double extractParam(JsonNode params, JsonNode answers, String key, double defaultVal) {
        if (params != null && params.has(key)) return params.get(key).asDouble();
        if (answers != null && answers.has(key)) return answers.get(key).asDouble();
        return defaultVal;
    }

    private double extractParam(JsonNode params, JsonNode answers, String k1, String k2, double defaultVal) {
        if (params != null) {
            if (params.has(k1)) return params.get(k1).asDouble();
            if (params.has(k2)) return params.get(k2).asDouble();
        }
        if (answers != null) {
            if (answers.has(k1)) return answers.get(k1).asDouble();
            if (answers.has(k2)) return answers.get(k2).asDouble();
        }
        return defaultVal;
    }

    private double extractAnswer(JsonNode answers, String... keys) {
        if (answers == null) return 0.0;
        for (String k : keys) {
            if (answers.has(k)) {
                return answers.get(k).asDouble();
            }
        }
        if (answers.has("summary") && answers.get("summary").isObject()) {
            JsonNode sum = answers.get("summary");
            for (String k : keys) {
                if (sum.has(k)) return sum.get(k).asDouble();
            }
        }
        return 0.0;
    }
}
