package com.edulab.service;

import com.edulab.auth.dto.PendingRegistration;

import java.util.Optional;

public interface RegistrationStagingService {
    String stageRegistration(PendingRegistration data);
    Optional<PendingRegistration> getAndValidateToken(String token);
    void invalidate(String token, String email);
    boolean canResend(String email);
    long getRemainingCooldownSeconds(String email);
    String resendRegistration(String email);
}
