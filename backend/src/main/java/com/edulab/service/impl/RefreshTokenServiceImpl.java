package com.edulab.service.impl;

import com.edulab.auth.JwtTokenProvider;
import com.edulab.model.RefreshToken;
import com.edulab.repository.RefreshTokenRepository;
import com.edulab.service.RefreshTokenService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;
import java.util.UUID;

@Service
public class RefreshTokenServiceImpl implements RefreshTokenService {

    private static final Logger log = LoggerFactory.getLogger(RefreshTokenServiceImpl.class);
    private static final long REFRESH_TOKEN_VALIDITY_DAYS = 7;

    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtTokenProvider jwtTokenProvider;

    public RefreshTokenServiceImpl(RefreshTokenRepository refreshTokenRepository, JwtTokenProvider jwtTokenProvider) {
        this.refreshTokenRepository = refreshTokenRepository;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Override
    @Transactional
    public String createRefreshToken(String userId, String userAgent, String ipAddress) {
        String rawToken = jwtTokenProvider.generateRawRefreshToken();
        String tokenHash = jwtTokenProvider.hashToken(rawToken);

        RefreshToken entity = new RefreshToken(
                UUID.randomUUID().toString(),
                userId,
                tokenHash,
                Instant.now().plus(REFRESH_TOKEN_VALIDITY_DAYS, ChronoUnit.DAYS),
                false,
                Instant.now(),
                userAgent,
                ipAddress
        );

        refreshTokenRepository.save(entity);
        return rawToken;
    }

    @Override
    @Transactional
    public Optional<RefreshTokenResult> rotateRefreshToken(String rawRefreshToken, String userAgent, String ipAddress) {
        if (rawRefreshToken == null || rawRefreshToken.isBlank()) {
            return Optional.empty();
        }

        String tokenHash = jwtTokenProvider.hashToken(rawRefreshToken);
        Optional<RefreshToken> existingOpt = refreshTokenRepository.findByTokenHash(tokenHash);

        if (existingOpt.isEmpty()) {
            log.warn("Refresh token không tồn tại trong cơ sở dữ liệu");
            return Optional.empty();
        }

        RefreshToken existing = existingOpt.get();

        // Security Defense: Token Reuse Detection
        if (existing.isRevoked()) {
            log.warn("CẢNH BÁO AN NINH: Phát hiện Refresh Token đã bị thu hồi được sử dụng lại! User ID: {}. Tiến hành hủy tất cả các phiên của user.", existing.getUserId());
            refreshTokenRepository.revokeAllByUserId(existing.getUserId());
            return Optional.empty();
        }

        // Check expiry
        if (existing.getExpiresAt().isBefore(Instant.now())) {
            log.warn("Refresh token đã hết hạn");
            return Optional.empty();
        }

        // Revoke old token
        existing.setRevoked(true);
        refreshTokenRepository.save(existing);

        // Issue new refresh token
        String newRawToken = createRefreshToken(existing.getUserId(), userAgent, ipAddress);
        return Optional.of(new RefreshTokenResult(newRawToken, existing.getUserId()));
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<String> getUserIdByRawToken(String rawRefreshToken) {
        if (rawRefreshToken == null || rawRefreshToken.isBlank()) {
            return Optional.empty();
        }
        String tokenHash = jwtTokenProvider.hashToken(rawRefreshToken);
        return refreshTokenRepository.findByTokenHash(tokenHash).map(RefreshToken::getUserId);
    }

    @Override
    @Transactional
    public void revokeToken(String rawRefreshToken) {
        if (rawRefreshToken == null || rawRefreshToken.isBlank()) return;
        String tokenHash = jwtTokenProvider.hashToken(rawRefreshToken);
        refreshTokenRepository.findByTokenHash(tokenHash).ifPresent(token -> {
            token.setRevoked(true);
            refreshTokenRepository.save(token);
        });
    }

    @Override
    @Transactional
    public void revokeAllUserTokens(String userId) {
        if (userId != null && !userId.isBlank()) {
            refreshTokenRepository.revokeAllByUserId(userId);
        }
    }

    @Override
    @Scheduled(cron = "0 0 3 * * ?") // Daily at 3 AM
    @Transactional
    public void purgeExpiredTokens() {
        try {
            refreshTokenRepository.deleteExpiredBefore(Instant.now());
            log.info("Đã dọn dẹp các Refresh Token hết hạn khỏi cơ sở dữ liệu");
        } catch (Exception e) {
            log.error("Lỗi khi dọn dẹp Refresh Token hết hạn:", e);
        }
    }
}
