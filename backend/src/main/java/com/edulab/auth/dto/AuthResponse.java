package com.edulab.auth.dto;

import com.edulab.model.User;

public record AuthResponse(
    String token,
    User user,
    String message
) {}
