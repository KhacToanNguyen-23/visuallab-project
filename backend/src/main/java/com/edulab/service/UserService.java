package com.edulab.service;

import com.edulab.auth.dto.AuthRequest;
import com.edulab.auth.dto.AuthResponse;
import com.edulab.model.User;

import java.util.Optional;

public interface UserService {
    AuthResponse register(AuthRequest request);
    AuthResponse login(AuthRequest request);
    AuthResponse loginWithGoogle(AuthRequest request);
    AuthResponse verifyRegistration(String token);
    void resendVerification(String email);
    User completeOnboarding(String userId, String school);
    Optional<User> getUserByToken(String token);
    Optional<User> getUserById(String userId);
    Optional<User> getUserByEmail(String email);
    User updateProfile(String userId, String fullName, String school);
}
