package com.edulab.auth.dto;

import java.io.Serializable;

public class PendingRegistration implements Serializable {
    private static final long serialVersionUID = 1L;

    private String email;
    private String googleId;
    private String fullName;
    private String avatar;
    private long createdAt;

    public PendingRegistration() {}

    public PendingRegistration(String email, String googleId, String fullName, String avatar, long createdAt) {
        this.email = email;
        this.googleId = googleId;
        this.fullName = fullName;
        this.avatar = avatar;
        this.createdAt = createdAt;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getGoogleId() {
        return googleId;
    }

    public void setGoogleId(String googleId) {
        this.googleId = googleId;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getAvatar() {
        return avatar;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }

    public long getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(long createdAt) {
        this.createdAt = createdAt;
    }
}
