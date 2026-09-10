package com.edulab.service;

import com.edulab.auth.dto.AuthRequest;
import com.edulab.auth.dto.AuthResponse;
import com.edulab.model.User;

import java.util.Optional;

public interface UserService {
    AuthResponse register(AuthRequest request);
    AuthResponse login(AuthRequest request);
    AuthResponse loginWithGoogle(AuthRequest request);
    Optional<User> getUserByToken(String token);
    User updateProfile(String userId, String fullName, String school);
}
