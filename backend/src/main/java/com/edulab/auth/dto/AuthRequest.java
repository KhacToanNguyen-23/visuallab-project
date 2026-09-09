package com.edulab.auth.dto;

public record AuthRequest(
    String email,
    String password,
    String fullName,
    String role, // "STUDENT" or "TEACHER"
    String school,
    String googleIdToken
) {}
