package com.edulab.auth.dto;

import com.edulab.model.User;

public record AuthResponse(
    String token,
    User user,
    String message,
    String status,
    String email,
    boolean onboardingCompleted
) {
    public AuthResponse(String token, User user, String message) {
        this(token, user, message, user != null ? user.getStatus() : "SUCCESS", user != null ? user.getEmail() : null, user != null && user.isOnboardingCompleted());
    }

    public AuthResponse(String token, User user, String message, String status, String email) {
        this(token, user, message, status, email, user != null && user.isOnboardingCompleted());
    }
}
