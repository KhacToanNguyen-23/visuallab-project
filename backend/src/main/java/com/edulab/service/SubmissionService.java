package com.edulab.service;

import com.edulab.model.Assignment;
import com.edulab.model.AssignmentSubmission;
import com.edulab.model.StudentAssignmentInstance;
import com.edulab.repository.AssignmentRepository;
import com.edulab.repository.AssignmentSubmissionRepository;
import com.edulab.repository.StudentAssignmentInstanceRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class SubmissionService {

    @Autowired
    private AssignmentSubmissionRepository submissionRepository;

    @Autowired
    private StudentAssignmentInstanceRepository instanceRepository;

    @Autowired
    private AssignmentRepository assignmentRepository;

    @Autowired
    private MathVerificationEngine mathEngine;

    @Autowired
    private GroqAIService groqAIService;

    private final ObjectMapper objectMapper = new ObjectMapper();

    public AssignmentSubmission submitAssignment(String instanceId, String studentId, String studentName, String submittedAnswersJson, String explanation) {
        StudentAssignmentInstance instance = instanceRepository.findById(instanceId)
                .orElseThrow(() -> new IllegalArgumentException("Assignment instance not found: " + instanceId));

        Assignment assignment = assignmentRepository.findById(instance.getAssignmentId())
                .orElseThrow(() -> new IllegalArgumentException("Assignment not found: " + instance.getAssignmentId()));

        // Parse student parameter 'length'
        double length = 1.0;
        try {
            JsonNode paramsNode = objectMapper.readTree(instance.getGeneratedParamsJson());
            if (paramsNode.has("length")) {
                length = paramsNode.get("length").asDouble();
            }
        } catch (Exception ignored) {}

        // Parse student answer 'period'
        double studentSubmittedPeriod = 0.0;
        try {
            JsonNode answersNode = objectMapper.readTree(submittedAnswersJson);
            if (answersNode.has("period")) {
                studentSubmittedPeriod = answersNode.get("period").asDouble();
            } else if (answersNode.has("measuredPeriod")) {
                studentSubmittedPeriod = answersNode.get("measuredPeriod").asDouble();
            }
        } catch (Exception ignored) {}

        // 1. Math Verification Engine
        MathVerificationEngine.MathCheckResult mathResult = mathEngine.verifyPendulumPeriod(length, studentSubmittedPeriod, assignment.getTolerancePercent());

        // 2. Groq AI Pedagogical Evaluation
        String aiFeedbackJson = groqAIService.generatePedagogicalFeedback(
                assignment.getTitle(),
                instance.getGeneratedParamsJson(),
                submittedAnswersJson,
                explanation,
                mathResult.getMathScore(),
                mathResult.isWithinTolerance()
        );

        double aiScore = 80.0;
        try {
            JsonNode feedbackNode = objectMapper.readTree(aiFeedbackJson);
            if (feedbackNode.has("aiReasoningScore")) {
                aiScore = feedbackNode.get("aiReasoningScore").asDouble();
            }
        } catch (Exception ignored) {}

        // Total score calculation: 70% Math Accuracy + 30% AI Reasoning Review
        double totalScore = Math.round((mathResult.getMathScore() * 0.7 + aiScore * 0.3) * 10.0) / 10.0;

        String id = "sub_" + UUID.randomUUID().toString().substring(0, 8);
        AssignmentSubmission submission = new AssignmentSubmission(
                id, instanceId, assignment.getId(), studentId, studentName,
                submittedAnswersJson, explanation, mathResult.getMathScore(),
                aiScore, totalScore, aiFeedbackJson
        );

        return submissionRepository.save(submission);
    }

    public Optional<AssignmentSubmission> getSubmissionByInstance(String instanceId) {
        return submissionRepository.findByInstanceId(instanceId);
    }

    public List<AssignmentSubmission> getSubmissionsByAssignment(String assignmentId) {
        return submissionRepository.findByAssignmentId(assignmentId);
    }

    public Optional<AssignmentSubmission> getStudentSubmissionForAssignment(String assignmentId, String studentId) {
        return submissionRepository.findByAssignmentIdAndStudentId(assignmentId, studentId);
    }
}
