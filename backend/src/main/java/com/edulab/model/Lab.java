package com.edulab.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

@Entity
@Table(name = "labs")
public class Lab {

    @Id
    private String id;
    private String title;

    @Column(length = 2000)
    private String description;

    private String subject; // "Vật lý"
    private String domain;  // "Điện & Từ Học", "Cơ Học & Năng Lượng", "Quang Học", "Sóng & Nhiệt Học"
    private String grade;   // "Lớp 10", "Lớp 11", "Lớp 12"
    private String difficulty; // "EASY", "MEDIUM", "HARD"
    private String route;   // "/simulation", "/srs-lab"
    private String simulationType; // "CUSTOM_CANVAS", "PHET_EMBED", "STEP_WORKFLOW"
    private String thumbnailUrl;
    private String tags;    // "GDPT 2018,PhET,Canvas"
    private String status;  // "PUBLISHED", "DRAFT", "ARCHIVED"
    private String createdBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Lab() {}

    public Lab(String id, String title, String description, String subject, String domain, String grade, String difficulty, String route, String simulationType, String thumbnailUrl, String tags, String status, String createdBy) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.subject = subject != null ? subject : "Vật lý";
        this.domain = domain;
        this.grade = grade;
        this.difficulty = difficulty != null ? difficulty : "MEDIUM";
        this.route = route;
        this.simulationType = simulationType != null ? simulationType : "CUSTOM_CANVAS";
        this.thumbnailUrl = thumbnailUrl;
        this.tags = tags;
        this.status = status != null ? status : "PUBLISHED";
        this.createdBy = createdBy;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
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

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getDomain() {
        return domain;
    }

    public void setDomain(String domain) {
        this.domain = domain;
    }

    public String getGrade() {
        return grade;
    }

    public void setGrade(String grade) {
        this.grade = grade;
    }

    public String getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
    }

    public String getRoute() {
        return route;
    }

    public void setRoute(String route) {
        this.route = route;
    }

    public String getSimulationType() {
        return simulationType;
    }

    public void setSimulationType(String simulationType) {
        this.simulationType = simulationType;
    }

    public String getThumbnailUrl() {
        return thumbnailUrl;
    }

    public void setThumbnailUrl(String thumbnailUrl) {
        this.thumbnailUrl = thumbnailUrl;
    }

    public String getTags() {
        return tags;
    }

    public void setTags(String tags) {
        this.tags = tags;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
