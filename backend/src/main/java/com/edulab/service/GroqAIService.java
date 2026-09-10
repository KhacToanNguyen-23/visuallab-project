package com.edulab.service;

public interface GroqAIService {
    String generatePedagogicalFeedback(String problemTitle, String parametersJson, String studentSubmittedAnswersJson, String studentExplanation, double mathScore, boolean mathWithinTolerance);
}
