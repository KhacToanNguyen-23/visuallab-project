package com.edulab.service.impl;

import com.edulab.model.Assignment;
import com.edulab.model.AssignmentSubmission;
import com.edulab.model.StudentAssignmentInstance;
import com.edulab.repository.AssignmentRepository;
import com.edulab.repository.AssignmentSubmissionRepository;
import com.edulab.repository.StudentAssignmentInstanceRepository;
import com.edulab.service.GroqAIService;
import com.edulab.service.MathVerificationEngine;
import com.edulab.service.SubmissionService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class SubmissionServiceImpl implements SubmissionService {

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

    @Override
    public AssignmentSubmission submitAssignment(String instanceId, String studentId, String studentName, String submittedAnswersJson, String explanation) {
        StudentAssignmentInstance instance = instanceRepository.findById(instanceId).orElse(null);

        Assignment assignment = null;
        String generatedParamsJson = "{}";

        if (instance != null) {
            generatedParamsJson = instance.getGeneratedParamsJson();
            assignment = assignmentRepository.findById(instance.getAssignmentId()).orElse(null);
        }

        if (assignment == null) {
            // Check if instanceId format is inst-assignmentId-studentId
            if (instanceId.startsWith("inst-")) {
                String potentialAsgId = instanceId.replace("inst-", "").split("-")[0];
                assignment = assignmentRepository.findById(potentialAsgId).orElse(null);
            }
        }

        if (assignment == null && submittedAnswersJson != null) {
            try {
                JsonNode parsed = objectMapper.readTree(submittedAnswersJson);
                if (parsed.has("assignmentId")) {
                    assignment = assignmentRepository.findById(parsed.get("assignmentId").asText()).orElse(null);
                }
            } catch (Exception ignored) {}
        }

        if (assignment == null) {
            throw new IllegalArgumentException("Không tìm thấy thông tin bài tập tương ứng với instance: " + instanceId);
        }

        String labType = assignment.getLabType() != null && !assignment.getLabType().isBlank()
                ? assignment.getLabType()
                : assignment.getTitle();

        MathVerificationEngine.MathCheckResult mathResult = mathEngine.verifySubmission(
                labType,
                generatedParamsJson,
                submittedAnswersJson,
                assignment.getTolerancePercent()
        );
        double mathScore10 = mathResult.getMathScore();

        String aiFeedbackJson = groqAIService.generatePedagogicalFeedback(
                assignment.getTitle(),
                generatedParamsJson,
                submittedAnswersJson,
                explanation,
                mathScore10,
                mathResult.isWithinTolerance()
        );

        double aiScore10 = 8.0;
        try {
            JsonNode feedbackNode = objectMapper.readTree(aiFeedbackJson);
            if (feedbackNode.has("aiReasoningScore")) {
                aiScore10 = feedbackNode.get("aiReasoningScore").asDouble();
            }
        } catch (Exception ignored) {}

        double totalScore = Math.min(10.0, Math.max(0.0, Math.round((mathScore10 * 0.7 + aiScore10 * 0.3) * 10.0) / 10.0));

        // Check if student already has a submission for this assignment
        Optional<AssignmentSubmission> existingSubOpt = submissionRepository.findFirstByAssignmentIdAndStudentIdOrderBySubmittedAtDesc(assignment.getId(), studentId);
        AssignmentSubmission submission;

        if (existingSubOpt.isPresent()) {
            submission = existingSubOpt.get();
            submission.setInstanceId(instanceId);
            submission.setStudentName(studentName);
            submission.setSubmittedAnswersJson(submittedAnswersJson);
            submission.setExplanation(explanation);
            submission.setMathScore(mathScore10);
            submission.setAiReasoningScore(aiScore10);
            submission.setTotalScore(totalScore);
            submission.setAiFeedbackJson(aiFeedbackJson);
            submission.setSubmittedAt(java.time.LocalDateTime.now());
        } else {
            String id = "sub_" + UUID.randomUUID().toString().substring(0, 8);
            submission = new AssignmentSubmission(
                    id, instanceId, assignment.getId(), studentId, studentName,
                    submittedAnswersJson, explanation, mathScore10,
                    aiScore10, totalScore, aiFeedbackJson
            );
        }

        return submissionRepository.save(submission);
    }

    @Autowired
    private com.edulab.repository.ClassroomRepository classroomRepository;

    @Override
    public Optional<AssignmentSubmission> getSubmissionByInstance(String instanceId) {
        return submissionRepository.findByInstanceId(instanceId);
    }

    @Override
    public List<AssignmentSubmission> getSubmissionsByAssignment(String assignmentId) {
        return submissionRepository.findByAssignmentId(assignmentId);
    }

    @Override
    public Optional<AssignmentSubmission> getStudentSubmissionForAssignment(String assignmentId, String studentId) {
        return submissionRepository.findFirstByAssignmentIdAndStudentIdOrderBySubmittedAtDesc(assignmentId, studentId);
    }

    @Override
    public List<AssignmentSubmission> getSubmissionsByTeacher(String teacherId) {
        // Collect assignment IDs from assignments created by teacher or belonging to teacher's classes
        java.util.Set<String> assignmentIds = new java.util.HashSet<>();
        
        List<Assignment> teacherAssignments = assignmentRepository.findByTeacherId(teacherId);
        for (Assignment a : teacherAssignments) {
            assignmentIds.add(a.getId());
        }

        List<com.edulab.model.Classroom> classrooms = classroomRepository.findByTeacherId(teacherId);
        for (com.edulab.model.Classroom c : classrooms) {
            List<Assignment> classAssignments = assignmentRepository.findByClassId(c.getId());
            for (Assignment a : classAssignments) {
                assignmentIds.add(a.getId());
            }
        }

        if (assignmentIds.isEmpty()) {
            return java.util.Collections.emptyList();
        }

        return submissionRepository.findByAssignmentIdIn(new java.util.ArrayList<>(assignmentIds));
    }

    @Override
    public AssignmentSubmission updateGrade(String submissionId, double totalScore, String feedback) {
        AssignmentSubmission sub = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy bài nộp: " + submissionId));
        sub.setTotalScore(totalScore);
        if (feedback != null && !feedback.isBlank()) {
            try {
                // If feedback is JSON or plain text, wrap/update
                sub.setAiFeedbackJson(feedback);
            } catch (Exception ignored) {}
        }
        return submissionRepository.save(sub);
    }
}
