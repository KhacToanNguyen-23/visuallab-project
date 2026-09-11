package com.edulab.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

@Entity
@Table(name = "student_lab_snapshots")
public class StudentLabSnapshot {

    @Id
    private String id;
    private String studentId;
    private String labId;
    private String labTitle;

    @Column(length = 500)
    private String screenshotUrl;

    private String cloudinaryPublicId;

    @Column(length = 2000)
    private String caption;

    private String difficulty; // "EASY", "MEDIUM", "HARD"
    private Double score;
    private LocalDateTime createdAt;

    public StudentLabSnapshot() {}

    public StudentLabSnapshot(String id, String studentId, String labId, String labTitle, String screenshotUrl, String cloudinaryPublicId, String caption, String difficulty, Double score) {
        this.id = id;
        this.studentId = studentId;
        this.labId = labId;
        this.labTitle = labTitle;
        this.screenshotUrl = screenshotUrl;
        this.cloudinaryPublicId = cloudinaryPublicId;
        this.caption = caption;
        this.difficulty = difficulty != null ? difficulty : "MEDIUM";
        this.score = score;
        this.createdAt = LocalDateTime.now();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getStudentId() {
        return studentId;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }

    public String getLabId() {
        return labId;
    }

    public void setLabId(String labId) {
        this.labId = labId;
    }

    public String getLabTitle() {
        return labTitle;
    }

    public void setLabTitle(String labTitle) {
        this.labTitle = labTitle;
    }

    public String getScreenshotUrl() {
        return screenshotUrl;
    }

    public void setScreenshotUrl(String screenshotUrl) {
        this.screenshotUrl = screenshotUrl;
    }

    public String getCloudinaryPublicId() {
        return cloudinaryPublicId;
    }

    public void setCloudinaryPublicId(String cloudinaryPublicId) {
        this.cloudinaryPublicId = cloudinaryPublicId;
    }

    public String getCaption() {
        return caption;
    }

    public void setCaption(String caption) {
        this.caption = caption;
    }

    public String getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
    }

    public Double getScore() {
        return score;
    }

    public void setScore(Double score) {
        this.score = score;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
