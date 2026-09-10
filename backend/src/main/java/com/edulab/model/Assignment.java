package com.edulab.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

@Entity
@Table(name = "assignments")
public class Assignment {

    @Id
    private String id;
    private String classId;
    private String title;
    
    @Column(length = 2000)
    private String description;
    
    private String labType; // e.g. "PENDULUM"
    
    @Column(length = 1000)
    private String paramBoundsJson; // e.g. {"lengthMin": 0.5, "lengthMax": 2.0, "angleMin": 10, "angleMax": 30}
    
    private String targetFormula; // e.g. "T = 2 * PI * sqrt(L / g)"
    private double tolerancePercent; // default 3.0
    private String teacherId;
    private LocalDateTime createdAt;

    public Assignment() {}

    public Assignment(String id, String classId, String title, String description, String labType, String paramBoundsJson, String targetFormula, double tolerancePercent, String teacherId) {
        this.id = id;
        this.classId = classId;
        this.title = title;
        this.description = description;
        this.labType = labType;
        this.paramBoundsJson = paramBoundsJson;
        this.targetFormula = targetFormula;
        this.tolerancePercent = tolerancePercent > 0 ? tolerancePercent : 3.0;
        this.teacherId = teacherId;
        this.createdAt = LocalDateTime.now();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getClassId() {
        return classId;
    }

    public void setClassId(String classId) {
        this.classId = classId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getLabType() {
        return labType;
    }

    public void setLabType(String labType) {
        this.labType = labType;
    }

    public String getParamBoundsJson() {
        return paramBoundsJson;
    }

    public void setParamBoundsJson(String paramBoundsJson) {
        this.paramBoundsJson = paramBoundsJson;
    }

    public String getTargetFormula() {
        return targetFormula;
    }

    public void setTargetFormula(String targetFormula) {
        this.targetFormula = targetFormula;
    }

    public double getTolerancePercent() {
        return tolerancePercent;
    }

    public void setTolerancePercent(double tolerancePercent) {
        this.tolerancePercent = tolerancePercent;
    }

    public String getTeacherId() {
        return teacherId;
    }

    public void setTeacherId(String teacherId) {
        this.teacherId = teacherId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
