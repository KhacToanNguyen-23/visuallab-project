package com.edulab.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "users")
public class User {

    @Id
    private String id;

    @Column(unique = true, nullable = false)
    private String email;

    private String password;
    private String fullName;
    private String role; // "STUDENT" or "TEACHER" or "ADMIN"
    private String school;
    private String provider; // "LOCAL" or "GOOGLE"

    @Column(unique = true)
    private String googleId;

    @Column(nullable = false)
    private String status = "ACTIVE"; // "ACTIVE", "SUSPENDED", "INACTIVE"

    @Column(nullable = false)
    private boolean onboardingCompleted = true;

    public User() {}

    public User(String id, String email, String password, String fullName, String role, String school, String provider) {
        this(id, email, password, fullName, role, school, provider, null, "ACTIVE", true);
    }

    public User(String id, String email, String password, String fullName, String role, String school, String provider, String googleId, String status, boolean onboardingCompleted) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.fullName = fullName;
        this.role = role != null ? role : "STUDENT";
        this.school = school;
        this.provider = provider != null ? provider : "LOCAL";
        this.googleId = googleId;
        this.status = status != null ? status : "ACTIVE";
        this.onboardingCompleted = onboardingCompleted;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getSchool() {
        return school;
    }

    public void setSchool(String school) {
        this.school = school;
    }

    public String getProvider() {
        return provider;
    }

    public void setProvider(String provider) {
        this.provider = provider;
    }

    public String getGoogleId() {
        return googleId;
    }

    public void setGoogleId(String googleId) {
        this.googleId = googleId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public boolean isOnboardingCompleted() {
        return onboardingCompleted;
    }

    public void setOnboardingCompleted(boolean onboardingCompleted) {
        this.onboardingCompleted = onboardingCompleted;
    }
}
