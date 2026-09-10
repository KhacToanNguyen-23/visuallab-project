package com.edulab.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

@Entity
@Table(name = "assignment_submissions")
public class AssignmentSubmission {

    @Id
    private String id;
    private String instanceId;
    private String assignmentId;
    private String studentId;
    private String studentName;
    
    @Column(length = 1000)
    private String submittedAnswersJson; // e.g. {"period": 2.25, "gravity": 9.8}
    
    @Column(length = 3000)
    private String explanation;
    
    private double mathScore; // 0-100
    private double aiReasoningScore; // 0-100
    private double totalScore; // 0-100
    
    @Column(length = 4000)
    private String aiFeedbackJson; // JSON feedback from Groq AI
    
    private LocalDateTime submittedAt;

    public AssignmentSubmission() {}

    public AssignmentSubmission(String id, String instanceId, String assignmentId, String studentId, String studentName, String submittedAnswersJson, String explanation, double mathScore, double aiReasoningScore, double totalScore, String aiFeedbackJson) {
        this.id = id;
        this.instanceId = instanceId;
        this.assignmentId = assignmentId;
        this.studentId = studentId;
        this.studentName = studentName;
        this.submittedAnswersJson = submittedAnswersJson;
        this.explanation = explanation;
        this.mathScore = mathScore;
        this.aiReasoningScore = aiReasoningScore;
        this.totalScore = totalScore;
        this.aiFeedbackJson = aiFeedbackJson;
        this.submittedAt = LocalDateTime.now();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getInstanceId() {
        return instanceId;
    }

    public void setInstanceId(String instanceId) {
        this.instanceId = instanceId;
    }

    public String getAssignmentId() {
        return assignmentId;
    }

    public void setAssignmentId(String assignmentId) {
        this.assignmentId = assignmentId;
    }

    public String getStudentId() {
        return studentId;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public String getSubmittedAnswersJson() {
        return submittedAnswersJson;
    }

    public void setSubmittedAnswersJson(String submittedAnswersJson) {
        this.submittedAnswersJson = submittedAnswersJson;
    }

    public String getExplanation() {
        return explanation;
    }

    public void setExplanation(String explanation) {
        this.explanation = explanation;
    }

    public double getMathScore() {
        return mathScore;
    }

    public void setMathScore(double mathScore) {
        this.mathScore = mathScore;
    }

    public double getAiReasoningScore() {
        return aiReasoningScore;
    }

    public void setAiReasoningScore(double aiReasoningScore) {
        this.aiReasoningScore = aiReasoningScore;
    }

    public double getTotalScore() {
        return totalScore;
    }

    public void setTotalScore(double totalScore) {
        this.totalScore = totalScore;
    }

    public String getAiFeedbackJson() {
        return aiFeedbackJson;
    }

    public void setAiFeedbackJson(String aiFeedbackJson) {
        this.aiFeedbackJson = aiFeedbackJson;
    }

    public LocalDateTime getSubmittedAt() {
        return submittedAt;
    }

    public void setSubmittedAt(LocalDateTime submittedAt) {
        this.submittedAt = submittedAt;
    }
}
