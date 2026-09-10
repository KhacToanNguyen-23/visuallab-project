package com.edulab.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

@Entity
@Table(name = "student_assignment_instances")
public class StudentAssignmentInstance {

    @Id
    private String id;
    private String assignmentId;
    private String studentId;
    
    @Column(length = 1000)
    private String generatedParamsJson; // e.g. {"length": 1.25, "angle": 15, "mass": 1.0}
    
    private LocalDateTime createdAt;

    public StudentAssignmentInstance() {}

    public StudentAssignmentInstance(String id, String assignmentId, String studentId, String generatedParamsJson) {
        this.id = id;
        this.assignmentId = assignmentId;
        this.studentId = studentId;
        this.generatedParamsJson = generatedParamsJson;
        this.createdAt = LocalDateTime.now();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
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

    public String getGeneratedParamsJson() {
        return generatedParamsJson;
    }

    public void setGeneratedParamsJson(String generatedParamsJson) {
        this.generatedParamsJson = generatedParamsJson;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
