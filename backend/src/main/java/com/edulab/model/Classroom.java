package com.edulab.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

@Entity
@Table(name = "classrooms")
public class Classroom {

    @Id
    private String id;
    private String name;
    private String description;
    private String code; // Unique 6-character alphanumeric code
    private String teacherId;
    private String teacherName;
    private LocalDateTime createdAt;

    public Classroom() {}

    public Classroom(String id, String name, String description, String code, String teacherId, String teacherName) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.code = code;
        this.teacherId = teacherId;
        this.teacherName = teacherName;
        this.createdAt = LocalDateTime.now();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getTeacherId() {
        return teacherId;
    }

    public void setTeacherId(String teacherId) {
        this.teacherId = teacherId;
    }

    public String getTeacherName() {
        return teacherName;
    }

    public void setTeacherName(String teacherName) {
        this.teacherName = teacherName;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
