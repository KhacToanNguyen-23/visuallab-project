package com.edulab.service;

import java.util.Optional;

public interface RefreshTokenService {

    record RefreshTokenResult(String rawRefreshToken, String userId) {}

    String createRefreshToken(String userId, String userAgent, String ipAddress);

    Optional<RefreshTokenResult> rotateRefreshToken(String rawRefreshToken, String userAgent, String ipAddress);

    Optional<String> getUserIdByRawToken(String rawRefreshToken);

    void revokeToken(String rawRefreshToken);

    void revokeAllUserTokens(String userId);

    void purgeExpiredTokens();
}
